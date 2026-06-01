import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CloseuseLogin } from '@/components/closeuse/CloseuseLogin';
import { getStoredSession, clearSession, type CloseuseSession } from '@/lib/closeuse-auth';
import { PRODUCTS, formatFCFA } from '@/lib/products';
import { COMMISSION_PAR_COMMANDE } from '@/lib/closeuses';

export const Route = createFileRoute('/closeuse')({
  head: () => ({ meta: [{ title: 'KOUKA Closeuse' }, { name: 'theme-color', content: '#be185d' }] }),
  component: CloseusePage,
});

type ClOrder = {
  id: string;
  order_number: string;
  product_name: string;
  product_slug: string | null;
  product_price: number;
  offer_label: string | null;
  first_name: string | null;
  city: string | null;
  delivery_fee: number | null;
  status: string;
  created_at: string;
  delivered_at: string | null;
  closeuse_idx: number | null;
};

function unitWordFor(slug: string): string {
  if (slug === 'sirop-kouka') return 'flacon';
  if (slug === 'tonic-kouka') return 'bouteille';
  return 'sachet';
}

function CloseusePage() {
  const [session, setSession] = useState<CloseuseSession | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<'new' | 'history' | 'salary'>('new');

  useEffect(() => {
    setSession(getStoredSession());
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-rose-50 flex items-center justify-center"><div className="text-rose-700">Chargement…</div></div>;
  }

  if (!session) {
    return <CloseuseLogin onSuccess={setSession} />;
  }

  const logout = () => { clearSession(); setSession(null); };

  return (
    <div className="min-h-screen bg-rose-50">
      <header className="bg-rose-700 text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div>
            <div className="text-xs opacity-80">Bonjour 👩‍💼</div>
            <div className="font-bold">{session.name}</div>
          </div>
          <button onClick={logout} className="px-2 py-1.5 rounded hover:bg-rose-600 text-xs opacity-90">Déco</button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-3 pt-3">
        <div className="flex gap-1 bg-white p-1 rounded-2xl border-2 border-rose-200">
          {(['new', 'history', 'salary'] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)}
              className={`flex-1 px-3 py-2 rounded-xl text-sm font-extrabold ${tab === k ? 'bg-rose-600 text-white shadow' : 'text-rose-700 hover:bg-rose-50'}`}>
              {k === 'new' && '➕ Nouvelle'}
              {k === 'history' && '📜 Historique'}
              {k === 'salary' && '💰 Salaire'}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-3 py-4 pb-20">
        {tab === 'new' && <NewOrderForm session={session} onCreated={() => setTab('history')} />}
        {tab === 'history' && <History session={session} />}
        {tab === 'salary' && <Salary session={session} />}
      </main>
    </div>
  );
}

function NewOrderForm({ session, onCreated }: { session: CloseuseSession; onCreated: () => void }) {
  const [productSlug, setProductSlug] = useState('kouka');
  const [clientName, setClientName] = useState('');
  const [city, setCity] = useState('');
  const [pieces, setPieces] = useState(1);
  const [price, setPrice] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('2000');
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = PRODUCTS.find((p) => p.slug === productSlug);
    if (!product) { toast.error('Produit invalide'); return; }
    if (!city.trim()) { toast.error('Ville requise'); return; }
    const priceN = parseInt(price, 10);
    if (!priceN || priceN <= 0) { toast.error('Prix invalide'); return; }
    const feeN = Math.max(0, parseInt(deliveryFee, 10) || 0);
    const p = Math.max(1, pieces);
    const word = unitWordFor(productSlug);
    const offerLabel = `${p} ${word}${p > 1 ? 's' : ''}`;
    const order_number = `CL${Date.now().toString().slice(-7)}`;

    setSaving(true);
    const { error } = await supabase.from('orders').insert({
      order_number,
      product_name: product.name,
      product_slug: product.slug,
      product_price: priceN,
      offer_label: offerLabel,
      first_name: clientName.trim() || null,
      city: city.trim(),
      delivery_fee: feeN,
      status: 'delivered',
      delivered_at: new Date().toISOString(),
      closeuse_idx: session.idx,
      source: 'closeuse',
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Commande enregistrée 🎉');
    setClientName(''); setCity(''); setPieces(1); setPrice(''); setDeliveryFee('2000');
    onCreated();
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border-2 border-rose-200 p-5 space-y-3">
      <h2 className="font-extrabold text-rose-900 text-lg">➕ Nouvelle commande livrée</h2>

      <div>
        <label className="text-xs font-bold uppercase text-gray-600">Produit *</label>
        <select value={productSlug} onChange={(e) => setProductSlug(e.target.value)}
          className="w-full mt-1 px-3 py-2.5 border-2 border-rose-200 rounded-lg outline-none focus:border-rose-500">
          {PRODUCTS.map((p) => <option key={p.slug} value={p.slug}>{p.emoji} {p.name}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-bold uppercase text-gray-600">Nom client (facultatif)</label>
        <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Ex: Awa"
          className="w-full mt-1 px-3 py-2.5 border-2 border-rose-200 rounded-lg outline-none focus:border-rose-500" />
      </div>

      <div>
        <label className="text-xs font-bold uppercase text-gray-600">Ville *</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Ex: Ouagadougou"
          className="w-full mt-1 px-3 py-2.5 border-2 border-rose-200 rounded-lg outline-none focus:border-rose-500" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold uppercase text-gray-600">Nombre de pièces *</label>
          <input type="number" min={1} value={pieces} onChange={(e) => setPieces(parseInt(e.target.value) || 1)}
            className="w-full mt-1 px-3 py-2.5 border-2 border-rose-200 rounded-lg outline-none focus:border-rose-500" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-gray-600">Prix total (FCFA) *</label>
          <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="20000"
            className="w-full mt-1 px-3 py-2.5 border-2 border-rose-200 rounded-lg outline-none focus:border-rose-500" />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase text-gray-600">Frais de livraison (FCFA)</label>
        <input type="number" min={0} value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)}
          className="w-full mt-1 px-3 py-2.5 border-2 border-rose-200 rounded-lg outline-none focus:border-rose-500" />
      </div>

      <button type="submit" disabled={saving}
        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-xl disabled:opacity-50">
        {saving ? '...' : '✅ Valider la commande livrée'}
      </button>
      <p className="text-xs text-gray-500 text-center">Commission : {formatFCFA(COMMISSION_PAR_COMMANDE)} ajoutée à ton salaire.</p>
    </form>
  );
}

function useMyOrders(idx: number) {
  const [orders, setOrders] = useState<ClOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').eq('closeuse_idx', idx).order('created_at', { ascending: false }).limit(500);
    setOrders((data || []) as ClOrder[]);
    setLoading(false);
  }, [idx]);

  useEffect(() => {
    load();
    const ch = supabase.channel(`closeuse-${idx}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `closeuse_idx=eq.${idx}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [idx, load]);

  return { orders, loading, reload: load };
}

function History({ session }: { session: CloseuseSession }) {
  const { orders, loading } = useMyOrders(session.idx);
  if (loading) return <div className="text-center py-8 text-rose-700">Chargement…</div>;
  if (orders.length === 0) return <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border-2 border-rose-200">Aucune commande encore. Va dans <b>➕ Nouvelle</b>.</div>;
  return (
    <div className="space-y-2">
      {orders.map((o) => (
        <div key={o.id} className="bg-white rounded-xl border-2 border-rose-200 p-3 flex justify-between gap-2">
          <div className="min-w-0">
            <div className="font-bold text-rose-900 truncate">{o.first_name || 'Client'} · {o.city}</div>
            <div className="text-xs text-gray-600 truncate">{o.product_name} · {o.offer_label}</div>
            <div className="text-[10px] text-gray-400">{new Date(o.created_at).toLocaleString('fr-FR')} · n°{o.order_number}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-extrabold text-rose-700">{formatFCFA(o.product_price)}</div>
            <div className="text-[10px] text-gray-500">+{formatFCFA(COMMISSION_PAR_COMMANDE)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Salary({ session }: { session: CloseuseSession }) {
  const { orders } = useMyOrders(session.idx);

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthOrders = orders.filter((o) => o.status === 'delivered' && o.delivered_at && new Date(o.delivered_at) >= monthStart);
    const monthCount = monthOrders.length;
    const monthSalary = monthCount * COMMISSION_PAR_COMMANDE;

    // Historique mensuel
    const byMonth: Record<string, number> = {};
    orders.filter((o) => o.status === 'delivered' && o.delivered_at).forEach((o) => {
      const d = new Date(o.delivered_at!);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      byMonth[k] = (byMonth[k] || 0) + 1;
    });
    return { monthCount, monthSalary, byMonth };
  }, [orders]);

  const months = Object.entries(stats.byMonth).sort((a, b) => b[0].localeCompare(a[0]));
  const monthLabel = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-rose-600 to-pink-700 text-white rounded-2xl p-6">
        <div className="text-xs uppercase opacity-90 font-bold">💰 Salaire du mois ({monthLabel})</div>
        <div className="text-4xl font-extrabold mt-1">{formatFCFA(stats.monthSalary)}</div>
        <div className="text-sm opacity-90 mt-1">{stats.monthCount} commandes livrées × {formatFCFA(COMMISSION_PAR_COMMANDE)}</div>
        <div className="text-xs opacity-80 mt-3 bg-white/15 rounded-lg px-3 py-2">
          📅 Disponible le 1ᵉʳ de chaque mois.
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-rose-200 p-5">
        <h3 className="font-extrabold text-rose-900 mb-3">📊 Historique mensuel</h3>
        {months.length === 0 && <div className="text-sm text-gray-500">Aucun historique pour le moment.</div>}
        <div className="space-y-2">
          {months.map(([k, n]) => (
            <div key={k} className="flex justify-between border-b border-rose-100 pb-2">
              <div className="font-bold">{k}</div>
              <div className="text-right">
                <div className="text-xs text-gray-500">{n} commandes</div>
                <div className="font-extrabold text-rose-700">{formatFCFA(n * COMMISSION_PAR_COMMANDE)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
