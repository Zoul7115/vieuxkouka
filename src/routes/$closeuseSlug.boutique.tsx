import { createFileRoute } from '@tanstack/react-router';
import { BrandHomePage } from './boutique';
import { CloseuseSlugGate } from '@/components/closeuse/CloseuseSlugGate';

export const Route = createFileRoute('/$closeuseSlug/boutique')({
  head: () => ({
    meta: [
      { title: 'Les Remèdes Naturels du Vieux KOUKA' },
      { name: 'description', content: 'Gamme officielle de remèdes naturels du Vieux KOUKA. Paiement à la livraison.' },
    ],
  }),
  component: AssignedBoutiquePage,
});

function AssignedBoutiquePage() {
  const { closeuseSlug } = Route.useParams();
  return (
    <CloseuseSlugGate slug={closeuseSlug}>
      <BrandHomePage />
    </CloseuseSlugGate>
  );
}
