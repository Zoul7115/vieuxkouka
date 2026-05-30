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
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Détecte quand le formulaire de commande est visible
    const target = document.getElementById('order-section');
    if (!target) return () => window.removeEventListener('scroll', onScroll);
    const io = new IntersectionObserver(
      (entries) => setAtForm(entries[0]?.isIntersecting ?? false),
      { rootMargin: '0px 0px -40% 0px', threshold: 0.05 },
    );
    io.observe(target);

    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  if (!show || atForm) return null;

  return (
    <div
      className="fixed inset-x-0 z-50 bg-white/95 backdrop-blur border-t-2 border-bleu shadow-[0_-8px_24px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom"
      style={{
        bottom: 0,
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <div className="container-kouka pt-2.5 pb-1">
        <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-rouge mb-2 leading-none">
          <span className="w-1.5 h-1.5 rounded-full bg-rouge animate-pulse" />
          Stock limité : {stock} sachets restants aujourd'hui
        </div>
        <button
          onClick={() => go(21)}
          className="w-full flex items-center justify-center bg-rouge text-white rounded-xl py-[14px] px-4 text-[15px] font-extrabold leading-none shadow-[0_6px_18px_rgba(198,40,40,0.50)] active:scale-[0.97] transition border-2 border-white/25 touch-manipulation select-none min-h-[54px]"
        >
          ✅ Je commande · 1 sachet · 12 500 F
        </button>
      </div>
    </div>
  );
}
