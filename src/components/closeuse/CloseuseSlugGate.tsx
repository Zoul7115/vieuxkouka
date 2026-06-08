import { useEffect, useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { AssignedCloseuseProvider } from '@/lib/assignedCloseuseContext';

type Closeuse = { id: string; idx: number; name: string; emoji: string | null; slug: string | null; active: boolean };

export function CloseuseSlugGate({ slug, fallbackHref = '/boutique', children }: { slug: string; fallbackHref?: string; children: ReactNode }) {
  const [closeuse, setCloseuse] = useState<Closeuse | null>(null);
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setResolving(true);
      const { data } = await supabase
        .from('closeuses')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle();
      if (!cancelled) {
        setCloseuse((data || null) as Closeuse | null);
        setResolving(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

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
          <Link to={fallbackHref} className="text-bleu font-bold underline">Aller sur la boutique</Link>
        </div>
      </div>
    );
  }

  return (
    <AssignedCloseuseProvider value={{ idx: closeuse.idx, slug: closeuse.slug || slug, name: closeuse.name }}>
      {children}
    </AssignedCloseuseProvider>
  );
}
