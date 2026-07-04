import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { formatFCFA, isTwoPlusOneOffer, type Offer, type Product } from '@/lib/products';

function preselect(offerId: number) {
  try { sessionStorage.setItem('preselect_offer_id', String(offerId)); } catch {}
  window.dispatchEvent(new CustomEvent('preselect-offer', { detail: { offerId } }));
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Sticky offer bar (mobile) — version compacte.
 * Une seule ligne : badge ⭐ + prix + bouton COMMANDER.
 * Les autres offres restent accessibles via "Autres formules".
 */
export function StickyOfferBarRecommended({
  product,
  stock: _stock,
  unitLabel: _unitLabel = 'unités',
}: {
  product: Product;
  stock?: number;
  unitLabel?: string;
}) {
  const [show, setShow] = useState(false);
  const [atForm, setAtForm] = useState(false);
  const [openOther, setOpenOther] = useState(false);

  const reco: Offer =
    product.offers.find((o) => o.recommended) ||
    product.offers.find((o) => o.bestValue) ||
    product.offers[1] ||
    product.offers[0];
  const others = product.offers.filter((o) => o.id !== reco.id);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
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
    <div
      className="md:hidden fixed inset-x-0 z-50 bg-white border-t border-rouge/40 shadow-[0_-6px_18px_rgba(0,0,0,0.14)] animate-in slide-in-from-bottom"
      style={{
        bottom: 0,
        paddingBottom: 'max(env(safe-area-inset-bottom), 4px)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <div className="container-kouka py-1.5">
        <div className="flex items-center gap-2">
          {/* Infos offre */}
          <div className="flex-1 min-w-0 leading-tight">
            <div className="flex items-center gap-1 text-[10px] font-extrabold text-rouge uppercase tracking-wide truncate">
              <span>⭐</span>
              <span className="truncate">Offre la plus choisie</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-foreground tabular-nums">
                {formatFCFA(reco.price)}
              </span>
              {reco.oldPrice > reco.price && (
                <span className="text-[10px] line-through text-muted-foreground tabular-nums">
                  {formatFCFA(reco.oldPrice)}
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => preselect(reco.id)}
            className="shrink-0 bg-rouge text-white font-extrabold text-sm px-4 py-2.5 rounded-lg shadow-[0_3px_10px_rgba(198,40,40,0.35)] active:scale-95 transition touch-manipulation"
          >
            COMMANDER
          </button>
        </div>

        {/* Lien discret : autres offres */}
        <Sheet open={openOther} onOpenChange={setOpenOther}>
          <SheetTrigger asChild>
            <button className="block mx-auto mt-0.5 text-[10px] underline text-muted-foreground active:text-foreground leading-none">
              Autres formules
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Choisir une autre formule</SheetTitle>
            </SheetHeader>
            <div className="grid gap-3 mt-3 pb-6">
              {[reco, ...others.filter((o) => o.bestValue), ...others.filter((o) => !o.bestValue)].map((o) => {
                const isReco = o.id === reco.id;
                const isPremium = !isReco && !!o.bestValue;
                const isDiscovery = !isReco && !isPremium;
                return (
                  <button
                    key={o.id}
                    onClick={() => { setOpenOther(false); preselect(o.id); }}
                    className={`text-left rounded-2xl border-[3px] p-4 transition active:scale-[0.99] ${
                      isReco
                        ? 'border-rouge bg-rouge-light shadow-[0_4px_18px_rgba(198,40,40,0.18)]'
                        : isPremium
                        ? 'border-or bg-white'
                        : 'border-muted bg-white opacity-90'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wide ${
                        isReco ? 'text-rouge' : isPremium ? 'text-or' : 'text-muted-foreground'
                      }`}>
                        {isReco ? '⭐ La plus choisie' : isPremium ? '👑 Économie maximale' : 'Pour tester'}
                      </span>
                      {o.oldPrice > o.price && (
                        <span className="text-[11px] text-muted-foreground line-through">{formatFCFA(o.oldPrice)}</span>
                      )}
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <div className={`font-extrabold leading-tight ${isDiscovery ? 'text-sm text-foreground/80' : 'text-base'}`}>
                        {o.label}
                      </div>
                      <div className={`font-extrabold whitespace-nowrap ${
                        isReco ? 'text-xl text-rouge' : isPremium ? 'text-xl text-vert' : 'text-base text-muted-foreground'
                      }`}>
                        {formatFCFA(o.price)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{o.description}</div>
                  </button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
