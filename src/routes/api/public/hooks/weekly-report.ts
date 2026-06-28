import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';

// Endpoint cron appelé chaque dimanche 20h pour générer le bilan hebdo
// via l'edge function weekly-coach et le sauvegarder dans weekly_reports.

export const Route = createFileRoute('/api/public/hooks/weekly-report')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const cronSecret = process.env.CRON_SECRET;
          const provided = request.headers.get('x-cron-secret') || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
          if (!cronSecret || provided !== cronSecret) {
            return new Response('Unauthorized', { status: 401 });
          }
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

          // Coûts unitaires (alignés avec src/lib/products.ts)
          const PA_POUDRE = 2000;
          const PA_SIROP = 3000;
          const DELIVERY = 2000;
          const unitsFromLabel = (label?: string | null): number => {
            const l = (label || '').toLowerCase();
            let u = 1;
            if (/3\s*\+\s*2/.test(l)) u = 5;
            else if (/2\s*\+\s*1/.test(l)) u = 3;
            if (/bump/.test(l)) u += 1;
            return u;
          };
          const paFor = (name?: string | null) => (/sirop/i.test(name || '') ? PA_SIROP : PA_POUDRE);

          let cogs = 0;
          const par_produit: Record<string, { nb: number; ca: number; livrees: number; cogs: number; units: number }> = {};
          for (const o of orders) {
            const k = o.product_slug || o.product_name || 'inconnu';
            par_produit[k] ||= { nb: 0, ca: 0, livrees: 0, cogs: 0, units: 0 };
            par_produit[k].nb += 1;
            if (o.status === 'delivered') {
              const units = unitsFromLabel(o.offer_label);
              const c = paFor(o.product_name) * units;
              par_produit[k].livrees += 1;
              par_produit[k].ca += o.product_price || 0;
              par_produit[k].units += units;
              par_produit[k].cogs += c;
              cogs += c;
            }
          }

          const depenses_par_categorie: Record<string, number> = {};
          let charges_compta = 0;
          let stock_rachete = 0;
          for (const e of expenses) {
            const cat = (e.category || 'autre').toLowerCase();
            depenses_par_categorie[cat] = (depenses_par_categorie[cat] || 0) + (e.amount || 0);
            if (cat === 'stock') stock_rachete += e.amount || 0;
            else charges_compta += e.amount || 0;
          }
          const pub_spend = depenses_par_categorie['pub'] || 0;

          const delivery_cost = delivered.length * DELIVERY;
          const depenses_total = cogs + delivery_cost + charges_compta;
          const profit_net = ca_livre - depenses_total;
          const cash_out = charges_compta + stock_rachete + delivery_cost;
          const prevDelivered = prevOrders.filter((o) => o.status === 'delivered');
          const prevCA = prevDelivered.reduce((s, o) => s + (o.product_price || 0), 0);
          const prevCOGS = prevDelivered.reduce((s, o) => s + paFor(o.product_name) * unitsFromLabel(o.offer_label), 0);
          const prevProfit = prevCA - prevCOGS - prevDelivered.length * DELIVERY;

          const kpi = {
            week_start: start.toISOString().slice(0, 10),
            week_end: end.toISOString().slice(0, 10),
            ca_livre, profit_net, depenses_total, pub_spend,
            cogs, delivery_cost, charges_compta, stock_rachete, cash_out,
            marge_pct: ca_livre ? Math.round((profit_net / ca_livre) * 100) : 0,
            nb_orders: orders.length, nb_delivered: delivered.length,
            taux_livraison: orders.length ? Math.round((delivered.length / orders.length) * 100) : 0,
            panier_moyen: delivered.length ? Math.round(ca_livre / delivered.length) : 0,
            roas: pub_spend ? Math.round((ca_livre / pub_spend) * 100) / 100 : 0,
            cac: delivered.length ? Math.round(pub_spend / delivered.length) : 0,
            visites,
            par_produit, depenses_par_categorie,
            vs_n1_ca_pct: prevCA ? Math.round(((ca_livre - prevCA) / prevCA) * 100) : 0,
            vs_n1_profit_pct: prevProfit ? Math.round(((profit_net - prevProfit) / prevProfit) * 100) : 0,
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
            headers: { 'Content-Type': 'application/json', apikey: anonKey, Authorization: `Bearer ${anonKey}`, 'x-cron-secret': cronSecret },
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
