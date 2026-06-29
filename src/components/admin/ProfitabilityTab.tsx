// ============================================================================
// 📊 Onglet "Rentabilité des closeuses"
// Bilan hebdo / mensuel / personnalisé, filtrage par closeuse, tableau triable,
// classement, graphiques, alertes, export CSV & XLSX.
// ============================================================================

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCloseuses, type Closeuse } from '@/lib/closeuses';
import { formatFCFA } from '@/lib/products';
import { getPeriodRange } from '@/lib/periods';
import { downloadXLSX, downloadCSV } from '@/lib/exports';
import {
  computeProfitRow,
  countWorkdays,
  weekKey,
  dateKey,
  alertLevel,
  type ProfitRow,
} from '@/lib/profitability';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import { toast } from 'sonner';

type Mode = 'week' | 'month' | 'custom';

type LeadLite = { id: string; closeuse_idx: number; created_at: string };
type OrderLite = {
  id: string;
  closeuse_idx: number | null;
  status: string;
  product_price: number;
  created_at: string;
  delivered_at: string | null;
};
type ExpenseLite = {
  id: string;
  expense_date: string;
  category: string;
  amount: number;
  closeuse_idx: number | null;
};

const PIE_COLORS = ['#dc2626', '#16a34a', '#2563eb', '#ca8a04'];

