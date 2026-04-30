import { useEffect, useMemo, useState } from 'react';
import { findOfferByLabel, formatFCFA, orderProductCost } from '@/lib/products';
import { useLivreurs, effectiveDeliveryFee } from '@/lib/livreurs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PERIODS, filterByPeriod, type PeriodKey } from '@/lib/periods';

type Order = {
  id: string;
  order_number: string;
  product_name: string;
  product_price: number;
  offer_label?: string | null;
  status: string;
  livreur_idx: number | null;
  delivery_fee?: number | null;
  created_at: string;
};

type Expense = {
  id: string;
  expense_date: string;
  category: string;
  label: string;
  amount: number;
  notes: string | null;
};

const CATEGORIES = [
  { k: 'pub', label: '📣 Publicité', emoji: '📣' },
  { k: 'appel', label: '📞 Appels', emoji: '📞' },
  { k: 'autre', label: '🧾 Autre', emoji: '🧾' },
];

const USD_TO_FCFA = 655;

export function ComptaTab({ orders }: { orders: Order[] }) {
  const [period, setPeriod] = useState<PeriodKey>('30d');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const { livreurs } = useLivreurs();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState({
    expense_date: new Date().toISOString().slice(0, 10),
    category: 'pub',
    label: '',
    amount: '',
    amount_usd: '',
    notes: '',
  });

  const loadExpenses = async () => {
    const { data, error } = await supabase
      .from('daily_expenses')
      .select('*')
      .order('expense_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) toast.error(error.message);
    else setExpenses((data || []) as Expense[]);
  };

  useEffect(() => { loadExpenses(); }, []);

  const filtered = useMemo(
    () => filterByPeriod(orders, period, 'created_at', customFrom, customTo),
    [orders, period, customFrom, customTo],
  );

  const filteredExpenses = useMemo(
    () => filterByPeriod(expenses, period, 'expense_date', customFrom, customTo),
    [expenses, period, customFrom, customTo],
  );

  const totals = useMemo(() => {
    const delivered = filtered.filter((o) => o.status === 'delivered');
    const cancelled = filtered.filter((o) => o.status === 'cancelled');
    const pending = filtered.filter((o) => ['pending', 'confirmed', 'approche', 'suivi'].includes(o.status));
    const ca = delivered.reduce((s, o) => s + o.product_price, 0);
    const potentiel = pending.reduce((s, o) => s + o.product_price, 0);
    const perdu = cancelled.reduce((s, o) => s + o.product_price, 0);

    // Coûts auto sur les commandes livrées
    const coutProduits = delivered.reduce((s, o) => {
      const offer = findOfferByLabel(o.offer_label || o.product_name);
      const units = offer?.units ?? 1;
      return s + orderProductCost(o.product_name, units);
    }, 0);
    const coutLivraison = delivered.reduce((s, o) => s + effectiveDeliveryFee(livreurs, o), 0);

    // Dépenses manuelles (pub, appels, autres)
    const depPub = filteredExpenses.filter((e) => e.category === 'pub').reduce((s, e) => s + e.amount, 0);
    const depAppel = filteredExpenses.filter((e) => e.category === 'appel').reduce((s, e) => s + e.amount, 0);
    const depAutre = filteredExpenses.filter((e) => e.category === 'autre').reduce((s, e) => s + e.amount, 0);
    const depManuelles = depPub + depAppel + depAutre;

    const totalCharges = coutProduits + coutLivraison + depManuelles;
    const benefice = ca - totalCharges;
    const marge = ca > 0 ? (benefice / ca) * 100 : 0;

    return {
      delivered, cancelled, pending, ca, potentiel, perdu,
      coutProduits, coutLivraison, depPub, depAppel, depAutre, depManuelles,
      totalCharges, benefice, marge,
    };
  }, [filtered, filteredExpenses, livreurs]);

  const parLivreur = useMemo(() => {
    const map: Record<number, { count: number; ca: number }> = {};
    livreurs.forEach((l) => { map[l.idx] = { count: 0, ca: 0 }; });
    totals.delivered.forEach((o) => {
      const idx = o.livreur_idx ?? -1;
      if (!map[idx]) map[idx] = { count: 0, ca: 0 };
      map[idx].count += 1;
      map[idx].ca += o.product_price;
    });
    return map;
  }, [totals.delivered, livreurs]);

  const exportCSV = () => {
    const headers = ['N° Commande', 'Date', 'Produit', 'Prix', 'Statut', 'Livreur'];
    const rows = filtered.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleString('fr-FR'),
      o.product_name,
      o.product_price,
      o.status,
      livreurs.find((l) => l.idx === o.livreur_idx)?.name || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compta-shopafrik-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addExpense = async () => {
    let amount = parseInt(form.amount, 10) || 0;
    if (form.category === 'pub' && form.amount_usd) {
      const usd = parseFloat(form.amount_usd);
      if (!isNaN(usd) && usd > 0) amount = Math.round(usd * USD_TO_FCFA);
    }
    if (!form.label.trim()) { toast.error('Libellé requis'); return; }
    if (amount <= 0) { toast.error('Montant invalide'); return; }
    const { error } = await supabase.from('daily_expenses').insert({
      expense_date: form.expense_date,
      category: form.category,
      label: form.label.trim(),
      amount,
      notes: form.notes.trim() || null,
    });
    if (error) toast.error(error.message);
    else {
      toast.success('Dépense enregistrée');
      setForm({ ...form, label: '', amount: '', amount_usd: '', notes: '' });
      loadExpenses();
    }
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('daily_expenses').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Dépense supprimée'); loadExpenses(); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.k}
            onClick={() => setPeriod(p.k)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              period === p.k ? 'bg-vert-mid text-white' : 'bg-white border-2 border-vert-bg text-muted-foreground'
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
        <button onClick={exportCSV} className="ml-auto bg-vert text-white px-4 py-2 rounded-xl text-sm font-extrabold hover:bg-vert-mid">
          📥 Export CSV
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <Card label="✅ CA Réalisé" value={formatFCFA(totals.ca)} sub={`${totals.delivered.length} livrées`} cls="text-vert" />
        <Card label="⏳ Potentiel" value={formatFCFA(totals.potentiel)} sub={`${totals.pending.length} en cours`} cls="text-[oklch(0.55_0.15_60)]" />
        <Card label="❌ Perdu" value={formatFCFA(totals.perdu)} sub={`${totals.cancelled.length} annulées`} cls="text-rouge" />
      </div>

      {/* Bénéfice */}
      <div className="bg-gradient-to-br from-vert to-vert-mid text-white rounded-2xl p-5">
        <div className="text-xs uppercase font-bold opacity-90">💰 Bénéfice net</div>
        <div className="text-4xl font-extrabold mt-1">{formatFCFA(totals.benefice)}</div>
        <div className="text-sm opacity-90 mt-1">Marge : {totals.marge.toFixed(1)}% · CA {formatFCFA(totals.ca)} − Charges {formatFCFA(totals.totalCharges)}</div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 text-xs">
          <Mini label="🛒 PA produits" value={formatFCFA(totals.coutProduits)} />
          <Mini label="🛵 Livraisons" value={formatFCFA(totals.coutLivraison)} />
          <Mini label="📣 Pub" value={formatFCFA(totals.depPub)} />
          <Mini label="📞 Appels" value={formatFCFA(totals.depAppel)} />
          <Mini label="🧾 Autres" value={formatFCFA(totals.depAutre)} />
        </div>
      </div>

      {/* Saisie dépense */}
      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        <h3 className="font-extrabold text-vert mb-1">➕ Ajouter une dépense</h3>
        <p className="text-xs text-muted-foreground mb-4">
          PA produits (Poudre 2 000 F · Sirop 3 000 F) et livraison 2 000 F sont calculés automatiquement à chaque commande livrée.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Date">
            <input type="date" value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} className="ce-input" />
          </Field>
          <Field label="Catégorie">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="ce-input">
              {CATEGORIES.map((c) => <option key={c.k} value={c.k}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="Libellé" full>
            <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Ex: Boost Facebook campagne KOUKA" className="ce-input" />
          </Field>
          {form.category === 'pub' ? (
            <>
              <Field label="Montant (USD)">
                <input type="number" step="0.01" value={form.amount_usd} onChange={(e) => setForm({ ...form, amount_usd: e.target.value, amount: '' })} placeholder="Ex: 5" className="ce-input" />
                {form.amount_usd && (
                  <div className="text-xs text-vert font-bold mt-1">
                    ≈ {formatFCFA(Math.round((parseFloat(form.amount_usd) || 0) * USD_TO_FCFA))} (1$ = {USD_TO_FCFA}F)
                  </div>
                )}
              </Field>
              <Field label="ou Montant (FCFA)">
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value, amount_usd: '' })} placeholder="Ex: 3275" className="ce-input" />
              </Field>
            </>
          ) : (
            <Field label="Montant (FCFA)">
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Ex: 1000" className="ce-input" />
            </Field>
          )}
          <Field label="Notes (optionnel)" full>
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Détails…" className="ce-input" />
          </Field>
        </div>
        <button onClick={addExpense} className="mt-4 bg-vert-mid text-white px-5 py-2.5 rounded-xl font-extrabold hover:bg-vert">
          Enregistrer la dépense
        </button>
      </div>

      {/* Historique dépenses */}
      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        <h3 className="font-extrabold text-vert mb-3">📜 Dépenses manuelles ({filteredExpenses.length})</h3>
        {filteredExpenses.length === 0 && <div className="text-sm text-muted-foreground">Aucune dépense sur la période</div>}
        <div className="space-y-2">
          {filteredExpenses.map((e) => {
            const cat = CATEGORIES.find((c) => c.k === e.category);
            return (
              <div key={e.id} className="flex justify-between items-center border-b border-vert-bg/40 pb-2 gap-2">
                <div className="min-w-0">
                  <div className="font-bold truncate">{cat?.emoji || '🧾'} {e.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(e.expense_date).toLocaleDateString('fr-FR')} · {cat?.label || e.category}
                    {e.notes && <span className="italic"> · {e.notes}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="font-extrabold text-rouge">−{formatFCFA(e.amount)}</div>
                  <button onClick={() => deleteExpense(e.id)} className="text-xs text-rouge hover:underline">🗑</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        <h3 className="font-extrabold text-vert mb-4">👥 Performance livreurs</h3>
        <div className="space-y-2">
          {livreurs.map((l) => {
            const v = parLivreur[l.idx] || { count: 0, ca: 0 };
            return (
              <div key={l.id} className="flex justify-between items-center border-b border-vert-bg/40 pb-2">
                <div>
                  <div className="font-bold">{l.emoji} {l.name}{!l.active && <span className="text-xs text-muted-foreground ml-2">(inactif)</span>}</div>
                  <div className="text-xs text-muted-foreground">{l.zone}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-vert">{formatFCFA(v.ca)}</div>
                  <div className="text-xs text-muted-foreground">{v.count} livraisons</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .ce-input { width: 100%; padding: 0.55rem 0.75rem; border: 2px solid oklch(0.92 0.04 145); border-radius: 0.6rem; outline: none; font-size: 0.95rem; }
        .ce-input:focus { border-color: oklch(0.55 0.18 145); }
      `}</style>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <div className="text-xs font-bold uppercase text-muted-foreground mb-1">{label}</div>
      {children}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/15 rounded-lg p-2">
      <div className="text-[10px] font-bold uppercase opacity-80">{label}</div>
      <div className="font-extrabold text-sm">{value}</div>
    </div>
  );
}

function Card({ label, value, sub, cls }: { label: string; value: string; sub: string; cls: string }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-vert-bg p-4">
      <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
      <div className={`text-2xl font-extrabold mt-1 ${cls}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}
