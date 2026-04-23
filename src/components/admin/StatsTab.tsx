import { useMemo } from 'react';
import { formatFCFA } from '@/lib/products';

type Order = {
  id: string;
  product_name: string;
  product_price: number;
  country: string | null;
  city: string | null;
  status: string;
  created_at: string;
};

type Visit = {
  id: string;
  page: string | null;
  country: string | null;
  source: string | null;
  visited_at: string | null;
};

export function StatsTab({ orders, visits }: { orders: Order[]; visits: Visit[] }) {
  const stats = useMemo(() => {
    const delivered = orders.filter((o) => o.status === 'delivered');
    const ca = delivered.reduce((s, o) => s + o.product_price, 0);
    const conversion = visits.length > 0 ? (orders.length / visits.length) * 100 : 0;

    // Par pays
    const byCountry = orders.reduce<Record<string, number>>((acc, o) => {
      const k = o.country || 'N/A';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    // Par produit
    const byProduct = orders.reduce<Record<string, { count: number; ca: number }>>((acc, o) => {
      const k = o.product_name;
      if (!acc[k]) acc[k] = { count: 0, ca: 0 };
      acc[k].count += 1;
      acc[k].ca += o.product_price;
      return acc;
    }, {});

    // 7 derniers jours
    const days: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const count = orders.filter((o) => o.created_at?.slice(0, 10) === ds).length;
      days.push({ day: d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' }), count });
    }
    const maxDay = Math.max(1, ...days.map((d) => d.count));

    return { ca, conversion, byCountry, byProduct, days, maxDay, deliveredCount: delivered.length };
  }, [orders, visits]);

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-3">
        <KpiBox label="CA Livré" value={formatFCFA(stats.ca)} sub={`${stats.deliveredCount} commandes`} />
        <KpiBox label="Visites" value={visits.length.toString()} sub="Total tracké" />
        <KpiBox label="Conversion" value={`${stats.conversion.toFixed(1)}%`} sub="Commandes / Visites" />
      </div>

      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        <h3 className="font-extrabold text-vert mb-4">📈 Commandes — 7 derniers jours</h3>
        <div className="flex items-end gap-2 h-40">
          {stats.days.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs font-bold text-vert">{d.count}</div>
              <div
                className="w-full bg-gradient-to-t from-vert to-vert-mid rounded-t-lg transition-all"
                style={{ height: `${(d.count / stats.maxDay) * 100}%`, minHeight: '4px' }}
              />
              <div className="text-[10px] text-muted-foreground">{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
          <h3 className="font-extrabold text-vert mb-3">🌍 Par pays</h3>
          <div className="space-y-2">
            {Object.entries(stats.byCountry).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span>{k}</span>
                <span className="font-bold text-vert">{v}</span>
              </div>
            ))}
            {Object.keys(stats.byCountry).length === 0 && (
              <div className="text-sm text-muted-foreground">Aucune donnée</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
          <h3 className="font-extrabold text-vert mb-3">🌿 Par produit</h3>
          <div className="space-y-2">
            {Object.entries(stats.byProduct).sort((a, b) => b[1].ca - a[1].ca).map(([k, v]) => (
              <div key={k} className="text-sm">
                <div className="flex justify-between">
                  <span className="truncate pr-2">{k}</span>
                  <span className="font-bold text-vert">{v.count}</span>
                </div>
                <div className="text-xs text-muted-foreground">{formatFCFA(v.ca)}</div>
              </div>
            ))}
            {Object.keys(stats.byProduct).length === 0 && (
              <div className="text-sm text-muted-foreground">Aucune donnée</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-vert-bg p-4">
      <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
      <div className="text-2xl font-extrabold text-vert mt-1">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}