export function ProfitabilityTab() {
  const { closeuses } = useCloseuses();
  const [mode, setMode] = useState<Mode>('week');
  const [weekOffset, setWeekOffset] = useState(0); // 0 = semaine en cours, -1 = précédente
  const [monthOffset, setMonthOffset] = useState(0);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [filterCloseuse, setFilterCloseuse] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof ProfitRow>('benefice');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [detailIdx, setDetailIdx] = useState<number | null>(null);

  const [leads, setLeads] = useState<LeadLite[]>([]);
  const [orders, setOrders] = useState<OrderLite[]>([]);
  const [expenses, setExpenses] = useState<ExpenseLite[]>([]);
  const [loading, setLoading] = useState(true);

  // Calcule la plage de dates à partir du mode
  const { from, to, label } = useMemo(() => {
    const now = new Date();
    if (mode === 'week') {
      const ref = new Date(now);
      ref.setDate(ref.getDate() + weekOffset * 7);
      const day = ref.getDay() || 7;
      const monday = new Date(ref);
      monday.setDate(ref.getDate() + 1 - day);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      return {
        from: monday,
        to: sunday,
        label: `Semaine du ${monday.toLocaleDateString('fr-FR')} au ${sunday.toLocaleDateString('fr-FR')}`,
      };
    }
    if (mode === 'month') {
      const first = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
      const last = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 0);
      last.setHours(23, 59, 59, 999);
      return {
        from: first,
        to: last,
        label: first.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
      };
    }
    // custom
    const { from: f, to: t } = getPeriodRange('custom', customFrom, customTo);
    return {
      from: new Date(f),
      to: new Date(t),
      label: `Du ${new Date(f).toLocaleDateString('fr-FR')} au ${new Date(t).toLocaleDateString('fr-FR')}`,
    };
  }, [mode, weekOffset, monthOffset, customFrom, customTo]);

  // Charge données scopées à la période (optimisé : un seul fetch par changement de plage)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const fromISO = from.toISOString();
      const toISO = to.toISOString();
      const fromDate = dateKey(from);
      const toDate = dateKey(to);
      const [lRes, oRes, eRes] = await Promise.all([
        supabase
          .from('leads')
          .select('id, closeuse_idx, created_at')
          .gte('created_at', fromISO)
          .lte('created_at', toISO),
        supabase
          .from('orders')
          .select('id, closeuse_idx, status, product_price, created_at, delivered_at')
          .gte('created_at', fromISO)
          .lte('created_at', toISO),
        supabase
          .from('daily_expenses')
          .select('id, expense_date, category, amount, closeuse_idx')
          .eq('category', 'pub')
          .gte('expense_date', fromDate)
          .lte('expense_date', toDate),
      ]);
      if (cancelled) return;
      if (lRes.error || oRes.error || eRes.error) {
        toast.error('Erreur de chargement des données rentabilité');
      }
      setLeads((lRes.data || []) as LeadLite[]);
      setOrders((oRes.data || []) as OrderLite[]);
      setExpenses((eRes.data || []) as ExpenseLite[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [from, to]);

  // Calcul des lignes par closeuse
  const rows: ProfitRow[] = useMemo(() => {
    if (!closeuses.length) return [];

    // Leads par closeuse
    const leadsByIdx = new Map<number, LeadLite[]>();
    leads.forEach((l) => {
      const arr = leadsByIdx.get(l.closeuse_idx) || [];
      arr.push(l);
      leadsByIdx.set(l.closeuse_idx, arr);
    });

    // Orders par closeuse (sans null)
    const ordersByIdx = new Map<number, OrderLite[]>();
    orders.forEach((o) => {
      if (o.closeuse_idx == null) return;
      const arr = ordersByIdx.get(o.closeuse_idx) || [];
      arr.push(o);
      ordersByIdx.set(o.closeuse_idx, arr);
    });

    // Pub attribuée vs partagée
    const pubAttributed = new Map<number, number>();
    let pubShared = 0;
    expenses.forEach((e) => {
      if (e.closeuse_idx != null) {
        pubAttributed.set(e.closeuse_idx, (pubAttributed.get(e.closeuse_idx) || 0) + e.amount);
      } else {
        pubShared += e.amount;
      }
    });
    const totalLeads = leads.length || 1;

    // Pour chaque closeuse : calcul des jours/semaines actifs
    return closeuses.map((c) => {
      const myLeads = leadsByIdx.get(c.idx) || [];
      const myOrders = ordersByIdx.get(c.idx) || [];

      // Activité par jour
      const activeDays = new Set<string>();
      const activeWeeks = new Set<string>();
      const mark = (iso: string) => {
        const d = new Date(iso);
        const day = d.getDay();
        if (day >= 1 && day <= 5) activeDays.add(dateKey(d));
        activeWeeks.add(weekKey(d));
      };
      myLeads.forEach((l) => mark(l.created_at));
      myOrders.forEach((o) => mark(o.created_at));

      // Plafonne par les jours ouvrés / semaines de la période
      const workdaysInPeriod = countWorkdays(from, to);
      const weeksInPeriod = (() => {
        const s = new Set<string>();
        const d = new Date(from);
        while (d <= to) { s.add(weekKey(d)); d.setDate(d.getDate() + 7); }
        s.add(weekKey(to));
        return s.size;
      })();

      const workdays = Math.min(activeDays.size, workdaysInPeriod);
      const weeks = Math.min(activeWeeks.size, weeksInPeriod);

      const myLeadsCount = myLeads.length;
      const sharedShare = pubShared * (myLeadsCount / totalLeads);

      return computeProfitRow({
        closeuseIdx: c.idx,
        closeuseName: c.name,
        emoji: c.emoji,
        leads: myLeads.map((l) => ({ created_at: l.created_at })),
        orders: myOrders.map((o) => ({
          status: o.status,
          product_price: o.product_price,
          created_at: o.created_at,
          delivered_at: o.delivered_at,
        })),
        pubAttributed: pubAttributed.get(c.idx) || 0,
        pubShared: sharedShare,
        workdays,
        weeks,
      });
    });
  }, [closeuses, leads, orders, expenses, from, to]);

  // Filtrage + recherche + tri + pagination
  const filtered = useMemo(() => {
    let r = rows;
    if (filterCloseuse !== 'all') r = r.filter((x) => x.closeuseIdx === filterCloseuse);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((x) => x.closeuseName.toLowerCase().includes(q));
    }
    r = [...r].sort((a, b) => {
      const av = a[sortBy] as number | string;
      const bv = b[sortBy] as number | string;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return r;
  }, [rows, filterCloseuse, search, sortBy, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Totaux globaux
  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, r) => ({
        ca: acc.ca + r.ca,
        pub: acc.pub + r.pub,
        commission: acc.commission + r.commission,
        carburant: acc.carburant + r.carburant,
        repas: acc.repas + r.repas,
        coutTotal: acc.coutTotal + r.coutTotal,
        benefice: acc.benefice + r.benefice,
        delivered: acc.delivered + r.nbDelivered,
      }),
      { ca: 0, pub: 0, commission: 0, carburant: 0, repas: 0, coutTotal: 0, benefice: 0, delivered: 0 },
    );
  }, [filtered]);

  // Évolution jour par jour (CA / dépenses / bénéfice)
  const dailySeries = useMemo(() => {
    const map = new Map<string, { date: string; ca: number; pub: number }>();
    const d = new Date(from);
    while (d <= to) {
      const k = dateKey(d);
      map.set(k, { date: k.slice(5), ca: 0, pub: 0 });
      d.setDate(d.getDate() + 1);
    }
    orders.forEach((o) => {
      if (o.status !== 'delivered' || !o.delivered_at) return;
      const k = dateKey(new Date(o.delivered_at));
      const m = map.get(k);
      if (m && (filterCloseuse === 'all' || o.closeuse_idx === filterCloseuse)) {
        m.ca += o.product_price;
      }
    });
    expenses.forEach((e) => {
      const m = map.get(e.expense_date);
      if (m && (filterCloseuse === 'all' || e.closeuse_idx === filterCloseuse || e.closeuse_idx == null)) {
        m.pub += e.amount;
      }
    });
    return Array.from(map.values());
  }, [from, to, orders, expenses, filterCloseuse]);

  const exportData = () =>
    filtered.map((r) => ({
      Closeuse: r.closeuseName,
      Leads: r.nbLeads,
      Commandes: r.nbOrders,
      Livrées: r.nbDelivered,
      Annulées: r.nbCancelled,
      'Taux livraison %': r.tauxLivraison,
      'CA (FCFA)': r.ca,
      'Pub (FCFA)': r.pub,
      'Commission (FCFA)': r.commission,
      'Carburant (FCFA)': r.carburant,
      'Repas (FCFA)': r.repas,
      'Coût total (FCFA)': r.coutTotal,
      'Bénéfice (FCFA)': r.benefice,
      'Marge %': Math.round(r.marge * 10) / 10,
    }));

  const detailRow = detailIdx != null ? rows.find((r) => r.closeuseIdx === detailIdx) : null;
  const detailCloseuse = detailIdx != null ? closeuses.find((c) => c.idx === detailIdx) : null;

  // Classements
  const ranking = (key: keyof ProfitRow) =>
    [...filtered].sort((a, b) => (b[key] as number) - (a[key] as number)).slice(0, 3);

  // Alertes
  const alerts = useMemo(() => {
    return filtered
      .map((r) => ({ row: r, level: alertLevel(r) }))
      .filter((x) => x.level === 'red' || x.level === 'orange');
  }, [filtered]);

  return (
    <div className="space-y-5">
      {/* Header / filtres */}
      <div className="bg-white border-2 border-vert-bg rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-extrabold text-vert text-lg flex items-center gap-2">
            📊 Rentabilité des closeuses
          </div>
          <div className="ml-auto text-xs text-muted-foreground">{label}</div>
        </div>

        {/* Onglets bilan */}
        <div className="flex flex-wrap gap-2">
          {(['week', 'month', 'custom'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                mode === m ? 'bg-vert text-white' : 'bg-vert-bg text-vert hover:bg-vert/10'
              }`}
            >
              {m === 'week' ? 'Bilan hebdo' : m === 'month' ? 'Bilan mensuel' : 'Personnalisé'}
            </button>
          ))}
        </div>

        {/* Navigation période */}
        <div className="flex flex-wrap items-center gap-2">
          {mode === 'week' && (
            <>
              <button onClick={() => setWeekOffset((w) => w - 1)} className="px-3 py-1.5 rounded-lg bg-vert-bg text-vert font-bold text-sm">←</button>
              <button onClick={() => setWeekOffset(0)} className="px-3 py-1.5 rounded-lg bg-vert-bg text-vert font-bold text-sm">Cette semaine</button>
              <button onClick={() => setWeekOffset((w) => w + 1)} disabled={weekOffset >= 0} className="px-3 py-1.5 rounded-lg bg-vert-bg text-vert font-bold text-sm disabled:opacity-40">→</button>
            </>
          )}
          {mode === 'month' && (
            <>
              <button onClick={() => setMonthOffset((m) => m - 1)} className="px-3 py-1.5 rounded-lg bg-vert-bg text-vert font-bold text-sm">←</button>
              <button onClick={() => setMonthOffset(0)} className="px-3 py-1.5 rounded-lg bg-vert-bg text-vert font-bold text-sm">Ce mois</button>
              <button onClick={() => setMonthOffset((m) => m + 1)} disabled={monthOffset >= 0} className="px-3 py-1.5 rounded-lg bg-vert-bg text-vert font-bold text-sm disabled:opacity-40">→</button>
            </>
          )}
          {mode === 'custom' && (
            <>
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="px-2 py-1.5 border-2 border-vert-bg rounded-lg text-sm" />
              <span className="text-muted-foreground">→</span>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="px-2 py-1.5 border-2 border-vert-bg rounded-lg text-sm" />
            </>
          )}

          <select
            value={filterCloseuse}
            onChange={(e) => setFilterCloseuse(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-1.5 border-2 border-vert-bg rounded-lg text-sm"
          >
            <option value="all">Toutes les closeuses</option>
            {closeuses.map((c) => (
              <option key={c.id} value={c.idx}>{c.emoji} {c.name}</option>
            ))}
          </select>

          <input
            placeholder="🔎 Rechercher…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-3 py-1.5 border-2 border-vert-bg rounded-lg text-sm flex-1 min-w-[160px]"
          />

          <div className="ml-auto flex gap-2">
            <button onClick={() => downloadCSV(exportData(), `rentabilite-${dateKey(from)}-${dateKey(to)}.csv`)} className="text-xs bg-vert-bg text-vert font-bold px-3 py-1.5 rounded-lg">CSV</button>
            <button onClick={() => downloadXLSX(exportData(), `rentabilite-${dateKey(from)}-${dateKey(to)}.xlsx`)} className="text-xs bg-vert text-white font-bold px-3 py-1.5 rounded-lg">Excel</button>
            <button onClick={() => window.print()} className="text-xs bg-vert-mid text-white font-bold px-3 py-1.5 rounded-lg">PDF</button>
          </div>
        </div>
      </div>

      {/* KPI globaux */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="CA total" value={formatFCFA(totals.ca)} cls="text-vert" />
        <KPI label="Coût total" value={formatFCFA(totals.coutTotal)} cls="text-rouge" />
        <KPI label="Bénéfice" value={formatFCFA(totals.benefice)} cls={totals.benefice >= 0 ? 'text-vert' : 'text-rouge'} />
        <KPI label="Marge moyenne" value={totals.ca > 0 ? `${Math.round((totals.benefice / totals.ca) * 100)} %` : '—'} cls="text-vert-mid" />
      </div>

      {/* Alertes */}
      {alerts.length > 0 && (
        <div className="bg-white border-2 border-vert-bg rounded-2xl p-4 space-y-2">
          <div className="font-extrabold text-vert">⚠️ Alertes rentabilité</div>
          {alerts.map(({ row, level }) => (
            <div
              key={row.closeuseIdx}
              className={`p-3 rounded-xl text-sm flex items-center justify-between ${
                level === 'red' ? 'bg-rouge/10 text-rouge' : 'bg-or/30 text-vert'
              }`}
            >
              <span className="font-bold">
                {level === 'red' ? '🔴' : '🟠'} {row.closeuseName}
              </span>
              <span>
                {level === 'red' ? 'Non rentable' : `Marge faible (${row.marge.toFixed(1)}%)`} · Bénéfice {formatFCFA(row.benefice)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Classement */}
      <div className="grid md:grid-cols-2 gap-3">
        <RankingCard title="🏆 Plus rentables (bénéfice)" rows={ranking('benefice')} valueKey="benefice" format={formatFCFA} />
        <RankingCard title="💰 Meilleur CA" rows={ranking('ca')} valueKey="ca" format={formatFCFA} />
        <RankingCard title="📦 Plus de livraisons" rows={ranking('nbDelivered')} valueKey="nbDelivered" format={(v) => `${v}`} />
        <RankingCard title="📈 Meilleure marge" rows={ranking('marge')} valueKey="marge" format={(v) => `${v.toFixed(1)}%`} />
      </div>

      {/* Tableau principal */}
      <div className="bg-white border-2 border-vert-bg rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-vert-bg text-vert">
              <tr>
                {([
                  ['closeuseName', 'Closeuse'],
                  ['nbLeads', 'Leads'],
                  ['nbOrders', 'Cmd'],
                  ['nbDelivered', 'Livrées'],
                  ['ca', 'CA'],
                  ['pub', 'Pub'],
                  ['commission', 'Comm.'],
                  ['carburant', 'Carb.'],
                  ['repas', 'Repas'],
                  ['coutTotal', 'Coût total'],
                  ['benefice', 'Bénéfice'],
                  ['marge', 'Marge'],
                ] as [keyof ProfitRow, string][]).map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => {
                      if (sortBy === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                      else { setSortBy(key); setSortDir('desc'); }
                    }}
                    className="px-3 py-2 text-left font-bold cursor-pointer hover:bg-vert/10 whitespace-nowrap"
                  >
                    {label} {sortBy === key && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={12} className="text-center py-6 text-muted-foreground">Chargement…</td></tr>
              )}
              {!loading && paginated.length === 0 && (
                <tr><td colSpan={12} className="text-center py-6 text-muted-foreground">Aucune donnée</td></tr>
              )}
              {paginated.map((r) => {
                const lvl = alertLevel(r);
                return (
                  <tr
                    key={r.closeuseIdx}
                    onClick={() => setDetailIdx(r.closeuseIdx)}
                    className="border-t border-vert-bg/40 hover:bg-vert-bg/30 cursor-pointer"
                  >
                    <td className="px-3 py-2 font-bold">
                      {lvl === 'red' && '🔴 '}
                      {lvl === 'orange' && '🟠 '}
                      {lvl === 'green' && '🟢 '}
                      {r.emoji} {r.closeuseName}
                    </td>
                    <td className="px-3 py-2">{r.nbLeads}</td>
                    <td className="px-3 py-2">{r.nbOrders}</td>
                    <td className="px-3 py-2">{r.nbDelivered}</td>
                    <td className="px-3 py-2 font-bold text-vert">{formatFCFA(r.ca)}</td>
                    <td className="px-3 py-2">{formatFCFA(r.pub)}</td>
                    <td className="px-3 py-2">{formatFCFA(r.commission)}</td>
                    <td className="px-3 py-2">{formatFCFA(r.carburant)}</td>
                    <td className="px-3 py-2">{formatFCFA(r.repas)}</td>
                    <td className="px-3 py-2 text-rouge">{formatFCFA(r.coutTotal)}</td>
                    <td className={`px-3 py-2 font-extrabold ${r.benefice >= 0 ? 'text-vert' : 'text-rouge'}`}>
                      {formatFCFA(r.benefice)}
                    </td>
                    <td className="px-3 py-2">{r.marge.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {pageCount > 1 && (
          <div className="flex justify-end gap-2 p-3 text-sm">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded-lg bg-vert-bg text-vert font-bold disabled:opacity-40">←</button>
            <span className="self-center">{page} / {pageCount}</span>
            <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount} className="px-3 py-1 rounded-lg bg-vert-bg text-vert font-bold disabled:opacity-40">→</button>
          </div>
        )}
      </div>

      {/* Graphiques */}
      <div className="grid md:grid-cols-2 gap-3">
        <ChartCard title="📈 Évolution CA & Pub">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dailySeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip formatter={(v: number) => formatFCFA(v)} />
              <Legend />
              <Line type="monotone" dataKey="ca" stroke="#16a34a" name="CA" strokeWidth={2} />
              <Line type="monotone" dataKey="pub" stroke="#dc2626" name="Pub" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="📊 Comparaison closeuses (bénéfice)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={filtered.map((r) => ({ name: r.closeuseName, Bénéfice: r.benefice, CA: r.ca }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip formatter={(v: number) => formatFCFA(v)} />
              <Legend />
              <Bar dataKey="CA" fill="#16a34a" />
              <Bar dataKey="Bénéfice" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="🥧 Répartition des dépenses">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Publicité', value: totals.pub },
                  { name: 'Commission', value: totals.commission },
                  { name: 'Carburant', value: totals.carburant },
                  { name: 'Repas', value: totals.repas },
                ]}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label={(e) => `${e.name}: ${formatFCFA(Number(e.value))}`}
              >
                {PIE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatFCFA(v)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="💸 Bénéfice par closeuse">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={filtered.map((r) => ({ name: r.closeuseName, value: r.benefice }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip formatter={(v: number) => formatFCFA(v)} />
              <Bar dataKey="value" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Détail closeuse */}
      {detailRow && detailCloseuse && (
        <CloseuseDetail row={detailRow} closeuse={detailCloseuse} onClose={() => setDetailIdx(null)} />
      )}
    </div>
  );
}

function KPI({ label, value, cls }: { label: string; value: string; cls: string }) {
  return (
    <div className="bg-white border-2 border-vert-bg rounded-2xl p-4">
      <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
      <div className={`text-2xl font-extrabold mt-1 ${cls}`}>{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border-2 border-vert-bg rounded-2xl p-4">
      <div className="font-extrabold text-vert mb-3">{title}</div>
      {children}
    </div>
  );
}

function RankingCard({
  title,
  rows,
  valueKey,
  format,
}: {
  title: string;
  rows: ProfitRow[];
  valueKey: keyof ProfitRow;
  format: (v: number) => string;
}) {
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <div className="bg-white border-2 border-vert-bg rounded-2xl p-4">
      <div className="font-extrabold text-vert mb-2">{title}</div>
      {rows.length === 0 && <div className="text-sm text-muted-foreground">—</div>}
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <div key={r.closeuseIdx} className="flex justify-between items-center text-sm border-b border-vert-bg/40 pb-1.5">
            <span className="font-bold">{medals[i] || '·'} {r.emoji} {r.closeuseName}</span>
            <span className="font-extrabold text-vert">{format(r[valueKey] as number)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CloseuseDetail({
  row,
  closeuse,
  onClose,
}: {
  row: ProfitRow;
  closeuse: Closeuse;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-2xl font-extrabold text-vert">👩 {closeuse.emoji} {closeuse.name}</div>
            <div className="text-xs text-muted-foreground">Détail rentabilité</div>
          </div>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <DetailCard label="CA" value={formatFCFA(row.ca)} cls="text-vert" />
          <DetailCard label="Pub" value={formatFCFA(row.pub)} cls="text-rouge" />
          <DetailCard label="Commission" value={formatFCFA(row.commission)} cls="text-rouge" />
          <DetailCard label="Carburant" value={formatFCFA(row.carburant)} cls="text-rouge" />
          <DetailCard label="Repas" value={formatFCFA(row.repas)} cls="text-rouge" />
          <DetailCard label="Coût total" value={formatFCFA(row.coutTotal)} cls="text-rouge" />
          <DetailCard label="Bénéfice" value={formatFCFA(row.benefice)} cls={row.benefice >= 0 ? 'text-vert' : 'text-rouge'} />
          <DetailCard label="Marge" value={`${row.marge.toFixed(1)}%`} cls="text-vert-mid" />
          <DetailCard label="Livrées" value={`${row.nbDelivered}`} cls="text-vert" />
          <DetailCard label="Taux livraison" value={`${row.tauxLivraison}%`} cls="text-vert-mid" />
          <DetailCard label="Bénéfice/livrée" value={formatFCFA(row.beneficeParLivree)} cls="text-vert" />
          <DetailCard label="Coût pub/livrée" value={formatFCFA(row.pubParLivree)} cls="text-rouge" />
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value, cls }: { label: string; value: string; cls: string }) {
  return (
    <div className="bg-vert-bg/40 rounded-xl p-3">
      <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
      <div className={`text-lg font-extrabold ${cls}`}>{value}</div>
    </div>
  );
}
