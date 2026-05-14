import { useState } from 'react';
import { StatusModal } from './StatusModal';
import type { LivreurOrder } from '@/lib/livreur-orders';
import type { Livreur } from '@/lib/livreurs';
import { productBadge } from '@/lib/products';

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: 'À livrer', cls: 'bg-amber-100 text-amber-800' },
  delivered: { label: 'Livré ✅', cls: 'bg-emerald-100 text-emerald-800' },
  shipped: { label: 'Expédié 📦', cls: 'bg-blue-100 text-blue-800' },
  cancelled: { label: 'Annulé ❌', cls: 'bg-red-100 text-red-800' },
  rescheduled: { label: 'Reprogrammé 📅', cls: 'bg-amber-100 text-amber-800' },
};

export function OrderCard({ order, livreur, onUpdated }: { order: LivreurOrder; livreur: Livreur; onUpdated: () => void }) {
  const [open, setOpen] = useState(false);
  const phone = (order.whatsapp || '').replace(/\D/g, '');
  const addressText = [order.neighborhood, order.address_detail, order.city].filter(Boolean).join(', ');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText || order.city || '')}`;
  const waMsg = encodeURIComponent(
    `Bonjour ${order.first_name || ''} 🌿, je suis votre livreur KOUKA 🛵.\n\n` +
    `J'arrive bientôt avec votre commande *${order.order_number}* :\n` +
    `📦 *Produit :* ${order.product_name}\n` +
    (order.offer_label ? `🎁 *Offre :* ${order.offer_label}\n` : '') +
    `💰 *À payer :* ${order.product_price.toLocaleString('fr-FR')} FCFA\n\n` +
    `Merci de bien préparer le montant 🙏`
  );
  const waUrl = `https://wa.me/${phone}?text=${waMsg}`;
  const status = STATUS_LABEL[order.status] || { label: order.status, cls: 'bg-gray-100 text-gray-700' };
  const badge = productBadge(order.product_name, order.product_slug);

  const isFinal = ['delivered', 'cancelled', 'shipped'].includes(order.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 flex justify-between items-start">
        <div>
          <div className="text-xs text-gray-500">N° {order.order_number}</div>
          <div className="font-bold text-gray-900">
            {order.first_name} {order.last_name}
          </div>
          <div className="text-xs text-gray-600">{order.city}{order.neighborhood ? ` · ${order.neighborhood}` : ''}</div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.cls}`}>{status.label}</span>
      </div>

      <div className="px-4 pb-2 text-sm">
        <div className="mb-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {badge.emoji} {badge.label}
          </span>
        </div>
        <div className="text-gray-900 font-semibold">{order.product_name}</div>
        {order.offer_label && (
          <div className="text-xs text-gray-600">📦 {order.offer_label}</div>
        )}
        <div className="text-emerald-700 font-bold mt-0.5">{order.product_price.toLocaleString('fr-FR')} FCFA</div>
        {order.delivery_slot && <div className="text-xs text-gray-500 mt-1">⏰ {order.delivery_slot}</div>}
        {order.address_detail && <div className="text-xs text-gray-500 mt-1">📍 {order.address_detail}</div>}
        {order.notes && <div className="text-xs text-amber-700 mt-1 bg-amber-50 px-2 py-1 rounded">📝 {order.notes}</div>}
        {order.cancellation_reason && (
          <div className="text-xs text-red-700 mt-1 bg-red-50 px-2 py-1 rounded">Motif : {order.cancellation_reason}</div>
        )}
        {order.reschedule_date && (
          <div className="text-xs text-amber-700 mt-1 bg-amber-50 px-2 py-1 rounded">
            Reprogrammé : {new Date(order.reschedule_date).toLocaleString('fr-FR')}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 border-t border-gray-100">
        {phone && (
          <a href={`tel:${phone}`} className="text-center py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 border-r border-gray-100">
            📞 Appel
          </a>
        )}
        {phone && (
          <a href={waUrl} target="_blank" rel="noreferrer" className="text-center py-2.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 border-r border-gray-100">
            💬 WhatsApp
          </a>
        )}
        <a href={mapsUrl} target="_blank" rel="noreferrer" className="text-center py-2.5 text-xs font-medium text-blue-700 hover:bg-blue-50">
          🗺️ Maps
        </a>
      </div>

      {!isFinal && (
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 text-sm"
        >
          Mettre à jour le statut
        </button>
      )}

      <StatusModal order={order} livreur={livreur} open={open} onClose={() => setOpen(false)} onUpdated={onUpdated} />
    </div>
  );
}
