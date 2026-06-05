import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatFCFA } from '@/lib/products';
import { useCloseuses } from '@/lib/closeuses';
import { useLeads } from '@/lib/leads';
import { useAuditLog } from '@/lib/auditLog';
import { computeCloseuseStats } from '@/lib/closeuseScore';
import { formatLastActivity } from '@/lib/closeuseActivity';
import type { Order } from '@/components/admin/OrdersTab';

export function SummaryTab({ orders }: { orders: Order[] }) {
  const { leads } = useLeads(null);
  const { closeuses } = useCloseuses();
  const { entries } = useAuditLog(20);
  const [closeusesActivity, setActivity] = useState<Record<number, string>>({});

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).from('closeuses').select('idx,last_activity_at');
      const m: Record<number, string> = {};
      (data || []).forEach((c: any) => { if (c.last_activity_at) m[c.idx] = c.last_activity_at; });
      setActivity(m);
    })();
  }, []);

  const start = new Date(); start.setHours(0, 0, 0, 0);
  const isToday = (iso: string | null | undefined) => iso ? new Date(iso) >= start : false;

  const leadsToday = leads.filter((l) => isToday(l.created_at)).length;
  const validatedToday = orders.filter((o) => o.closeuse_idx != null && isToday(o.assigned_at || o.created_at) && ['confirmed','delivered'].includes(o.status)).length;
  const deliveredToday = orders.filter((o) => o.status === 'delivered' && isToday(o.delivered_at || o.created_at)).length;
  const refusedToday = leads.filter((l) => ['refusee','annulee'].includes(l.status) && isToday(l.updated_at)).length;
  const relancer = leads.filter((l) => l.status === 'a_relancer').length;

  const totalLeads = leads.length;
  const totalValidated = leads.filter((l) => ['valide','expediee','livree'].includes(l.status)).length;
  const totalDelivered = leads.filter((l) => l.status === 'livree').length;
  const validRate = totalLeads ? Math.round((totalValidated / totalLeads) * 100) : 0;
  const deliveryRate = totalValidated ? Math.round((totalDelivered / totalValidated) * 100) : 0;

  const ranking = useMemo(() => {
    return closeuses.map((c) => {
      const own = leads.filter((l) => l.closeuse_idx === c.idx);
      return { c, stats: computeCloseuseStats(own) };
    }).sort((a, b) => (b.stats.validated - a.stats.validated) || (b.stats.validationRate - a.stats.validationRate)).slice(0, 5);
  }, [closeuses, leads]);

  const topProducts = useMemo(() => {
    const m = new Map<string, number>();
    leads.forEach((l) => m.set(l.product_slug, (m.get(l.product_slug) || 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [leads]);

  const Card = ({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) => (
    <div className={`rounded-2xl p-4 text-white ${color}`}>
      <div className="text-xs opacity-90 font-bold">{label}</div>
      <div className="text-2xl font-extrabold">{value}</div>
      {sub && <div className="text-[10px] opacity-80 mt-0.5">{sub}</div>}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card label="Leads aujourd'hui" value={leadsToday} color="bg-blue-600" />
        <Card label="Validées aujourd'hui" value={validatedToday} color="bg-emerald-600" />
        <Card label="Livrées aujourd'hui" value={deliveredToday} color="bg-green-600" sub={formatFCFA(orders.filter((o) => o.status === 'delivered' && isToday(o.delivered_at || o.created_at)).reduce((s, o) => s + o.product_price, 0))} />
        <Card label="Refus aujourd'hui" value={refusedToday} color="bg-red-600" />
        <Card label="Taux validation" value={`${validRate}%`} color="bg-indigo-600" sub={`${totalValidated}/${totalLeads}`} />
        <Card label="Taux livraison" value={`${deliveryRate}%`} color="bg-teal-600" sub={`${totalDelivered}/${totalValidated}`} />
        <Card label="À relancer" value={relancer} color="bg-orange-600" />
        <Card label="Closeuses actives" value={closeuses.filter((c) => c.active).length} color="bg-rose-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border-2 border-vert-bg">
          <div className="font-extrabold mb-2">🏆 Top 5 closeuses</div>
          <div className="space-y-1.5">
            {ranking.map((r, i) => (
              <div key={r.c.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg w-6">{['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</span>
                  <div>
                    <div className="font-bold">{r.c.name}</div>
                    <div className="text-[10px] text-gray-500">{formatLastActivity(closeusesActivity[r.c.idx])}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-vert">{r.stats.validated} val.</div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${r.stats.scoreColor}`}>{r.stats.scoreLabel}</span>
                </div>
              </div>
            ))}
            {ranking.length === 0 && <div className="text-xs text-gray-500">Aucune closeuse encore active.</div>}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-vert-bg">
          <div className="font-extrabold mb-2">📦 Top produits (leads)</div>
          <div className="space-y-1.5">
            {topProducts.map(([slug, count]) => (
              <div key={slug} className="flex justify-between text-sm">
                <span className="truncate">{slug}</span>
                <span className="font-bold text-vert">{count}</span>
              </div>
            ))}
            {topProducts.length === 0 && <div className="text-xs text-gray-500">Aucun lead.</div>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border-2 border-vert-bg">
        <div className="font-extrabold mb-2">📜 Dernières activités</div>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {entries.slice(0, 12).map((e) => (
            <div key={e.id} className="text-xs flex justify-between gap-2 py-1 border-b border-gray-100">
              <span className="truncate">{e.actor_name || e.actor_type} · {e.action} · {e.entity_type}</span>
              <span className="text-gray-500 shrink-0">{new Date(e.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span>
            </div>
          ))}
          {entries.length === 0 && <div className="text-xs text-gray-500">Aucune activité.</div>}
        </div>
      </div>
    </div>
  );
}
