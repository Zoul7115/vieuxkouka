import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useLivreurs } from '@/lib/livreurs';
import { useLivreurOrders, type LivreurOrder } from '@/lib/livreur-orders';
import { OrderCard } from '@/components/livreur/OrderCard';
import { usePWALivreur } from '@/hooks/usePWALivreur';
import { useLivreurSession } from '@/lib/use-livreur-session';
import { ManualOrderModal } from '@/components/ManualOrderModal';

export const Route = createFileRoute('/livreur/')({
  component: LivreurDashboard,
});

function LivreurDashboard() {
  const { session } = useLivreurSession();
  const { livreurs } = useLivreurs();
  const { orders, reload } = useLivreurOrders(session?.idx ?? null);
  const [tab, setTab] = useState<'todo' | 'today' | 'history'>('todo');
  const [manualOpen, setManualOpen] = useState(false);

  const livreur = livreurs.find((l) => l.idx === session?.idx);
  const { installed, install, permission, enableNotif, installPromptAvailable } = usePWALivreur(session?.idx ?? null, session?.name ?? '');

  const todayStart = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d.toISOString();
  }, []);

  const filtered = useMemo(() => {
    if (tab === 'todo') return orders.filter((o) => !['delivered', 'cancelled', 'shipped'].includes(o.status));
    if (tab === 'today') return orders.filter((o) => ['delivered', 'shipped'].includes(o.status) && o.created_at >= todayStart);
    const sevenAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    return orders.filter((o) => o.created_at >= sevenAgo);
  }, [orders, tab, todayStart]);

  const counts = useMemo(() => {
    const today = orders.filter((o) => o.created_at >= todayStart);
    return {
      pending: orders.filter((o) => !['delivered', 'cancelled', 'shipped'].includes(o.status)).length,
      delivered: today.filter((o) => o.status === 'delivered').length,
      cancelled: today.filter((o) => o.status === 'cancelled').length,
    };
  }, [orders, todayStart]);

  if (!livreur) return <div className="p-6 text-center text-gray-500">Chargement…</div>;

  return (
    <div className="space-y-4">
      {/* PWA / Notif bar */}
      {(!installed || permission !== 'granted') && (
        <div className="bg-white border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-sm">
          {!installed && installPromptAvailable && (
            <button onClick={install} className="flex-1 bg-emerald-600 text-white rounded-lg py-2 font-medium">📲 Installer l'app</button>
          )}
          {permission !== 'granted' && (
            <button onClick={enableNotif} className="flex-1 bg-amber-500 text-white rounded-lg py-2 font-medium">🔔 Activer notifications</button>
          )}
        </div>
      )}

      {/* Compteurs */}
      <div className="grid grid-cols-3 gap-2">
        <Counter label="À livrer" value={counts.pending} color="bg-amber-100 text-amber-800" />
        <Counter label="Livrées" value={counts.delivered} color="bg-emerald-100 text-emerald-800" />
        <Counter label="Annulées" value={counts.cancelled} color="bg-red-100 text-red-800" />
      </div>

      {/* Bouton commande manuelle */}
      <button
        onClick={() => setManualOpen(true)}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl py-2.5 text-sm"
      >
        ➕ Ajouter une commande manuelle
      </button>
      <ManualOrderModal
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        onCreated={reload}
        forceLivreurIdx={session?.idx ?? null}
        orderPrefix="LIV"
      />

      {/* Tabs */}
      <div className="flex bg-white rounded-xl p-1 border border-gray-200 text-sm">
        <TabBtn active={tab === 'todo'} onClick={() => setTab('todo')}>À livrer</TabBtn>
        <TabBtn active={tab === 'today'} onClick={() => setTab('today')}>Aujourd'hui</TabBtn>
        <TabBtn active={tab === 'history'} onClick={() => setTab('history')}>7 jours</TabBtn>
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-6 text-center text-gray-400 text-sm">Aucune commande dans cette catégorie</div>
        )}
        {filtered.map((o: LivreurOrder) => (
          <OrderCard key={o.id} order={o} livreur={livreur} onUpdated={reload} />
        ))}
      </div>
    </div>
  );
}

function Counter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-xl p-2.5 text-center ${color}`}>
      <div className="text-2xl font-bold leading-none">{value}</div>
      <div className="text-xs mt-1">{label}</div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`flex-1 py-2 rounded-lg font-medium transition ${active ? 'bg-emerald-600 text-white' : 'text-gray-600'}`}>
      {children}
    </button>
  );
}
