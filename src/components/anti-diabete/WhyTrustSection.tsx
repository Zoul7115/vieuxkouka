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

const TRUST_CARDS = [
  {
    icon: '🌿',
    title: '100 % naturel',
    text: 'Des racines, des écorces et d’autres ingrédients choisis avec soin.',
  },
  {
    icon: '👴',
    title: 'Plus de 30 ans d’expérience',
    text: 'Le Vieux Kouka prépare des traitements traditionnels depuis de nombreuses années.',
  },
  {
    icon: '💚',
    title: 'Une cure complète',
    text: 'La formule 2 + 1 permet de suivre les 40 jours de traitement sans interruption.',
  },
  {
    icon: '🌙',
    title: 'Pour retrouver un meilleur quotidien',
    text: 'Beaucoup de personnes prennent cette poudre pour mieux dormir, avoir moins soif et retrouver plus d’énergie.',
  },
  {
    icon: '📲',
    title: 'On reste avec vous',
    text: 'Si vous avez une question pendant le traitement, notre équipe est disponible sur WhatsApp.',
  },
  {
    icon: '🚚',
    title: 'Paiement à la livraison',
    text: 'Vous recevez votre colis avant de payer. Aucun paiement à l’avance.',
  },
];

const BADGES = [
  { icon: '🌙', text: 'Dormir toute la nuit sans se lever plusieurs fois' },
  { icon: '💧', text: 'Boire normalement sans avoir toujours soif' },
  { icon: '🚶', text: 'Retrouver plus d’énergie pendant la journée' },
  { icon: '🚽', text: 'Aller moins souvent aux toilettes' },
  { icon: '🦶', text: 'Marcher plus facilement, sans cette gêne dans les pieds' },
  { icon: '📉', text: 'Retrouver une glycémie plus stable' },
  { icon: '😊', text: 'Retrouver le plaisir de vivre plus sereinement' },
];


export function WhyTrustSection() {
  const { ref: headerRef, inView: headerIn } = useInView<HTMLDivElement>(0.2);
  const { ref: cardsRef, inView: cardsIn } = useInView<HTMLDivElement>(0.1);
  const { ref: badgesRef, inView: badgesIn } = useInView<HTMLDivElement>(0.2);
  const { ref: finalRef, inView: finalIn } = useInView<HTMLDivElement>(0.2);

  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-bleu-bg blur-3xl opacity-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 h-[26rem] w-[26rem] rounded-full bg-bleu-bg blur-3xl opacity-50"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        {/* En-tête */}
        <div
          ref={headerRef}
          className={cn(
            'mx-auto max-w-3xl text-center',
            headerIn ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both' : 'opacity-0'
          )}
        >
          <h2 className="font-body text-[2rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-[2.6rem] lg:text-[3.2rem]">
            Pourquoi autant de familles font confiance au Vieux Kouka ?
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-[1.8] text-muted-foreground sm:text-xl">
            Ce n&apos;est pas seulement une poudre. C&apos;est un traitement traditionnel préparé avec soin par le Vieux Kouka depuis de nombreuses années.
          </p>
        </div>

        {/* 6 cartes */}
        <div
          ref={cardsRef}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-7"
        >
          {TRUST_CARDS.map((card, i) => (
            <div
              key={card.title}
              className={cn(
                'rounded-[1.75rem] bg-white p-8 shadow-[0_18px_50px_-30px_rgba(15,40,80,0.45)] ring-1 ring-bleu/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_-30px_rgba(15,40,80,0.5)]',
                cardsIn ? 'animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both' : 'opacity-0'
              )}
              style={cardsIn ? { animationDelay: `${i * 120}ms` } : undefined}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bleu-bg text-2xl">
                {card.icon}
              </div>
              <h3 className="mt-6 font-body text-xl font-extrabold leading-snug text-foreground sm:text-[1.35rem]">
                {card.title}
              </h3>
              <p className="mt-3 text-base leading-[1.8] text-muted-foreground sm:text-lg">
                {card.text}
              </p>
            </div>
          ))}
        </div>

        {/* Bloc badges */}
        <div
          ref={badgesRef}
          className={cn(
            'mt-16 rounded-[2rem] bg-bleu-bg/80 p-8 ring-1 ring-bleu/10 sm:mt-20 sm:p-12 lg:p-16',
            badgesIn ? 'animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both' : 'opacity-0'
          )}
        >
          <h3 className="text-center font-body text-xl font-extrabold leading-snug text-foreground sm:text-2xl lg:text-[1.75rem]">
            Beaucoup de personnes prennent cette cure pour retrouver petit à petit :
          </h3>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
            {BADGES.map((badge, i) => (
              <div
                key={badge.text}
                className={cn(
                  'group flex items-center gap-4 rounded-[1.25rem] bg-white px-5 py-5 shadow-[0_10px_30px_-14px_rgba(15,40,80,0.25)] ring-1 ring-bleu/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-20px_rgba(25,118,210,0.35)] sm:px-6 sm:py-6',
                  badgesIn ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both' : 'opacity-0'
                )}
                style={badgesIn ? { animationDelay: `${i * 100}ms` } : undefined}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bleu-bg text-[1.35rem] shadow-sm transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12 sm:text-[1.5rem]">
                  {badge.icon}
                </span>
                <span className="text-base font-bold leading-snug text-foreground sm:text-lg">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>


        {/* Bloc final bleu clair */}
        <div
          ref={finalRef}
          className={cn(
            'mt-16 rounded-[2rem] bg-bleu-bg p-9 ring-1 ring-bleu/10 sm:mt-20 sm:p-14',
            finalIn ? 'animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both' : 'opacity-0'
          )}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
              💡
            </div>
            <div>
              <h3 className="font-body text-2xl font-extrabold text-foreground sm:text-[1.75rem]">
                Pourquoi le Vieux Kouka insiste sur la cure complète ?
              </h3>
              <p className="mt-4 text-lg leading-[1.85] text-muted-foreground sm:text-xl">
                Quand on commence un traitement, le plus important est d&apos;aller jusqu&apos;au bout. C&apos;est pour cette raison que le Vieux Kouka recommande la formule complète de 3 sachets. Elle permet de suivre les 40 jours de traitement sans risquer de manquer de poudre en cours de route.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
