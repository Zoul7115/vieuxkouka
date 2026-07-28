import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';


import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { FAQSection } from '@/components/anti-diabete/FAQSection';
import { CureCompleteSection } from '@/components/anti-diabete/CureCompleteSection';
import { TemoignagesSection } from '@/components/anti-diabete/TemoignagesSection';
import { WhyTrustSection } from '@/components/anti-diabete/WhyTrustSection';
import { StickyOrderBar } from '@/components/anti-diabete/StickyOrderBar';

import { ANTI_DIABETE } from '@/lib/products';
import heroKouka from '@/assets/kouka-hero-medical.png.asset.json';
import pbNuit from '@/assets/pb-nuit.png.asset.json';
import pbSoif from '@/assets/pb-soif.png.asset.json';
import pbFatigue from '@/assets/pb-fatigue.png.asset.json';
import pbGlucometre from '@/assets/pb-glucometre.png.asset.json';
import pbPieds from '@/assets/pb-pieds.png.asset.json';
import pbPlaie from '@/assets/pb-plaie.png.asset.json';
import portraitKouka from '@/assets/vieux-kouka-portrait-premium.png.asset.json';
import sachetPremium from '@/assets/sachet-anti-diabete-premium.png.asset.json';

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

            <h1 className="mt-6 text-[2.1rem] leading-[1.18] sm:leading-[1.2] font-body font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem] animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75 fill-mode-both">
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

      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="font-body text-[2rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-[2.5rem] lg:text-[3.2rem]">
            Vous vivez peut-être ces problèmes tous les jours…
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-[1.7] text-muted-foreground sm:text-lg lg:text-xl">
            Le diabète peut vous fatiguer, vous empêcher de bien dormir et vous compliquer la vie.
          </p>
        </header>

        {/* Composition éditoriale */}
        <div className="mt-12 grid gap-6 sm:gap-7 lg:mt-16 lg:grid-cols-3">
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

        <p className="mx-auto mt-12 max-w-3xl text-center text-lg font-bold leading-[1.6] text-foreground sm:text-xl lg:mt-16 lg:text-2xl">
          Si vous vivez plusieurs de ces problèmes, il est peut-être temps d’agir.
        </p>
      </div>
    </section>
  );
}

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
      { threshold, rootMargin: '0px 0px 180px 0px' }
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
        ? 'delay-150'
        : index === 2
          ? 'delay-300'
          : index === 3
            ? 'delay-500'
            : 'delay-700';

  // Progression visuelle très discrète : les cercles gagnent en intensité
  const intensity = [
    'bg-bleu/85 ring-bleu/10',
    'bg-bleu/90 ring-bleu/15',
    'bg-bleu ring-bleu/20',
    'bg-bleu ring-bleu/25',
    'bg-bleu ring-bleu/35',
  ][index] ?? 'bg-bleu ring-bleu/20';

  return (
    <div
      ref={ref}
      className={`relative flex gap-6 sm:gap-9 ${isLast ? '' : 'pb-14 sm:pb-20'} ${
        inView ? `animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both ${delayClass}` : 'opacity-0'
      }`}
    >
      {/* Icône dans un cercle bleu */}
      <div className="relative z-10 flex-shrink-0">
        <div
          className={`flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full text-3xl text-white shadow-[0_10px_30px_-10px_rgba(25,118,210,0.5)] ring-4 transition-transform duration-300 hover:scale-110 sm:h-[5.25rem] sm:w-[5.25rem] sm:text-[2.1rem] ${intensity}`}
        >
          {step.icon}
        </div>
      </div>

      {/* Contenu texte */}
      <div className="min-w-0 flex-1 pt-2 sm:pt-4">
        {step.label && (
          <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-bleu/70 sm:text-base">
            {step.label}
          </span>
        )}
        <h3 className="font-body text-xl font-extrabold leading-snug text-foreground sm:text-2xl lg:text-[1.7rem]">
          {step.title}
        </h3>
        <p className="mt-2.5 max-w-lg text-lg leading-[1.75] text-muted-foreground sm:text-xl">
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

      <div className="relative mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
        <div
          ref={headerRef}
          className={`mx-auto max-w-3xl text-center ${
            headerInView
              ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both'
              : 'opacity-0'
          }`}
        >
          <h2 className="font-body text-[2.4rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-[3rem] lg:text-[3.6rem]">
            Le diabète n&apos;attend pas...
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-[1.75] text-muted-foreground sm:text-xl lg:text-[1.4rem]">
            Quand on laisse les choses continuer, les problèmes peuvent devenir de plus en plus difficiles à supporter.
          </p>
        </div>

        {/* Ligne du temps */}
        <div className="relative mt-12 sm:mt-14">
          {/* Ligne verticale */}
          <div
            aria-hidden
            className="absolute left-[2.15rem] top-4 bottom-4 w-1 rounded-full bg-gradient-to-b from-bleu/15 via-bleu/30 to-bleu/60 sm:left-[2.5rem]"
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
          className={`mt-12 rounded-[2rem] bg-bleu-bg p-9 text-center shadow-[0_24px_60px_-28px_rgba(25,118,210,0.5)] ring-1 ring-bleu/10 sm:mt-14 sm:p-14 ${
            blockInView
              ? 'animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200 fill-mode-both'
              : 'opacity-0'
          }`}
        >
          <p className="font-body text-2xl font-extrabold text-foreground sm:text-[2rem]">
            La bonne nouvelle ?
          </p>
          <p className="mx-auto mt-3 max-w-lg text-lg leading-[1.7] text-muted-foreground sm:text-xl">
            Il n&apos;est peut-être pas trop tard pour agir.
          </p>
          <a
            href="#order-section"
            className="mt-9 inline-flex items-center justify-center rounded-xl bg-rouge px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-rouge/25 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl sm:text-lg"
          >
            Découvrir la solution
          </a>
        </div>
      </div>
    </section>
  );
}


