import { useEffect, useMemo, useState } from 'react';
import { formatFCFA, PRODUCTS, PRODUCT_COSTS } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';

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

type StockTx = {
  produit: string;
  type: string;
  quantite: number;
};

/** Normalise les sources brutes (an, fb, Facebook, FACEBOOK…) vers un libellé propre */
function normalizeSource(raw: string | null | undefined): string {
  const s = (raw || '').toLowerCase().trim();
  if (!s) return 'Direct';
  if (s === 'fb' || s.includes('facebook')) return 'Facebook';
  if (s === 'ig' || s.includes('instagram')) return 'Instagram';
  if (s.includes('whatsapp') || s === 'wa') return 'WhatsApp';
  if (s.includes('google')) return 'Google';
  if (s.includes('tiktok') || s === 'tt') return 'TikTok';
  if (s.includes('youtube') || s === 'yt') return 'YouTube';
  if (s === 'direct') return 'Direct';
  if (s === 'an' || s === 'autre') return 'Autre';
  // Fallback : garde la valeur brute capitalisée
  return raw!.charAt(0).toUpperCase() + raw!.slice(1);
}

export function StatsTab({ orders, visits }: { orders: Order[]; visits: Visit[] }) {
  const [visitsTotal, setVisitsTotal] = useState<number | null>(null);
  const [visitsToday, setVisitsToday] = useState<number | null>(null);
  const [sourceCounts, setSourceCounts] = useState<Record<string, number>>({});
  const [stockTxs, setStockTxs] = useState<StockTx[]>([]);

  // Compteurs visites + agrégat par source (vue exhaustive, pas limitée à 1000)
  useEffect(() => {
    let mounted = true;

    const loadCounts = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [{ count: total }, { count: todayCount }, allSources] = await Promise.all([
        supabase.from('visits').select('id', { count: 'exact', head: true }),
        supabase
          .from('visits')
          .select('id', { count: 'exact', head: true })
          .gte('visited_at', today.toISOString()),
        // On lit toutes les sources (paginé par lots de 1000)
        fetchAllSources(),
      ]);

      if (!mounted) return;
      setVisitsTotal(total ?? 0);
      setVisitsToday(todayCount ?? 0);
      setSourceCounts(allSources);
    };

    const loadStock = async () => {
      const { data } = await supabase
        .from('stock_transactions')
        .select('produit, type, quantite')
        .limit(5000);
      if (!mounted) return;
      setStockTxs((data || []) as StockTx[]);
    };

    loadCounts();
    loadStock();
  }, []);

  const stats = useMemo(() => {
    const delivered = orders.filter((o) => o.status === 'delivered');
    const ca = delivered.reduce((s, o) => s + o.product_price, 0);
    const totalVisits = visitsTotal ?? visits.length;
    const conversion = totalVisits > 0 ? (orders.length / totalVisits) * 100 : 0;

    const byCountry = orders.reduce<Record<string, number>>((acc, o) => {
      const k = o.country || 'N/A';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    const byProduct = orders.reduce<Record<string, { count: number; ca: number }>>((acc, o) => {
      const k = o.product_name;
      if (!acc[k]) acc[k] = { count: 0, ca: 0 };
      acc[k].count += 1;
      acc[k].ca += o.product_price;
      return acc;
    }, {});

    const days: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const count = orders.filter((o) => o.created_at?.slice(0, 10) === ds).length;
      days.push({ day: d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' }), count });
    }
    const maxDay = Math.max(1, ...days.map((d) => d.count));

    return { ca, conversion, byCountry, byProduct, days, maxDay, deliveredCount: delivered.length, totalVisits };
  }, [orders, visits, visitsTotal]);

  // Sources groupées + normalisées
  const sources = useMemo(() => {
    const grouped: Record<string, number> = {};
    Object.entries(sourceCounts).forEach(([raw, n]) => {
      const k = normalizeSource(raw);
      grouped[k] = (grouped[k] || 0) + n;
    });
    return Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  }, [sourceCounts]);

  const sourcesTotal = sources.reduce((s, [, n]) => s + n, 0);

  // Stock par produit (matrix → quantité totale par produit) + valeur d'achat
  const stockByProduct = useMemo(() => {
    const qty: Record<string, number> = {};
    PRODUCTS.forEach((p) => { qty[p.shortName] = 0; });
    stockTxs.forEach((t) => {
      if (qty[t.produit] == null) qty[t.produit] = 0;
      qty[t.produit] += (t.type === 'entree' ? 1 : -1) * t.quantite;
    });
    return PRODUCTS.map((p) => {
      const q = Math.max(0, qty[p.shortName] || 0);
      const pa = PRODUCT_COSTS[p.shortName] ?? 0;
      return { name: p.shortName, emoji: p.emoji, qty: q, pa, value: q * pa };
    });
  }, [stockTxs]);

  const stockTotalValue = stockByProduct.reduce((s, r) => s + r.value, 0);
  const stockTotalQty = stockByProduct.reduce((s, r) => s + r.qty, 0);

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-3">
        <KpiBox label="CA Livré" value={formatFCFA(stats.ca)} sub={`${stats.deliveredCount} commandes`} />
        <KpiBox label="Visites total" value={(visitsTotal ?? '…').toString()} sub="Depuis le début" />
        <KpiBox label="Visites aujourd'hui" value={(visitsToday ?? '…').toString()} sub="Mises à jour temps réel" />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <KpiBox label="Conversion globale" value={`${stats.conversion.toFixed(2)}%`} sub={`${orders.length} cmd / ${stats.totalVisits} visites`} />
        <KpiBox label="Valeur stock totale" value={formatFCFA(stockTotalValue)} sub={`${stockTotalQty} unités en stock`} />
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

      {/* Sources de trafic */}
      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        <h3 className="font-extrabold text-vert mb-3">🚦 Sources de trafic</h3>
        {sources.length === 0 && <div className="text-sm text-muted-foreground">Chargement…</div>}
        <div className="space-y-2">
          {sources.map(([name, n]) => {
            const pct = sourcesTotal > 0 ? (n / sourcesTotal) * 100 : 0;
            return (
              <div key={name}>
                <div className="flex justify-between text-sm mb-0.5">
                  <span className="font-bold">{name}</span>
                  <span className="text-muted-foreground">{n} · {pct.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-vert-bg rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-vert to-vert-mid" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coût du stock par produit */}
      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5 overflow-x-auto">
        <h3 className="font-extrabold text-vert mb-3">💰 Coût total du stock</h3>
        <table className="w-full text-sm min-w-[420px]">
          <thead>
            <tr className="border-b-2 border-vert-bg">
              <th className="text-left py-2 px-2">Produit</th>
              <th className="text-right py-2 px-2">Qté</th>
              <th className="text-right py-2 px-2">PA unitaire</th>
              <th className="text-right py-2 px-2">Valeur stock</th>
            </tr>
          </thead>
          <tbody>
            {stockByProduct.map((r) => (
              <tr key={r.name} className="border-b border-vert-bg/50">
                <td className="py-2 px-2 font-bold">{r.emoji} {r.name}</td>
                <td className="text-right py-2 px-2">{r.qty}</td>
                <td className="text-right py-2 px-2 text-muted-foreground">{formatFCFA(r.pa)}</td>
                <td className="text-right py-2 px-2 font-extrabold text-vert">{formatFCFA(r.value)}</td>
              </tr>
            ))}
            <tr className="bg-vert-bg/40">
              <td className="py-2 px-2 font-extrabold">TOTAL</td>
              <td className="text-right py-2 px-2 font-extrabold">{stockTotalQty}</td>
              <td></td>
              <td className="text-right py-2 px-2 font-extrabold text-vert">{formatFCFA(stockTotalValue)}</td>
            </tr>
          </tbody>
        </table>
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

/** Récupère toutes les sources en paginant par lots de 1000 (limite Supabase) */
async function fetchAllSources(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  const pageSize = 1000;
  let from = 0;
  // Garde-fou : max 50 pages = 50k lignes
  for (let i = 0; i < 50; i++) {
    const { data, error } = await supabase
      .from('visits')
      .select('source')
      .range(from, from + pageSize - 1);
    if (error || !data || data.length === 0) break;
    for (const row of data) {
      const k = (row as { source: string | null }).source || 'Direct';
      counts[k] = (counts[k] || 0) + 1;
    }
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return counts;
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
