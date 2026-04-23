import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatFCFA, ADMIN_WHATSAPP } from '@/lib/products';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin')({
  head: () => ({ meta: [{ title: 'Admin — ShopAfrik' }] }),
  component: AdminPage,
});

const ADMIN_PASSWORD = 'KOUKA2024!';
const STATUSES: Record<string, { label: string; cls: string }> = {
  pending: { label: 'En attente', cls: 'bg-[oklch(0.95_0.10_85)] text-[oklch(0.40_0.10_82)]' },
  confirmed: { label: 'Confirmée', cls: 'bg-[oklch(0.92_0.06_240)] text-[oklch(0.40_0.15_240)]' },
  delivered: { label: 'Livrée', cls: 'bg-vert-bg text-vert' },
  cancelled: { label: 'Annulée', cls: 'bg-rouge-light text-rouge' },
  approche: { label: 'Approche', cls: 'bg-[oklch(0.92_0.08_300)] text-[oklch(0.40_0.18_300)]' },
  suivi: { label: 'Suivi', cls: 'bg-[oklch(0.94_0.10_55)] text-[oklch(0.45_0.15_55)]' },
};

type Order = {
  id: string;
  order_number: string;
  product_name: string;
  product_price: number;
  first_name: string | null;
  last_name: string | null;
  whatsapp: string | null;
  country: string | null;
  city: string | null;
  status: string;
  created_at: string;
};

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('sa_auth') === '1') {
      setAuthed(true);
    }
  }, []);

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

  function tryLogin() {
    if (pwd === ADMIN_PASSWORD) {
      localStorage.setItem('sa_auth', '1');
      setAuthed(true);
      toast.success('Connecté');
    } else {
      toast.error('Mot de passe incorrect');
    }
  }

  return <AdminDashboard onLogout={() => { localStorage.removeItem('sa_auth'); setAuthed(false); }} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) {
      toast.error(error.message);
    } else {
      setOrders((data || []) as Order[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const kpi = {
    total: orders.length,
    ca: orders.reduce((s, o) => s + (o.product_price || 0), 0),
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Statut → ${STATUSES[status]?.label || status}`);
      load();
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-vert text-white px-5 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="font-extrabold">🌿 ShopAfrik Admin</div>
        <div className="flex gap-3 items-center">
          <Link to="/" className="text-white/80 text-sm hover:text-white">Boutique</Link>
          <button onClick={onLogout} className="text-sm bg-white/15 px-3 py-1.5 rounded-lg hover:bg-white/25">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-5">
        {/* KPI */}
        <div className="bg-gradient-to-br from-rouge to-[oklch(0.40_0.20_28)] text-white rounded-2xl p-6 mb-5">
          <div className="text-sm opacity-90 font-semibold">Chiffre d'affaires total</div>
          <div className="text-4xl font-extrabold mt-1">{formatFCFA(kpi.ca)}</div>
          <div className="text-sm opacity-90 mt-1">{kpi.total} commandes au total</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { k: 'pending', l: 'En attente', n: kpi.pending },
            { k: 'confirmed', l: 'Confirmées', n: kpi.confirmed },
            { k: 'delivered', l: 'Livrées', n: kpi.delivered },
            { k: 'cancelled', l: 'Annulées', n: kpi.cancelled },
          ].map((m) => (
            <div key={m.k} className="bg-white rounded-xl p-4 border-2 border-vert-bg">
              <div className="text-xs text-muted-foreground font-bold uppercase">{m.l}</div>
              <div className="text-3xl font-extrabold text-vert mt-1">{m.n}</div>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-4">
          <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>Tous ({orders.length})</FilterBtn>
          {Object.entries(STATUSES).map(([k, v]) => (
            <FilterBtn key={k} active={filter === k} onClick={() => setFilter(k)}>
              {v.label}
            </FilterBtn>
          ))}
          <button onClick={load} className="ml-auto text-sm text-vert-mid font-bold hover:underline">
            🔄 Recharger
          </button>
        </div>

        {/* Liste */}
        {loading && <div className="text-center py-10 text-muted-foreground">Chargement…</div>}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground bg-white rounded-2xl border-2 border-dashed border-vert-bg">
            Aucune commande dans cette catégorie.
          </div>
        )}

        <div className="grid gap-3">
          {filtered.map((o) => (
            <OrderCard key={o.id} order={o} onUpdate={updateStatus} />
          ))}
        </div>
      </main>
    </div>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors ${
        active ? 'bg-vert-mid text-white' : 'bg-white border-2 border-vert-bg text-muted-foreground hover:border-vert-mid'
      }`}
    >
      {children}
    </button>
  );
}

function OrderCard({ order, onUpdate }: { order: Order; onUpdate: (id: string, status: string) => void }) {
  const [open, setOpen] = useState(false);
  const status = STATUSES[order.status] || STATUSES.pending;
  const waUrl = order.whatsapp
    ? `https://wa.me/${order.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${order.first_name}, votre commande ${order.order_number} sur ShopAfrik`)}`
    : '#';

  return (
    <div className="bg-white rounded-2xl border-2 border-vert-bg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-vert-bg/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-vert">{order.order_number}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${status.cls}`}>{status.label}</span>
          </div>
          <div className="text-sm text-foreground mt-1 truncate">
            {order.first_name} {order.last_name} · {order.city}
          </div>
          <div className="text-xs text-muted-foreground truncate">{order.product_name}</div>
        </div>
        <div className="text-right shrink-0 ml-3">
          <div className="font-extrabold text-vert">{formatFCFA(order.product_price)}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t-2 border-vert-bg p-4 bg-cream-2/40">
          <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
            <div><span className="text-muted-foreground">WhatsApp :</span> <a className="text-vert-mid font-bold" href={waUrl} target="_blank" rel="noreferrer">{order.whatsapp}</a></div>
            <div><span className="text-muted-foreground">Pays :</span> {order.country}</div>
            <div><span className="text-muted-foreground">Ville :</span> {order.city}</div>
            <div><span className="text-muted-foreground">Date :</span> {new Date(order.created_at).toLocaleString('fr-FR')}</div>
          </div>

          <div className="text-xs font-bold uppercase text-muted-foreground mb-2">Changer le statut</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(STATUSES).map(([k, v]) => (
              <button
                key={k}
                onClick={() => onUpdate(order.id, k)}
                className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all ${v.cls} hover:scale-105 ${order.status === k ? 'ring-2 ring-vert-mid' : ''}`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {order.whatsapp && (
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block bg-[#25D366] text-white text-center py-2.5 rounded-xl font-bold text-sm hover:bg-[#1da851] transition-colors"
            >
              💬 Contacter sur WhatsApp
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// Ensure ADMIN_WHATSAPP imported (used by future livreur logic)
void ADMIN_WHATSAPP;
