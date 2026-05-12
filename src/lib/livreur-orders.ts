import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type LivreurOrder = {
  id: string;
  order_number: string;
  product_name: string;
  product_price: number;
  product_slug: string | null;
  offer_label: string | null;
  first_name: string | null;
  last_name: string | null;
  whatsapp: string | null;
  city: string | null;
  neighborhood: string | null;
  address_detail: string | null;
  delivery_slot: string | null;
  status: string;
  livreur_idx: number | null;
  delivery_fee: number | null;
  cash_confirmed: boolean | null;
  reschedule_date: string | null;
  cancellation_reason: string | null;
  notes: string | null;
  sav_notes: string | null;
  created_at: string;
};

/** Charge en temps réel les commandes assignées à un livreur */
export function useLivreurOrders(livreurIdx: number | null) {
  const [orders, setOrders] = useState<LivreurOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (livreurIdx == null) {
      setOrders([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('livreur_idx', livreurIdx)
      .order('created_at', { ascending: false });
    setOrders((data || []) as LivreurOrder[]);
    setLoading(false);
  }, [livreurIdx]);

  useEffect(() => {
    load();
    if (livreurIdx == null) return;
    const ch = supabase
      .channel(`livreur-orders-${livreurIdx}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [livreurIdx, load]);

  return { orders, loading, reload: load };
}

export function unitsForOrder(o: { offer_label?: string | null; product_name: string }): number {
  const label = (o.offer_label || o.product_name || '').toLowerCase();
  let units = 1;
  // 1) Quantité explicite (ex: "10 flacons", "5 sachets") — prioritaire pour les commandes manuelles
  const explicit = label.match(/(\d+)\s*(sachet|flacon|bidon|unit|piece|pièce)s?/i);
  if (explicit && parseInt(explicit[1], 10) > 0) {
    units = parseInt(explicit[1], 10);
  } else if (/3\s*\+\s*2/.test(label)) units = 5;
  else if (/2\s*\+\s*1/.test(label)) units = 3;
  else if (/1\s*(sachet|flacon)|démarrage|demarrage/.test(label)) units = 1;
  if (/bump/i.test(label)) units += 1;
  return units;
}

export type StatusUpdate =
  | { status: 'delivered'; delivery_fee: number }
  | { status: 'shipped' }
  | { status: 'cancelled'; reason: string }
  | { status: 'rescheduled'; reschedule_date: string };

export async function updateOrder(orderId: string, payload: StatusUpdate) {
  const update: {
    status: string;
    delivery_fee?: number;
    cancellation_reason?: string;
    reschedule_date?: string;
  } = { status: payload.status };
  if (payload.status === 'delivered') update.delivery_fee = payload.delivery_fee;
  if (payload.status === 'cancelled') update.cancellation_reason = payload.reason;
  if (payload.status === 'rescheduled') update.reschedule_date = payload.reschedule_date;
  const { error } = await supabase.from('orders').update(update).eq('id', orderId);
  if (error) throw error;
}

export async function confirmCashHandover(orderIds: string[]) {
  if (!orderIds.length) return;
  const { error } = await supabase
    .from('orders')
    .update({ cash_confirmed: true, confirmed_via_whatsapp_at: new Date().toISOString() })
    .in('id', orderIds);
  if (error) throw error;
}
