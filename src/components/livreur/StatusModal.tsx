import { useState } from 'react';
import { toast } from 'sonner';
import { updateOrder } from '@/lib/livreur-orders';
import type { LivreurOrder } from '@/lib/livreur-orders';
import type { Livreur } from '@/lib/livreurs';

type Props = {
  order: LivreurOrder;
  livreur: Livreur;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

export function StatusModal({ order, livreur, open, onClose, onUpdated }: Props) {
  const [choice, setChoice] = useState<'delivered' | 'shipped' | 'cancelled' | 'rescheduled' | null>(null);
  const [fee, setFee] = useState(String(livreur.delivery_fee || 2000));
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!choice) return;
    setLoading(true);
    try {
      if (choice === 'delivered') {
        await updateOrder(order.id, { status: 'delivered', delivery_fee: parseInt(fee) || 0 });
        toast.success('✅ Commande livrée');
      } else if (choice === 'shipped') {
        // « Expédié chez moi » = compté comme Livré, mais admin encaisse → frais livreur 0
        await updateOrder(order.id, { status: 'delivered', delivery_fee: 0 });
        toast.success('📦 Expédié chez l\'admin — comptée comme livrée');
      } else if (choice === 'cancelled') {
        if (!reason.trim()) {
          toast.error('Indique un motif d\'annulation');
          setLoading(false);
          return;
        }
        await updateOrder(order.id, { status: 'cancelled', reason: reason.trim() });
        toast.success('❌ Commande annulée');
      } else if (choice === 'rescheduled') {
        if (!date) {
          toast.error('Choisis une date');
          setLoading(false);
          return;
        }
        await updateOrder(order.id, { status: 'rescheduled', reschedule_date: new Date(date).toISOString() });
        toast.success('📅 Commande reprogrammée');
      }
      onUpdated();
      onClose();
    } catch (e) {
      toast.error('Erreur — réessaye');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const opt = (
    key: 'delivered' | 'shipped' | 'cancelled' | 'rescheduled',
    icon: string,
    label: string,
    color: string,
  ) => (
    <button
      key={key}
      onClick={() => setChoice(key)}
      className={`flex items-center gap-3 w-full rounded-xl border-2 px-4 py-3 text-left font-medium transition ${
        choice === key ? `${color} border-current` : 'border-gray-200 bg-white hover:border-gray-400'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold">Mettre à jour</h2>
            <p className="text-xs text-gray-500">Commande {order.order_number}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none">×</button>
        </div>

        <div className="space-y-2 mb-4">
          {opt('delivered', '✅', 'Livré (encaissé en cash)', 'bg-emerald-50 text-emerald-700')}
          {opt('shipped', '📦', 'Expédié chez l\'admin (= Livré)', 'bg-blue-50 text-blue-700')}
          {opt('cancelled', '❌', 'Annulé', 'bg-red-50 text-red-700')}
          {opt('rescheduled', '📅', 'Reprogrammé', 'bg-amber-50 text-amber-700')}
        </div>

        {choice === 'delivered' && (
          <div className="mb-4 bg-emerald-50 rounded-lg p-3">
            <label className="text-sm font-medium text-emerald-900">Frais de livraison encaissés (FCFA)</label>
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-base"
            />
            <p className="text-xs text-emerald-700 mt-1">
              💡 Si tu modifies ce montant, il remplace le frais par défaut. Tu gardes ces frais ; le reste ({(order.product_price).toLocaleString('fr-FR')} FCFA) est à reverser à l'admin.
            </p>
          </div>
        )}

        {choice === 'shipped' && (
          <div className="mb-4 bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
            ℹ️ La commande sera marquée <strong>Livrée</strong>. C'est l'admin qui encaisse. Aucun frais de livraison ne te sera compté.
          </div>
        )}

        {choice === 'cancelled' && (
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Motif d'annulation</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Client injoignable, refus, etc."
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
            />
          </div>
        )}

        {choice === 'rescheduled' && (
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Nouvelle date / créneau</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
            />
          </div>
        )}

        <button
          onClick={submit}
          disabled={!choice || loading}
          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 disabled:opacity-40"
        >
          {loading ? '...' : 'Confirmer'}
        </button>
      </div>
    </div>
  );
}
