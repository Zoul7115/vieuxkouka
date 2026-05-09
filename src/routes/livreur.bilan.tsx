import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useLivreurs, effectiveDeliveryFee } from '@/lib/livreurs';
import { useLivreurOrders, unitsForOrder, confirmCashHandover } from '@/lib/livreur-orders';
import type { LivreurSession } from '@/lib/livreur-auth';

export const Route = createFileRoute('/livreur/bilan')({
  component: LivreurBilan,
});

const layoutApi = getRouteApi('/livreur');

function LivreurBilan() {
  const { session } = layoutApi.useRouteContext() as { session: LivreurSession };
  const { livreurs } = useLivreurs();
  const { orders, reload } = useLivreurOrders(session.idx);
  const [busy, setBusy] = useState(false);
  const [days, setDays] = useState(0); // 0 = aujourd'hui, 1 = hier...

  const dayStart = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - days); return d;
  }, [days]);
  const dayEnd = useMemo(() => {
    const d = new Date(dayStart); d.setDate(d.getDate() + 1); return d;
  }, [dayStart]);

  const day = useMemo(() => {
    const startISO = dayStart.toISOString();
    const endISO = dayEnd.toISOString();
    const inDay = orders.filter((o) => o.created_at >= startISO && o.created_at < endISO);
    const delivered = inDay.filter((o) => o.status === 'delivered');
    const ca = delivered.reduce((s, o) => s + o.product_price, 0);
    const fees = delivered.reduce((s, o) => s + effectiveDeliveryFee(livreurs, { livreur_idx: o.livreur_idx, delivery_fee: o.delivery_fee }), 0);
    const pieces = delivered.reduce((s, o) => s + unitsForOrder(o), 0);
    const reverse = ca - fees;
    const pendingCash = delivered.filter((o) => !o.cash_confirmed);
    return {
      delivered, ca, fees, pieces, reverse,
      pendingCashIds: pendingCash.map((o) => o.id),
      pendingCashAmount: pendingCash.reduce((s, o) => s + o.product_price - effectiveDeliveryFee(livreurs, { livreur_idx: o.livreur_idx, delivery_fee: o.delivery_fee }), 0),
      shipped: inDay.filter((o) => o.status === 'shipped'),
      cancelled: inDay.filter((o) => o.status === 'cancelled'),
    };
  }, [orders, livreurs, dayStart, dayEnd]);

  // Historique 30 jours
  const history = useMemo(() => {
    const arr: { date: string; ca: number; fees: number; net: number; nb: number }[] = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
      const e = new Date(d); e.setDate(e.getDate() + 1);
      const sISO = d.toISOString(); const eISO = e.toISOString();
      const dlv = orders.filter((o) => o.created_at >= sISO && o.created_at < eISO && o.status === 'delivered');
      if (!dlv.length) continue;
      const ca = dlv.reduce((s, o) => s + o.product_price, 0);
      const fees = dlv.reduce((s, o) => s + effectiveDeliveryFee(livreurs, { livreur_idx: o.livreur_idx, delivery_fee: o.delivery_fee }), 0);
      arr.push({ date: d.toLocaleDateString('fr-FR'), ca, fees, net: ca - fees, nb: dlv.length });
    }
    return arr;
  }, [orders, livreurs]);

  const handover = async () => {
    if (!day.pendingCashIds.length) { toast.info('Aucune commande à confirmer'); return; }
    setBusy(true);
    try {
      await confirmCashHandover(day.pendingCashIds);
      toast.success(`✅ ${day.pendingCashIds.length} commande(s) marquée(s) comme reversée(s)`);
      reload();
    } catch {
      toast.error('Erreur — réessaye');
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-4">
      {/* Sélecteur jour */}
      <div className="flex items-center gap-2">
        <button onClick={() => setDays(days + 1)} className="px-3 py-1.5 bg-white rounded-lg border text-sm">←</button>
        <div className="flex-1 text-center font-semibold text-emerald-900">
          {days === 0 ? "Aujourd'hui" : days === 1 ? 'Hier' : dayStart.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}
        </div>
        <button onClick={() => setDays(Math.max(0, days - 1))} disabled={days === 0} className="px-3 py-1.5 bg-white rounded-lg border text-sm disabled:opacity-30">→</button>
      </div>

      {/* Résumé */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
        <Row label="Livraisons" value={`${day.delivered.length} (${day.pieces} pièces)`} />
        <Row label="Expédiées" value={`${day.shipped.length}`} muted />
        <Row label="Annulées" value={`${day.cancelled.length}`} muted />
        <hr className="my-2" />
        <Row label="💰 CA encaissé (livraisons)" value={`${day.ca.toLocaleString('fr-FR')} FCFA`} />
        <Row label="🛵 Tes frais de livraison" value={`${day.fees.toLocaleString('fr-FR')} FCFA`} good />
        <hr className="my-2" />
        <Row label="📤 À reverser à l'admin" value={`${day.reverse.toLocaleString('fr-FR')} FCFA`} bold />
      </div>

      {days === 0 && day.pendingCashIds.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-2">
          <div className="text-sm text-amber-900">
            <strong>{day.pendingCashIds.length}</strong> commande(s) à reverser : <strong>{day.pendingCashAmount.toLocaleString('fr-FR')} FCFA</strong>
          </div>
          <button onClick={handover} disabled={busy} className="w-full bg-emerald-600 text-white rounded-lg py-2.5 font-semibold disabled:opacity-50">
            ✅ J'ai versé à l'admin
          </button>
        </div>
      )}

      {/* Historique */}
      {history.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">Historique 30 jours</div>
          <div className="space-y-1">
            {history.map((h) => (
              <div key={h.date} className="flex justify-between text-xs py-1 border-b border-gray-100 last:border-0">
                <span className="text-gray-600">{h.date}</span>
                <span className="text-gray-700">{h.nb} liv.</span>
                <span className="font-medium text-emerald-700">{h.net.toLocaleString('fr-FR')} F</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold, good, muted }: { label: string; value: string; bold?: boolean; good?: boolean; muted?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${bold ? 'text-base font-bold text-emerald-900' : ''} ${muted ? 'text-gray-500' : 'text-gray-700'}`}>
      <span>{label}</span>
      <span className={good ? 'text-emerald-700 font-semibold' : ''}>{value}</span>
    </div>
  );
}
