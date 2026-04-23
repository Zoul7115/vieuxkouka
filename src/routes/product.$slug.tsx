import { createFileRoute, redirect } from '@tanstack/react-router';

// L'ancienne page produit est consolidée dans la home — on redirige.
export const Route = createFileRoute('/product/$slug')({
  beforeLoad: () => {
    throw redirect({ to: '/' });
  },
  component: () => null,
});
