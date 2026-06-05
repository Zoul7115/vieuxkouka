import type { CloseuseStats } from '@/lib/closeuseScore';

export function CloseuseStatsCard({ stats }: { stats: CloseuseStats }) {
  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-rose-200 space-y-2">
      <div className="flex justify-between items-center">
        <div className="font-extrabold text-rose-900 text-sm">📊 Mes performances</div>
        <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${stats.scoreColor}`}>{stats.scoreLabel}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-rose-50 rounded-lg py-2">
          <div className="text-[10px] text-gray-600 uppercase font-bold">Validation</div>
          <div className="text-lg font-extrabold text-rose-700">{Math.round(stats.validationRate * 100)}%</div>
          <div className="text-[10px] text-gray-500">{stats.validated}/{stats.leads}</div>
        </div>
        <div className="bg-emerald-50 rounded-lg py-2">
          <div className="text-[10px] text-gray-600 uppercase font-bold">Livraison</div>
          <div className="text-lg font-extrabold text-emerald-700">{Math.round(stats.deliveryRate * 100)}%</div>
          <div className="text-[10px] text-gray-500">{stats.delivered}/{stats.validated}</div>
        </div>
      </div>
    </div>
  );
}
