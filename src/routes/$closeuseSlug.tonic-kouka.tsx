import { createFileRoute } from '@tanstack/react-router';
import { TonicKoukaPage } from './tonic-kouka';
import { CloseuseSlugGate } from '@/components/closeuse/CloseuseSlugGate';
import { TONIC_KOUKA } from '@/lib/products';

export const Route = createFileRoute('/$closeuseSlug/tonic-kouka')({
  head: () => ({
    meta: [
      { title: TONIC_KOUKA.metaTitle },
      { name: 'description', content: TONIC_KOUKA.metaDesc },
    ],
  }),
  component: AssignedTonicPage,
});

function AssignedTonicPage() {
  const { closeuseSlug } = Route.useParams();
  return (
    <CloseuseSlugGate slug={closeuseSlug}>
      <TonicKoukaPage />
    </CloseuseSlugGate>
  );
}
