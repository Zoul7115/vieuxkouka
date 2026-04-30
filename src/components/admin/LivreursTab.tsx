import { useMemo, useState } from 'react';
import { useLivreurs, effectiveDeliveryFee, type Livreur } from '@/lib/livreurs';
import { formatFCFA } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PERIODS, filterByPeriod, type PeriodKey } from '@/lib/periods';

type Order = {
  id: string;
  order_number: string;
  product_name: string;
  product_price: number;
  offer_label?: string | null;
  first_name: string | null;
  last_name: string | null;
  whatsapp: string | null;
  city: string | null;
  status: string;
  livreur_idx: number | null;
  delivery_fee?: number | null;
  created_at: string;
};

/** Calcule le nombre de pièces d'une commande à partir de l'offre/label (réplique de la fonction SQL) */
function unitsForOrder(o: { offer_label?: string | null; product_name: string }): number {
  const label = (o.offer_label || o.product_name || '').toLowerCase();
  let units = 1;
  if (/3\s*\+\s*2/.test(label)) units = 5;
  else if (/2\s*\+\s*1/.test(label)) units = 3;
  else if (/1\s*(sachet|flacon)|démarrage|demarrage/.test(label)) units = 1;
  if (/bump/i.test(label)) units += 1;
  return units;
}

