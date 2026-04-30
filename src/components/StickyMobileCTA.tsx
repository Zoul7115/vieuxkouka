import { useEffect, useState } from 'react';

export function StickyMobileCTA({ label = '🌿 COMMANDER MAINTENANT', price: _price }: { label?: string; price?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const formEl = document.getElementById('order-section');
      const scrolled = window.scrollY > 600;
      let formVisible = false;
      if (formEl) {
        const r = formEl.getBoundingClientRect();
        formVisible = r.top < window.innerHeight && r.bottom > 0;
      }
      setShow(scrolled && !formVisible);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-vert-bg shadow-[0_-4px_20px_rgba(0,0,0,0.15)] p-3 animate-in slide-in-from-bottom duration-300">
      <button
        onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' })}
        className="w-full bg-rouge text-white py-3.5 rounded-xl text-base font-extrabold shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
      >
        <span>{label}</span>
      </button>
      <div className="text-center text-[10px] text-muted-foreground mt-1 font-semibold">
        💵 Paiement à la livraison · 🛡️ Remboursé si insatisfait
      </div>
    </div>
  );
}
