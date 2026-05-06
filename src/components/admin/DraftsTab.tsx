import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Draft = {
  id: string;
  session_id: string;
  full_name: string | null;
  whatsapp: string | null;
  country_code: string | null;
  city: string | null;
  product_slug: string | null;
  offer_label: string | null;
  page: string | null;
  source: string | null;
  recovered: boolean;
  created_at: string;
  updated_at: string;
};

const formatTimeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `il y a ${d}j`;
};

export function DraftsTab() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'recovered'>('pending');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('form_drafts')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(500);
    if (error) toast.error(error.message);
    else setDrafts((data || []) as Draft[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel('admin-drafts-stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'form_drafts' }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = drafts.filter((d) => {
    if (filter === 'pending') return !d.recovered;
    if (filter === 'recovered') return d.recovered;
    return true;
  });

  const waLink = (phone: string, draft: Draft) => {
    const clean = phone.replace(/[^\d+]/g, '').replace(/^\+/, '');
    const product = draft.product_slug === 'sirop-kouka' ? 'Sirop KOUKA' : 'Poudre KOUKA';
    const msg = `Bonjour ${draft.full_name || ''} 👋\n\nJ'ai vu que vous avez commencé une commande pour le ${product}${draft.offer_label ? ' (' + draft.offer_label + ')' : ''} mais vous n'avez pas pu finaliser.\n\nTout va bien ? Je peux vous aider à confirmer la livraison directement ici sur WhatsApp 📦\n\nPaiement à la livraison · Colis 100% discret · Garantie satisfait ou remboursé.`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
  };

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce brouillon ?')) return;
    const { error } = await supabase.from('form_drafts').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Supprimé'); load(); }
  };

  const counts = {
    all: drafts.length,
    pending: drafts.filter((d) => !d.recovered).length,
    recovered: drafts.filter((d) => d.recovered).length,
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-or to-[oklch(0.65_0.15_75)] text-white rounded-2xl p-5 mb-5">
        <div className="text-sm font-semibold opacity-90">📝 Formulaires abandonnés</div>
        <div className="text-3xl font-extrabold mt-1">{counts.pending}</div>
        <div className="text-sm opacity-90 mt-1">à rappeler · {counts.recovered} déjà récupérés</div>
      </div>

      <div className="flex gap-2 mb-4">
        {(['pending', 'recovered', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              filter === f ? 'bg-vert text-white' : 'bg-white border-2 border-vert-bg text-muted-foreground'
            }`}
          >
            {f === 'pending' ? `⏳ À rappeler (${counts.pending})` : f === 'recovered' ? `✅ Récupérés (${counts.recovered})` : `📋 Tous (${counts.all})`}
          </button>
        ))}
        <button onClick={load} className="ml-auto px-3 py-1.5 rounded-full text-xs font-bold bg-white border-2 border-vert-bg">🔄</button>
      </div>

      {loading && <div className="text-center py-8 text-muted-foreground">Chargement…</div>}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-vert-bg">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-muted-foreground">Aucun brouillon dans cette catégorie</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((d) => (
          <div key={d.id} className={`bg-white rounded-2xl p-4 border-2 ${d.recovered ? 'border-vert-bg opacity-70' : 'border-or'}`}>
            <div className="flex justify-between items-start gap-3 mb-2">
              <div>
                <div className="font-extrabold text-base">
                  {d.full_name || <span className="text-muted-foreground italic">Nom non saisi</span>}
                  {d.recovered && <span className="ml-2 text-xs bg-vert-bg text-vert px-2 py-0.5 rounded-full">✅ Récupéré</span>}
                </div>
                <div className="text-xs text-muted-foreground">{formatTimeAgo(d.updated_at)}</div>
              </div>
              <button onClick={() => remove(d.id)} className="text-xs text-rouge hover:underline">Suppr.</button>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm mb-3">
              <div><span className="text-muted-foreground">📱</span> {d.whatsapp || <em className="text-muted-foreground">—</em>}</div>
              <div><span className="text-muted-foreground">📍</span> {d.city || <em className="text-muted-foreground">—</em>} {d.country_code && `(${d.country_code})`}</div>
              <div className="col-span-2 text-xs text-muted-foreground">
                🛒 {d.product_slug === 'sirop-kouka' ? 'Sirop KOUKA' : 'Poudre KOUKA'}
                {d.offer_label && ` · ${d.offer_label}`}
              </div>
              {d.source && <div className="col-span-2 text-xs text-muted-foreground truncate">🌐 {d.source}</div>}
            </div>

            {d.whatsapp && !d.recovered && (
              <a
                href={waLink(d.whatsapp, d)}
                target="_blank"
                rel="noreferrer"
                className="block text-center w-full bg-[#25D366] text-white py-2.5 rounded-xl font-extrabold text-sm hover:bg-[#1da851]"
              >
                💬 Relancer sur WhatsApp
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
