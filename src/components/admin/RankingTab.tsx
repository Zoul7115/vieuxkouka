import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCloseuses } from '@/lib/closeuses';
import { useLeads } from '@/lib/leads';
import { computeCloseuseStats } from '@/lib/closeuseScore';
import { formatLastActivity } from '@/lib/closeuseActivity';

export function RankingTab() {
  const { closeuses } = useCloseuses();
  const { leads } = useLeads(null);
  const [activity, setActivity] = useState<Record<number, string>>({});

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).from('closeuses').select('idx,last_activity_at');
      const m: Record<number, string> = {};
      (data || []).forEach((c: any) => { if (c.last_activity_at) m[c.idx] = c.last_activity_at; });
      setActivity(m);
    })();
  }, []);

  const ranking = useMemo(() => {
    return closeuses.map((c) => {
      const own = leads.filter((l) => l.closeuse_idx === c.idx);
      return { c, stats: computeCloseuseStats(own) };
    }).sort((a, b) => (b.stats.validated - a.stats.validated) || (b.stats.validationRate - a.stats.validationRate));
  }, [closeuses, leads]);

  const medal = (i: number) => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;

  return (
    <div className="bg-white rounded-2xl border-2 border-vert-bg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-vert text-white">
          <tr>
            <th className="text-left p-2">#</th>
            <th className="text-left p-2">Closeuse</th>
            <th className="text-right p-2">Leads</th>
            <th className="text-right p-2">Val.</th>
            <th className="text-right p-2">Livr.</th>
            <th className="text-right p-2">Tx val.</th>
            <th className="text-right p-2">Tx livr.</th>
            <th className="text-left p-2">Score</th>
            <th className="text-left p-2">Dernière activité</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((r, i) => (
            <tr key={r.c.id} className="border-t border-gray-100">
              <td className="p-2 text-lg">{medal(i)}</td>
              <td className="p-2 font-bold">{r.c.emoji} {r.c.name}</td>
              <td className="p-2 text-right">{r.stats.leads}</td>
              <td className="p-2 text-right font-bold text-emerald-700">{r.stats.validated}</td>
              <td className="p-2 text-right font-bold text-green-700">{r.stats.delivered}</td>
              <td className="p-2 text-right">{Math.round(r.stats.validationRate * 100)}%</td>
              <td className="p-2 text-right">{Math.round(r.stats.deliveryRate * 100)}%</td>
              <td className="p-2"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.stats.scoreColor}`}>{r.stats.scoreLabel}</span></td>
              <td className="p-2 text-xs text-gray-600">{formatLastActivity(activity[r.c.idx])}</td>
            </tr>
          ))}
          {ranking.length === 0 && <tr><td colSpan={9} className="text-center text-gray-500 py-6">Aucune closeuse</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
