import { useMemo, useState } from 'react';
import { formatFCFA } from '@/lib/products';
import { useLivreurs } from '@/lib/livreurs';

type Order = {
  id: string;
  order_number: string;
  product_name: string;
  product_price: number;
  status: string;
  livreur_idx: number | null;
  created_at: string;
};

const PERIODS = [
  { k: '7d', label: '7 jours', days: 7 },
  { k: '30d', label: '30 jours', days: 30 },
  { k: '90d', label: '90 jours', days: 90 },
  { k: 'all', label: 'Tout', days: 99999 },
];

export function ComptaTab({ orders }: { orders: Order[] }) {
  const [period, setPeriod] = useState('30d');
  const { livreurs } = useLivreurs();

  const filtered = useMemo(() => {
    const days = PERIODS.find((p) => p.k === period)?.days || 30;
    const cutoff = Date.now() - days * 24 * 3600 * 1000;
    return orders.filter((o) => new Date(o.created_at).getTime() >= cutoff);
  }, [orders, period]);

  const totals = useMemo(() => {
    const delivered = filtered.filter((o) => o.status === 'delivered');
    const cancelled = filtered.filter((o) => o.status === 'cancelled');
    const pending = filtered.filter((o) => ['pending', 'confirmed', 'approche', 'suivi'].includes(o.status));
    const ca = delivered.reduce((s, o) => s + o.product_price, 0);
    const potentiel = pending.reduce((s, o) => s + o.product_price, 0);
    const perdu = cancelled.reduce((s, o) => s + o.product_price, 0);
    return { delivered, cancelled, pending, ca, potentiel, perdu };
  }, [filtered]);

  const parLivreur = useMemo(() => {
    const map: Record<number, { count: number; ca: number }> = {};
    livreurs.forEach((l) => { map[l.idx] = { count: 0, ca: 0 }; });
    totals.delivered.forEach((o) => {
      const idx = o.livreur_idx ?? -1;
      if (!map[idx]) map[idx] = { count: 0, ca: 0 };
      map[idx].count += 1;
      map[idx].ca += o.product_price;
    });
    return map;
  }, [totals.delivered, livreurs]);

  const exportCSV = () => {
    const headers = ['N° Commande', 'Date', 'Produit', 'Prix', 'Statut', 'Livreur'];
    const rows = filtered.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleString('fr-FR'),
      o.product_name,
      o.product_price,
      o.status,
      livreurs.find((l) => l.idx === o.livreur_idx)?.name || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compta-shopafrik-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.k}
            onClick={() => setPeriod(p.k)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-bold ${
              period === p.k ? 'bg-vert-mid text-white' : 'bg-white border-2 border-vert-bg text-muted-foreground'
            }`}
          >
            {p.label}
          </button>
        ))}
        <button onClick={exportCSV} className="ml-auto bg-vert text-white px-4 py-2 rounded-xl text-sm font-extrabold hover:bg-vert-mid">
          📥 Export CSV
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <Card label="✅ CA Réalisé" value={formatFCFA(totals.ca)} sub={`${totals.delivered.length} livrées`} cls="text-vert" />
        <Card label="⏳ Potentiel" value={formatFCFA(totals.potentiel)} sub={`${totals.pending.length} en cours`} cls="text-[oklch(0.55_0.15_60)]" />
        <Card label="❌ Perdu" value={formatFCFA(totals.perdu)} sub={`${totals.cancelled.length} annulées`} cls="text-rouge" />
      </div>

      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        <h3 className="font-extrabold text-vert mb-4">👥 Performance livreurs</h3>
        <div className="space-y-2">
          {livreurs.map((l) => {
            const v = parLivreur[l.idx] || { count: 0, ca: 0 };
            return (
              <div key={l.id} className="flex justify-between items-center border-b border-vert-bg/40 pb-2">
                <div>
                  <div className="font-bold">{l.emoji} {l.name}{!l.active && <span className="text-xs text-muted-foreground ml-2">(inactif)</span>}</div>
                  <div className="text-xs text-muted-foreground">{l.zone}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-vert">{formatFCFA(v.ca)}</div>
                  <div className="text-xs text-muted-foreground">{v.count} livraisons</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, sub, cls }: { label: string; value: string; sub: string; cls: string }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-vert-bg p-4">
      <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
      <div className={`text-2xl font-extrabold mt-1 ${cls}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}