export function LivreursTab({ orders, onChange }: { orders: Order[]; onChange: () => void }) {
  const { livreurs, reload } = useLivreurs();
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', whatsapp: '', zone: '', emoji: '🛵', delivery_fee: '2000' });
  const [adding, setAdding] = useState(false);
  const [newLivreur, setNewLivreur] = useState({ name: '', whatsapp: '', zone: '', emoji: '🛵', delivery_fee: '2000' });
  const [period, setPeriod] = useState<PeriodKey>('today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const stats = useMemo(() => {
    const map: Record<number, { total: number; delivered: number; cancelled: number; pending: number; ca: number }> = {};
    livreurs.forEach((l) => { map[l.idx] = { total: 0, delivered: 0, cancelled: 0, pending: 0, ca: 0 }; });
    orders.forEach((o) => {
      if (o.livreur_idx == null || !map[o.livreur_idx]) return;
      const s = map[o.livreur_idx];
      s.total += 1;
      if (o.status === 'delivered') { s.delivered += 1; s.ca += o.product_price; }
      else if (o.status === 'cancelled') s.cancelled += 1;
      else s.pending += 1;
    });
    return map;
  }, [orders, livreurs]);

  // Résumé par livreur sur la période choisie (uniquement commandes livrées)
  const periodSummary = useMemo(() => {
    const inPeriod = filterByPeriod(orders, period, 'created_at', customFrom, customTo);
    const map: Record<number, { deliveries: number; pieces: number; ca: number; deliveryFees: number; net: number }> = {};
    livreurs.forEach((l) => { map[l.idx] = { deliveries: 0, pieces: 0, ca: 0, deliveryFees: 0, net: 0 }; });
    const totals = { deliveries: 0, pieces: 0, ca: 0, deliveryFees: 0, net: 0 };
    inPeriod.forEach((o) => {
      if (o.status !== 'delivered' || o.livreur_idx == null || !map[o.livreur_idx]) return;
      const u = unitsForOrder(o);
      const fee = effectiveDeliveryFee(livreurs, o);
      const net = o.product_price - fee;
      const s = map[o.livreur_idx];
      s.deliveries += 1; s.pieces += u; s.ca += o.product_price; s.deliveryFees += fee; s.net += net;
      totals.deliveries += 1; totals.pieces += u; totals.ca += o.product_price; totals.deliveryFees += fee; totals.net += net;
    });
    return { map, totals };
  }, [orders, livreurs, period, customFrom, customTo]);

  const periodLabel = PERIODS.find((p) => p.k === period)?.label || '';

  const unassigned = orders.filter((o) => o.livreur_idx == null && o.status !== 'cancelled' && o.status !== 'delivered');

  const assign = async (orderId: string, livreurIdx: number | null) => {
    const { error } = await supabase.from('orders').update({ livreur_idx: livreurIdx }).eq('id', orderId);
    if (error) toast.error(error.message);
    else {
      toast.success(livreurIdx != null ? `Assigné à ${livreurs.find((l) => l.idx === livreurIdx)?.name}` : 'Désassigné');
      onChange();
    }
  };

  const startEdit = (l: Livreur) => {
    setEditId(l.id);
    setEditForm({ name: l.name, whatsapp: l.whatsapp, zone: l.zone || '', emoji: l.emoji || '🛵', delivery_fee: String(l.delivery_fee ?? 2000) });
  };

  const saveEdit = async (id: string) => {
    if (!editForm.name.trim() || !editForm.whatsapp.trim()) {
      toast.error('Nom et WhatsApp obligatoires');
      return;
    }
    const fee = Math.max(0, parseInt(editForm.delivery_fee, 10) || 0);
    const { error } = await supabase.from('livreurs').update({
      name: editForm.name.trim(),
      whatsapp: editForm.whatsapp.replace(/\D/g, ''),
      zone: editForm.zone.trim() || null,
      emoji: editForm.emoji,
      delivery_fee: fee,
    }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Livreur mis à jour'); setEditId(null); reload(); }
  };

  const toggleActive = async (l: Livreur) => {
    const { error } = await supabase.from('livreurs').update({ active: !l.active }).eq('id', l.id);
    if (error) toast.error(error.message);
    else { toast.success(l.active ? 'Désactivé' : 'Activé'); reload(); }
  };

  const addLivreur = async () => {
    if (!newLivreur.name.trim() || !newLivreur.whatsapp.trim()) {
      toast.error('Nom et WhatsApp obligatoires');
      return;
    }
    const nextIdx = livreurs.length > 0 ? Math.max(...livreurs.map((l) => l.idx)) + 1 : 1;
    const fee = Math.max(0, parseInt(newLivreur.delivery_fee, 10) || 0);
    const { error } = await supabase.from('livreurs').insert({
      idx: nextIdx,
      name: newLivreur.name.trim(),
      whatsapp: newLivreur.whatsapp.replace(/\D/g, ''),
      zone: newLivreur.zone.trim() || null,
      emoji: newLivreur.emoji,
      delivery_fee: fee,
      active: true,
    });
    if (error) toast.error(error.message);
    else {
      toast.success('Livreur ajouté');
      setAdding(false);
      setNewLivreur({ name: '', whatsapp: '', zone: '', emoji: '🛵', delivery_fee: '2000' });
      reload();
    }
  };

  const score = (s: { total: number; delivered: number; cancelled: number }) => {
    if (s.total === 0) return null;
    const ratio = s.delivered / s.total;
    return Math.round(ratio * 100);
  };

  const scoreColor = (n: number | null) => {
    if (n == null) return 'text-muted-foreground';
    if (n >= 80) return 'text-vert';
    if (n >= 50) return 'text-[oklch(0.55_0.15_60)]';
    return 'text-rouge';
  };

  return (
    <div className="space-y-5">
      {/* Résumé par livreur — par période */}
      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="font-extrabold text-vert">💼 Résumé livreurs · {periodLabel}</h3>
          <div className="text-[10px] text-muted-foreground">Frais livraison : variables par livreur / commande</div>
        </div>

        {/* Sélecteur période */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PERIODS.map((p) => (
            <button
              key={p.k}
              onClick={() => setPeriod(p.k)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                period === p.k ? 'bg-vert text-white' : 'bg-cream-2 text-muted-foreground hover:bg-vert-bg'
              }`}
            >
              {p.label}
            </button>
          ))}
          {period === 'custom' && (
            <div className="flex items-center gap-1 bg-cream-2 rounded-full px-2 py-0.5">
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="text-[11px] outline-none bg-transparent" />
              <span className="text-[11px] text-muted-foreground">→</span>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="text-[11px] outline-none bg-transparent" />
            </div>
          )}
        </div>

        {/* Tableau résumé */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase text-muted-foreground border-b-2 border-vert-bg">
                <th className="text-left py-2 px-1">Livreur</th>
                <th className="text-right py-2 px-1">Livraisons</th>
                <th className="text-right py-2 px-1">Pièces</th>
                <th className="text-right py-2 px-1">CA</th>
                <th className="text-right py-2 px-1">Frais livr.</th>
                <th className="text-right py-2 px-1">Net à encaisser</th>
              </tr>
            </thead>
            <tbody>
              {livreurs.map((l) => {
                const s = periodSummary.map[l.idx] || { deliveries: 0, pieces: 0, ca: 0, deliveryFees: 0, net: 0 };
                if (s.deliveries === 0) return null;
                return (
                  <tr key={l.id} className="border-b border-vert-bg/40">
                    <td className="py-2 px-1 font-bold text-vert">{l.emoji} {l.name}</td>
                    <td className="text-right py-2 px-1">{s.deliveries}</td>
                    <td className="text-right py-2 px-1">{s.pieces}</td>
                    <td className="text-right py-2 px-1 font-bold">{formatFCFA(s.ca)}</td>
                    <td className="text-right py-2 px-1 text-rouge">−{formatFCFA(s.deliveryFees)}</td>
                    <td className="text-right py-2 px-1 font-extrabold text-vert">{formatFCFA(s.net)}</td>
                  </tr>
                );
              })}
              {periodSummary.totals.deliveries === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-muted-foreground text-sm">
                    Aucune livraison sur cette période
                  </td>
                </tr>
              )}
            </tbody>
            {periodSummary.totals.deliveries > 0 && (
              <tfoot>
                <tr className="bg-vert-bg/40 font-extrabold">
                  <td className="py-2 px-1 text-vert">TOTAL</td>
                  <td className="text-right py-2 px-1">{periodSummary.totals.deliveries}</td>
                  <td className="text-right py-2 px-1">{periodSummary.totals.pieces}</td>
                  <td className="text-right py-2 px-1">{formatFCFA(periodSummary.totals.ca)}</td>
                  <td className="text-right py-2 px-1 text-rouge">−{formatFCFA(periodSummary.totals.deliveryFees)}</td>
                  <td className="text-right py-2 px-1 text-vert">{formatFCFA(periodSummary.totals.net)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Cartes livreurs */}
      <div className="grid sm:grid-cols-2 gap-3">
        {livreurs.map((l) => {
          const s = stats[l.idx] || { total: 0, delivered: 0, cancelled: 0, pending: 0, ca: 0 };
          const sc = score(s);
          const waUrl = `https://wa.me/${l.whatsapp}`;
          const isEditing = editId === l.id;

          return (
            <div key={l.id} className={`bg-white rounded-2xl border-2 p-4 ${l.active ? 'border-vert-bg' : 'border-vert-bg/40 opacity-60'}`}>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input value={editForm.emoji} onChange={(e) => setEditForm({ ...editForm, emoji: e.target.value })} className="w-14 text-center px-2 py-1.5 border-2 border-vert-bg rounded-lg" />
                    <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Nom" className="flex-1 px-3 py-1.5 border-2 border-vert-bg rounded-lg" />
                  </div>
                  <input value={editForm.whatsapp} onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })} placeholder="22670000000" className="w-full px-3 py-1.5 border-2 border-vert-bg rounded-lg" />
                  <input value={editForm.zone} onChange={(e) => setEditForm({ ...editForm, zone: e.target.value })} placeholder="Zone" className="w-full px-3 py-1.5 border-2 border-vert-bg rounded-lg" />
                  <label className="block">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Frais livraison par défaut (FCFA)</span>
                    <input type="number" min="0" value={editForm.delivery_fee} onChange={(e) => setEditForm({ ...editForm, delivery_fee: e.target.value })} placeholder="2000" className="w-full px-3 py-1.5 border-2 border-vert-bg rounded-lg mt-1" />
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(l.id)} className="flex-1 bg-vert text-white py-1.5 rounded-lg font-bold text-sm">💾 Sauver</button>
                    <button onClick={() => setEditId(null)} className="flex-1 bg-cream-2 text-vert py-1.5 rounded-lg font-bold text-sm">Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-3">
                    <div className="min-w-0">
                      <div className="font-extrabold text-vert text-lg truncate">{l.emoji} {l.name}</div>
                      <div className="text-xs text-muted-foreground">{l.zone || '—'} · +{l.whatsapp}</div>
                      <div className="text-[10px] text-muted-foreground">Frais livraison : <span className="font-bold text-vert">{formatFCFA(l.delivery_fee ?? 2000)}</span></div>
                    </div>
                    <div className="flex flex-col gap-1 items-end shrink-0">
                      <a href={waUrl} target="_blank" rel="noreferrer" className="bg-[#25D366] text-white text-xs px-3 py-1 rounded-full font-bold hover:bg-[#1da851]">
                        💬 WA
                      </a>
                      <button onClick={() => startEdit(l)} className="text-xs text-vert-mid font-bold hover:underline">✏️ Modifier</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center mb-3">
                    <Mini label="Total" value={s.total.toString()} />
                    <Mini label="Livrées" value={s.delivered.toString()} cls="text-vert" />
                    <Mini label="En cours" value={s.pending.toString()} cls="text-[oklch(0.55_0.15_60)]" />
                    <Mini label="Annulées" value={s.cancelled.toString()} cls="text-rouge" />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-vert-bg/40">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Score livraison</div>
                      <div className={`text-xl font-extrabold ${scoreColor(sc)}`}>{sc != null ? `${sc}%` : '—'}</div>
                      <div className="text-[10px] text-muted-foreground">CA : {formatFCFA(s.ca)}</div>
                    </div>
                    <button
                      onClick={() => toggleActive(l)}
                      className={`text-xs px-3 py-1.5 rounded-full font-extrabold ${l.active ? 'bg-vert-bg text-vert' : 'bg-rouge-light text-rouge'}`}
                    >
                      {l.active ? '✅ Actif' : '⏸ Inactif'}
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Ajout livreur */}
      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        {!adding ? (
          <button onClick={() => setAdding(true)} className="w-full bg-vert-mid text-white py-2.5 rounded-xl font-extrabold hover:bg-vert">
            ➕ Ajouter un livreur
          </button>
        ) : (
          <div className="space-y-3">
            <h3 className="font-extrabold text-vert">Nouveau livreur</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              <input value={newLivreur.emoji} onChange={(e) => setNewLivreur({ ...newLivreur, emoji: e.target.value })} placeholder="🛵" className="px-3 py-2 border-2 border-vert-bg rounded-lg" />
              <input value={newLivreur.name} onChange={(e) => setNewLivreur({ ...newLivreur, name: e.target.value })} placeholder="Nom complet" className="px-3 py-2 border-2 border-vert-bg rounded-lg" />
              <input value={newLivreur.whatsapp} onChange={(e) => setNewLivreur({ ...newLivreur, whatsapp: e.target.value })} placeholder="22670000000" className="px-3 py-2 border-2 border-vert-bg rounded-lg" />
              <input value={newLivreur.zone} onChange={(e) => setNewLivreur({ ...newLivreur, zone: e.target.value })} placeholder="Zone (Ouagadougou…)" className="px-3 py-2 border-2 border-vert-bg rounded-lg" />
              <input type="number" min="0" value={newLivreur.delivery_fee} onChange={(e) => setNewLivreur({ ...newLivreur, delivery_fee: e.target.value })} placeholder="Frais livraison (2000)" className="px-3 py-2 border-2 border-vert-bg rounded-lg sm:col-span-2" />
            </div>
            <div className="flex gap-2">
              <button onClick={addLivreur} className="flex-1 bg-vert text-white py-2 rounded-xl font-extrabold">Ajouter</button>
              <button onClick={() => setAdding(false)} className="flex-1 bg-cream-2 text-vert py-2 rounded-xl font-extrabold">Annuler</button>
            </div>
          </div>
        )}
      </div>

      {/* Non assignées */}
      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        <h3 className="font-extrabold text-vert mb-3">📋 Non assignées ({unassigned.length})</h3>
        {unassigned.length === 0 && <div className="text-sm text-muted-foreground">Toutes les commandes sont assignées 🎉</div>}
        <div className="space-y-2">
          {unassigned.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-vert-bg/40 pb-2">
              <div className="text-sm">
                <div className="font-bold text-vert">{o.order_number}</div>
                <div className="text-xs text-muted-foreground">{o.first_name} · {o.city} · {o.product_name}</div>
              </div>
              <select
                onChange={(e) => assign(o.id, e.target.value ? parseInt(e.target.value) : null)}
                defaultValue=""
                className="text-sm border-2 border-vert-bg rounded-lg px-2 py-1.5 outline-none focus:border-vert-mid"
              >
                <option value="">Assigner à…</option>
                {livreurs.filter((l) => l.active).map((l) => (
                  <option key={l.id} value={l.idx}>{l.emoji} {l.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value, cls = 'text-vert' }: { label: string; value: string; cls?: string }) {
  return (
    <div className="bg-cream rounded-lg p-1.5">
      <div className="text-[9px] uppercase font-bold text-muted-foreground leading-tight">{label}</div>
      <div className={`font-extrabold ${cls} text-sm`}>{value}</div>
    </div>
  );
}
