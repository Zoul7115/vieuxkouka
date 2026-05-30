import { useEffect, useState } from 'react';

function go(offerId: number) {
  try { sessionStorage.setItem('preselect_offer_id', String(offerId)); } catch {}
  window.dispatchEvent(new CustomEvent('preselect-offer', { detail: { offerId } }));
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

export function StickyOfferBarTonic({ stock }: { stock: number }) {
  const [show, setShow] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const target = document.getElementById('order-section');
    if (!target) return () => window.removeEventListener('scroll', onScroll);
    const io = new IntersectionObserver(
      (entries) => setAtForm(entries[0]?.isIntersecting ?? false),
      { rootMargin: '0px 0px -40% 0px', threshold: 0.05 },
    );
    io.observe(target);
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect(); };
  }, []);

  if (!show || atForm) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t-2 border-vert shadow-[0_-8px_24px_rgba(0,0,0,0.14)] animate-in slide-in-from-bottom">
      <div className="container-kouka py-3">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rouge mb-2">
          <span className="w-2 h-2 rounded-full bg-rouge animate-pulse" />
          Stock limité : {stock} flacons restants aujourd'hui
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={() => go(31)} className="flex flex-col items-center justify-center bg-white border-2 border-vert text-vert rounded-xl py-3 px-2 font-extrabold leading-tight active:scale-95 transition min-h-[52px]">
            <span className="text-[11px] uppercase tracking-wide opacity-70">Découverte</span>
            <span className="text-base">1 flacon · 8 000 F</span>
          </button>
          <button onClick={() => go(32)} className="relative flex flex-col items-center justify-center bg-rouge text-white rounded-xl py-3 px-2 font-extrabold leading-tight shadow-[0_6px_18px_rgba(198,40,40,0.50)] active:scale-95 transition border-2 border-white/20 min-h-[52px]">
            <span className="absolute -top-2.5 right-1 bg-or text-foreground text-[10px] font-extrabold px-2 py-0.5 rounded-full">★ TOP</span>
            <span className="text-[11px] uppercase tracking-wide opacity-90">2+1 OFFERT</span>
            <span className="text-base">3 flacons · 18 000 F</span>
          </button>
        </div>
      </div>
    </div>
  );
}
