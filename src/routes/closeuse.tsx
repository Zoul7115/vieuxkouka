import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { CloseuseLogin } from '@/components/closeuse/CloseuseLogin';
import { ShareLinks } from '@/components/closeuse/ShareLinks';
import { LeadCard } from '@/components/closeuse/LeadCard';
import { getStoredSession, clearSession, type CloseuseSession } from '@/lib/closeuse-auth';
import { useLeads, type LeadStatus, LEAD_STATUS_META } from '@/lib/leads';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/closeuse')({
  head: () => ({ meta: [{ title: 'KOUKA Closeuse' }, { name: 'theme-color', content: '#be185d' }] }),
  component: CloseusePage,
});

const TABS: { k: LeadStatus | 'all'; label: string; emoji: string }[] = [
  { k: 'all', label: 'Tout', emoji: '📋' },
  { k: 'nouveau_lead', label: 'Nouveaux', emoji: '🆕' },
  { k: 'discussion', label: 'Discussion', emoji: '💬' },
  { k: 'a_relancer', label: 'À relancer', emoji: '🔁' },
  { k: 'valide', label: 'Validées', emoji: '✅' },
  { k: 'expediee', label: 'Expédiées', emoji: '📦' },
  { k: 'livree', label: 'Livrées', emoji: '🎉' },
  { k: 'refusee', label: 'Refusées', emoji: '❌' },
  { k: 'perdue', label: 'Perdues', emoji: '💀' },
];

function CloseusePage() {
  const [session, setSession] = useState<CloseuseSession | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<LeadStatus | 'all'>('all');
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    setSession(getStoredSession());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data } = await supabase.from('closeuses').select('slug').eq('id', session.id).maybeSingle();
      setSlug((data as any)?.slug ?? null);
    })();
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
        <Dashboard session={session} tab={tab} setTab={setTab} />
      </main>
    </div>
  );
}

function Dashboard({ session, tab, setTab }: { session: CloseuseSession; tab: LeadStatus | 'all'; setTab: (t: LeadStatus | 'all') => void }) {
  const { leads, loading } = useLeads(session.idx);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    leads.forEach((l) => { c[l.status] = (c[l.status] || 0) + 1; });
    return c;
  }, [leads]);

  const visible = useMemo(() => {
    if (tab === 'all') return leads;
    return leads.filter((l) => l.status === tab);
  }, [leads, tab]);

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 overflow-x-auto bg-white p-1.5 rounded-2xl border-2 border-rose-200">
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap ${tab === t.k ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'}`}
          >
            {t.emoji} {t.label}
            <span className="ml-1 opacity-70">{counts[t.k as string] || 0}</span>
          </button>
        ))}
      </div>

      {loading && <div className="text-center text-rose-700 py-6">Chargement…</div>}

      {!loading && visible.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border-2 border-rose-100">
          {tab === 'all' ? (
            <>
              Aucun lead pour le moment.<br />
              <span className="text-xs">Partage tes liens (en haut) pour recevoir tes premières commandes.</span>
            </>
          ) : (
            <>Aucun lead en statut <b>{LEAD_STATUS_META[tab as LeadStatus]?.label}</b>.</>
          )}
        </div>
      )}

      <div className="space-y-3">
        {visible.map((l) => <LeadCard key={l.id} lead={l} />)}
      </div>
    </div>
  );
}
