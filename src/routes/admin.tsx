import { createFileRoute, Link } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatFCFA } from '@/lib/products';
import { toast } from 'sonner';
import { OrdersTab, type Order } from '@/components/admin/OrdersTab';
import { StatsTab } from '@/components/admin/StatsTab';
import { StockTab } from '@/components/admin/StockTab';
import { ComptaTab } from '@/components/admin/ComptaTab';
import { LivreursTab } from '@/components/admin/LivreursTab';
import { usePWAAdmin } from '@/hooks/usePWAAdmin';
import { PERIODS, filterByPeriod, type PeriodKey } from '@/lib/periods';

export const Route = createFileRoute('/admin')({
  head: () => ({ meta: [{ title: 'Admin — ShopAfrik' }] }),
  component: AdminPage,
});

const ADMIN_PASSWORD = 'KOUKA2024!';

type Visit = {
  id: string;
  page: string | null;
  country: string | null;
  source: string | null;
  visited_at: string | null;
};

type Tab = 'orders' | 'stats' | 'stock' | 'compta' | 'livreurs';

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('sa_auth') === '1') {
      setAuthed(true);
    }
  }, []);

  function tryLogin() {
    if (pwd === ADMIN_PASSWORD) {
      localStorage.setItem('sa_auth', '1');
      setAuthed(true);
      toast.success('Connecté');
    } else {
      toast.error('Mot de passe incorrect');
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-vert to-vert-mid p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
          <h1 className="text-vert text-2xl mb-2">🔒 Espace Admin</h1>
          <p className="text-muted-foreground text-sm mb-6">Mot de passe requis</p>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && tryLogin()}
            placeholder="Mot de passe"
            className="w-full px-4 py-3.5 border-2 border-vert-bg rounded-xl mb-4 outline-none focus:border-vert-mid"
          />
          <button
            onClick={tryLogin}
            className="w-full bg-vert-mid text-white py-3.5 rounded-xl font-extrabold hover:bg-vert transition-colors"
          >
            Se connecter
          </button>
          <Link to="/" className="block text-center text-vert-mid text-sm mt-4">
            ← Retour
          </Link>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => { localStorage.removeItem('sa_auth'); setAuthed(false); }} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [tab, setTab] = useState<Tab>('orders');
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodKey>('today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const load = useCallback(async (silent = false, attempt = 1) => {
    if (!silent) setLoading(true);
    try {
      const [oRes, vRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(2000),
        supabase.from('visits').select('*').order('visited_at', { ascending: false }).limit(5000),
      ]);
      if (oRes.error) throw oRes.error;
      else setOrders((oRes.data || []) as Order[]);
      if (vRes.error) throw vRes.error;
      else setVisits((vRes.data || []) as Visit[]);
    } catch (err) {
      console.error('admin load failed', err);
      if (attempt < 4) {
        window.setTimeout(() => load(silent, attempt + 1), attempt * 650);
        return;
      }
      if (!silent) toast.error('Erreur chargement — appuie sur 🔄 si besoin');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Realtime: refresh on any order change
    const channel = supabase
      .channel('admin-orders-stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => load(true))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_transactions' }, () => load(true))
      .subscribe();
    // Polling de secours toutes les 12s (en cas d'écart Realtime)
    const itv = window.setInterval(() => load(true), 12000);
    // Refresh quand l'onglet redevient visible
    const onVis = () => { if (document.visibilityState === 'visible') load(true); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      supabase.removeChannel(channel);
      window.clearInterval(itv);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success(`Statut mis à jour`); load(true); }
  };

  const assignLivreur = async (id: string, livreurIdx: number | null) => {
    const { error } = await supabase.from('orders').update({ livreur_idx: livreurIdx }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Livreur mis à jour'); load(true); }
  };

  // KPI scopés à la période choisie
  const kpi = useMemo(() => {
    const inPeriod = filterByPeriod(orders, period, 'created_at', customFrom, customTo);
    const delivered = inPeriod.filter((o) => o.status === 'delivered');
    const pending = inPeriod.filter((o) => o.status === 'pending');
    return {
      total: inPeriod.length,
      ca: delivered.reduce((s, o) => s + o.product_price, 0),
      pending: pending.length,
      delivered: delivered.length,
    };
  }, [orders, period, customFrom, customTo]);

  const TABS: { k: Tab; label: string; emoji: string }[] = [
    { k: 'orders', label: 'Commandes', emoji: '📦' },
    { k: 'livreurs', label: 'Livreurs', emoji: '🛵' },
    { k: 'stock', label: 'Stock', emoji: '📊' },
    { k: 'compta', label: 'Compta', emoji: '💰' },
    { k: 'stats', label: 'Stats', emoji: '📈' },
  ];

  const { canInstall, install, permission, requestNotifications, testAlert } = usePWAAdmin(true);

  // Auto-prompt notif au login si non accordé
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      // léger délai pour ne pas être agressif
      const t = setTimeout(() => requestNotifications(), 800);
      return () => clearTimeout(t);
    }
  }, [requestNotifications]);

  const periodLabel = PERIODS.find((p) => p.k === period)?.label || '';

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-vert text-white px-5 py-4 flex justify-between items-center sticky top-0 z-30 shadow-md flex-wrap gap-2">
        <div className="font-extrabold">🌿 ShopAfrik Admin</div>
        <div className="flex gap-2 items-center flex-wrap">
          {canInstall && (
            <button onClick={install} className="text-xs bg-or text-vert font-extrabold px-3 py-1.5 rounded-lg hover:bg-or-light">
              📲 Installer
            </button>
          )}
          {permission !== 'granted' && (
            <button onClick={requestNotifications} className="text-xs bg-or text-vert font-extrabold px-3 py-1.5 rounded-lg hover:bg-or-light">
              🔔 Activer son + notifs
            </button>
          )}
          {permission === 'granted' && (
            <button onClick={testAlert} className="text-xs bg-white/15 px-3 py-1.5 rounded-lg hover:bg-white/25">
              🔊 Test
            </button>
          )}
          <button onClick={() => load()} className="text-sm bg-white/15 px-3 py-1.5 rounded-lg hover:bg-white/25">🔄</button>
          <Link to="/" className="text-white/80 text-sm hover:text-white">Boutique</Link>
          <button onClick={onLogout} className="text-sm bg-white/15 px-3 py-1.5 rounded-lg hover:bg-white/25">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-5">
        {/* Sélecteur période */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.k}
              onClick={() => setPeriod(p.k)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                period === p.k ? 'bg-vert text-white' : 'bg-white border-2 border-vert-bg text-muted-foreground hover:border-vert-mid'
              }`}
            >
              {p.label}
            </button>
          ))}
          {period === 'custom' && (
            <div className="flex items-center gap-1.5 bg-white border-2 border-vert-bg rounded-full px-2 py-1">
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="text-xs outline-none bg-transparent" />
              <span className="text-xs text-muted-foreground">→</span>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="text-xs outline-none bg-transparent" />
            </div>
          )}
        </div>

        {/* KPI résumé scopé période */}
        <div className="bg-gradient-to-br from-rouge to-[oklch(0.40_0.20_28)] text-white rounded-2xl p-6 mb-5">
          <div className="text-sm opacity-90 font-semibold">CA livré · {periodLabel}</div>
          <div className="text-4xl font-extrabold mt-1">{formatFCFA(kpi.ca)}</div>
          <div className="text-sm opacity-90 mt-1">{kpi.total} commandes · {kpi.delivered} livrées · {kpi.pending} en attente</div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-white p-1 rounded-2xl border-2 border-vert-bg overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`flex-1 min-w-fit px-3 py-2 rounded-xl text-sm font-extrabold transition-all whitespace-nowrap ${
                tab === t.k ? 'bg-vert-mid text-white shadow' : 'text-muted-foreground hover:bg-vert-bg/50'
              }`}
            >
              <span className="mr-1">{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>

        {loading && orders.length === 0 && <div className="text-center py-10 text-muted-foreground">Chargement…</div>}

        {(!loading || orders.length > 0) && (
          <>
            {tab === 'orders' && <OrdersTab orders={orders} onUpdateStatus={updateStatus} onAssignLivreur={assignLivreur} />}
            {tab === 'livreurs' && <LivreursTab orders={orders} onChange={() => load(true)} />}
            {tab === 'stock' && <StockTab />}
            {tab === 'compta' && <ComptaTab orders={orders} />}
            {tab === 'stats' && <StatsTab orders={orders} visits={visits} />}
          </>
        )}
      </main>
    </div>
  );
}
