import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';

// Endpoint cron appelé chaque dimanche 20h pour générer le bilan hebdo
// via l'edge function weekly-coach et le sauvegarder dans weekly_reports.

export const Route = createFileRoute('/api/public/hooks/weekly-report')({
  server: {
    handlers: {
      POST: async () => {
        try {
          const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!;
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
          const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
          const admin = createClient(supabaseUrl, serviceKey);

          // Calcul de la semaine écoulée (lundi → dimanche)
          const now = new Date();
          const day = now.getDay();
          const sundayOffset = day === 0 ? 0 : -day;
          const end = new Date(now); end.setDate(end.getDate() + sundayOffset); end.setHours(23, 59, 59, 999);
          const start = new Date(end); start.setDate(start.getDate() - 6); start.setHours(0, 0, 0, 0);

          // KPI: on lance des requêtes parallèles
          const [oRes, prevORes, eRes, vRes] = await Promise.all([
            admin.from('orders').select('*').gte('created_at', start.toISOString()).lte('created_at', end.toISOString()),
            admin.from('orders').select('*').gte('created_at', new Date(start.getTime() - 7 * 86400000).toISOString()).lt('created_at', start.toISOString()),
            admin.from('daily_expenses').select('*').gte('expense_date', start.toISOString().slice(0, 10)).lte('expense_date', end.toISOString().slice(0, 10)),
            admin.from('visits').select('id', { count: 'exact', head: true }).gte('visited_at', start.toISOString()).lte('visited_at', end.toISOString()),
          ]);

          const orders = oRes.data || [];
          const prevOrders = prevORes.data || [];
          const expenses = eRes.data || [];
          const visites = vRes.count || 0;
          const delivered = orders.filter((o) => o.status === 'delivered');
          const ca_livre = delivered.reduce((s, o) => s + (o.product_price || 0), 0);
          const depenses_total = expenses.reduce((s, e) => s + (e.amount || 0), 0);
          const depenses_par_categorie: Record<string, number> = {};
          for (const e of expenses) depenses_par_categorie[e.category] = (depenses_par_categorie[e.category] || 0) + e.amount;
          const pub_spend = depenses_par_categorie['pub'] || 0;

          const par_produit: Record<string, { nb: number; ca: number; livrees: number }> = {};
          for (const o of orders) {
            const k = o.product_slug || o.product_name || 'inconnu';
            par_produit[k] ||= { nb: 0, ca: 0, livrees: 0 };
            par_produit[k].nb += 1;
            if (o.status === 'delivered') { par_produit[k].livrees += 1; par_produit[k].ca += o.product_price || 0; }
          }

          const profit_net = ca_livre - depenses_total;
          const prevCA = prevOrders.filter((o) => o.status === 'delivered').reduce((s, o) => s + (o.product_price || 0), 0);

          const kpi = {
            week_start: start.toISOString().slice(0, 10),
            week_end: end.toISOString().slice(0, 10),
            ca_livre, profit_net, depenses_total, pub_spend,
            nb_orders: orders.length, nb_delivered: delivered.length,
            taux_livraison: orders.length ? Math.round((delivered.length / orders.length) * 100) : 0,
            panier_moyen: delivered.length ? Math.round(ca_livre / delivered.length) : 0,
            roas: pub_spend ? Math.round((ca_livre / pub_spend) * 100) / 100 : 0,
            cac: delivered.length ? Math.round(pub_spend / delivered.length) : 0,
            visites,
            par_produit, depenses_par_categorie,
            vs_n1_ca_pct: prevCA ? Math.round(((ca_livre - prevCA) / prevCA) * 100) : 0,
          };

          // Récupérer les règles finance
          const { data: settings } = await admin.from('app_settings').select('value').eq('key', 'finance_rules').maybeSingle();
          const finance_rules = (settings?.value as Record<string, number>) || { pub_pct: 40, stock_pct: 30, epargne_pct: 20, perso_pct: 10 };

          const products = [
            { slug: 'kouka', name: 'Poudre KOUKA', offers: ['1 sachet', '2+1', '3+2'] },
            { slug: 'sirop-kouka', name: 'Sirop KOUKA', offers: ['1 flacon', '2+1', '3+2'] },
          ];

          // Appel edge function weekly-coach
          const coachRes = await fetch(`${supabaseUrl}/functions/v1/weekly-coach`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', apikey: anonKey, Authorization: `Bearer ${anonKey}` },
            body: JSON.stringify({ week_start: kpi.week_start, week_end: kpi.week_end, kpi, products, finance_rules }),
          });
          if (!coachRes.ok) {
            const t = await coachRes.text();
            console.error('weekly-coach failed', coachRes.status, t);
            return new Response(JSON.stringify({ error: 'IA unavailable', detail: t }), { status: 500 });
          }
          const result = await coachRes.json();

          // Sauvegarde (upsert sur week_start)
          const { error } = await admin.from('weekly_reports').upsert({
            week_start: kpi.week_start,
            week_end: kpi.week_end,
            kpi,
            ia_report: result.report_markdown,
            finance_reco: result.finance_reco,
            alerts: result.alerts || [],
            generated_at: new Date().toISOString(),
            read_at: null,
          }, { onConflict: 'week_start' });

          if (error) throw error;

          // Notification push admin
          try {
            await fetch(`${supabaseUrl}/functions/v1/send-push`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_number: 'BILAN', first_name: '📊 Bilan semaine prêt',
                city: '', product_name: 'Coach IA', product_price: kpi.profit_net,
              }),
            });
          } catch (e) { console.warn('push failed', e); }

          return new Response(JSON.stringify({ ok: true, week_start: kpi.week_start }), {
            status: 200, headers: { 'Content-Type': 'application/json' },
          });
        } catch (e) {
          console.error('weekly-report error', e);
          return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown' }), { status: 500 });
        }
      },
    },
  },
});
