// Helpers de filtrage par période (CA, dépenses, commandes…)

export type PeriodKey = 'today' | 'yesterday' | '7d' | '30d' | '90d' | 'month' | 'all' | 'custom';

export type Period = {
  k: PeriodKey;
  label: string;
};

export const PERIODS: Period[] = [
  { k: 'today', label: "Aujourd'hui" },
  { k: 'yesterday', label: 'Hier' },
  { k: '7d', label: '7 jours' },
  { k: '30d', label: '30 jours' },
  { k: '90d', label: '90 jours' },
  { k: 'month', label: 'Ce mois' },
  { k: 'all', label: 'Tout' },
  { k: 'custom', label: 'Période…' },
];

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function endOfDay(d: Date) { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; }

export function getPeriodRange(k: PeriodKey, customFrom?: string, customTo?: string): { from: number; to: number } {
  const now = new Date();
  const today0 = startOfDay(now).getTime();
  const todayEnd = endOfDay(now).getTime();
  switch (k) {
    case 'today':
      return { from: today0, to: todayEnd };
    case 'yesterday': {
      const y = new Date(now); y.setDate(y.getDate() - 1);
      return { from: startOfDay(y).getTime(), to: endOfDay(y).getTime() };
    }
    case '7d':
      return { from: today0 - 6 * 86400000, to: todayEnd };
    case '30d':
      return { from: today0 - 29 * 86400000, to: todayEnd };
    case '90d':
      return { from: today0 - 89 * 86400000, to: todayEnd };
    case 'month': {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: startOfDay(first).getTime(), to: todayEnd };
    }
    case 'custom': {
      const from = customFrom ? startOfDay(new Date(customFrom)).getTime() : today0 - 29 * 86400000;
      const to = customTo ? endOfDay(new Date(customTo)).getTime() : todayEnd;
      return { from, to };
    }
    case 'all':
    default:
      return { from: 0, to: Number.MAX_SAFE_INTEGER };
  }
}

export function filterByPeriod<T extends { created_at?: string | null; expense_date?: string | null }>(
  rows: T[],
  k: PeriodKey,
  dateField: 'created_at' | 'expense_date' = 'created_at',
  customFrom?: string,
  customTo?: string,
): T[] {
  const { from, to } = getPeriodRange(k, customFrom, customTo);
  return rows.filter((r) => {
    const v = (r as Record<string, unknown>)[dateField] as string | null | undefined;
    if (!v) return false;
    const t = new Date(v).getTime();
    return t >= from && t <= to;
  });
}
