import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AntiDiabetePage } from './anti-diabete';
import { AssignedCloseuseProvider } from '@/lib/assignedCloseuseContext';
import { ANTI_DIABETE } from '@/lib/products';

export const Route = createFileRoute('/$closeuseSlug/anti-diabete')({
  head: () => ({
    meta: [
      { title: ANTI_DIABETE.metaTitle },
      { name: 'description', content: ANTI_DIABETE.metaDesc },
      { property: 'og:title', content: ANTI_DIABETE.metaTitle },
      { property: 'og:description', content: ANTI_DIABETE.metaDesc },
      { property: 'og:image', content: ANTI_DIABETE.heroImage },
    ],
  }),
  component: AssignedAntiDiabetePage,
});

type Closeuse = { id: string; idx: number; name: string; emoji: string | null; slug: string | null; active: boolean };

function AssignedAntiDiabetePage() {
  const { closeuseSlug } = Route.useParams();
  const [closeuse, setCloseuse] = useState<Closeuse | null>(null);
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    (async () => {
      setResolving(true);
      const { data } = await supabase
        .from('closeuses')
        .select('*')
        .eq('slug', closeuseSlug)
        .eq('active', true)
        .maybeSingle();
      setCloseuse((data || null) as Closeuse | null);
      setResolving(false);
    })();
  }, [closeuseSlug]);

  if (resolving) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Chargement…</div>;
  }

  if (!closeuse) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <div className="text-6xl mb-3">🔗</div>
          <h1 className="text-xl font-extrabold mb-2">Lien invalide</h1>
          <p className="text-sm text-muted-foreground mb-4">Ce lien ne correspond à aucune conseillère active.</p>
          <Link to="/anti-diabete" className="text-bleu font-bold underline">Aller sur la page Anti-Diabète</Link>
        </div>
      </div>
    );
  }

  return (
    <AssignedCloseuseProvider value={{ idx: closeuse.idx, slug: closeuse.slug || closeuseSlug, name: closeuse.name }}>
      <AntiDiabetePage />
    </AssignedCloseuseProvider>
  );
}
