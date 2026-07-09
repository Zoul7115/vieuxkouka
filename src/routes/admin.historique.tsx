import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/admin/historique')({
  head: () => ({ meta: [{ title: 'Historique — Admin' }] }),
  component: HistoriquePage,
});

const PAGE_SIZE = 30;

type LeadEvent = {
  id: string;
  lead_id: string;
  closeuse_idx: number | null;
  event_type: string;
  from_status: string | null;
  to_status: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
};

async function fetchPage(pageIndex: number): Promise<LeadEvent[]> {
  const from = pageIndex * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data, error } = await supabase
    .from('lead_events')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);
  if (error) throw error;
  return (data ?? []) as LeadEvent[];
}

function HistoriquePage() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('sa_auth') === '1') {
      setAuthed(true);
    }
  }, []);

  const query = useInfiniteQuery({
    queryKey: ['admin', 'historique', 'lead_events'],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchPage(pageParam as number),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length,
    enabled: authed,
  });

  const events = useMemo(
    () => (query.data?.pages.flat() ?? []) as LeadEvent[],
    [query.data]
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          query.hasNextPage &&
          !query.isFetchingNextPage
        ) {
          query.fetchNextPage();
        }
      },
      { rootMargin: '400px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage, events.length]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <p className="mb-4">Accès réservé à l'admin.</p>
          <Link to="/admin" className="underline text-primary">Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Historique</h1>
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">
            ← Admin
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {query.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
        {query.isError && (
          <p className="text-sm text-destructive">
            Erreur : {(query.error as Error).message}
          </p>
        )}

        <ul className="divide-y border rounded-lg overflow-hidden bg-card">
          {events.map((e) => (
            <li key={e.id} className="p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{e.event_type}</span>
                <time className="text-xs text-muted-foreground">
                  {new Date(e.created_at).toLocaleString('fr-FR')}
                </time>
              </div>
              {(e.from_status || e.to_status) && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {e.from_status ?? '—'} → {e.to_status ?? '—'}
                </div>
              )}
              <div className="mt-1 text-xs text-muted-foreground">
                Lead {e.lead_id.slice(0, 8)}
                {e.closeuse_idx != null ? ` · closeuse #${e.closeuse_idx}` : ''}
              </div>
            </li>
          ))}
          {events.length === 0 && !query.isLoading && (
            <li className="p-6 text-sm text-muted-foreground text-center">
              Aucun événement.
            </li>
          )}
        </ul>

        <div ref={sentinelRef} className="h-10 flex items-center justify-center">
          {query.isFetchingNextPage && (
            <span className="text-xs text-muted-foreground">Chargement…</span>
          )}
          {!query.hasNextPage && events.length > 0 && (
            <span className="text-xs text-muted-foreground">Fin de l'historique</span>
          )}
        </div>
      </main>
    </div>
  );
}
