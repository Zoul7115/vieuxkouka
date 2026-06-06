import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { Product, Offer } from '@/lib/products';
import { formatFCFA } from '@/lib/products';

function preselect(offerId: number) {
  try { sessionStorage.setItem('preselect_offer_id', String(offerId)); } catch {}
  window.dispatchEvent(new CustomEvent('preselect-offer', { detail: { offerId } }));
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Sticky offer bar (mobile) qui met EN AVANT l'offre recommandée (2+1 OFFERT).
 * Les autres offres restent accessibles via "Voir les autres offres".
 * Générique pour tous les produits — récupère prix/labels depuis `product.offers`.
 */
export function StickyOfferBarRecommended({
  product,
  stock,
  unitLabel = 'unités',
}: {
  product: Product;
  stock: number;
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
  const economy = Math.max(0, reco.oldPrice - reco.price);

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
      className="md:hidden fixed inset-x-0 z-50 bg-white border-t-2 border-rouge shadow-[0_-10px_30px_rgba(0,0,0,0.18)] animate-in slide-in-from-bottom"
      style={{
        bottom: 0,
        paddingBottom: 'max(env(safe-area-inset-bottom), 6px)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <div className="container-kouka pt-2 pb-1.5">
        {/* Bandeau stock */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-rouge mb-1.5 leading-none">
          <span className="w-1.5 h-1.5 rounded-full bg-rouge animate-pulse" />
          Stock limité : {stock} {unitLabel} restant{stock > 1 ? 's' : ''} aujourd'hui
        </div>

        {/* Carte offre recommandée */}
        <div className="relative bg-gradient-to-r from-rouge to-[oklch(0.55_0.20_25)] text-white rounded-xl px-3 py-2 shadow-[0_4px_14px_rgba(198,40,40,0.45)]">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-or text-foreground text-[10px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow leading-none">
            ⭐ OFFRE LA PLUS CHOISIE
          </div>

          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="leading-tight">
              <div className="text-[11px] font-bold uppercase tracking-wide text-white/90">
                {reco.paidUnits}+{reco.bonusUnits} OFFERT{reco.bonusUnits > 1 ? 'S' : ''} · Cure complète
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold">{formatFCFA(reco.price)}</span>
                {reco.oldPrice > reco.price && (
                  <span className="text-[11px] line-through opacity-80">{formatFCFA(reco.oldPrice)}</span>
                )}
              </div>
              {economy > 0 && (
                <div className="text-[10px] font-extrabold text-or leading-none">
                  Économie {formatFCFA(economy)}
                </div>
              )}
            </div>
            <button
              onClick={() => preselect(reco.id)}
              className="shrink-0 bg-white text-rouge font-extrabold text-sm px-4 py-2.5 rounded-lg shadow active:scale-95 transition touch-manipulation"
            >
              COMMANDER
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 mt-1.5 text-[10px] text-white/90 leading-none">
            <span>✔ La plus choisie</span>
            <span>✔ Cure complète</span>
            <span>✔ Évite les ruptures</span>
          </div>
        </div>

        {/* Lien discret : autres offres */}
        <Sheet open={openOther} onOpenChange={setOpenOther}>
          <SheetTrigger asChild>
            <button className="block mx-auto mt-1 text-[11px] underline text-muted-foreground active:text-foreground leading-tight">
              Choisir une autre formule
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
