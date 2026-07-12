import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OrdersTab, type Order } from '@/components/admin/OrdersTab';
import type { CloseuseSession } from '@/lib/closeuse-auth';
import { formatFCFA } from '@/lib/products';

const PRIME_PAR_LIVRAISON = 1000;

/**
 * Panneau réservé aux closeuses ayant `admin_orders_access = true`.
 * Elle voit et traite toutes les commandes comme un admin.
 * Chaque fois qu'elle passe une commande en `delivered`, on enregistre
 * `delivered_by_closeuse_idx` pour lui créditer sa prime de 1 000 FCFA.
 */
export function AdminOrdersPanel({ session }: { session: CloseuseSession }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2000);
    if (error) toast.error(error.message);
    else setOrders((data || []) as Order[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel('closeuse-admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => load(true))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => load(true))
      .subscribe();
    const itv = window.setInterval(() => load(true), 5000);
    return () => { supabase.removeChannel(channel); window.clearInterval(itv); };
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    const patch: Record<string, unknown> = { status };
    // Trace la closeuse qui a livré → prime de 1 000 FCFA
    if (status === 'delivered') patch.delivered_by_closeuse_idx = session.idx;
    const { error } = await supabase.from('orders').update(patch as never).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Statut mis à jour'); load(true); }
  };

  const assignLivreur = async (id: string, livreurIdx: number | null) => {
    const { error } = await supabase.from('orders').update({ livreur_idx: livreurIdx }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Livreur mis à jour'); load(true); }
  };

  // Prime du mois en cours pour cette closeuse
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const myDelivered = orders.filter((o) => {
    const idx = (o as unknown as { delivered_by_closeuse_idx?: number | null }).delivered_by_closeuse_idx;
    return idx === session.idx && o.status === 'delivered' && o.delivered_at && new Date(o.delivered_at) >= monthStart;
  });
  const prime = myDelivered.length * PRIME_PAR_LIVRAISON;

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-br from-vert to-vert-mid text-white rounded-2xl p-4">
        <div className="text-xs opacity-90 font-bold uppercase">Prime traitement admin · ce mois</div>
        <div className="text-3xl font-extrabold mt-1">{formatFCFA(prime)}</div>
        <div className="text-xs opacity-90 mt-1">
          {myDelivered.length} livraison{myDelivered.length > 1 ? 's' : ''} validée{myDelivered.length > 1 ? 's' : ''} par toi · {formatFCFA(PRIME_PAR_LIVRAISON)} par commande livrée
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Chargement…</div>
      ) : (
        <OrdersTab
          orders={orders}
          onUpdateStatus={updateStatus}
          onAssignLivreur={assignLivreur}
          onChange={() => load(true)}
        />
      )}
    </div>
  );
}
