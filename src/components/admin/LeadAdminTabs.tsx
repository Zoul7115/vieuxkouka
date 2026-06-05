import { useMemo } from 'react';
import { useLeads, LEAD_STATUS_META, type Lead, type LeadStatus } from '@/lib/leads';
import { useCloseuses } from '@/lib/closeuses';
import { formatFCFA } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Order } from '@/components/admin/OrdersTab';

/** Onglet : commandes validées (vue admin sur les leads validés → orders) */
export function ValidatedOrdersTab({ orders }: { orders: Order[] }) {
  const validated = useMemo(
    () => orders.filter((o) => o.closeuse_idx != null && ['confirmed', 'delivered'].includes(o.status)),
    [orders],
  );
  return (
    <div className="space-y-2">
      <div className="text-sm font-bold text-vert">✅ {validated.length} commandes validées par les closeuses</div>
      {validated.map((o) => (
        <OrderRow key={o.id} order={o} />
      ))}
      {validated.length === 0 && <Empty label="Aucune commande validée pour le moment." />}
    </div>
  );
}

/** Onglet : commandes livrées */
export function DeliveredOrdersTab({ orders }: { orders: Order[] }) {
  const delivered = useMemo(() => orders.filter((o) => o.status === 'delivered'), [orders]);
  const ca = delivered.reduce((s, o) => s + o.product_price, 0);
  return (
    <div className="space-y-2">
      <div className="bg-gradient-to-br from-vert to-vert-mid text-white rounded-2xl p-4">
        <div className="text-xs opacity-90 font-bold">🎉 {delivered.length} commandes livrées</div>
        <div className="text-2xl font-extrabold">{formatFCFA(ca)}</div>
      </div>
      {delivered.map((o) => <OrderRow key={o.id} order={o} />)}
      {delivered.length === 0 && <Empty label="Aucune livraison pour le moment." />}
    </div>
  );
}

/** Onglet : refusées / annulées (leads + commandes) */
export function RefusedTab() {
  const { leads, loading } = useLeads(null);
  const refused = useMemo(() => leads.filter((l) => ['refusee', 'annulee'].includes(l.status)), [leads]);
  if (loading) return <Empty label="Chargement…" />;
  return (
    <div className="space-y-2">
      <div className="text-sm font-bold text-rouge">❌ {refused.length} leads refusés / annulés</div>
      {refused.map((l) => <LeadRow key={l.id} lead={l} />)}
      {refused.length === 0 && <Empty label="Aucun refus." />}
    </div>
  );
}

/** Onglet : perdus / à relancer */
export function LostLeadsTab() {
  const { leads, loading } = useLeads(null);
  const lost = useMemo(() => leads.filter((l) => ['perdue', 'a_relancer'].includes(l.status)), [leads]);

  const relaunch = async (lead: Lead) => {
    await (supabase as any).from('leads').update({ status: 'a_relancer', updated_at: new Date().toISOString() }).eq('id', lead.id);
    await (supabase as any).from('lead_events').insert({
      lead_id: lead.id, closeuse_idx: lead.closeuse_idx, event_type: 'relance_admin', from_status: lead.status, to_status: 'a_relancer',
    });
    toast.success('Lead remis "à relancer"');
  };

  if (loading) return <Empty label="Chargement…" />;
  return (
    <div className="space-y-2">
      <div className="text-sm font-bold text-orange-700">💀 {lost.length} leads perdus ou à relancer</div>
      {lost.map((l) => (
        <div key={l.id} className="bg-white rounded-xl border-2 border-orange-100 p-3 flex justify-between gap-2">
          <div className="min-w-0">
            <div className="font-bold text-gray-900 truncate">{l.first_name || 'Client'} · {l.city}</div>
            <div className="text-xs text-gray-500 truncate">{l.product_name} · {l.closeuse_slug}</div>
            {l.notes && <div className="text-[10px] text-gray-500 mt-1 line-clamp-2">{l.notes}</div>}
          </div>
          <div className="text-right shrink-0 space-y-1">
            <button onClick={() => relaunch(l)} className="text-xs bg-orange-600 text-white px-2 py-1 rounded font-bold">🔁 Relancer</button>
          </div>
        </div>
      ))}
      {lost.length === 0 && <Empty label="Aucun lead perdu." />}
    </div>
  );
}

/** Onglet : commandes groupées par closeuse */
export function OrdersByCloseuseTab({ orders }: { orders: Order[] }) {
  const { closeuses } = useCloseuses();
  const grouped = useMemo(() => {
    const m = new Map<number, Order[]>();
    orders.forEach((o) => {
      if (o.closeuse_idx == null) return;
      if (!m.has(o.closeuse_idx)) m.set(o.closeuse_idx, []);
      m.get(o.closeuse_idx)!.push(o);
    });
    return m;
  }, [orders]);

  return (
    <div className="space-y-3">
      {closeuses.map((c) => {
        const list = grouped.get(c.idx) || [];
        if (list.length === 0) return null;
        const ca = list.filter((o) => o.status === 'delivered').reduce((s, o) => s + o.product_price, 0);
        return (
          <div key={c.id} className="bg-white border-2 border-rose-100 rounded-2xl p-4">
            <div className="flex justify-between items-baseline mb-2">
              <div className="font-extrabold text-rose-900">{c.emoji} {c.name}</div>
              <div className="text-xs text-gray-500">{list.length} cmdes · CA livré {formatFCFA(ca)}</div>
            </div>
            <div className="space-y-1">
              {list.slice(0, 8).map((o) => <OrderRow key={o.id} order={o} compact />)}
              {list.length > 8 && <div className="text-xs text-gray-500 text-center pt-1">… +{list.length - 8} autres</div>}
            </div>
          </div>
        );
      })}
      {grouped.size === 0 && <Empty label="Aucune commande attribuée à une closeuse." />}
    </div>
  );
}

function OrderRow({ order, compact }: { order: Order; compact?: boolean }) {
  return (
    <div className={`bg-white border border-vert-bg rounded-lg p-2 flex justify-between gap-2 ${compact ? '' : 'border-2'}`}>
      <div className="min-w-0">
        <div className="font-bold text-sm truncate">{order.first_name || 'Client'} · {order.city || '—'}</div>
        <div className="text-xs text-gray-500 truncate">{order.product_name}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-bold text-sm text-vert">{formatFCFA(order.product_price)}</div>
        <div className="text-[10px] text-gray-500">{order.status}</div>
      </div>
    </div>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const meta = LEAD_STATUS_META[lead.status as LeadStatus];
  return (
    <div className="bg-white border-2 border-gray-100 rounded-lg p-2 flex justify-between gap-2">
      <div className="min-w-0">
        <div className="font-bold text-sm truncate">{lead.first_name || 'Client'} · {lead.city}</div>
        <div className="text-xs text-gray-500 truncate">{lead.product_name} · {lead.closeuse_slug}</div>
      </div>
      <div className="text-right shrink-0">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.cls}`}>{meta.emoji} {meta.label}</span>
        <div className="text-xs text-gray-500 mt-1">{formatFCFA(lead.product_price)}</div>
      </div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="bg-white rounded-2xl p-6 text-center text-gray-500 border-2 border-vert-bg">{label}</div>;
}
