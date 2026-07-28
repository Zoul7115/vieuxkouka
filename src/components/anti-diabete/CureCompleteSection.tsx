import { useRef, useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function selectOffer(offerId: number) {
  try {
    sessionStorage.setItem('preselect_offer_id', String(offerId));
  } catch {
    /* noop */
  }
  window.dispatchEvent(new CustomEvent('preselect-offer', { detail: { offerId } }));
  document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const RAISONS = [
  {
    icon: '📦',
    title: 'Évitez une rupture du traitement',
    text:
      "Si votre poudre finit avant la fin de la cure, vous devrez attendre une nouvelle livraison. Pendant ce temps, votre traitement sera interrompu.",
  },
  {
    icon: '📅',
    title: 'Suivez votre cure jusqu’au bout',
    text:
      "Avec la cure complète, vous avez tout ce qu’il faut pour suivre votre traitement pendant les 40 jours sans interruption.",
  },
  {
    icon: '⭐',
    title: 'L’offre la plus choisie',
    text:
      "La majorité de nos clients choisissent directement la formule 2 sachets achetés + 1 sachet offert. Elle permet de suivre la cure complète tout en faisant des économies.",
  },
];

export function CureCompleteSection() {
  const { ref: headerRef, inView: headerIn } = useInView<HTMLDivElement>(0.2);
  const { ref: cardsRef, inView: cardsIn } = useInView<HTMLDivElement>(0.1);
  const { ref: adviceRef, inView: adviceIn } = useInView<HTMLDivElement>(0.2);
  const { ref: offersHeadRef, inView: offersHeadIn } = useInView<HTMLDivElement>(0.2);
  const { ref: offersRef, inView: offersIn } = useInView<HTMLDivElement>(0.1);

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-bleu-bg/60 via-white to-bleu-bg/40">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-8rem] h-[26rem] w-[26rem] rounded-full bg-bleu-bg blur-3xl opacity-60"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        {/* En-tête */}
        <div
          ref={headerRef}
          className={cn(
            'mx-auto max-w-3xl text-center',
            headerIn ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both' : 'opacity-0'
          )}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-bleu shadow-sm ring-1 ring-bleu/10">
            💡 Bon à savoir
          </span>
          <h2 className="mt-6 font-body text-[2rem] font-extrabold leading-[1.15] text-foreground sm:text-[2.6rem] lg:text-[3rem]">
            Pourquoi nous recommandons la cure complète ?
          </h2>
          <p className="mt-6 text-lg leading-[1.8] text-muted-foreground sm:text-xl">
            Beaucoup de personnes pensent qu’un seul sachet suffit. Mais pour suivre correctement la cure de 40 jours,
            nous recommandons généralement la formule complète.
          </p>
        </div>

        {/* 3 cartes */}
        <div ref={cardsRef} className="mt-14 grid gap-6 sm:mt-16 md:grid-cols-3 lg:mt-20 lg:gap-8">
          {RAISONS.map((r, i) => (
            <div
              key={r.title}
              className={cn(
                'rounded-[1.75rem] bg-white p-8 shadow-[0_18px_50px_-30px_rgba(15,40,80,0.45)] ring-1 ring-bleu/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_-30px_rgba(15,40,80,0.5)]',
                cardsIn ? 'animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both' : 'opacity-0'
              )}
              style={cardsIn ? { animationDelay: `${i * 120}ms` } : undefined}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bleu-bg text-2xl">{r.icon}</div>
              <h3 className="mt-6 font-body text-xl font-extrabold leading-snug text-foreground">{r.title}</h3>
              <p className="mt-3 text-base leading-[1.8] text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>

        {/* Bloc conseil */}
        <div
          ref={adviceRef}
          className={cn(
            'mt-14 rounded-[2.25rem] bg-bleu-bg/80 p-8 ring-1 ring-bleu/10 sm:mt-16 sm:p-12 lg:p-14',
            adviceIn ? 'animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both' : 'opacity-0'
          )}
        >
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
              💡
            </div>
            <div>
              <h3 className="font-body text-2xl font-extrabold text-foreground">Notre conseil</h3>
              <p className="mt-4 text-lg leading-[1.85] text-muted-foreground">
                Si votre budget le permet, choisissez directement la formule{' '}
                <strong className="text-foreground">2 sachets achetés + 1 sachet offert</strong>. Vous évitez une rupture
                du traitement, vous suivez votre cure jusqu’au bout et vous profitez d’une meilleure offre.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-lg font-semibold text-foreground sm:text-xl">
          Choisissez maintenant l’offre qui vous convient le mieux.
        </p>

        {/* ── Offres ── */}
        <div
          ref={offersHeadRef}
          className={cn(
            'mx-auto mt-20 max-w-2xl text-center sm:mt-24',
            offersHeadIn ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both' : 'opacity-0'
          )}
        >
          <h3 className="font-body text-[1.8rem] font-extrabold leading-tight text-foreground sm:text-[2.3rem]">
            Nos formules
          </h3>
          <p className="mt-4 text-base leading-[1.8] text-muted-foreground sm:text-lg">
            Trois formules simples. Paiement à la livraison dans tous les cas.
          </p>
        </div>

        <div
          ref={offersRef}
          className="mt-12 grid gap-6 md:grid-cols-3 md:items-center lg:gap-7"
        >
          {/* Offre 1 */}
          <div
            className={cn(
              'order-2 flex h-full flex-col rounded-[1.75rem] bg-white p-7 shadow-[0_16px_44px_-30px_rgba(15,40,80,0.45)] ring-1 ring-border transition-all duration-300 hover:-translate-y-1 md:order-1',
              offersIn ? 'animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both' : 'opacity-0'
            )}
          >
            <span className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">
              Idéal pour découvrir le traitement
            </span>
            <h4 className="mt-5 font-body text-xl font-extrabold text-foreground">Offre Découverte</h4>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">1 sachet</p>
            <p className="mt-4 font-body text-3xl font-extrabold text-foreground">12 500 FCFA</p>
            <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
              {['Pour découvrir le traitement', 'Petit budget', 'Quantité limitée'].map((a) => (
                <li key={a} className="flex items-start gap-2.5">
                  <span className="text-bleu">✔</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => selectOffer(21)}
              className="mt-auto pt-8 w-full rounded-xl bg-white px-6 py-4 text-base font-bold text-foreground ring-1 ring-border transition-all duration-300 hover:-translate-y-0.5 hover:bg-bleu-bg"
            >
              Choisir cette offre
            </button>
          </div>

          {/* Offre 2 — recommandée */}
          <div
            className={cn(
              'relative order-1 flex h-full flex-col rounded-[2rem] bg-white p-8 shadow-[0_28px_70px_-30px_rgba(198,40,40,0.45)] ring-[3px] ring-rouge transition-all duration-300 hover:-translate-y-1 md:order-2 md:scale-[1.05]',
              offersIn ? 'animate-in fade-in zoom-in-95 duration-700 delay-100 fill-mode-both' : 'opacity-0'
            )}
          >
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-rouge px-4 py-1.5 text-xs font-extrabold text-primary-foreground shadow-lg shadow-rouge/30 animate-pulse">
              ⭐ OFFRE LA PLUS CHOISIE
            </span>
            <h4 className="mt-4 font-body text-2xl font-extrabold text-foreground">Cure Complète</h4>
            <p className="mt-1 text-sm font-semibold text-rouge">2 sachets achetés + 1 sachet offert</p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-body text-4xl font-extrabold text-foreground">25 000 FCFA</span>
              <span className="text-base text-muted-foreground line-through">37 500</span>
            </div>
            <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-foreground">
              {[
                'Cure complète de 40 jours',
                'Aucun risque de rupture du traitement',
                '1 sachet offert',
                'Meilleur rapport qualité-prix',
                'Recommandée par le Vieux Kouka',
              ].map((a) => (
                <li key={a} className="flex items-start gap-2.5">
                  <span className="text-rouge">✔</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl bg-bleu-bg px-4 py-3 text-center text-[13px] font-bold leading-relaxed text-bleu">
              🛡️ Cure complète • Pas de rupture de traitement • Paiement à la livraison
            </div>
            <button
              type="button"
              onClick={() => selectOffer(22)}
              className="mt-7 w-full rounded-xl bg-rouge px-6 py-4 text-base font-extrabold text-primary-foreground shadow-lg shadow-rouge/25 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl sm:text-lg"
            >
              Je choisis cette offre
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              La majorité de nos clients choisissent cette formule.
            </p>
          </div>

          {/* Offre 3 */}
          <div
            className={cn(
              'relative order-3 flex h-full flex-col rounded-[1.75rem] bg-white p-7 shadow-[0_16px_44px_-30px_rgba(15,40,80,0.45)] ring-1 ring-bleu/25 transition-all duration-300 hover:-translate-y-1',
              offersIn ? 'animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200 fill-mode-both' : 'opacity-0'
            )}
          >
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-bleu px-4 py-1.5 text-xs font-extrabold text-white shadow-md">
              💎 ÉCONOMIE MAXIMALE
            </span>
            <h4 className="mt-4 font-body text-xl font-extrabold text-foreground">Cure Longue Durée</h4>
            <p className="mt-1 text-sm font-semibold text-bleu">3 sachets achetés + 2 sachets offerts</p>
            <p className="mt-4 font-body text-3xl font-extrabold text-foreground">38 000 FCFA</p>
            <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
              {[
                '2 sachets offerts',
                'Stock longue durée',
                'Économie maximale',
                'Idéal pour éviter plusieurs commandes',
                'Parfait pour ceux qui veulent avoir toujours du stock',
              ].map((a) => (
                <li key={a} className="flex items-start gap-2.5">
                  <span className="text-bleu">✔</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => selectOffer(23)}
              className="mt-auto pt-8 w-full rounded-xl bg-bleu px-6 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
            >
              Choisir cette formule
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
