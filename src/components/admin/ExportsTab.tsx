import { useMemo, useState } from 'react';
import { useLeads } from '@/lib/leads';
import { useCloseuses } from '@/lib/closeuses';
import { computeCloseuseStats } from '@/lib/closeuseScore';
import { downloadCSV, downloadXLSX } from '@/lib/exports';
import type { Order } from '@/components/admin/OrdersTab';

export function ExportsTab({ orders }: { orders: Order[] }) {
  const { leads } = useLeads(null);
  const { closeuses } = useCloseuses();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [closeuseIdx, setCloseuseIdx] = useState<string>('');
  const [productSlug, setProductSlug] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const filter = <T extends { created_at?: string | null; closeuse_idx?: number | null; product_slug?: string | null; status?: string | null }>(rows: T[]) => {
    return rows.filter((r) => {
      if (from && r.created_at && new Date(r.created_at) < new Date(from)) return false;
      if (to && r.created_at && new Date(r.created_at) > new Date(`${to}T23:59:59`)) return false;
      if (closeuseIdx && String(r.closeuse_idx ?? '') !== closeuseIdx) return false;
      if (productSlug && r.product_slug !== productSlug) return false;
      if (status && r.status !== status) return false;
      return true;
    });
  };

  const filteredLeads = useMemo(() => filter(leads), [leads, from, to, closeuseIdx, productSlug, status]);
  const filteredOrders = useMemo(() => filter(orders as any), [orders, from, to, closeuseIdx, productSlug, status]);

  const performances = useMemo(() => closeuses.map((c) => {
    const own = filteredLeads.filter((l) => l.closeuse_idx === c.idx);
    const s = computeCloseuseStats(own);
    return { closeuse: c.name, idx: c.idx, slug: c.slug, ...s, validationRate: Math.round(s.validationRate * 100) + '%', deliveryRate: Math.round(s.deliveryRate * 100) + '%' };
  }), [closeuses, filteredLeads]);

  const productSlugs = [...new Set(leads.map((l) => l.product_slug))];

  const downloadBoth = (rows: any[], name: string) => ({
    xlsx: () => downloadXLSX(rows, `${name}.xlsx`),
    csv: () => downloadCSV(rows, `${name}.csv`),
  });

  const exports = [
    { label: '📋 Leads', rows: filteredLeads, name: 'leads' },
    { label: '📦 Commandes', rows: filteredOrders, name: 'commandes' },
    { label: '🏆 Performances closeuses', rows: performances, name: 'performances-closeuses' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border-2 border-vert-bg space-y-3">
        <div className="font-extrabold">🔎 Filtres</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <label className="text-xs">Du
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border-2 border-gray-200 rounded px-2 py-1 mt-0.5" />
          </label>
          <label className="text-xs">Au
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border-2 border-gray-200 rounded px-2 py-1 mt-0.5" />
          </label>
          <label className="text-xs">Closeuse
            <select value={closeuseIdx} onChange={(e) => setCloseuseIdx(e.target.value)} className="w-full border-2 border-gray-200 rounded px-2 py-1 mt-0.5">
              <option value="">Toutes</option>
              {closeuses.map((c) => <option key={c.id} value={c.idx}>{c.name}</option>)}
            </select>
          </label>
          <label className="text-xs">Produit
            <select value={productSlug} onChange={(e) => setProductSlug(e.target.value)} className="w-full border-2 border-gray-200 rounded px-2 py-1 mt-0.5">
              <option value="">Tous</option>
              {productSlugs.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="text-xs">Statut
            <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="ex: valide" className="w-full border-2 border-gray-200 rounded px-2 py-1 mt-0.5" />
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {exports.map((e) => {
          const d = downloadBoth(e.rows, e.name);
          return (
            <div key={e.name} className="bg-white rounded-2xl p-4 border-2 border-vert-bg">
              <div className="font-extrabold mb-1">{e.label}</div>
              <div className="text-xs text-gray-500 mb-2">{e.rows.length} lignes</div>
              <div className="flex gap-2">
                <button onClick={d.xlsx} disabled={e.rows.length === 0} className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-lg text-sm disabled:opacity-40">📊 .xlsx</button>
                <button onClick={d.csv} disabled={e.rows.length === 0} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg text-sm disabled:opacity-40">📄 .csv</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
