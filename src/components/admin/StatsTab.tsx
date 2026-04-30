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

const SOURCE_EMOJI: Record<string, string> = {
  Facebook: '📘',
  WhatsApp: '🟢',
  Google: '🔍',
  TikTok: '🎵',
  Instagram: '📸',
  YouTube: '▶️',
  Direct: '🌐',
  Autre: '🔗',
  Inconnu: '❓',
};

function normSource(s: string | null | undefined): string {
  if (!s) return 'Inconnu';
  const v = s.trim();
  if (!v) return 'Inconnu';
  const low = v.toLowerCase();
  if (low === 'fb' || low.includes('facebook')) return 'Facebook';
  if (low.includes('whatsapp') || low === 'wa') return 'WhatsApp';
  if (low.includes('google')) return 'Google';
  if (low.includes('tiktok')) return 'TikTok';
  if (low.includes('insta')) return 'Instagram';
  if (low.includes('youtube') || low === 'yt') return 'YouTube';
  if (low === 'direct') return 'Direct';
  if (v.length <= 3) return 'Autre';
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export function StatsTab({
  orders,
  visits,
  visitsTotal,
  visitsToday,
}: {
  orders: Order[];
  visits: Visit[];
  visitsTotal: number;
  visitsToday: number;
}) {
  const stats = useMemo(() => {
    const delivered = orders.filter((o) => o.status === 'delivered');
    const ca = delivered.reduce((s, o) => s + o.product_price, 0);
    const conversion = visitsTotal > 0 ? (orders.length / visitsTotal) * 100 : 0;

    // Taux de livraison
    // Numérateur   : commandes effectivement livrées (status = 'delivered')
    // Dénominateur : TOUTES les commandes reçues sur la boutique (annulées comprises)
    const CANCELLED_STATUSES = ['cancelled', 'canceled', 'annulee', 'annulée', 'refused', 'refusee', 'refusée', 'rejected'];
    const isCancelled = (s: string | null | undefined) =>
      CANCELLED_STATUSES.includes((s || '').toLowerCase().trim());

    const cancelledOrders = orders.filter((o) => isCancelled(o.status));
    const inProgressOrders = orders.filter((o) => !isCancelled(o.status) && o.status !== 'delivered');
    const denom = orders.length; // toutes les commandes reçues
    const deliveryRate = denom > 0 ? (delivered.length / denom) * 100 : 0;

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

    // Source de trafic (échantillon récent)
    const bySource = visits.reduce<Record<string, number>>((acc, v) => {
      const k = normSource(v.source);
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    const sourceTotal = Object.values(bySource).reduce((s, n) => s + n, 0);

    const days: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const count = orders.filter((o) => o.created_at?.slice(0, 10) === ds).length;
      days.push({ day: d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' }), count });
    }
    const maxDay = Math.max(1, ...days.map((d) => d.count));

    return {
      ca,
      conversion,
      byCountry,
      byProduct,
      bySource,
      sourceTotal,
      days,
      maxDay,
      deliveredCount: delivered.length,
      deliveryRate,
      inProgressCount: inProgressOrders.length,
      cancelledCount: cancelledOrders.length,
      denomCount: denom,
    };
  }, [orders, visits, visitsTotal]);

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiBox label="Visites aujourd'hui" value={visitsToday.toLocaleString('fr-FR')} sub="Depuis 00h00" highlight />
        <KpiBox label="Visites total" value={visitsTotal.toLocaleString('fr-FR')} sub="Toutes périodes" />
        <KpiBox label="Conversion" value={`${stats.conversion.toFixed(2)}%`} sub={`${orders.length} cmds / ${visitsTotal} visites`} />
        <KpiBox
          label="Taux de livraison"
          value={`${stats.deliveryRate.toFixed(1)}%`}
          sub={`${stats.deliveredCount}/${stats.denomCount} commandes reçues`}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <KpiBox label="CA Livré (total)" value={formatFCFA(stats.ca)} sub={`${stats.deliveredCount} commandes livrées`} />
        <KpiBox label="Commandes total" value={orders.length.toString()} sub="Toutes périodes" />
      </div>

      {/* Détail du taux de livraison */}
      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-vert">🚚 Détail du taux de livraison</h3>
          <span className="text-2xl font-extrabold text-vert">{stats.deliveryRate.toFixed(1)}%</span>
        </div>
        <div className="text-xs text-muted-foreground mb-3">
          Formule : <strong>livrées ÷ (livrées + en cours valides)</strong> — les commandes annulées sont exclues du calcul.
        </div>
        <div className="h-3 bg-vert-bg/40 rounded-full overflow-hidden flex mb-4">
          {stats.denomCount > 0 && (
            <>
              <div
                className="h-full bg-vert"
                style={{ width: `${(stats.deliveredCount / stats.denomCount) * 100}%` }}
                title={`${stats.deliveredCount} livrées`}
              />
              <div
                className="h-full bg-[oklch(0.75_0.15_75)]"
                style={{ width: `${(stats.inProgressCount / stats.denomCount) * 100}%` }}
                title={`${stats.inProgressCount} en cours`}
              />
            </>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-vert/10 rounded-xl p-3">
            <div className="text-xs font-bold uppercase text-vert">✅ Livrées</div>
            <div className="text-xl font-extrabold text-vert mt-1">{stats.deliveredCount}</div>
            <div className="text-[11px] text-muted-foreground">comptées au numérateur</div>
          </div>
          <div className="bg-[oklch(0.95_0.05_75)] rounded-xl p-3">
            <div className="text-xs font-bold uppercase text-[oklch(0.45_0.15_60)]">⏳ En cours valides</div>
            <div className="text-xl font-extrabold text-[oklch(0.45_0.15_60)] mt-1">{stats.inProgressCount}</div>
            <div className="text-[11px] text-muted-foreground">en attente / suivi</div>
          </div>
          <div className="bg-rouge/10 rounded-xl p-3">
            <div className="text-xs font-bold uppercase text-rouge">❌ Annulées</div>
            <div className="text-xl font-extrabold text-rouge mt-1">{stats.cancelledCount}</div>
            <div className="text-[11px] text-muted-foreground">exclues du calcul</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-3 text-right">
          Base de calcul : <strong>{stats.denomCount}</strong> commandes valides ·
          Total brut : {orders.length}
        </div>
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

      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        <h3 className="font-extrabold text-vert mb-3">🎯 Sources de trafic</h3>
        <div className="text-xs text-muted-foreground mb-3">
          Sur les {stats.sourceTotal.toLocaleString('fr-FR')} dernières visites trackées
        </div>
        <div className="space-y-2">
          {Object.entries(stats.bySource)
            .sort((a, b) => b[1] - a[1])
            .map(([k, v]) => {
              const pct = stats.sourceTotal > 0 ? (v / stats.sourceTotal) * 100 : 0;
              return (
                <div key={k}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold">
                      {SOURCE_EMOJI[k] || '🔗'} {k}
                    </span>
                    <span className="text-vert font-extrabold">
                      {v.toLocaleString('fr-FR')} <span className="text-muted-foreground font-normal">· {pct.toFixed(1)}%</span>
                    </span>
                  </div>
                  <div className="h-2 bg-vert-bg/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-vert to-vert-mid rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          {Object.keys(stats.bySource).length === 0 && (
            <div className="text-sm text-muted-foreground">Aucune visite trackée</div>
          )}
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

function KpiBox({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border-2 p-4 ${
        highlight ? 'bg-gradient-to-br from-vert to-vert-mid text-white border-vert' : 'bg-white border-vert-bg'
      }`}
    >
      <div className={`text-xs font-bold uppercase ${highlight ? 'text-white/80' : 'text-muted-foreground'}`}>{label}</div>
      <div className={`text-2xl font-extrabold mt-1 ${highlight ? 'text-white' : 'text-vert'}`}>{value}</div>
      <div className={`text-xs mt-0.5 ${highlight ? 'text-white/80' : 'text-muted-foreground'}`}>{sub}</div>
    </div>
  );
}
