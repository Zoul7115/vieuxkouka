import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type CloseuseOrder = {
  id: string;
  order_number: string;
  product_name: string;
  product_slug?: string | null;
  product_price: number;
  offer_label: string | null;
  first_name: string | null;
  last_name: string | null;
  whatsapp: string | null;
  country: string | null;
  city: string | null;
  neighborhood?: string | null;
  address_detail?: string | null;
  car_transport?: string | null;
  delivery_slot?: string | null;
  status: string | null;
  closeuse_idx?: number | null;
  closeuse_slug?: string | null;
  livreur_idx?: number | null;
  lead_id?: string | null;
  assigned_at?: string | null;
  delivered_at?: string | null;
  created_at: string;
};

const db = supabase as any;

export const CLOSEUSE_ORDER_STATUS_META: Record<string, { label: string; emoji: string; cls: string }> = {
  pending: { label: 'En attente', emoji: '🕒', cls: 'bg-blue-100 text-blue-700' },
  approche: { label: 'Approche', emoji: '💬', cls: 'bg-amber-100 text-amber-700' },
  suivi: { label: 'Suivi', emoji: '🔁', cls: 'bg-orange-100 text-orange-700' },
  confirmed: { label: 'Confirmée', emoji: '✅', cls: 'bg-emerald-100 text-emerald-700' },
  expediee: { label: 'Expédiée', emoji: '📦', cls: 'bg-cyan-100 text-cyan-700' },
  delivered: { label: 'Livrée', emoji: '🎉', cls: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Annulée', emoji: '🚫', cls: 'bg-gray-200 text-gray-700' },
};

export function useCloseuseOrders(closeuseIdx?: number | null) {
  const [orders, setOrders] = useState<CloseuseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    let q = db.from('orders').select('*').order('assigned_at', { ascending: false }).order('created_at', { ascending: false }).limit(1000);
    if (typeof closeuseIdx === 'number') q = q.eq('closeuse_idx', closeuseIdx);
    const { data } = await q;
    setOrders((data || []) as CloseuseOrder[]);
    setLoading(false);
  }, [closeuseIdx]);

  useEffect(() => {
    load();
    const filter = typeof closeuseIdx === 'number' ? `closeuse_idx=eq.${closeuseIdx}` : undefined;
    const ch = supabase
      .channel(`closeuse-orders-${closeuseIdx ?? 'all'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', ...(filter ? { filter } : {}) }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [closeuseIdx, load]);

  return { orders, loading, reload: load };
}

export async function updateCloseuseOrderStatus(order: CloseuseOrder, status: string) {
  const nowIso = new Date().toISOString();
  const patch: Record<string, unknown> = { status };
  if (status === 'delivered') patch.delivered_at = order.delivered_at || nowIso;
  if (order.status === 'delivered' && status !== 'delivered') patch.delivered_at = null;

  const { error } = await db.from('orders').update(patch).eq('id', order.id);
  if (error) throw error;

  if (order.lead_id && ['pending', 'confirmed', 'delivered', 'cancelled'].includes(status)) {
    const leadStatus = status === 'confirmed' ? 'valide'
      : status === 'delivered' ? 'livree'
      : status === 'cancelled' ? 'annulee'
      : 'nouveau_lead';
    const leadPatch: Record<string, unknown> = { status: leadStatus };
    if (leadStatus === 'valide') leadPatch.validated_at = nowIso;
    await db.from('leads').update(leadPatch).eq('id', order.lead_id);
  }
}