import { createFileRoute, redirect } from '@tanstack/react-router';
import { SiropPage } from './product.$slug';
import { CloseuseSlugGate } from '@/components/closeuse/CloseuseSlugGate';
import { SIROP_KOUKA } from '@/lib/products';

export const Route = createFileRoute('/$closeuseSlug/product/$slug')({
  beforeLoad: ({ params }) => {
    if (params.slug !== 'sirop-kouka') throw redirect({ to: '/$closeuseSlug/boutique', params: { closeuseSlug: params.closeuseSlug } });
  },
  head: () => ({
    meta: [
      { title: SIROP_KOUKA.metaTitle },
      { name: 'description', content: SIROP_KOUKA.metaDesc },
    ],
  }),
  component: AssignedSiropPage,
});

function AssignedSiropPage() {
  const { closeuseSlug } = Route.useParams();
  return (
    <CloseuseSlugGate slug={closeuseSlug}>
      <SiropPage />
    </CloseuseSlugGate>
  );
}
