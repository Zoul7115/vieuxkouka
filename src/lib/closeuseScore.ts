import type { Lead } from '@/lib/leads';

export type CloseuseStats = {
  leads: number;
  validated: number;
  delivered: number;
  refused: number;
  validationRate: number; // 0..1
  deliveryRate: number; // 0..1
  scoreLabel: 'Excellent' | 'Bon' | 'Moyen' | 'Faible' | '—';
  scoreColor: string;
};

export function computeCloseuseStats(leads: Lead[]): CloseuseStats {
  const total = leads.length;
  const validated = leads.filter((l) => ['valide', 'expediee', 'livree'].includes(l.status)).length;
  const delivered = leads.filter((l) => l.status === 'livree').length;
  const refused = leads.filter((l) => ['refusee', 'annulee', 'perdue'].includes(l.status)).length;
  const validationRate = total ? validated / total : 0;
  const deliveryRate = validated ? delivered / validated : 0;
  const composite = validationRate * 0.6 + deliveryRate * 0.4;
  let scoreLabel: CloseuseStats['scoreLabel'] = '—';
  let scoreColor = 'text-gray-500 bg-gray-100';
  if (total > 0) {
    if (composite >= 0.7) { scoreLabel = 'Excellent'; scoreColor = 'text-emerald-700 bg-emerald-100'; }
    else if (composite >= 0.5) { scoreLabel = 'Bon'; scoreColor = 'text-blue-700 bg-blue-100'; }
    else if (composite >= 0.3) { scoreLabel = 'Moyen'; scoreColor = 'text-amber-700 bg-amber-100'; }
    else { scoreLabel = 'Faible'; scoreColor = 'text-red-700 bg-red-100'; }
  }
  return { leads: total, validated, delivered, refused, validationRate, deliveryRate, scoreLabel, scoreColor };
}

export function validatedToday(leads: Lead[]): number {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  return leads.filter((l) => ['valide', 'expediee', 'livree'].includes(l.status) && new Date(l.validated_at || l.updated_at) >= start).length;
}