const KOUKA_CARDS: { icon: string; title: string; lines: string[] }[] = [
  { icon: '📍', title: 'Origine', lines: ['Région des Kuilsés', 'Burkina Faso'] },
  { icon: '🌿', title: 'Ingrédients', lines: ['Burkina Faso', 'Côte d’Ivoire', 'Bénin'] },
  { icon: '⏳', title: 'Expérience', lines: ['Plus de 30 ans de savoir-faire'] },
];



const TRAITEMENT_POINTS = [
  '3 sachets pour une cure de 40 jours',
  "Conseils d'utilisation",
  'Utilisation simple à la maison',
  'Accompagnement si besoin',
];

const CONFIANCE_CARDS = [
  { icon: '🌿', title: 'Préparé avec soin', text: 'Chaque traitement est préparé avec attention.' },
  { icon: '🏺', title: 'Traitement traditionnel', text: 'Un savoir transmis depuis de nombreuses années.' },
  { icon: '💵', title: 'Paiement à la livraison', text: 'Vous payez uniquement lorsque vous recevez votre commande.' },
  { icon: '🚚', title: 'Livraison rapide', text: 'Votre commande est expédiée rapidement.' },
];

function CheckItem({ text, index, show }: { text: string; index: number; show: boolean }) {
  return (
    <li
      className={`flex items-start gap-3.5 ${
        show ? 'animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both' : 'opacity-0'
      }`}
      style={show ? { animationDelay: `${200 + index * 120}ms` } : undefined}
    >
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bleu-bg text-sm font-bold text-bleu">
        ✔
      </span>
      <span className="text-lg leading-[1.7] text-foreground sm:text-xl">{text}</span>
    </li>
  );
}

