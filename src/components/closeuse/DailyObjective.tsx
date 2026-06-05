import { Progress } from '@/components/ui/progress';

export function DailyObjective({ done, goal }: { done: number; goal: number }) {
  const pct = Math.min(100, Math.round((done / Math.max(1, goal)) * 100));
  const completed = done >= goal;
  return (
    <div className={`rounded-2xl p-4 border-2 ${completed ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-rose-200'}`}>
      <div className="flex justify-between items-baseline mb-1.5">
        <div className="font-extrabold text-rose-900 text-sm">🎯 Objectif du jour</div>
        <div className={`text-2xl font-extrabold ${completed ? 'text-emerald-700' : 'text-rose-700'}`}>{done} / {goal}</div>
      </div>
      <Progress value={pct} className="h-2.5" />
      <div className="text-xs text-gray-600 mt-1.5">
        {completed ? '🏆 Objectif atteint, bravo !' : `Plus que ${goal - done} commande(s) à valider aujourd'hui`}
      </div>
    </div>
  );
}
