import { useEffect, useState } from 'react';
import { useCtaVariant, trackCtaClick } from '@/hooks/useCtaVariant';

function go(offerId: number, location: string) {
  trackCtaClick(location);
  try { sessionStorage.setItem('preselect_offer_id', String(offerId)); } catch {}
  window.dispatchEvent(new CustomEvent('preselect-offer', { detail: { offerId } }));
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

export function StickyOfferBarTonic({ stock }: { stock: number }) {
  const [show, setShow] = useState(false);
  const [atForm, setAtForm] = useState(false);
  const cta = useCtaVariant();

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

  const sizeClass = cta.variant === 'B' ? 'py-[16px] min-h-[60px] text-[15px]' : 'py-[14px] min-h-[54px] text-[14px]';

  return (
    <div
      className="fixed inset-x-0 z-50 bg-white/95 backdrop-blur border-t-2 border-vert shadow-[0_-8px_24px_rgba(0,0,0,0.14)] animate-in slide-in-from-bottom"
      style={{
        bottom: 0,
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <div className="container-kouka pt-2.5 pb-1">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-rouge mb-2 leading-none">
          <span className="w-2 h-2 rounded-full bg-rouge animate-pulse" />
          Stock limité : {stock} bouteilles restantes aujourd'hui
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => go(31, 'sticky-bar-1')}
            className={`flex flex-col items-center justify-center bg-white border-2 border-vert text-vert rounded-xl px-2 font-extrabold leading-none active:scale-[0.97] transition touch-manipulation select-none ${sizeClass}`}
          >
            <span className="text-[10px] uppercase tracking-wide opacity-70 mb-1">Découverte</span>
            <span>1 bouteille · 11 000 F</span>
          </button>
          <button
            onClick={() => go(32, 'sticky-bar-2')}
            className={`relative flex flex-col items-center justify-center bg-rouge text-white rounded-xl px-2 font-extrabold leading-none shadow-[0_6px_18px_rgba(198,40,40,0.50)] active:scale-[0.97] transition border-2 border-white/25 touch-manipulation select-none ${sizeClass}`}
          >
            <span className="absolute -top-2.5 right-1 bg-or text-foreground text-[10px] font-extrabold px-2 py-0.5 rounded-full leading-none">★ TOP</span>
            <span className="text-[10px] uppercase tracking-wide opacity-90 mb-1">2+1 OFFERT</span>
            <span>3 bouteilles · 22 000 F</span>
          </button>
        </div>
      </div>
    </div>
  );
}
