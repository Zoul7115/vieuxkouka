import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { FAQ } from '@/components/FAQ';
import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { SIROP_KOUKA } from '@/lib/products';

export const Route = createFileRoute('/product/$slug')({
  beforeLoad: ({ params }) => {
    if (params.slug !== 'sirop-kouka') throw redirect({ to: '/' });
  },
  head: () => ({
    meta: [
      { title: SIROP_KOUKA.metaTitle },
      { name: 'description', content: SIROP_KOUKA.metaDesc },
      { property: 'og:title', content: SIROP_KOUKA.metaTitle },
      { property: 'og:description', content: SIROP_KOUKA.metaDesc },
      { property: 'og:image', content: SIROP_KOUKA.heroImage },
    ],
  }),
  component: SiropPage,
});

function SiropPage() {
  const product = SIROP_KOUKA;

  return (
    <div className="bg-background">
      <VisitTracker page="sirop-kouka" />

      <div className="bg-vert text-white text-center py-3 px-4 text-sm font-bold sticky top-0 z-40">
        🍯 Résultats dès les premiers jours · Livraison gratuite Ouaga · Paiement à la réception
      </div>

      <section className="bg-gradient-to-b from-vert-bg to-background py-12 border-b-2 border-vert-bg">
        <div className="container-kouka text-center">
          <span className="inline-block bg-rouge text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full mb-4">
            Vitalité · Désir · Endurance
          </span>
          <h1 className="text-vert mb-4">
            Tu souffres en silence…<br />
            <em className="text-rouge not-italic">mais la solution existe.</em>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6 text-lg leading-relaxed">
            Éjaculation précoce, érection molle, manque d’envie, faible libido féminine :
            <strong> le Sirop du Vieux KOUKA aide à retrouver force, confiance et performances.</strong>
          </p>
          <div className="max-w-[300px] mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-vert-bg shadow-[0_8px_32px_rgba(46,125,50,0.25)]">
            <img src={product.heroImage} alt={product.name} className="w-full block" />
          </div>
          <button
            onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full bg-rouge text-white py-4 rounded-xl text-lg font-extrabold shadow-[0_6px_20px_rgba(198,40,40,0.35)]"
          >
            🍯 COMMANDER LE SIROP KOUKA
          </button>
        </div>
      </section>

      <section className="sec bg-cream-2">
        <div className="container-kouka">
          <h2 className="text-center mb-6">🚨 Tu te reconnais ici ?</h2>
          <div className="grid gap-4">
            {[
              'Tu veux durer plus longtemps sans éjaculer trop vite',
              'L’érection est molle ou absente au moment où il faut assurer',
              'La libido a chuté et le désir n’est plus au rendez-vous',
              'Tu veux retrouver confiance, puissance et endurance naturelle',
            ].map((item) => (
              <div key={item} className="bloc bloc-r">
                <p className="font-bold text-muted-2">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec bg-vert-bg">
        <div className="container-kouka">
          <h2 className="text-center mb-3">🌿 La solution : Sirop du Vieux KOUKA</h2>
          <p className="text-center text-muted-foreground mb-6">
            Préparation traditionnelle africaine pour redonner vitalité, désir et résistance dès les 2 premiers jours.
          </p>
          <div className="grid gap-4">
            <img src="/images/kouka-solution.png" alt="La solution existe — Sirop du Vieux KOUKA" className="rounded-2xl border-2 border-vert-bg" />
            <img src="/images/kouka-banner-investissement.png" alt="Le Vieux KOUKA — ton investissement bien-être" className="rounded-2xl border-2 border-vert-bg" />
            <img src="/images/kouka-temoignages.webp" alt="Témoignages clients Sirop du Vieux KOUKA" className="rounded-2xl border-2 border-vert-bg" />
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="container-kouka">
          <h2 className="text-center mb-2">⚡ Résultats dès les 2 premiers jours</h2>
          <div className="grid gap-4 mt-6">
            {[
              ['J1 à J2', 'Énergie sexuelle relancée', 'Le corps répond mieux, l’envie remonte et la confiance revient.'],
              ['J3 à J5', 'Érections plus solides', 'Tu ressens plus de fermeté, plus de tenue et moins de stress pendant le rapport.'],
              ['J6 à J10', 'Endurance renforcée', 'Tu tiens plus longtemps et tu retrouves une vraie satisfaction dans l’acte.'],
            ].map(([day, title, desc]) => (
              <div key={day} className="flex gap-4 py-4 border-b border-vert-bg last:border-b-0">
                <div className="shrink-0 w-[76px] text-center rounded-xl py-2 px-1 bg-vert-mid text-white font-extrabold">{day}</div>
                <div>
                  <div className="font-extrabold text-vert mb-1">{title}</div>
                  <div className="text-sm text-muted-foreground">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductForm product={product} />

      <section className="sec">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Questions fréquentes</h2>
          <FAQ />
          <div className="text-center mt-8">
            <Link to="/" className="text-vert-mid font-bold text-sm">← Retour à la page poudre KOUKA</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
