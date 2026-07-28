import { createFileRoute } from '@tanstack/react-router';

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
    <section className="relative isolate overflow-hidden bg-card">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-bleu-bg blur-3xl opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 h-[26rem] w-[26rem] rounded-full bg-bleu-bg blur-3xl opacity-50"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="font-body text-[1.9rem] font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Le diabète vous fait peut-être vivre tout ça…
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Le diabète ne fait pas seulement monter le taux de sucre. Petit à
            petit, il peut rendre les choses simples beaucoup plus difficiles.
          </p>
        </header>

        {/* Composition éditoriale */}
        <div className="mt-14 grid gap-5 sm:gap-6 lg:mt-20 lg:grid-cols-3">
          <PbCard
            item={PROBLEMES.nuit}
            className="lg:col-span-2 lg:aspect-auto lg:h-full lg:min-h-[34rem]"
          />
          <div className="grid gap-5 sm:gap-6">
            <PbCard item={PROBLEMES.sucre} ratio="aspect-[4/5] lg:aspect-[4/3]" />
            <PbCard item={PROBLEMES.soif} ratio="aspect-[4/5] lg:aspect-[4/3]" />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:gap-6 lg:mt-6 lg:grid-cols-3">
          <PbCard item={PROBLEMES.fatigue} />
          <PbCard item={PROBLEMES.pieds} />
          <PbCard item={PROBLEMES.plaie} />
        </div>

        <p className="mx-auto mt-14 max-w-3xl text-center text-lg font-bold leading-relaxed text-foreground sm:text-xl lg:mt-20 lg:text-2xl">
          Si vous vivez plusieurs de ces problèmes, il ne faut pas attendre que
          la situation <span className="text-bleu">s’aggrave</span>.
        </p>
      </div>
    </section>
  );
}

export function AntiDiabetePage() {
  return (
    <main className="bg-card font-body">
      <VisitTracker page="anti-diabete" />

      <Hero />

      <ProblemSection />


      <section id="order-section">
        <ProductForm product={ANTI_DIABETE} />
      </section>
    </main>
  );
}
