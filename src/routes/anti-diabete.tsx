import { createFileRoute } from '@tanstack/react-router';

import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { ANTI_DIABETE } from '@/lib/products';
import heroKouka from '@/assets/kouka-hero-medical.png.asset.json';

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
    <section className="relative isolate overflow-hidden bg-background min-h-[100svh] flex items-center">
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

            <h1 className="mt-6 text-[2.1rem] leading-[1.08] font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem] animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75 fill-mode-both">
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

export function AntiDiabetePage() {
  return (
    <main className="bg-background">
      <VisitTracker page="anti-diabete" />

      <Hero />

      <section id="order-section">
        <ProductForm product={ANTI_DIABETE} />
      </section>
    </main>
  );
}
