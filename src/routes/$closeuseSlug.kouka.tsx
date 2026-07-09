import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from './index';
import { CloseuseSlugGate } from '@/components/closeuse/CloseuseSlugGate';
import { KOUKA } from '@/lib/products';

export const Route = createFileRoute('/$closeuseSlug/kouka')({
  head: () => ({
    meta: [
      { title: KOUKA.metaTitle },
      { name: 'description', content: KOUKA.metaDesc },
    ],
  }),
  component: AssignedKoukaPage,
});

function AssignedKoukaPage() {
  const { closeuseSlug } = Route.useParams();
  return (
    <CloseuseSlugGate slug={closeuseSlug}>
      <HomePage />
    </CloseuseSlugGate>
  );
}
