import { useState } from 'react';
import { toast } from 'sonner';
import { formatFCFA } from '@/lib/products';
import { buildClientMessage, buildLivreurMessage, waUrl, type WAOrder } from '@/lib/whatsappMessages';
import { CLOSEUSE_ORDER_STATUS_META, type CloseuseOrder, updateCloseuseOrderStatus } from '@/lib/closeuse-orders';

const LIVREUR_GROUP_URL = 'https://chat.whatsapp.com/IeoZRclWk6H0rsHaOiO1dc';

const ORDER_ACTIONS = [
  { to: 'pending', label: 'En attente', emoji: '🕒', cls: 'bg-blue-600 hover:bg-blue-700' },
  { to: 'approche', label: 'Approche', emoji: '💬', cls: 'bg-amber-600 hover:bg-amber-700' },
  { to: 'suivi', label: 'Suivi', emoji: '🔁', cls: 'bg-orange-600 hover:bg-orange-700' },
  { to: 'confirmed', label: 'Confirmée', emoji: '✅', cls: 'bg-emerald-600 hover:bg-emerald-700' },
  { to: 'delivered', label: 'Livrée', emoji: '🎉', cls: 'bg-green-700 hover:bg-green-800' },
  { to: 'cancelled', label: 'Annulée', emoji: '🚫', cls: 'bg-red-600 hover:bg-red-700' },
];

export function CloseuseOrderCard({ order, onChanged }: { order: CloseuseOrder; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const statusKey = order.status || 'pending';
  const badge = CLOSEUSE_ORDER_STATUS_META[statusKey] || { label: statusKey, emoji: '•', cls: 'bg-gray-100 text-gray-700' };

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

  const setStatus = async (to: string) => {
    if (to === statusKey || busy) return;
    setBusy(true);
    try {
      await updateCloseuseOrderStatus(order, to);
      toast.success(`Statut → ${CLOSEUSE_ORDER_STATUS_META[to]?.label || to}`);
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setBusy(false);
    }
  };

  const openLivreurGroup = async () => {
    try {
      await navigator.clipboard?.writeText(buildLivreurMessage(wa));
      toast.success('Message livreur copié 📋 — colle-le dans le groupe');
    } catch {
      toast.message('Ouverture du groupe livreur…');
    }
    window.open(LIVREUR_GROUP_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-rose-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-3 flex justify-between items-center gap-2 hover:bg-rose-50/50"
      >
        <div className="min-w-0 flex-1">
          <div className="font-extrabold text-rose-900 truncate">
            {order.first_name || 'Client'} {order.last_name || ''}
          </div>
          <div className="text-xs text-gray-600 truncate">{order.order_number} · {order.product_name}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            {order.city || '—'} · {new Date(order.assigned_at || order.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.emoji} {badge.label}</span>
          <span className="text-xs font-extrabold text-rose-700">{formatFCFA(order.product_price)}</span>
          <span className="text-[10px] text-rose-400">{open ? '▲ Fermer' : '▼ Ouvrir'}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-rose-100 p-3 space-y-3 bg-rose-50/40">
          <div className="text-xs bg-white border border-rose-100 rounded-lg p-2 space-y-0.5">
            <div>📞 <b>{order.whatsapp || '—'}</b></div>
            <div>📍 {[order.city, order.neighborhood, order.address_detail].filter(Boolean).join(' · ') || '—'}</div>
            {order.offer_label && <div>🎁 {order.offer_label}</div>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {clientUrl ? (
              <a href={clientUrl} target="_blank" rel="noreferrer" className="bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold px-3 py-2.5 rounded-xl text-center">
                💬 Confirmation client
              </a>
            ) : (
              <span className="bg-gray-200 text-gray-500 text-xs font-extrabold px-3 py-2.5 rounded-xl text-center">💬 Pas de WhatsApp</span>
            )}
            <button onClick={openLivreurGroup} className="bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-extrabold px-3 py-2.5 rounded-xl text-center">
              🛵 Notif livreur
            </button>
          </div>

          <div>
            <div className="text-[11px] font-extrabold text-rose-900 uppercase mb-1.5">Statut de la commande</div>
            <div className="grid grid-cols-3 gap-1.5">
              {ORDER_ACTIONS.map((s) => {
                const active = s.to === statusKey;
                return (
                  <button
                    key={s.to}
                    disabled={busy || active}
                    onClick={() => setStatus(s.to)}
                    className={`text-xs text-white font-bold px-2 py-2 rounded-lg disabled:opacity-100 ${s.cls} ${active ? 'ring-2 ring-offset-1 ring-rose-400' : ''}`}
                  >
                    {s.emoji} {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}