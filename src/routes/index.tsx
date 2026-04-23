import { createFileRoute, Link } from '@tanstack/react-router';
import { PRODUCTS, formatFCFA } from '@/lib/products';
import { VisitTracker } from '@/components/VisitTracker';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'ShopAfrik — Produits naturels KOUKA · Hémorroïdes, Ulcères, Colopathie' },
      { name: 'description', content: 'Boutique ShopAfrik : poudres et sirop KOUKA — savoir ancestral africain pour soigner hémorroïdes, ulcères, colopathie et diarrhée. Paiement à la livraison.' },
      { property: 'og:title', content: 'ShopAfrik — Produits naturels KOUKA' },
      { property: 'og:description', content: 'Savoir ancestral africain. Paiement cash à la livraison au Burkina Faso et en Afrique de l\'Ouest.' },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <VisitTracker page="home" />

      {/* Header */}
      <header className="bg-vert text-white py-3 text-center text-sm font-bold sticky top-0 z-40">
        🌿 +200 clients guéris · Livraison gratuite Ouaga · Paiement à la livraison
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-vert-bg to-background py-12 sm:py-16 border-b-[3px] border-[oklch(0.85_0.06_145)]">
        <div className="container-kouka text-center">
          <span className="inline-block bg-vert-mid text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            🌿 Thérapies traditionnelles africaines
          </span>
          <h1 className="text-vert mb-4">
            Le savoir du <span className="text-or">Vieux KOUKA</span><br />
            au service de ta santé
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6 text-lg leading-relaxed">
            Hémorroïdes, ulcères, colopathie, diarrhée — des plantes récoltées dans 3 pays africains
            pour traiter à la racine. <strong>Pas pour calmer. Pour guérir.</strong>
          </p>
          <Link
            to="/diagnostic"
            className="inline-block bg-vert-mid text-white px-8 py-4 rounded-xl font-extrabold shadow-[0_6px_20px_rgba(46,125,50,0.35)] hover:-translate-y-0.5 transition-transform"
          >
            🩺 Consultation gratuite avec KOUKA
          </Link>
        </div>
      </section>

      {/* Catalogue */}
      <section className="sec">
        <div className="container-kouka">
          <h2 className="text-center mb-2">Nos produits naturels</h2>
          <p className="text-center text-muted-foreground mb-10">
            Choisis le traitement adapté à ta pathologie
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            {PRODUCTS.map((p) => (
              <Link
                key={p.slug}
                to="/product/$slug"
                params={{ slug: p.slug }}
                className="group bg-card rounded-2xl overflow-hidden border-2 border-vert-bg hover:border-vert-mid hover:shadow-lg transition-all"
              >
                <div className="aspect-square bg-gradient-to-br from-vert-bg to-cream-2 flex items-center justify-center text-7xl">
                  {p.emoji}
                </div>
                <div className="p-5">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-rouge mb-2">
                    {p.pathology}
                  </span>
                  <h3 className="text-vert mb-2">{p.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">À partir de</span>
                    <span className="text-xl font-extrabold text-vert">
                      {formatFCFA(p.offers[0].price)}
                    </span>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-vert-mid font-bold group-hover:gap-3 transition-all">
                    Voir le produit <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="sec bg-vert-bg/40">
        <div className="container-kouka text-center">
          <h2 className="mb-8">Pourquoi nous choisir ?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { i: '🌿', t: '100% naturel', d: 'Plantes africaines' },
              { i: '💵', t: 'Cash à la livraison', d: 'Paiement à réception' },
              { i: '📦', t: 'Emballage discret', d: 'Sans mention' },
              { i: '↩️', t: 'Satisfait ou remboursé', d: 'Garantie totale' },
            ].map((x) => (
              <div key={x.t} className="bg-white rounded-xl p-4 border-2 border-vert-bg">
                <div className="text-3xl mb-2">{x.i}</div>
                <div className="font-extrabold text-foreground text-sm">{x.t}</div>
                <div className="text-xs text-muted-foreground mt-1">{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-vert text-white text-center py-8 text-sm">
        <div className="container-kouka">
          <div className="font-extrabold mb-2">🌿 KOUKA Thérapies</div>
          <p className="opacity-80 mb-4">Savoir ancestral · Burkina Faso · Afrique de l'Ouest</p>
          <Link to="/admin" className="text-white/60 text-xs hover:text-white">
            Espace admin
          </Link>
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
