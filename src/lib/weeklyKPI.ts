// Calcul des KPI hebdo (lundi → dimanche) à partir des commandes et dépenses.

import { supabase } from '@/integrations/supabase/client';

export type WeeklyKPI = {
  week_start: string;
  week_end: string;
  ca_livre: number;
  ca_pending: number;
  nb_orders: number;
  nb_delivered: number;
  nb_cancelled: number;
  taux_livraison: number;
  panier_moyen: number;
  par_produit: Record<string, { nb: number; ca: number; livrees: number }>;
  par_livreur: Record<string, { nb: number; livrees: number; taux: number }>;
  depenses_total: number;
  depenses_par_categorie: Record<string, number>;
  pub_spend: number;
  profit_net: number;
  roas: number;
  cac: number;
  visites: number;
  taux_conversion: number;
  vs_n1: { ca_pct: number; orders_pct: number; profit_pct: number };
};

function startOfWeek(d: Date): Date {
  const x = new Date(d);
  const day = x.getDay(); // 0 dim, 1 lun
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function getWeekRange(offset = 0): { start: Date; end: Date } {
  const start = startOfWeek(new Date());
  start.setDate(start.getDate() + offset * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function computeWeeklyKPI(weekOffset = -1): Promise<WeeklyKPI> {
  const { start, end } = getWeekRange(weekOffset);
  const prev = getWeekRange(weekOffset - 1);

  const [oRes, prevORes, eRes, vRes] = await Promise.all([
    supabase.from('orders').select('*').gte('created_at', start.toISOString()).lte('created_at', end.toISOString()),
    supabase.from('orders').select('*').gte('created_at', prev.start.toISOString()).lte('created_at', prev.end.toISOString()),
    supabase.from('daily_expenses').select('*').gte('expense_date', isoDate(start)).lte('expense_date', isoDate(end)),
    supabase.from('visits').select('id', { count: 'exact', head: true }).gte('visited_at', start.toISOString()).lte('visited_at', end.toISOString()),
  ]);

  const orders = oRes.data || [];
  const prevOrders = prevORes.data || [];
  const expenses = eRes.data || [];
  const visites = vRes.count || 0;

  const delivered = orders.filter((o) => o.status === 'delivered');
  const pending = orders.filter((o) => o.status === 'pending');
  const cancelled = orders.filter((o) => o.status === 'cancelled');

  const ca_livre = delivered.reduce((s, o) => s + (o.product_price || 0), 0);
  const ca_pending = pending.reduce((s, o) => s + (o.product_price || 0), 0);

  const par_produit: Record<string, { nb: number; ca: number; livrees: number }> = {};
  for (const o of orders) {
    const k = o.product_slug || o.product_name || 'inconnu';
    par_produit[k] ||= { nb: 0, ca: 0, livrees: 0 };
    par_produit[k].nb += 1;
    if (o.status === 'delivered') {
      par_produit[k].livrees += 1;
      par_produit[k].ca += o.product_price || 0;
    }
  }

  const par_livreur: Record<string, { nb: number; livrees: number; taux: number }> = {};
  for (const o of orders) {
    if (o.livreur_idx == null) continue;
    const k = `livreur_${o.livreur_idx}`;
    par_livreur[k] ||= { nb: 0, livrees: 0, taux: 0 };
    par_livreur[k].nb += 1;
    if (o.status === 'delivered') par_livreur[k].livrees += 1;
  }
  for (const k of Object.keys(par_livreur)) {
    par_livreur[k].taux = par_livreur[k].nb ? Math.round((par_livreur[k].livrees / par_livreur[k].nb) * 100) : 0;
  }

  const depenses_par_categorie: Record<string, number> = {};
  let depenses_total = 0;
  for (const e of expenses) {
    depenses_par_categorie[e.category] = (depenses_par_categorie[e.category] || 0) + (e.amount || 0);
    depenses_total += e.amount || 0;
  }
  const pub_spend = depenses_par_categorie['pub'] || depenses_par_categorie['publicité'] || depenses_par_categorie['publicite'] || 0;

  const profit_net = ca_livre - depenses_total;
  const roas = pub_spend ? Math.round((ca_livre / pub_spend) * 100) / 100 : 0;
  const cac = delivered.length ? Math.round(pub_spend / delivered.length) : 0;
  const taux_livraison = orders.length ? Math.round((delivered.length / orders.length) * 100) : 0;
  const panier_moyen = delivered.length ? Math.round(ca_livre / delivered.length) : 0;
  const taux_conversion = visites ? Math.round((orders.length / visites) * 1000) / 10 : 0;

  const prevDelivered = prevOrders.filter((o) => o.status === 'delivered');
  const prevCA = prevDelivered.reduce((s, o) => s + (o.product_price || 0), 0);

  const pct = (a: number, b: number) => (b ? Math.round(((a - b) / b) * 100) : 0);

  return {
    week_start: isoDate(start),
    week_end: isoDate(end),
    ca_livre,
    ca_pending,
    nb_orders: orders.length,
    nb_delivered: delivered.length,
    nb_cancelled: cancelled.length,
    taux_livraison,
    panier_moyen,
    par_produit,
    par_livreur,
    depenses_total,
    depenses_par_categorie,
    pub_spend,
    profit_net,
    roas,
    cac,
    visites,
    taux_conversion,
    vs_n1: {
      ca_pct: pct(ca_livre, prevCA),
      orders_pct: pct(orders.length, prevOrders.length),
      profit_pct: pct(profit_net, prevCA - depenses_total),
    },
  };
}

export const PRODUCTS_FOR_AI = [
  {
    slug: 'kouka',
    name: 'Poudre KOUKA',
    offers: ['1 sachet démarrage', 'Pack 2+1 OFFERT', 'Pack 3+2 OFFERT (économie max)'],
  },
  {
    slug: 'sirop-kouka',
    name: 'Sirop KOUKA',
    offers: ['1 flacon démarrage', 'Pack 2+1 OFFERT', 'Pack 3+2 OFFERT'],
  },
];
