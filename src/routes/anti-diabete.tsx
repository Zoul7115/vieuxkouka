import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';


import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { ANTI_DIABETE } from '@/lib/products';
import heroKouka from '@/assets/kouka-hero-medical.png.asset.json';
import pbNuit from '@/assets/pb-nuit.png.asset.json';
import pbSoif from '@/assets/pb-soif.png.asset.json';
import pbFatigue from '@/assets/pb-fatigue.png.asset.json';
import pbGlucometre from '@/assets/pb-glucometre.png.asset.json';
import pbPieds from '@/assets/pb-pieds.png.asset.json';
import pbPlaie from '@/assets/pb-plaie.png.asset.json';

export const Route = createFileRoute('/anti-diabete')({
  head: () => ({
    meta: [
      { title: ANTI_DIABETE.metaTitle },
      { name: 'description', content: ANTI_DIABETE.metaDesc },
      { property: 'og:title', content: ANTI_DIABETE.metaTitle },
      { property: 'og:description', content: ANTI_DIABETE.metaDesc },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { property: 'og:image', content: ANTI_DIABETE.heroImage },
      { name: 'twitter:image', content: ANTI_DIABETE.heroImage },
    ],
  }),
  component: AntiDiabetePage,
});

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-card min-h-[100svh] flex items-center">
      {/* Formes bleues très discrètes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 h-[38rem] w-[38rem] rounded-full bg-bleu-bg blur-3xl opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-40 h-[32rem] w-[32rem] rounded-full bg-bleu-bg blur-3xl opacity-60"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[55fr_45fr] lg:gap-14">
          {/* Visuel — premier sur mobile */}
          <div className="order-1 lg:order-2 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div
                aria-hidden
                className="absolute inset-x-4 top-6 bottom-6 rounded-[3rem] bg-bleu-light/25 blur-2xl"
              />
              <img
                src={heroKouka.url}
                alt="Le Vieux Kouka présentant le sachet de Poudre anti-diabète"
                width={1129}
                height={1411}
                loading="eager"
                fetchPriority="high"
                className="relative w-full h-auto object-contain drop-shadow-[0_18px_40px_rgba(25,118,210,0.15)]"
              />
            </div>
          </div>

          {/* Texte */}
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-bleu-bg px-4 py-2 text-xs font-bold text-bleu sm:text-sm animate-in fade-in duration-500 fill-mode-both">
              🌿 Traitement traditionnel reconnu depuis plusieurs années
            </span>

            <h1 className="mt-6 text-[2.1rem] leading-[1.08] font-body font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem] animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75 fill-mode-both">
              <span className="text-bleu">Guérir</span> du diabète en un temps
              record avec le traitement traditionnel du{' '}
              <span className="text-bleu">Vieux Kouka</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg animate-in fade-in duration-500 delay-150 fill-mode-both">
              Découvrez comment le traitement traditionnel du Vieux Kouka peut
              vous aider à stabiliser votre glycémie, à éliminer les symptômes du
              diabète et à retrouver une meilleure santé grâce à un traitement
              complet de 40 jours.
            </p>

            <div className="mt-9 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 fill-mode-both">
              <a
                href="#order-section"
                className="inline-flex items-center justify-center rounded-xl bg-rouge px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-rouge/25 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl sm:text-lg"
              >
                Je découvre le traitement
              </a>
            </div>

            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground animate-in fade-in duration-500 delay-500 fill-mode-both">
              {[
                'Paiement à la livraison',
                'Traitement complet de 40 jours',
                'Livraison rapide',
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="text-bleu font-bold">✔</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

type Pb = { img: string; alt: string; title: string; text: string; pos?: string };

const PROBLEMES: Record<string, Pb> = {
  nuit: {
    img: pbNuit.url,
    alt: "Homme assis sur son lit, réveillé plusieurs fois dans la nuit",
    title: 'Vous vous levez souvent la nuit ?',
    text: 'Vous vous réveillez plusieurs fois pour aller aux toilettes.',
    pos: 'object-center',
  },
  soif: {
    img: pbSoif.url,
    alt: "Femme buvant un verre d'eau dans sa cuisine",
    title: 'Vous avez toujours soif ?',
    text: "Vous buvez de l'eau, mais vous avez toujours soif.",
    pos: 'object-top',
  },
  fatigue: {
    img: pbFatigue.url,
    alt: 'Homme fatigué assis sur son canapé',
    title: 'Vous êtes toujours fatigué ?',
    text: 'Même les petites choses vous fatiguent.',
    pos: 'object-top',
  },
  sucre: {
    img: pbGlucometre.url,
    alt: 'Homme regardant le résultat de son glucomètre',
    title: 'Votre taux de sucre ne baisse pas ?',
    text: 'Malgré tous vos efforts, rien ne change.',
    pos: 'object-top',
  },
  pieds: {
    img: pbPieds.url,
    alt: 'Homme tenant son pied douloureux au bord du lit',
    title: 'Vos pieds vous brûlent ou vous font mal ?',
    text: 'La douleur devient de plus en plus difficile à supporter.',
    pos: 'object-center',
  },
  plaie: {
    img: pbPlaie.url,
    alt: 'Petite plaie recouverte d’un pansement sous le pied',
    title: 'Vos blessures mettent du temps à guérir ?',
    text: 'Même une petite blessure met beaucoup de temps à guérir.',
    pos: 'object-center',
  },
};

function PbCard({
  item,
  className = '',
  ratio = 'aspect-[4/5]',
}: {
  item: Pb;
  className?: string;
  ratio?: string;
}) {
  return (
    <figure
      className={`group relative overflow-hidden rounded-3xl bg-bleu-bg shadow-[0_10px_30px_-18px_rgba(15,40,80,0.45)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_-22px_rgba(15,40,80,0.55)] ${ratio} ${className}`}
    >
      <img
        src={item.img}
        alt={item.alt}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover ${item.pos ?? 'object-center'} transition-transform duration-700 ease-out group-hover:scale-[1.04]`}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/85 via-black/45 to-transparent"
      />
      <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
        <h3 className="font-body text-lg font-extrabold leading-snug text-white drop-shadow-sm sm:text-[1.35rem] lg:text-[1.5rem]">
          {item.title}
        </h3>
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-white/90 sm:text-base lg:text-[1.05rem]">
          {item.text}
        </p>
      </figcaption>
    </figure>
  );
}

function ProblemSection() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-white to-bleu-bg/60">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-bleu-bg blur-3xl opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 h-[26rem] w-[26rem] rounded-full bg-bleu-bg blur-3xl opacity-50"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="font-body text-[2rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-[2.5rem] lg:text-[3.2rem]">
            Vous vivez peut-être ces problèmes tous les jours…
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-[1.7] text-muted-foreground sm:text-lg lg:text-xl">
            Le diabète peut vous fatiguer, vous empêcher de bien dormir et vous compliquer la vie.
          </p>
        </header>

        {/* Composition éditoriale */}
        <div className="mt-16 grid gap-6 sm:gap-7 lg:mt-24 lg:grid-cols-3">
          <PbCard
            item={PROBLEMES.nuit}
            className="lg:col-span-2 lg:aspect-auto lg:h-full lg:min-h-[34rem]"
          />
          <div className="grid gap-6 sm:gap-7">
            <PbCard item={PROBLEMES.sucre} ratio="aspect-[4/5] lg:aspect-[4/3]" />
            <PbCard item={PROBLEMES.soif} ratio="aspect-[4/5] lg:aspect-[4/3]" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:gap-7 lg:mt-8 lg:grid-cols-3">
          <PbCard item={PROBLEMES.fatigue} />
          <PbCard item={PROBLEMES.pieds} />
          <PbCard item={PROBLEMES.plaie} />
        </div>

        <p className="mx-auto mt-16 max-w-3xl text-center text-lg font-bold leading-[1.6] text-foreground sm:text-xl lg:mt-24 lg:text-2xl">
          Si vous vivez plusieurs de ces problèmes, il est peut-être temps d’agir.
        </p>
      </div>
    </section>
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

type TimelineStep = {
  label?: string;
  icon: string;
  title: string;
  text: string;
};

const TIMELINE_STEPS: TimelineStep[] = [
  {
    label: 'Au début...',
    icon: '🌙',
    title: 'Vous dormez moins bien.',
    text: 'Vous vous réveillez plusieurs fois dans la nuit.',
  },
  {
    label: 'Avec le temps...',
    icon: '💧',
    title: 'Vous vous fatiguez plus vite.',
    text: 'Même les petites choses deviennent fatigantes.',
  },
  {
    icon: '📈',
    title: 'Votre taux de sucre reste élevé.',
    text: 'Malgré tous vos efforts, il ne baisse pas.',
  },
  {
    icon: '🦶',
    title: 'Les douleurs deviennent plus fortes.',
    text: 'Les pieds brûlent, les picotements augmentent.',
  },
  {
    label: 'Si rien ne change...',
    icon: '⚠️',
    title: 'Votre quotidien devient de plus en plus difficile.',
    text: 'Vous avez de plus en plus de mal à vivre normalement.',
  },
];

function TimelineStepItem({
  step,
  index,
  isLast,
}: {
  step: TimelineStep;
  index: number;
  isLast: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const delayClass =
    index === 0
      ? ''
      : index === 1
        ? 'delay-100'
        : index === 2
          ? 'delay-200'
          : index === 3
            ? 'delay-300'
            : 'delay-400';

  return (
    <div
      ref={ref}
      className={`relative flex gap-5 sm:gap-8 ${isLast ? '' : 'pb-10 sm:pb-14'} ${
        inView ? `animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both ${delayClass}` : 'opacity-0'
      }`}
    >
      {/* Icône dans un cercle bleu */}
      <div className="relative z-10 flex-shrink-0">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bleu text-2xl text-white shadow-[0_8px_24px_-10px_rgba(25,118,210,0.45)] transition-transform duration-300 hover:scale-110 sm:h-16 sm:w-16">
          {step.icon}
        </div>
      </div>

      {/* Contenu texte */}
      <div className="flex-1 pt-1 sm:pt-2">
        {step.label && (
          <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-bleu/70 sm:text-sm">
            {step.label}
          </span>
        )}
        <h3 className="font-body text-lg font-extrabold leading-tight text-foreground sm:text-xl lg:text-[1.4rem]">
          {step.title}
        </h3>
        <p className="mt-1.5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          {step.text}
        </p>
      </div>
    </div>
  );
}

function TimelineSection() {
  const { ref: headerRef, inView: headerInView } = useInView<HTMLDivElement>(0.2);
  const { ref: blockRef, inView: blockInView } = useInView<HTMLDivElement>(0.2);

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-bleu-bg/60 via-white to-white">
      {/* Formes bleues très discrètes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-[26rem] w-[26rem] rounded-full bg-bleu-bg blur-3xl opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-[24rem] w-[24rem] rounded-full bg-bleu-bg blur-3xl opacity-50"
      />

      <div className="relative mx-auto w-full max-w-3xl px-5 py-24 sm:px-8 lg:py-32">
        <div
          ref={headerRef}
          className={`mx-auto max-w-2xl text-center ${
            headerInView
              ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both'
              : 'opacity-0'
          }`}
        >
          <h2 className="font-body text-[2rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-[2.5rem] lg:text-[3rem]">
            Le diabète n&apos;attend pas...
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-[1.7] text-muted-foreground sm:text-lg lg:text-xl">
            Quand on laisse les choses continuer, les problèmes peuvent devenir de plus en plus difficiles à supporter.
          </p>
        </div>

        {/* Ligne du temps */}
        <div className="relative mt-16 sm:mt-20">
          {/* Ligne verticale */}
          <div
            aria-hidden
            className="absolute left-7 top-3 bottom-3 w-0.5 bg-gradient-to-b from-bleu/20 via-bleu/15 to-bleu/20 sm:left-8"
          />

          {TIMELINE_STEPS.map((step, index) => (
            <TimelineStepItem
              key={step.title}
              step={step}
              index={index}
              isLast={index === TIMELINE_STEPS.length - 1}
            />
          ))}
        </div>

        {/* Bloc de transition bleu clair */}
        <div
          ref={blockRef}
          className={`mt-10 rounded-3xl bg-bleu-bg p-7 text-center shadow-[0_12px_40px_-24px_rgba(25,118,210,0.35)] sm:mt-14 sm:p-10 ${
            blockInView
              ? 'animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200 fill-mode-both'
              : 'opacity-0'
          }`}
        >
          <p className="font-body text-lg font-extrabold text-foreground sm:text-xl">
            La bonne nouvelle ?
          </p>
          <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Il n&apos;est peut-être pas trop tard pour agir.
          </p>
          <a
            href="#order-section"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-bleu shadow-sm ring-1 ring-bleu/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-bleu hover:text-white hover:shadow-lg hover:ring-bleu/20 sm:text-base"
          >
            Découvrir la solution
          </a>
        </div>
      </div>
    </section>
  );
}

  return (
    <main className="bg-card font-body">
      <VisitTracker page="anti-diabete" />

      <Hero />

      <ProblemSection />

      <TimelineSection />

      <section id="order-section">
        <ProductForm product={ANTI_DIABETE} />
      </section>
    </main>
  );
}

