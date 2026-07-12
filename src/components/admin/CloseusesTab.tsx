import { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCloseuses, slugify, type Closeuse } from '@/lib/closeuses';
import { useCommissionSettings } from '@/lib/commissions';
import { formatFCFA } from '@/lib/products';

type Order = { closeuse_idx?: number | null; status: string; delivered_at?: string | null; product_price: number };

export function CloseusesTab({ orders }: { orders: Order[] }) {
  const { closeuses, reload } = useCloseuses();
  const { settings } = useCommissionSettings();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', whatsapp: '', emoji: '👩‍💼', slug: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', whatsapp: '', emoji: '👩‍💼', slug: '' });

  const monthStart = useMemo(() => {
    const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d;
  }, []);

  const statsByCloseuse = useMemo(() => {
    const m: Record<number, { count: number; ca: number; salary: number }> = {};
    closeuses.forEach((c) => { m[c.idx] = { count: 0, ca: 0, salary: 0 }; });
    orders.forEach((o) => {
      if (o.closeuse_idx == null || o.status !== 'delivered' || !o.delivered_at) return;
      if (new Date(o.delivered_at) < monthStart) return;
      if (!m[o.closeuse_idx]) m[o.closeuse_idx] = { count: 0, ca: 0, salary: 0 };
      m[o.closeuse_idx].count += 1;
      m[o.closeuse_idx].ca += o.product_price;
      m[o.closeuse_idx].salary += settings.commission_per_delivered_order || settings.commission_per_validated_order;
    });
    return m;
  }, [orders, closeuses, monthStart, settings]);

  const add = async () => {
    if (!form.name.trim() || !form.whatsapp.trim()) { toast.error('Nom + WhatsApp requis'); return; }
    const slug = (form.slug.trim() || slugify(form.name)) || `closeuse-${Date.now().toString(36)}`;
    const { error } = await supabase.from('closeuses').insert({
      name: form.name.trim(),
      whatsapp: form.whatsapp.replace(/\D/g, ''),
      emoji: form.emoji || '👩‍💼',
      slug,
      active: true,
    } as any);
    if (error) toast.error(error.message);
    else { toast.success('Closeuse ajoutée'); setAdding(false); setForm({ name: '', whatsapp: '', emoji: '👩‍💼', slug: '' }); reload(); }
  };

  const startEdit = (c: Closeuse) => {
    setEditId(c.id);
    setEditForm({ name: c.name, whatsapp: c.whatsapp, emoji: c.emoji || '👩‍💼', slug: c.slug || slugify(c.name) });
  };

  const saveEdit = async (id: string) => {
    if (!editForm.name.trim() || !editForm.whatsapp.trim()) { toast.error('Nom + WhatsApp requis'); return; }
    const slug = editForm.slug.trim() || slugify(editForm.name);
    const { error } = await supabase.from('closeuses').update({
      name: editForm.name.trim(),
      whatsapp: editForm.whatsapp.replace(/\D/g, ''),
      emoji: editForm.emoji,
      slug,
    } as any).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Mise à jour'); setEditId(null); reload(); }
  };

  const toggle = async (c: Closeuse) => {
    const { error } = await supabase.from('closeuses').update({ active: !c.active }).eq('id', c.id);
    if (error) toast.error(error.message);
    else { toast.success(c.active ? 'Désactivée' : 'Activée'); reload(); }
  };

  const resetPassword = async (c: Closeuse) => {
    if (!confirm(`Réinitialiser le mot de passe de ${c.name} ?`)) return;
    const { error } = await supabase.from('closeuses').update({ password_hash: null } as any).eq('id', c.id);
    if (error) toast.error(error.message);
    else toast.success('Mot de passe réinitialisé');
  };

  const toggleAdminOrders = async (c: Closeuse) => {
    const next = !c.admin_orders_access;
    const { error } = await supabase.from('closeuses').update({ admin_orders_access: next } as any).eq('id', c.id);
    if (error) toast.error(error.message);
    else { toast.success(next ? `${c.name} a désormais accès aux commandes admin` : 'Accès commandes admin retiré'); reload(); }
  };

  const remove = async (c: Closeuse) => {
    if (!confirm(`Supprimer ${c.name} ?`)) return;
    const { error } = await supabase.from('closeuses').delete().eq('id', c.id);
    if (error) toast.error(error.message);
    else { toast.success('Supprimée'); reload(); }
  };

  const base = typeof window !== 'undefined' ? window.location.origin : '';

  const copyLink = (slug: string) => {
    navigator.clipboard?.writeText(`${base}/${slug}`);
    toast.success('Lien copié');
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-rose-600 to-pink-700 text-white rounded-2xl p-5">
        <h3 className="font-extrabold text-lg">👩‍💼 Closeuses</h3>
        <p className="text-sm opacity-90 mt-1">Chaque closeuse a un lien personnalisé (<code>/{`{slug}`}/{`{produit}`}</code>) à partager. Toute commande passée via ce lien lui est automatiquement attribuée.</p>
        <a href="/closeuse" target="_blank" rel="noreferrer" className="inline-block mt-3 bg-white text-rose-700 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-rose-50">
          🔗 Espace closeuse : /closeuse
        </a>
      </div>

      {!adding ? (
        <button onClick={() => setAdding(true)} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-2.5 rounded-xl">
          ➕ Ajouter une closeuse
        </button>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-rose-200 p-4 space-y-2">
          <div className="flex gap-2">
            <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className="w-14 text-center px-2 py-2 border-2 border-rose-200 rounded-lg" />
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })} placeholder="Nom (ex: Fatou)" className="flex-1 px-3 py-2 border-2 border-rose-200 rounded-lg" />
          </div>
          <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="22670000000" className="w-full px-3 py-2 border-2 border-rose-200 rounded-lg" />
          <div>
            <label className="text-xs font-bold text-rose-700">Slug (lien personnalisé)</label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">{base}/</span>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder="fatou" className="flex-1 px-3 py-2 border-2 border-rose-200 rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={add} className="flex-1 bg-rose-600 text-white font-bold py-2 rounded-lg">💾 Enregistrer</button>
            <button onClick={() => setAdding(false)} className="flex-1 bg-gray-100 font-bold py-2 rounded-lg">Annuler</button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {closeuses.map((c) => {
          const s = statsByCloseuse[c.idx] || { count: 0, ca: 0, salary: 0 };
          const editing = editId === c.id;
          const slug = c.slug || slugify(c.name);
          return (
            <div key={c.id} className={`bg-white rounded-2xl border-2 p-4 ${c.active ? 'border-rose-200' : 'border-rose-100 opacity-60'}`}>
              {editing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input value={editForm.emoji} onChange={(e) => setEditForm({ ...editForm, emoji: e.target.value })} className="w-14 text-center px-2 py-1.5 border-2 border-rose-200 rounded-lg" />
                    <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="flex-1 px-3 py-1.5 border-2 border-rose-200 rounded-lg" />
                  </div>
                  <input value={editForm.whatsapp} onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })} className="w-full px-3 py-1.5 border-2 border-rose-200 rounded-lg" />
                  <input value={editForm.slug} onChange={(e) => setEditForm({ ...editForm, slug: slugify(e.target.value) })} placeholder="slug" className="w-full px-3 py-1.5 border-2 border-rose-200 rounded-lg text-sm" />
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(c.id)} className="flex-1 bg-rose-600 text-white py-1.5 rounded-lg font-bold text-sm">💾 Sauver</button>
                    <button onClick={() => setEditId(null)} className="flex-1 bg-gray-100 py-1.5 rounded-lg font-bold text-sm">Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <div className="font-extrabold text-rose-900 text-lg truncate">{c.emoji} {c.name}</div>
                      <div className="text-xs text-gray-500">+{c.whatsapp}</div>
                      <div className="text-[10px] text-rose-700 mt-1 font-mono truncate">/{slug}/&hellip;</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-gray-500">Ce mois</div>
                      <div className="font-extrabold text-rose-700">{s.count} cmdes</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-rose-100">
                    <button onClick={() => copyLink(slug)} className="text-xs bg-rose-600 text-white px-3 py-1 rounded-full font-bold">📋 Copier lien</button>
                    <button onClick={() => startEdit(c)} className="text-xs bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-bold">✏️ Modifier</button>
                    <button onClick={() => resetPassword(c)} className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-bold">🔑 Reset MDP</button>
                    <button
                      onClick={() => toggleAdminOrders(c)}
                      title="Autoriser la closeuse à gérer toutes les commandes comme un admin"
                      className={`text-xs px-3 py-1 rounded-full font-bold ${c.admin_orders_access ? 'bg-vert text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {c.admin_orders_access ? '🛡️ Accès commandes ✓' : '🛡️ Accès commandes'}
                    </button>
                    <button onClick={() => toggle(c)} className="text-xs bg-gray-100 px-3 py-1 rounded-full font-bold">{c.active ? '⏸ Désactiver' : '▶ Activer'}</button>
                    <button onClick={() => remove(c)} className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-full font-bold">🗑 Supprimer</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {closeuses.length === 0 && <div className="text-center text-gray-500 py-6">Aucune closeuse — ajoute la première.</div>}
      </div>
    </div>
  );
}
