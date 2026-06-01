import { useMemo, useState } from 'react';
import { useCloseuses, COMMISSION_PAR_COMMANDE } from '@/lib/closeuses';
import { formatFCFA } from '@/lib/products';

type Order = { closeuse_idx?: number | null; status: string; delivered_at?: string | null; product_price: number };

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function SalairesTab({ orders }: { orders: Order[] }) {
  const { closeuses } = useCloseuses();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(monthKey(now));

  const months = useMemo(() => {
    const set = new Set<string>();
    set.add(monthKey(now));
    orders.forEach((o) => {
      if (o.delivered_at) set.add(monthKey(new Date(o.delivered_at)));
    });
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [orders, now]);

  const rows = useMemo(() => {
    const [year, m] = selectedMonth.split('-').map(Number);
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 1);
    return closeuses.map((c) => {
      const myOrders = orders.filter((o) =>
        o.closeuse_idx === c.idx &&
        o.status === 'delivered' &&
        o.delivered_at &&
        new Date(o.delivered_at) >= start &&
        new Date(o.delivered_at) < end,
      );
      const count = myOrders.length;
      const ca = myOrders.reduce((s, o) => s + o.product_price, 0);
      const salary = count * COMMISSION_PAR_COMMANDE;
      return { closeuse: c, count, ca, salary };
    });
  }, [closeuses, orders, selectedMonth]);

  const totalSalary = rows.reduce((s, r) => s + r.salary, 0);
  const totalCount = rows.reduce((s, r) => s + r.count, 0);
  const isCurrent = selectedMonth === monthKey(now);
  const isPaymentDay = now.getDate() === 1;

  return (
    <div className="space-y-4">
      {isPaymentDay && isCurrent && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl p-4 font-bold">
          📢 C'est le 1ᵉʳ du mois ! Les salaires des closeuses sont à verser.
        </div>
      )}

      <div className="bg-white rounded-2xl border-2 border-vert-bg p-4 flex flex-wrap gap-3 items-center justify-between">
        <div>
          <div className="text-xs uppercase font-bold text-muted-foreground">Mois</div>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
            className="mt-1 px-3 py-2 border-2 border-vert-bg rounded-lg font-bold">
            {months.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase font-bold text-muted-foreground">Total salaires</div>
          <div className="text-3xl font-extrabold text-rose-700">{formatFCFA(totalSalary)}</div>
          <div className="text-xs text-muted-foreground">{totalCount} commandes livrées</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-vert-bg p-5">
        <h3 className="font-extrabold text-vert mb-3">💰 Détail par closeuse</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase text-muted-foreground border-b-2 border-vert-bg">
                <th className="text-left py-2 px-1">Closeuse</th>
                <th className="text-right py-2 px-1">Commandes</th>
                <th className="text-right py-2 px-1">CA généré</th>
                <th className="text-right py-2 px-1">Salaire dû</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.closeuse.id} className="border-b border-vert-bg/40">
                  <td className="py-2 px-1 font-bold text-rose-700">{r.closeuse.emoji} {r.closeuse.name}</td>
                  <td className="text-right py-2 px-1">{r.count}</td>
                  <td className="text-right py-2 px-1">{formatFCFA(r.ca)}</td>
                  <td className="text-right py-2 px-1 font-extrabold text-rose-700">{formatFCFA(r.salary)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">Aucune closeuse</td></tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-vert-bg/40 font-extrabold">
                <td className="py-2 px-1 text-vert">TOTAL</td>
                <td className="text-right py-2 px-1">{totalCount}</td>
                <td className="text-right py-2 px-1">—</td>
                <td className="text-right py-2 px-1 text-rose-700">{formatFCFA(totalSalary)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Salaire = nombre de commandes livrées dans le mois × {formatFCFA(COMMISSION_PAR_COMMANDE)}. À verser le 1ᵉʳ du mois suivant.
        </p>
      </div>
    </div>
  );
}