function SolutionSection() {
  const { ref: headerRef, inView: headerIn } = useInView<HTMLDivElement>(0.2);
  const { ref: b1Ref, inView: b1In } = useInView<HTMLDivElement>(0.15);
  const { ref: b2Ref, inView: b2In } = useInView<HTMLDivElement>(0.15);
  const { ref: b3Ref, inView: b3In } = useInView<HTMLDivElement>(0.1);
  const { ref: trRef, inView: trIn } = useInView<HTMLDivElement>(0.3);

  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-10rem] h-[28rem] w-[28rem] rounded-full bg-bleu-bg blur-3xl opacity-50"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        {/* En-tête */}
        <div
          ref={headerRef}
          className={`mx-auto max-w-3xl text-center ${
            headerIn ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both' : 'opacity-0'
          }`}
        >
          <h2 className="font-body text-[2.1rem] font-extrabold leading-[1.14] tracking-tight text-foreground sm:text-[2.8rem] lg:text-[3.2rem]">
            Vous n&apos;êtes pas obligé de vivre comme ça.
            <br className="hidden sm:block" />{' '}
            <span className="text-bleu">Découvrez la Poudre Anti-Diabète du Vieux Kouka.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-[1.8] text-muted-foreground sm:text-xl">
            Depuis plusieurs années, le Vieux Kouka accompagne des personnes vivant avec le diabète grâce à son
            traitement traditionnel de 40 jours.
          </p>
        </div>

        {/* BLOC 1 — Le Vieux Kouka */}
        <div ref={b1Ref} className="mt-14 grid items-start gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-16">
          <div
            className={
              b1In ? 'animate-in fade-in slide-in-from-left-6 duration-700 fill-mode-both' : 'opacity-0'
            }
          >
            <div className="overflow-hidden rounded-[2rem] bg-bleu-bg shadow-[0_30px_70px_-35px_rgba(25,118,210,0.55)] ring-1 ring-bleu/10">
              <img
                src={portraitKouka.url}
                alt="Le Vieux Kouka, préparateur du traitement traditionnel anti-diabète"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div
            className={
              b1In
                ? 'animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 fill-mode-both'
                : 'opacity-0'
            }
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-bleu-bg px-4 py-2 text-sm font-bold text-bleu sm:text-base">
              Plus de 30 ans d&apos;expérience
            </span>
            <h3 className="mt-6 font-body text-[1.9rem] font-extrabold leading-[1.15] text-foreground sm:text-[2.3rem]">
              L&apos;histoire du Vieux Kouka
            </h3>
            <p className="mt-8 text-lg leading-[1.9] text-muted-foreground sm:text-xl">
              Le Vieux Kouka est originaire de la région des Kuilsés, au Burkina Faso. Depuis de nombreuses années,
              il prépare des traitements traditionnels grâce au savoir qu&apos;il a appris au fil du temps. Pour
              préparer sa poudre anti-diabète, il choisit avec soin des racines, des écorces et d&apos;autres
              ingrédients venant du Burkina Faso, de la Côte d&apos;Ivoire et du Bénin. Chaque préparation est
              réalisée avec beaucoup d&apos;attention afin d&apos;offrir un traitement traditionnel de qualité.
            </p>

            {/* Citation */}
            <figure
              className={`mt-10 rounded-[1.5rem] border border-bleu/15 bg-bleu-bg/50 px-7 py-7 ${
                b1In
                  ? 'animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300 fill-mode-both'
                  : 'opacity-0'
              }`}
            >
              <blockquote className="text-lg italic leading-[1.8] text-foreground sm:text-xl">
                «&nbsp;Chaque traitement est préparé avec le même soin, parce que chaque personne mérite toute mon
                attention.&nbsp;»
              </blockquote>
              <figcaption className="mt-4 text-base font-bold text-bleu">— Vieux Kouka</figcaption>
            </figure>

            {/* 3 cartes premium */}
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {KOUKA_CARDS.map((c, i) => (
                <div
                  key={c.title}
                  className={`rounded-[1.5rem] bg-white p-6 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] ring-1 ring-bleu/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_55px_-28px_rgba(25,118,210,0.45)] ${
                    b1In ? 'animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both' : 'opacity-0'
                  }`}
                  style={b1In ? { animationDelay: `${450 + i * 150}ms` } : undefined}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bleu-bg text-xl">
                    {c.icon}
                  </div>
                  <h4 className="mt-4 font-body text-lg font-extrabold text-foreground">{c.title}</h4>
                  <div className="mt-2 space-y-1">
                    {c.lines.map((l) => (
                      <p key={l} className="text-base leading-[1.6] text-muted-foreground">
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* BLOC 2 — Le traitement */}
        <div ref={b2Ref} className="mt-14 grid items-center gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-16">
          <div
            className={`${
              b2In ? 'animate-in fade-in slide-in-from-left-6 duration-700 fill-mode-both' : 'opacity-0'
            }`}
          >
            <div className="overflow-hidden rounded-[2rem] bg-bleu-bg shadow-[0_30px_70px_-35px_rgba(25,118,210,0.55)] ring-1 ring-bleu/10">
              <img
                src={sachetPremium.url}
                alt="Sachet de Poudre Anti-Diabète du Vieux Kouka"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div
            className={`lg:order-first ${
              b2In
                ? 'animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 fill-mode-both'
                : 'opacity-0'
            }`}
          >
            <h3 className="font-body text-[1.9rem] font-extrabold leading-[1.15] text-foreground sm:text-[2.3rem]">
              Ce que vous recevez
            </h3>
            <ul className="mt-8 space-y-4">
              {TRAITEMENT_POINTS.map((p, i) => (
                <CheckItem key={p} text={p} index={i} show={b2In} />
              ))}
            </ul>
            <span className="mt-9 inline-flex items-center gap-2 rounded-full bg-rouge/10 px-5 py-2.5 text-base font-bold text-rouge">
              Traitement complet de 40 jours
            </span>
          </div>
        </div>

        {/* BLOC 3 — Confiance */}
        <div ref={b3Ref} className="mt-14 lg:mt-16">
          <h3
            className={`mx-auto max-w-3xl text-center font-body text-[1.9rem] font-extrabold leading-[1.2] text-foreground sm:text-[2.4rem] ${
              b3In ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both' : 'opacity-0'
            }`}
          >
            Pourquoi tant de personnes lui font confiance ?
          </h3>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
            {CONFIANCE_CARDS.map((card, i) => (
              <div
                key={card.title}
                className={`group rounded-[1.75rem] bg-white p-8 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] ring-1 ring-bleu/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-28px_rgba(25,118,210,0.45)] ${
                  b3In ? 'animate-in fade-in duration-700 fill-mode-both' : 'opacity-0'
                }`}
                style={b3In ? { animationDelay: `${150 + i * 130}ms` } : undefined}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bleu-bg text-2xl">
                  {card.icon}
                </div>
                <h4 className="mt-6 font-body text-xl font-extrabold leading-snug text-foreground sm:text-[1.35rem]">
                  {card.title}
                </h4>
                <p className="mt-3 text-base leading-[1.75] text-muted-foreground sm:text-lg">{card.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transition vers les témoignages */}
        <div
          ref={trRef}
          className={`mx-auto mt-14 max-w-2xl text-center lg:mt-16 ${
            trIn ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both' : 'opacity-0'
          }`}
        >
          <p className="text-xl font-bold leading-[1.6] text-foreground sm:text-2xl">
            Mais le mieux, c&apos;est encore d&apos;écouter ceux qui l&apos;ont déjà essayé.
          </p>
          <p className="mt-4 text-lg leading-[1.75] text-muted-foreground sm:text-xl">
            Voici ce que racontent les personnes qui ont suivi la cure.
          </p>
        </div>
      </div>
    </section>
  );
}


export function AntiDiabetePage() {
  return (
    <main className="bg-card font-body pb-28 sm:pb-32">

      <VisitTracker page="anti-diabete" />

      <Hero />

      <ProblemSection />

      <TimelineSection />

      <SolutionSection />

      <WhyTrustSection />

      <TemoignagesSection />


      <FAQSection />

      <CureCompleteSection />

      <section id="order-section">
        <ProductForm product={ANTI_DIABETE} />
      </section>

      <StickyOrderBar />
    </main>
  );
}


