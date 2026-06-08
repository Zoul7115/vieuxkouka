import { toast } from 'sonner';

const LINKS: { key: string; label: string; emoji: string; path: (slug: string) => string }[] = [
  { key: 'boutique', label: 'Boutique (4 produits)', emoji: '🛍️', path: (s) => `/${s}/boutique` },
  { key: 'anti-diabete', label: 'Anti-Diabète', emoji: '🩸', path: (s) => `/${s}/anti-diabete` },
  { key: 'sirop', label: 'Sirop KOUKA', emoji: '🍯', path: (s) => `/${s}/product/sirop-kouka` },
  { key: 'kouka', label: 'Poudre KOUKA', emoji: '🌿', path: (s) => `/${s}/kouka` },
  { key: 'tonic', label: 'Tonic KOUKA', emoji: '⚡', path: (s) => `/${s}/tonic-kouka` },
];

export function ShareLinks({ slug }: { slug: string }) {
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://vieuxkouka.lovable.app';

  const copy = (url: string) => {
    navigator.clipboard?.writeText(url).then(
      () => toast.success('Lien copié ✅'),
      () => toast.error('Impossible de copier'),
    );
  };

  const share = async (label: string, url: string) => {
    if (navigator.share) {
      try { await navigator.share({ title: `${label} — Vieux KOUKA`, url }); return; } catch {}
    }
    copy(url);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-rose-200 p-4 space-y-3">
      <div className="font-extrabold text-rose-900">🔗 Mes liens de vente</div>
      <p className="text-[11px] text-gray-600 leading-snug">
        Chaque commande passée via tes liens est automatiquement attribuée à ton compte.
      </p>
      <div className="space-y-2">
        {LINKS.map((l) => {
          const url = `${base}${l.path(slug)}`;
          return (
            <div key={l.key} className="bg-rose-50 rounded-lg p-2.5">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="font-extrabold text-rose-900 text-xs">{l.emoji} {l.label}</div>
              </div>
              <div className="text-[10px] text-gray-700 break-all mb-1.5">{url}</div>
              <div className="flex gap-1.5">
                <button onClick={() => copy(url)} className="flex-1 bg-white border border-rose-300 px-2 py-1.5 rounded text-[11px] font-extrabold text-rose-700">📋 Copier</button>
                <button onClick={() => share(l.label, url)} className="flex-1 bg-rose-600 text-white px-2 py-1.5 rounded text-[11px] font-extrabold">↗ Partager</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
