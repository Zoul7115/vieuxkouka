import { useEffect, useState } from 'react';
import { formatFCFA, type Product } from '@/lib/products';

export function StoryAtcSticky({
  product,
  ctaLabel = 'Commander maintenant',
  tone = 'vert',
}: {
  product: Product;
  ctaLabel?: string;
  tone?: 'vert' | 'rouge';
}) {
  const [show, setShow] = useState(false);
  const reco = product.offers.find((o) => o.recommended) || product.offers[0];

  useEffect(() => {
    const onScroll = () => {
      const formEl = document.getElementById('order-section');
      const scrolled = window.scrollY > 500;
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

  const btnClass =
    tone === 'rouge'
      ? 'bg-rouge hover:brightness-110 text-white'
      : 'bg-vert-mid hover:bg-vert text-white';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-[oklch(0.90_0.02_130)] shadow-[0_-8px_24px_rgba(0,0,0,0.10)]">
      <div className="container-story py-3 flex items-center gap-3">
        <img
          src={product.heroImage}
          alt={product.name}
          className="hidden sm:block w-12 h-12 rounded-lg object-cover border border-[oklch(0.92_0.02_130)] shrink-0"
        />
        <div className="hidden sm:block min-w-0 flex-1">
          <div className="font-extrabold text-foreground text-sm truncate">{product.name}</div>
          <div className="text-xs text-muted-foreground">
            À partir de <strong className="text-vert">{formatFCFA(reco.price)}</strong> · Paiement livraison
          </div>
        </div>
        <button
          onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' })}
          className={`flex-1 sm:flex-none sm:px-8 py-3 rounded-xl text-sm sm:text-base font-extrabold transition-all active:scale-95 ${btnClass}`}
        >
          🛒 {ctaLabel}
        </button>
      </div>
    </div>
  );
}
