import { toast } from 'sonner';

export function ShareLinks({ slug }: { slug: string }) {
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://vieuxkouka.lovable.app';
  const url = `${base}/${slug}/anti-diabete`;

  const copy = () => {
    navigator.clipboard?.writeText(url).then(
      () => toast.success('Lien copié ✅'),
      () => toast.error('Impossible de copier'),
    );
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Anti-Diabète — Vieux KOUKA', url }); return; } catch {}
    }
    copy();
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-rose-200 p-4">
      <div className="font-extrabold text-rose-900 mb-2">🔗 Mon lien Anti-Diabète</div>
      <div className="bg-rose-50 rounded-lg p-2 text-[11px] text-gray-700 break-all mb-2">{url}</div>
      <div className="flex gap-2">
        <button onClick={copy} className="flex-1 bg-white border border-rose-300 px-3 py-2 rounded-lg text-xs font-extrabold text-rose-700">📋 Copier le lien</button>
        <button onClick={share} className="flex-1 bg-rose-600 text-white px-3 py-2 rounded-lg text-xs font-extrabold">↗ Partager</button>
      </div>
      <p className="text-[10px] text-gray-500 mt-2 leading-snug">
        Partage ce lien sur WhatsApp / Facebook. Chaque commande passée via ton lien est automatiquement attribuée à ton compte.
      </p>
    </div>
  );
}
