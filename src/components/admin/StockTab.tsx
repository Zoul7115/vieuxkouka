import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PRODUCTS, PRODUCT_COSTS, formatFCFA } from '@/lib/products';
import { useLivreurs } from '@/lib/livreurs';
import { toast } from 'sonner';

type StockTx = {
  id: string;
  produit: string;
  type: string;
  quantite: number;
  livreur_idx: number | null;
  motif: string | null;
  created_at: string | null;
};

export function StockTab() {
  const { livreurs } = useLivreurs();
  const [txs, setTxs] = useState<StockTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    produit: PRODUCTS[0].shortName,
    type: 'entree',
    quantite: 10,
    livreur_idx: 1,
    motif: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('stock_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);
    if (error) toast.error(error.message);
    else setTxs((data || []) as StockTx[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel('stock-tab-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_transactions' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load]);

  // Sync default livreur once livreurs loaded
  useEffect(() => {
    if (livreurs.length > 0 && !livreurs.find((l) => l.idx === form.livreur_idx)) {
      setForm((f) => ({ ...f, livreur_idx: livreurs[0].idx }));
    }
  }, [livreurs, form.livreur_idx]);

  const stockMatrix = useMemo(() => {
    const matrix: Record<string, Record<number, number>> = {};
    PRODUCTS.forEach((p) => {
      matrix[p.shortName] = {};
      livreurs.forEach((l) => { matrix[p.shortName][l.idx] = 0; });
    });
    txs.forEach((t) => {
      if (!matrix[t.produit]) matrix[t.produit] = {};
      const idx = t.livreur_idx ?? -1;
      if (matrix[t.produit][idx] == null) matrix[t.produit][idx] = 0;
      const sign = t.type === 'entree' ? 1 : -1;
      matrix[t.produit][idx] += sign * t.quantite;
    });
    return matrix;
  }, [txs, livreurs]);

  // Total par produit (toutes lignes confondues) + valeur d'achat
  const productTotals = useMemo(() => {
    const qty: Record<string, number> = {};
    PRODUCTS.forEach((p) => { qty[p.shortName] = 0; });
    txs.forEach((t) => {
      if (qty[t.produit] == null) qty[t.produit] = 0;
      qty[t.produit] += (t.type === 'entree' ? 1 : -1) * t.quantite;
    });
    const rows = PRODUCTS.map((p) => {
      const q = Math.max(0, qty[p.shortName] || 0);
      const pa = PRODUCT_COSTS[p.shortName] ?? 0;
      return { name: p.shortName, emoji: p.emoji, qty: q, pa, value: q * pa };
    });
    const totalQty = rows.reduce((s, r) => s + r.qty, 0);
    const totalValue = rows.reduce((s, r) => s + r.value, 0);
    return { rows, totalQty, totalValue };
  }, [txs]);

  const submit = async () => {
    if (form.quantite <= 0) { toast.error('Quantité invalide'); return; }
    const { error } = await supabase.from('stock_transactions').insert({
      produit: form.produit,
      type: form.type,
      quantite: form.quantite,
      livreur_idx: form.livreur_idx,
      motif: form.motif || null,
    });
    if (error) toast.error(error.message);
    else { toast.success('Mouvement enregistré'); load(); }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5 overflow-x-auto">
        <h3 className="font-extrabold text-vert mb-4">📦 Stock par livreur</h3>
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="border-b-2 border-vert-bg">
              <th className="text-left py-2 px-2">Produit</th>
              {livreurs.map((l) => (
                <th key={l.id} className="text-center py-2 px-2">{l.emoji} {l.name}</th>
              ))}
              <th className="text-right py-2 px-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p) => {
              const total = livreurs.reduce((s, l) => s + (stockMatrix[p.shortName]?.[l.idx] || 0), 0);
              return (
                <tr key={p.slug} className="border-b border-vert-bg/50">
                  <td className="py-2 px-2 font-bold">{p.emoji} {p.shortName}</td>
                  {livreurs.map((l) => {
                    const q = stockMatrix[p.shortName]?.[l.idx] || 0;
                    return (
                      <td key={l.id} className={`text-center py-2 px-2 font-extrabold ${q <= 0 ? 'text-rouge' : q < 5 ? 'text-[oklch(0.55_0.15_60)]' : 'text-vert'}`}>
                        {q}
                      </td>
                    );
                  })}
                  <td className="text-right py-2 px-2 font-extrabold text-vert">{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        <h3 className="font-extrabold text-vert mb-4">➕ Nouveau mouvement</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Produit">
            <select value={form.produit} onChange={(e) => setForm({ ...form, produit: e.target.value })} className="input">
              {PRODUCTS.map((p) => <option key={p.slug} value={p.shortName}>{p.shortName}</option>)}
            </select>
          </Field>
          <Field label="Type">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input">
              <option value="entree">📥 Entrée stock</option>
              <option value="sortie">📤 Sortie / Vente</option>
              <option value="transfert">🔄 Transfert livreur</option>
              <option value="perte">❌ Perte / Casse</option>
            </select>
          </Field>
          <Field label="Quantité">
            <input type="number" min={1} value={form.quantite} onChange={(e) => setForm({ ...form, quantite: parseInt(e.target.value) || 0 })} className="input" />
          </Field>
          <Field label="Livreur">
            <select value={form.livreur_idx} onChange={(e) => setForm({ ...form, livreur_idx: parseInt(e.target.value) })} className="input">
              {livreurs.map((l) => <option key={l.id} value={l.idx}>{l.emoji} {l.name}</option>)}
            </select>
          </Field>
          <Field label="Motif (optionnel)" full>
            <input value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} placeholder="Ex: Réapprovisionnement, vente directe…" className="input" />
          </Field>
        </div>
        <button onClick={submit} className="mt-4 bg-vert-mid text-white px-5 py-2.5 rounded-xl font-extrabold hover:bg-vert">
          Enregistrer
        </button>
      </div>

      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        <h3 className="font-extrabold text-vert mb-3">📜 Historique récent</h3>
        {loading && <div className="text-sm text-muted-foreground">Chargement…</div>}
        {!loading && txs.length === 0 && <div className="text-sm text-muted-foreground">Aucun mouvement</div>}
        <div className="space-y-2">
          {txs.slice(0, 20).map((t) => {
            const livreur = livreurs.find((l) => l.idx === t.livreur_idx);
            const sign = t.type === 'entree' ? '+' : '-';
            const cls = t.type === 'entree' ? 'text-vert' : 'text-rouge';
            return (
              <div key={t.id} className="flex items-center justify-between text-sm border-b border-vert-bg/40 pb-2">
                <div>
                  <div className="font-bold">{t.produit}</div>
                  <div className="text-xs text-muted-foreground">
                    {livreur?.name || '—'} · {t.type} · {t.created_at ? new Date(t.created_at).toLocaleString('fr-FR') : ''}
                  </div>
                  {t.motif && <div className="text-xs italic text-muted-foreground">{t.motif}</div>}
                </div>
                <div className={`font-extrabold ${cls}`}>{sign}{t.quantite}</div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .input { width: 100%; padding: 0.6rem 0.75rem; border: 2px solid oklch(0.92 0.04 145); border-radius: 0.6rem; outline: none; }
        .input:focus { border-color: oklch(0.55 0.18 145); }
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
