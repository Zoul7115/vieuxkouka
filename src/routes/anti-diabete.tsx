import { createFileRoute } from '@tanstack/react-router';

import { ProductForm } from '@/components/ProductForm';
import { VisitTracker } from '@/components/VisitTracker';
import { ANTI_DIABETE } from '@/lib/products';

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

/**
 * Page volontairement vide : toute l'ancienne identité visuelle a été supprimée.
 * Seule la mécanique technique est conservée (route, SEO, tracking, formulaire de commande).
 */
export function AntiDiabetePage() {
  return (
    <main>
      <VisitTracker page="anti-diabete" />

      {/* Zone de contenu — à reconstruire (PASTA) */}

      <section id="order-section">
        <ProductForm product={ANTI_DIABETE} />
      </section>
    </main>
  );
}
