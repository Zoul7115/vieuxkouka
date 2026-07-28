import { useEffect, useState } from 'react';

import { useInputFocused } from '@/hooks/useInputFocused';
import { cn } from '@/lib/utils';

const RECOMMENDED_OFFER_ID = 22;

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
  const inputFocused = useInputFocused();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out',
        visible && !inputFocused ? 'translate-y-0' : 'translate-y-full'
      )}
      aria-hidden={!visible || inputFocused}
    >
      <div className="mx-auto w-full max-w-5xl px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="flex items-center justify-between gap-3 rounded-t-2xl bg-card px-4 py-3.5 shadow-[0_-10px_40px_-12px_rgba(15,23,42,0.18)] ring-1 ring-bleu/10 sm:rounded-t-3xl sm:px-6 sm:py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-sm font-extrabold text-foreground sm:text-base">
              <span>⭐</span>
              <span className="leading-tight">Cure complète recommandée</span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-muted-foreground sm:text-sm">
              2 sachets achetés + 1 sachet offert
            </p>
            <p className="mt-0.5 text-base font-extrabold text-rouge sm:text-lg">25 000 FCFA</p>
          </div>
          <button
            type="button"
            onClick={() => selectOfferAndScroll(RECOMMENDED_OFFER_ID)}
            className="shrink-0 rounded-xl bg-rouge px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-lg shadow-rouge/25 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl sm:px-6 sm:py-3.5 sm:text-base"
          >
            <span className="sm:hidden">Commander</span>
            <span className="hidden sm:inline">Commander • 25 000 FCFA</span>
          </button>
        </div>
      </div>
    </div>
  );
}
