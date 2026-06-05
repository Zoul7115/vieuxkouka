import { useState } from 'react';
import { toast } from 'sonner';
import { PRODUCTS } from '@/lib/products';

export function ShareLinks({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://vieuxkouka.lovable.app';

  const links = PRODUCTS.map((p) => ({
    name: p.shortName,
    emoji: p.emoji,
    url: `${base}/${slug}/${p.slug}`,
  }));

  const copy = (url: string) => {
    navigator.clipboard?.writeText(url).then(
      () => toast.success('Lien copié ✅'),
      () => toast.error('Impossible de copier'),
    );
  };

  const share = async (url: string, label: string) => {
    if (navigator.share) {
      try { await navigator.share({ title: `${label} — Vieux KOUKA`, url }); return; } catch {}
    }
    copy(url);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-rose-200 p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex justify-between items-center font-extrabold text-rose-900"
      >
        <span>🔗 Mes liens de partage</span>
        <span className="text-xs text-rose-600">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {links.map((l) => (
            <div key={l.url} className="flex items-center gap-2 bg-rose-50 rounded-lg p-2">
              <div className="text-xs font-bold text-rose-900 flex-1 truncate">
                {l.emoji} {l.name}
                <div className="text-[10px] text-gray-500 truncate">{l.url}</div>
              </div>
              <button onClick={() => copy(l.url)} className="text-xs bg-white border border-rose-300 px-2 py-1 rounded font-bold">📋</button>
              <button onClick={() => share(l.url, l.name)} className="text-xs bg-rose-600 text-white px-2 py-1 rounded font-bold">↗</button>
            </div>
          ))}
          <p className="text-[10px] text-gray-500 mt-2 leading-snug">
            Partage ces liens sur WhatsApp / Facebook. Chaque commande passée via tes liens est automatiquement attribuée à ton compte.
          </p>
        </div>
      )}
    </div>
  );
}
