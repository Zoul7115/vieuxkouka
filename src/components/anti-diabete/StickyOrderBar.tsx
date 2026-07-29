import { useEffect, useState } from 'react';

import { useInputFocused } from '@/hooks/useInputFocused';
import { cn } from '@/lib/utils';

const RECOMMENDED_OFFER_ID = 22;

type BarOffer = { id: number; title: string; sub: string; price: string };

const OFFERS: Record<number, BarOffer> = {
  21: { id: 21, title: 'Offre Découverte', sub: '1 sachet', price: '12 500 FCFA' },
  22: {
    id: 22,
    title: '⭐ Cure complète recommandée',
    sub: '2 sachets achetés + 1 sachet offert',
    price: '25 000 FCFA',
  },
  23: {
    id: 23,
    title: 'Cure Longue Durée',
    sub: '3 sachets achetés + 2 sachets offerts',
    price: '38 000 FCFA',
  },
};

function selectOfferAndScroll(offerId: number) {
  try {
    sessionStorage.setItem('preselect_offer_id', String(offerId));
  } catch {
    /* noop */
  }
  window.dispatchEvent(new CustomEvent('preselect-offer', { detail: { offerId } }));
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function StickyOrderBar() {
  const [visible, setVisible] = useState(false);
  const [atOffers, setAtOffers] = useState(false);
  const [atForm, setAtForm] = useState(false);
  const [offerId, setOfferId] = useState(RECOMMENDED_OFFER_ID);
  const inputFocused = useInputFocused();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const onPreselect = (e: Event) => {
      const id = (e as CustomEvent<{ offerId: number }>).detail?.offerId;
      if (id && OFFERS[id]) setOfferId(id);
    };
    window.addEventListener('preselect-offer', onPreselect);

    const offersEl = document.getElementById('offres');
    const formEl = document.getElementById('order-section');
    const ioOffers = offersEl
      ? new IntersectionObserver(([e]) => setAtOffers(e?.isIntersecting ?? false), { threshold: 0.05 })
      : null;
    ioOffers?.observe(offersEl!);
    const ioForm = formEl
      ? new IntersectionObserver(([e]) => setAtForm(e?.isIntersecting ?? false), {
          rootMargin: '0px 0px -35% 0px',
          threshold: 0.02,
        })
      : null;
    ioForm?.observe(formEl!);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('preselect-offer', onPreselect);
      ioOffers?.disconnect();
      ioForm?.disconnect();
    };
  }, []);

  const offer = OFFERS[offerId] ?? OFFERS[RECOMMENDED_OFFER_ID];
  const show = visible && !inputFocused && !atForm;

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out',
        show ? 'translate-y-0' : 'translate-y-full'
      )}
      aria-hidden={!show}
    >
      <div className="mx-auto w-full max-w-5xl px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="flex items-center justify-between gap-3 rounded-t-2xl bg-card px-4 py-3.5 shadow-[0_-10px_40px_-12px_rgba(15,23,42,0.18)] ring-1 ring-bleu/10 sm:rounded-t-3xl sm:px-6 sm:py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-sm font-extrabold text-foreground sm:text-base">
              <span className="leading-tight">{offer.title}</span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-muted-foreground sm:text-sm">{offer.sub}</p>
            <p className="mt-0.5 text-base font-extrabold text-rouge sm:text-lg">{offer.price}</p>
          </div>
          <button
            type="button"
            onClick={() => selectOfferAndScroll(offer.id)}
            className="shrink-0 rounded-xl bg-rouge px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-lg shadow-rouge/25 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl sm:px-6 sm:py-3.5 sm:text-base"
          >
            <span className="sm:hidden">{atOffers ? 'Continuer' : 'Commander'}</span>
            <span className="hidden sm:inline">
              {atOffers ? 'Continuer la commande' : `Commander • ${offer.price}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
