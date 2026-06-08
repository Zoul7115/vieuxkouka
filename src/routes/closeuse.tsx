import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { CloseuseLogin } from '@/components/closeuse/CloseuseLogin';
import { ShareLinks } from '@/components/closeuse/ShareLinks';
import { LeadCard } from '@/components/closeuse/LeadCard';
import { ManualLeadModal } from '@/components/closeuse/ManualLeadModal';
import { getStoredSession, clearSession, type CloseuseSession } from '@/lib/closeuse-auth';
import { useLeads, type LeadStatus } from '@/lib/leads';
import { touchCloseuseActivity } from '@/lib/closeuseActivity';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/closeuse')({
  head: () => ({ meta: [{ title: 'KOUKA Closeuse' }, { name: 'theme-color', content: '#be185d' }] }),
  component: CloseusePage,
});

type FilterKey = 'all' | 'attente' | 'approche' | 'suivi' | 'confirmee' | 'livree' | 'annulee';

const FILTERS: { k: FilterKey; label: string; emoji: string; statuses: LeadStatus[] }[] = [
  { k: 'all',       label: 'Tout',       emoji: '📋', statuses: [] },
  { k: 'attente',   label: 'En attente', emoji: '🕒', statuses: ['nouveau_lead'] },
  { k: 'approche',  label: 'Approche',   emoji: '💬', statuses: ['discussion'] },
  { k: 'suivi',     label: 'Suivi',      emoji: '🔁', statuses: ['a_relancer'] },
  { k: 'confirmee', label: 'Confirmée',  emoji: '✅', statuses: ['valide', 'expediee'] },
  { k: 'livree',    label: 'Livrée',     emoji: '🎉', statuses: ['livree'] },
  { k: 'annulee',   label: 'Annulée',    emoji: '🚫', statuses: ['annulee', 'refusee', 'perdue'] },
];

function CloseusePage() {
  const [session, setSession] = useState<CloseuseSession | null>(null);
  const [ready, setReady] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    setSession(getStoredSession());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data } = await supabase.from('closeuses').select('slug').eq('id', session.id).maybeSingle();
      setSlug((data as { slug: string } | null)?.slug ?? null);
    })();
    touchCloseuseActivity(session.idx);
    const itv = setInterval(() => touchCloseuseActivity(session.idx), 5 * 60 * 1000);
    return () => clearInterval(itv);
  }, [session]);

  if (!ready) return <div className="min-h-screen bg-rose-50 flex items-center justify-center text-rose-700">Chargement…</div>;
  if (!session) return <CloseuseLogin onSuccess={setSession} />;

  const logout = () => { clearSession(); setSession(null); };

  return (
    <div className="min-h-screen bg-rose-50">
      <header className="bg-rose-700 text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div>
            <div className="text-xs opacity-80">Bonjour 👩‍💼</div>
            <div className="font-bold">{session.name}</div>
          </div>
          <button onClick={logout} className="px-2 py-1.5 rounded hover:bg-rose-600 text-xs opacity-90">Déco</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 py-4 pb-20 space-y-4">
        {slug && <ShareLinks slug={slug} />}
        <LeadList session={session} />
      </main>
    </div>
  );
}

function LeadList({ session, slug }: { session: CloseuseSession; slug: string | null }) {
  const { leads, loading, reload } = useLeads(session.idx);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [manualOpen, setManualOpen] = useState(false);

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = { all: leads.length, attente: 0, approche: 0, suivi: 0, confirmee: 0, livree: 0, annulee: 0 };
    leads.forEach((l) => {
      FILTERS.forEach((f) => { if (f.k !== 'all' && f.statuses.includes(l.status)) c[f.k]++; });
    });
    return c;
  }, [leads]);

  const visible = useMemo(() => {
    const f = FILTERS.find((x) => x.k === filter)!;
    if (f.k === 'all') return leads;
    return leads.filter((l) => f.statuses.includes(l.status));
  }, [leads, filter]);

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 overflow-x-auto bg-white p-1.5 rounded-2xl border-2 border-rose-200">
        {FILTERS.map((f) => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap ${filter === f.k ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'}`}
          >
            {f.emoji} {f.label}
            <span className="ml-1 opacity-70">{counts[f.k]}</span>
          </button>
        ))}
      </div>

      {loading && <div className="text-center text-rose-700 py-6">Chargement…</div>}

      {!loading && visible.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border-2 border-rose-100">
          Aucune commande pour le moment.<br />
          <span className="text-xs">Partage ton lien (ci-dessus) pour recevoir tes premières commandes.</span>
        </div>
      )}

      <div className="space-y-3">
        {visible.map((l) => <LeadCard key={l.id} lead={l} />)}
      </div>
    </div>
  );
}
