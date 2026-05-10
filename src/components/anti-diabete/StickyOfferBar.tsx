import { useEffect, useState } from 'react';

function go(offerId: number) {
  try {
    sessionStorage.setItem('preselect_offer_id', String(offerId));
  } catch {}
  window.dispatchEvent(new CustomEvent('preselect-offer', { detail: { offerId } }));
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

export function StickyOfferBar({ stock }: { stock: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t-2 border-bleu shadow-[0_-8px_24px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom">
      <div className="container-kouka py-2.5">
        <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-rouge mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rouge animate-pulse" />
          Stock limité : {stock} sachets restants aujourd'hui
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => go(21)}
            className="flex flex-col items-center justify-center bg-white border-2 border-bleu text-bleu rounded-xl py-2 px-2 font-extrabold leading-tight active:scale-95 transition"
          >
            <span className="text-[10px] uppercase tracking-wide opacity-70">Tester</span>
            <span className="text-sm">1 sachet · 12 500 F</span>
          </button>
          <button
            onClick={() => go(22)}
            className="relative flex flex-col items-center justify-center bg-rouge text-white rounded-xl py-2 px-2 font-extrabold leading-tight shadow-[0_4px_14px_rgba(198,40,40,0.45)] active:scale-95 transition"
          >
            <span className="absolute -top-2 right-2 bg-or text-foreground text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">★ TOP</span>
            <span className="text-[10px] uppercase tracking-wide opacity-90">Cure complète</span>
            <span className="text-sm">3 sachets · 25 000 F</span>
          </button>
        </div>
      </div>
    </div>
  );
}
