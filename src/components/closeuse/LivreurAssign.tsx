import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLivreurs, cleanPhone } from '@/lib/livreurs';
import { buildClientMessage, buildLivreurMessage, waUrl, type WAOrder } from '@/lib/whatsappMessages';

type Props = {
  orderId: string;
};

type OrderFull = {
  id: string;
  order_number: string;
  product_name: string;
  product_slug: string | null;
  product_price: number;
  offer_label: string | null;
  first_name: string | null;
  last_name: string | null;
  whatsapp: string | null;
  country: string | null;
  city: string | null;
  neighborhood: string | null;
  car_transport: string | null;
  delivery_slot: string | null;
  livreur_idx: number | null;
  status: string;
};

const db = supabase as any;

export function LivreurAssign({ orderId }: Props) {
  const { livreurs } = useLivreurs();
  const [order, setOrder] = useState<OrderFull | null>(null);
  const [assigning, setAssigning] = useState(false);

  const reload = async () => {
    const { data } = await db.from('orders').select('*').eq('id', orderId).maybeSingle();
    setOrder(data as OrderFull | null);
  };

  useEffect(() => {
    reload();
    const ch = supabase
      .channel(`order-assign-${orderId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, () => reload())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (!order) return null;

  const assignLivreur = async (idx: number) => {
    setAssigning(true);
    try {
      const { error } = await db.from('orders').update({
        livreur_idx: idx,
        assigned_at: new Date().toISOString(),
      }).eq('id', orderId);
      if (error) throw error;
      toast.success('🛵 Livreur assigné');
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erreur');
    } finally { setAssigning(false); }
  };

  const livreur = livreurs.find((l) => l.idx === order.livreur_idx);
  const wa: WAOrder = {
    order_number: order.order_number,
    product_name: order.product_name,
    product_slug: order.product_slug,
    product_price: order.product_price,
    offer_label: order.offer_label,
    first_name: order.first_name,
    last_name: order.last_name,
    whatsapp: order.whatsapp,
    country: order.country,
    city: order.city,
    neighborhood: order.neighborhood,
    car_transport: order.car_transport,
    delivery_slot: order.delivery_slot,
  };

  const clientUrl = order.whatsapp ? waUrl(order.whatsapp, buildClientMessage(wa)) : null;
  const livreurUrl = livreur ? (livreur.wa_group_url || waUrl(livreur.whatsapp, buildLivreurMessage(wa))) : null;

  return (
    <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-3 space-y-2">
      <div className="text-[11px] font-extrabold text-cyan-900 uppercase">🛵 Livreur</div>

      <div className="flex gap-2 items-center">
        <select
          value={order.livreur_idx ?? ''}
          onChange={(e) => e.target.value !== '' && assignLivreur(Number(e.target.value))}
          disabled={assigning}
          className="flex-1 rounded-lg border border-cyan-300 bg-white px-2 py-1.5 text-sm"
        >
          <option value="">— Choisir un livreur —</option>
          {livreurs.filter((l) => l.active).map((l) => (
            <option key={l.id} value={l.idx}>{l.emoji} {l.name} {l.zone ? `· ${l.zone}` : ''}</option>
          ))}
        </select>
      </div>

      {livreur && (
        <div className="text-[11px] text-cyan-900 bg-white border border-cyan-200 rounded-lg p-2">
          ✅ Assigné à <b>{livreur.emoji} {livreur.name}</b>
          {livreur.whatsapp && <span className="text-gray-600"> · +{cleanPhone(livreur.whatsapp)}</span>}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {clientUrl && (
          <a href={clientUrl} target="_blank" rel="noreferrer" className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            💬 Confirmation client
          </a>
        )}
        {livreurUrl && (
          <a href={livreurUrl} target="_blank" rel="noreferrer" className="bg-cyan-700 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            🛵 Envoyer au livreur
          </a>
        )}
      </div>
    </div>
  );
}
