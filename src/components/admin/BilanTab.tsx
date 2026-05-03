import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { formatFCFA } from '@/lib/products';
import { computeWeeklyKPI, PRODUCTS_FOR_AI, type WeeklyKPI } from '@/lib/weeklyKPI';
import { toast } from 'sonner';

type FinanceRules = { pub_pct: number; stock_pct: number; epargne_pct: number; perso_pct: number };
type FinanceReco = {
  profit_net: number;
  pub_budget: number;
  pub_daily: number;
  pub_focus: string;
  stock_budget: number;
  stock_priorite: string;
  epargne: number;
  perso: number;
  raison: string;
};
type Report = {
  id: string;
  week_start: string;
  week_end: string;
  kpi: WeeklyKPI;
  ia_report: string | null;
  finance_reco: FinanceReco | null;
  alerts: Array<{ severity: string; message: string }> | null;
  generated_at: string;
};

export function BilanTab() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [rules, setRules] = useState<FinanceRules>({ pub_pct: 40, stock_pct: 30, epargne_pct: 20, perso_pct: 10 });
  const [showRules, setShowRules] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [rRes, sRes] = await Promise.all([
      supabase.from('weekly_reports').select('*').order('week_start', { ascending: false }).limit(20),
      supabase.from('app_settings').select('value').eq('key', 'finance_rules').maybeSingle(),
    ]);
    const list = (rRes.data || []) as unknown as Report[];
    setReports(list);
    if (list[0]) setSelected(list[0]);
    if (sRes.data?.value) setRules(sRes.data.value as FinanceRules);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const generateNow = async (offset = -1) => {
    setGenerating(true);
    try {
      const kpi = await computeWeeklyKPI(offset);
      const { data, error } = await supabase.functions.invoke('weekly-coach', {
        body: { week_start: kpi.week_start, week_end: kpi.week_end, kpi, products: PRODUCTS_FOR_AI, finance_rules: rules },
      });
      if (error) throw error;
      const result = data as { report_markdown: string; finance_reco: FinanceReco; alerts: Array<{ severity: string; message: string }> };

      const { error: upErr } = await supabase.from('weekly_reports').upsert([{
        week_start: kpi.week_start,
        week_end: kpi.week_end,
        kpi: kpi as never,
        ia_report: result.report_markdown,
        finance_reco: result.finance_reco as never,
        alerts: (result.alerts || []) as never,
        generated_at: new Date().toISOString(),
      }], { onConflict: 'week_start' });
      if (upErr) throw upErr;

      toast.success('Bilan généré ✨');
      await load();
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Échec génération');
    } finally {
      setGenerating(false);
    }
  };

  const saveRules = async () => {
    const total = rules.pub_pct + rules.stock_pct + rules.epargne_pct + rules.perso_pct;
    if (total !== 100) { toast.error(`Le total doit faire 100% (actuel: ${total}%)`); return; }
    const { error } = await supabase.from('app_settings').upsert([{ key: 'finance_rules', value: rules as never, updated_at: new Date().toISOString() }]);
    if (error) toast.error(error.message);
    else { toast.success('Règles sauvegardées'); setShowRules(false); }
  };

  if (loading) return <div className="text-center py-10 text-muted-foreground">Chargement…</div>;

  return (
    <div className="space-y-5">
      {/* Header actions */}
      <div className="flex flex-wrap gap-2 items-center justify-between bg-white rounded-2xl border-2 border-vert-bg p-4">
        <div>
          <h2 className="text-vert font-extrabold text-lg">🧠 Coach IA — Bilan hebdo</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Auto chaque dimanche 20h · ou génère à la demande</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowRules((v) => !v)} className="px-3 py-2 rounded-xl bg-vert-bg text-vert text-xs font-extrabold hover:bg-vert-bg/70">
            ⚙️ Répartition
          </button>
          <button onClick={() => generateNow(-1)} disabled={generating} className="px-3 py-2 rounded-xl bg-vert text-white text-xs font-extrabold hover:bg-vert-mid disabled:opacity-50">
            {generating ? '⏳ Analyse IA…' : '🔄 Générer semaine passée'}
          </button>
          <button onClick={() => generateNow(0)} disabled={generating} className="px-3 py-2 rounded-xl bg-or text-vert text-xs font-extrabold hover:bg-or-light disabled:opacity-50">
            {generating ? '⏳ …' : '⚡ Bilan en cours'}
          </button>
        </div>
      </div>

      {/* Modale règles */}
      {showRules && (
        <div className="bg-vert-bg/30 border-2 border-vert-mid rounded-2xl p-5">
          <h3 className="text-vert font-extrabold mb-1">Comment répartir ton profit ?</h3>
          <p className="text-xs text-muted-foreground mb-4">Total doit faire 100%. L'IA appliquera ces règles à ton profit net.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              { k: 'pub_pct', label: '📣 Pub' },
              { k: 'stock_pct', label: '📦 Stock' },
              { k: 'epargne_pct', label: '🏦 Épargne' },
              { k: 'perso_pct', label: '👤 Toi' },
            ] as const).map((f) => (
              <label key={f.k} className="block">
                <span className="text-xs text-muted-foreground font-bold">{f.label}</span>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="number" min={0} max={100}
                    value={rules[f.k]}
                    onChange={(e) => setRules((r) => ({ ...r, [f.k]: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-lg border-2 border-vert-bg outline-none focus:border-vert-mid font-extrabold text-vert text-lg"
                  />
                  <span className="text-vert font-extrabold">%</span>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-4 flex gap-2 items-center justify-between">
            <span className="text-sm font-bold text-vert">
              Total : {rules.pub_pct + rules.stock_pct + rules.epargne_pct + rules.perso_pct}%
            </span>
            <button onClick={saveRules} className="px-4 py-2 rounded-xl bg-vert-mid text-white font-extrabold hover:bg-vert">
              ✓ Sauvegarder
            </button>
          </div>
        </div>
      )}

      {/* Sélecteur de semaine */}
      {reports.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {reports.map((r) => (
            <button key={r.id} onClick={() => setSelected(r)}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap border-2 ${
                selected?.id === r.id ? 'bg-vert text-white border-vert' : 'bg-white text-vert border-vert-bg hover:border-vert-mid'
              }`}>
              {new Date(r.week_start).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} → {new Date(r.week_end).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
            </button>
          ))}
        </div>
      )}

      {!selected && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-vert-bg p-10 text-center">
          <div className="text-5xl mb-3">📊</div>
          <p className="text-muted-foreground mb-4">Aucun bilan encore. Lance une génération pour démarrer.</p>
          <button onClick={() => generateNow(-1)} disabled={generating} className="px-5 py-3 rounded-xl bg-vert text-white font-extrabold hover:bg-vert-mid disabled:opacity-50">
            {generating ? '⏳ Analyse IA…' : '🔄 Générer le bilan de la semaine passée'}
          </button>
        </div>
      )}

      {selected && (
        <>
          {/* Alertes */}
          {selected.alerts && selected.alerts.length > 0 && (
            <div className="space-y-2">
              {selected.alerts.map((a, i) => (
                <div key={i} className={`rounded-xl p-3 text-sm font-semibold ${
                  a.severity === 'danger' ? 'bg-rouge-light text-rouge border-2 border-rouge/30' :
                  a.severity === 'warning' ? 'bg-[oklch(0.95_0.10_85)] text-[oklch(0.40_0.10_82)] border-2 border-[oklch(0.80_0.15_85)]' :
                  'bg-vert-bg text-vert border-2 border-vert-bg'
                }`}>
                  {a.severity === 'danger' ? '🚨' : a.severity === 'warning' ? '⚠️' : 'ℹ️'} {a.message}
                </div>
              ))}
            </div>
          )}

          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Kpi label="CA livré" value={formatFCFA(selected.kpi.ca_livre)} sub={`${selected.kpi.vs_n1?.ca_pct >= 0 ? '▲' : '▼'} ${Math.abs(selected.kpi.vs_n1?.ca_pct || 0)}% vs N-1`} good={selected.kpi.vs_n1?.ca_pct >= 0} />
            <Kpi label="Profit net" value={formatFCFA(selected.kpi.profit_net)} sub={`${selected.kpi.nb_delivered} livrées`} good={selected.kpi.profit_net >= 0} />
            <Kpi label="ROAS pub" value={`${selected.kpi.roas}x`} sub={`Pub ${formatFCFA(selected.kpi.pub_spend)}`} good={selected.kpi.roas >= 2} />
            <Kpi label="Taux livraison" value={`${selected.kpi.taux_livraison}%`} sub={`${selected.kpi.nb_orders} cmds`} good={selected.kpi.taux_livraison >= 60} />
          </div>

          {/* Reco financière */}
          {selected.finance_reco && (
            <div className="bg-gradient-to-br from-vert to-vert-mid text-white rounded-2xl p-5 shadow-lg">
              <div className="text-xs opacity-80 font-bold uppercase tracking-wide">💰 Plan financier semaine prochaine</div>
              <div className="text-3xl font-extrabold mt-1">Profit net : {formatFCFA(selected.finance_reco.profit_net)}</div>
              <p className="text-sm opacity-90 mt-2 italic">{selected.finance_reco.raison}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <FinanceCard emoji="📣" label="PUB" value={formatFCFA(selected.finance_reco.pub_budget)} sub={`≈ ${formatFCFA(selected.finance_reco.pub_daily)}/jour · ${selected.finance_reco.pub_focus}`} />
                <FinanceCard emoji="📦" label="STOCK" value={formatFCFA(selected.finance_reco.stock_budget)} sub={selected.finance_reco.stock_priorite} />
                <FinanceCard emoji="🏦" label="ÉPARGNE" value={formatFCFA(selected.finance_reco.epargne)} sub="Trésorerie sécurité" />
                <FinanceCard emoji="👤" label="POUR TOI" value={formatFCFA(selected.finance_reco.perso)} sub="Rémunération perso" />
              </div>
            </div>
          )}

          {/* Rapport IA */}
          {selected.ia_report && (
            <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
              <div className="prose prose-sm max-w-none prose-headings:text-vert prose-headings:font-extrabold prose-strong:text-vert prose-li:my-1">
                <ReactMarkdown>{selected.ia_report}</ReactMarkdown>
              </div>
              <div className="text-xs text-muted-foreground mt-4 pt-3 border-t border-vert-bg">
                Généré le {new Date(selected.generated_at).toLocaleString('fr-FR')}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Kpi({ label, value, sub, good }: { label: string; value: string; sub?: string; good?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-vert-bg p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-bold">{label}</div>
      <div className="text-xl font-extrabold text-vert mt-1">{value}</div>
      {sub && <div className={`text-xs font-semibold mt-1 ${good ? 'text-vert-mid' : 'text-rouge'}`}>{sub}</div>}
    </div>
  );
}

function FinanceCard({ emoji, label, value, sub }: { emoji: string; label: string; value: string; sub: string }) {
  return (
    <div className="bg-white/15 backdrop-blur rounded-xl p-3 border border-white/20">
      <div className="text-xs opacity-90 font-bold">{emoji} {label}</div>
      <div className="text-xl font-extrabold mt-1">{value}</div>
      <div className="text-[11px] opacity-80 mt-0.5">{sub}</div>
    </div>
  );
}
