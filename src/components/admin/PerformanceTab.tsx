import { useMemo, useState } from 'react';
import { useLeads } from '@/lib/leads';
import { useCloseuses } from '@/lib/closeuses';
import { formatFCFA } from '@/lib/products';

type Range = '1' | '7' | '30' | 'custom';

export function PerformanceTab() {
  const { closeuses } = useCloseuses();
  const { leads, loading } = useLeads(null);
  const [range, setRange] = useState<Range>('30');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const bounds = useMemo(() => {
    const now = new Date();
    if (range === 'custom') {
      return {
        from: from ? new Date(from + 'T00:00:00') : new Date(0),
        to: to ? new Date(to + 'T23:59:59') : now,
      };
    }
    const days = range === '1' ? 1 : range === '7' ? 7 : 30;
    const f = new Date(now); f.setDate(f.getDate() - days); f.setHours(0,0,0,0);
    return { from: f, to: now };
  }, [range, from, to]);

  const rows = useMemo(() => {
    return closeuses.map((c) => {
      const mine = leads.filter((l) => l.closeuse_idx === c.idx && new Date(l.created_at) >= bounds.from && new Date(l.created_at) <= bounds.to);
      const n = (s: string) => mine.filter((l) => l.status === s).length;
      const total = mine.length;
      const valid = n('valide') + n('expediee') + n('livree');
      const livr = n('livree');
      return {
        c,
        total,
        nouveau: n('nouveau_lead'),
        discussion: n('discussion'),
        valid,
        expedie: n('expediee'),
        livr,
        refus: n('refusee'),
        ca: mine.filter((l) => l.status === 'livree').reduce((s, l) => s + l.product_price, 0),
        validRate: total ? Math.round((valid / total) * 100) : 0,
        livrRate: valid ? Math.round((livr / valid) * 100) : 0,
        lastAt: mine.length ? mine.map((l) => l.updated_at).sort().reverse()[0] : null,
      };
    }).sort((a, b) => b.valid - a.valid);
  }, [closeuses, leads, bounds]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        {[
          { k: '1' as Range, l: "Aujourd'hui" },
          { k: '7' as Range, l: '7 jours' },
          { k: '30' as Range, l: '30 jours' },
          { k: 'custom' as Range, l: 'Personnalisé' },
        ].map((p) => (
          <button key={p.k} onClick={() => setRange(p.k)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${range === p.k ? 'bg-vert text-white' : 'bg-white border-2 border-vert-bg'}`}>
            {p.l}
          </button>
        ))}
        {range === 'custom' && (
          <div className="flex items-center gap-1 bg-white border-2 border-vert-bg rounded-full px-2 py-1">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="text-xs bg-transparent outline-none" />
            <span className="text-xs">→</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="text-xs bg-transparent outline-none" />
          </div>
        )}
      </div>

      {loading && <div className="text-center text-gray-500 py-6">Chargement…</div>}

      <div className="bg-white rounded-2xl border-2 border-rose-100 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-rose-50 text-rose-900">
            <tr>
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Closeuse</th>
              <th className="p-2">Leads</th>
              <th className="p-2">Disc.</th>
              <th className="p-2">Valid.</th>
              <th className="p-2">Livr.</th>
              <th className="p-2">Refus</th>
              <th className="p-2">Tx Val.</th>
              <th className="p-2">Tx Livr.</th>
              <th className="p-2">CA</th>
              <th className="p-2">Dernière</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.c.id} className="border-t border-rose-50">
                <td className="p-2 font-bold">{i + 1}</td>
                <td className="p-2 font-bold truncate">{r.c.emoji} {r.c.name}</td>
                <td className="p-2 text-center">{r.total}</td>
                <td className="p-2 text-center">{r.discussion}</td>
                <td className="p-2 text-center font-bold text-emerald-700">{r.valid}</td>
                <td className="p-2 text-center font-bold text-green-700">{r.livr}</td>
                <td className="p-2 text-center text-rouge">{r.refus}</td>
                <td className="p-2 text-center">{r.validRate}%</td>
                <td className="p-2 text-center">{r.livrRate}%</td>
                <td className="p-2 text-right font-bold">{formatFCFA(r.ca)}</td>
                <td className="p-2 text-[10px] text-gray-500">{r.lastAt ? new Date(r.lastAt).toLocaleDateString('fr-FR') : '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={11} className="p-6 text-center text-gray-500">Aucune donnée.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
