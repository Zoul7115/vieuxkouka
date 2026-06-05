import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { CloseuseLogin } from '@/components/closeuse/CloseuseLogin';
import { ShareLinks } from '@/components/closeuse/ShareLinks';
import { LeadCard } from '@/components/closeuse/LeadCard';
import { DailyObjective } from '@/components/closeuse/DailyObjective';
import { CloseuseStatsCard } from '@/components/closeuse/CloseuseStatsCard';
import { RelancesView } from '@/components/closeuse/RelancesView';
import { getStoredSession, clearSession, type CloseuseSession } from '@/lib/closeuse-auth';
import { useLeads, type LeadStatus, LEAD_STATUS_META } from '@/lib/leads';
import { computeCloseuseStats, validatedToday } from '@/lib/closeuseScore';
import { touchCloseuseActivity } from '@/lib/closeuseActivity';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/closeuse')({
  head: () => ({ meta: [{ title: 'KOUKA Closeuse' }, { name: 'theme-color', content: '#be185d' }] }),
  component: CloseusePage,
});

type TabKey = LeadStatus | 'all' | 'relances';
const TABS: { k: TabKey; label: string; emoji: string }[] = [
  { k: 'all', label: 'Tout', emoji: '📋' },
  { k: 'nouveau_lead', label: 'Nouveaux', emoji: '🆕' },
  { k: 'discussion', label: 'Discussion', emoji: '💬' },
  { k: 'a_relancer', label: 'À relancer', emoji: '🔁' },
  { k: 'relances', label: 'Tâches relance', emoji: '⏰' },
  { k: 'valide', label: 'Validées', emoji: '✅' },
  { k: 'expediee', label: 'Expédiées', emoji: '📦' },
  { k: 'livree', label: 'Livrées', emoji: '🎉' },
  { k: 'refusee', label: 'Refusées', emoji: '❌' },
  { k: 'perdue', label: 'Perdues', emoji: '💀' },
];

function CloseusePage() {
  const [session, setSession] = useState<CloseuseSession | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<TabKey>('all');
  const [slug, setSlug] = useState<string | null>(null);
  const [dailyObjective, setDailyObjective] = useState(5);

  useEffect(() => {
    setSession(getStoredSession());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data } = await supabase.from('closeuses').select('slug,daily_objective').eq('id', session.id).maybeSingle();
      setSlug((data as any)?.slug ?? null);
      if ((data as any)?.daily_objective) setDailyObjective((data as any).daily_objective);
    })();
    // Activity ping toutes les 5 min
    touchCloseuseActivity(session.idx);
    const itv = setInterval(() => touchCloseuseActivity(session.idx), 5 * 60 * 1000);

    // Realtime : si l'admin change une commande de cette closeuse, refléter côté UI
    const chOrders = supabase
      .channel(`closeuse-orders-${session.idx}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `closeuse_idx=eq.${session.idx}` }, () => {
        // L'invalidation se fait via useLeads (status synchronisé par trigger) — ce canal sert juste à pousser un re-render.
        window.dispatchEvent(new Event('closeuse:orders-updated'));
      })
      .subscribe();
    const chRelances = supabase
      .channel(`closeuse-relances-${session.idx}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lead_relances', filter: `closeuse_idx=eq.${session.idx}` }, () => {
        window.dispatchEvent(new Event('closeuse:relances-updated'));
      })
      .subscribe();

    return () => {
      clearInterval(itv);
      supabase.removeChannel(chOrders);
      supabase.removeChannel(chRelances);
    };
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
        <Dashboard session={session} tab={tab} setTab={setTab} dailyObjective={dailyObjective} />
      </main>
    </div>
  );
}

function Dashboard({ session, tab, setTab, dailyObjective }: { session: CloseuseSession; tab: TabKey; setTab: (t: TabKey) => void; dailyObjective: number }) {
  const { leads, loading } = useLeads(session.idx);

  const stats = useMemo(() => computeCloseuseStats(leads), [leads]);
  const doneToday = useMemo(() => validatedToday(leads), [leads]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    leads.forEach((l) => { c[l.status] = (c[l.status] || 0) + 1; });
    return c;
  }, [leads]);

  const visible = useMemo(() => {
    if (tab === 'all') return leads;
    if (tab === 'relances') return leads;
    return leads.filter((l) => l.status === tab);
  }, [leads, tab]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DailyObjective done={doneToday} goal={dailyObjective} />
        <CloseuseStatsCard stats={stats} />
      </div>

      <div className="flex gap-1.5 overflow-x-auto bg-white p-1.5 rounded-2xl border-2 border-rose-200">
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap ${tab === t.k ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'}`}
          >
            {t.emoji} {t.label}
            {t.k !== 'relances' && <span className="ml-1 opacity-70">{counts[t.k as string] || 0}</span>}
          </button>
        ))}
      </div>

      {loading && <div className="text-center text-rose-700 py-6">Chargement…</div>}

      {tab === 'relances' ? (
        <RelancesView closeuseIdx={session.idx} leads={leads} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
