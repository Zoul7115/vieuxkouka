import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCommissionSettings, usePayouts, monthKey } from '@/lib/commissions';
import { useCloseuses } from '@/lib/closeuses';
import { useLeads } from '@/lib/leads';
import { formatFCFA } from '@/lib/products';

const db = supabase as any;

export function CommissionsTab() {
  const { settings, save } = useCommissionSettings();
  const { closeuses } = useCloseuses();
  const { leads } = useLeads(null);
  const { payouts, reload } = usePayouts();
  const [val, setVal] = useState(settings.commission_per_validated_order);
  const [del, setDel] = useState(settings.commission_per_delivered_order);
  const [period, setPeriod] = useState(monthKey());

  // Compteurs du mois choisi
  const computed = useMemo(() => {
    const start = new Date(period + 'T00:00:00');
    const end = new Date(start); end.setMonth(end.getMonth() + 1);
    return closeuses.map((c) => {
      const mine = leads.filter((l) => l.closeuse_idx === c.idx && new Date(l.created_at) >= start && new Date(l.created_at) < end);
      const validated = mine.filter((l) => ['valide', 'expediee', 'livree'].includes(l.status)).length;
      const delivered = mine.filter((l) => l.status === 'livree').length;
      const amount = validated * settings.commission_per_validated_order + delivered * settings.commission_per_delivered_order;
      const payout = payouts.find((p) => p.closeuse_idx === c.idx && p.period_month === period);
      return { c, validated, delivered, amount, payout };
    });
  }, [closeuses, leads, period, settings, payouts]);

  const totalDue = computed.reduce((s, r) => s + r.amount, 0);

  const saveSettings = async () => {
    await save({ commission_per_validated_order: val, commission_per_delivered_order: del });
    toast.success('Barème enregistré');
  };

  const markPaid = async (row: typeof computed[number]) => {
    const ok = confirm(`Marquer payé : ${formatFCFA(row.amount)} à ${row.c.name} ?`);
    if (!ok) return;
    await db.from('commission_payouts').upsert({
      closeuse_idx: row.c.idx,
      period_month: period,
      validated_count: row.validated,
      delivered_count: row.delivered,
      amount_due: row.amount,
      amount_paid: row.amount,
      paid_at: new Date().toISOString(),
    }, { onConflict: 'closeuse_idx,period_month' });
    toast.success('Paiement enregistré');
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border-2 border-vert-bg p-4">
        <h3 className="font-extrabold text-vert mb-2">⚙️ Barème de commission</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold text-gray-600">Par commande validée</label>
            <input type="number" value={val} onChange={(e) => setVal(parseInt(e.target.value) || 0)} className="w-full mt-1 px-3 py-2 border-2 border-vert-bg rounded-lg" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600">Par commande livrée</label>
            <input type="number" value={del} onChange={(e) => setDel(parseInt(e.target.value) || 0)} className="w-full mt-1 px-3 py-2 border-2 border-vert-bg rounded-lg" />
          </div>
        </div>
        <button onClick={saveSettings} className="mt-3 w-full bg-vert text-white font-bold py-2 rounded-lg">💾 Enregistrer</button>
        <p className="text-xs text-gray-500 mt-2">Ces montants ne sont jamais affichés aux closeuses.</p>
      </div>

      <div className="bg-gradient-to-br from-rouge to-rouge-light text-white rounded-2xl p-4">
        <div className="text-xs uppercase font-bold opacity-90">Total dû ({period.slice(0, 7)})</div>
        <div className="text-3xl font-extrabold mt-1">{formatFCFA(totalDue)}</div>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-bold text-gray-600">Mois</label>
        <input type="month" value={period.slice(0, 7)} onChange={(e) => setPeriod(e.target.value + '-01')}
          className="px-2 py-1.5 border-2 border-vert-bg rounded-lg text-sm" />
      </div>

      <div className="bg-white rounded-2xl border-2 border-vert-bg overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-vert-bg/30 text-vert">
            <tr>
              <th className="text-left p-2">Closeuse</th>
              <th className="p-2">Validées</th>
              <th className="p-2">Livrées</th>
              <th className="p-2 text-right">Dû</th>
              <th className="p-2">Statut</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {computed.map((r) => (
              <tr key={r.c.id} className="border-t border-vert-bg/40">
                <td className="p-2 font-bold">{r.c.emoji} {r.c.name}</td>
                <td className="p-2 text-center">{r.validated}</td>
                <td className="p-2 text-center">{r.delivered}</td>
                <td className="p-2 text-right font-extrabold">{formatFCFA(r.amount)}</td>
                <td className="p-2 text-center">
                  {r.payout?.paid_at
                    ? <span className="text-emerald-700 font-bold text-[10px]">✅ Payé {new Date(r.payout.paid_at).toLocaleDateString('fr-FR')}</span>
                    : <span className="text-orange-700 font-bold text-[10px]">⏳ À payer</span>}
                </td>
                <td className="p-2 text-center">
                  {!r.payout?.paid_at && r.amount > 0 && (
                    <button onClick={() => markPaid(r)} className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded">💵 Marquer payé</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payouts.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-vert-bg p-4">
          <h3 className="font-extrabold text-vert mb-2">📜 Historique des paiements</h3>
          <div className="space-y-1 text-xs">
            {payouts.slice(0, 50).map((p) => {
              const c = closeuses.find((x) => x.idx === p.closeuse_idx);
              return (
                <div key={p.id} className="flex justify-between border-b border-vert-bg/40 py-1.5">
                  <div className="font-bold">{c?.emoji} {c?.name || `#${p.closeuse_idx}`} · {p.period_month.slice(0, 7)}</div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-700">{formatFCFA(p.amount_paid)}</div>
                    <div className="text-[10px] text-gray-500">{p.paid_at ? new Date(p.paid_at).toLocaleDateString('fr-FR') : 'En attente'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
