// ============================================================================
// Profitability calculations per closeuse.
// Used by ProfitabilityTab. All numbers in FCFA.
// ----------------------------------------------------------------------------
// Hypothèses (validées avec l'utilisateur) :
//  - Commission : 1000 FCFA × commande livrée
//  - Carburant  : 5000 FCFA / semaine ISO chevauchant la période
//                 (compté uniquement pour les closeuses ayant eu ≥1 lead
//                 ou ≥1 commande dans la semaine)
//  - Repas      : 500 FCFA × jour ouvré Lun-Ven de la période
//                 (idem : closeuses avec activité ce jour-là)
//  - Pub        : somme des dépenses daily_expenses.category='pub' attribuées
//                 (closeuse_idx) à la closeuse sur la période. Les dépenses
//                 pub non attribuées sont réparties au prorata des leads
//                 reçus par closeuse dans la période.
// ============================================================================

export const COMMISSION_PER_DELIVERED = 1000;
export const CARBURANT_PER_WEEK = 5000;
export const REPAS_PER_WORKDAY = 500;

export type ProfitInput = {
  closeuseIdx: number;
  closeuseName: string;
  emoji?: string | null;
  leads: { created_at: string }[];
  orders: {
    status: string;
    product_price: number;
    created_at: string;
    delivered_at?: string | null;
  }[];
  pubAttributed: number; // pub déjà attribuée nominativement à cette closeuse
  pubShared: number;     // part de pub non-attribuée répartie au prorata
  workdays: number;      // nb jours Lun-Ven actifs
  weeks: number;         // nb semaines ISO actives
};

export type ProfitRow = {
  closeuseIdx: number;
  closeuseName: string;
  emoji?: string | null;
  // Performance
  nbLeads: number;
  nbOrders: number;
  nbDelivered: number;
  nbCancelled: number;
  nbRefused: number;
  tauxLivraison: number;   // %
  tauxConversion: number;  // % = orders / leads
  // CA
  ca: number;
  // Dépenses
  pub: number;
  commission: number;
  carburant: number;
  repas: number;
  coutTotal: number;
  // Rentabilité
  benefice: number;
  marge: number;           // %
  beneficeParLivree: number;
  coutParLivree: number;
  pubParLivree: number;
};

export function computeProfitRow(i: ProfitInput): ProfitRow {
  const nbLeads = i.leads.length;
  const nbOrders = i.orders.length;
  const delivered = i.orders.filter((o) => o.status === 'delivered');
  const cancelled = i.orders.filter((o) => o.status === 'cancelled');
  const refused = i.orders.filter((o) => o.status === 'refused' || o.status === 'refusee');
  const nbDelivered = delivered.length;
  const ca = delivered.reduce((s, o) => s + (o.product_price || 0), 0);

  const pub = Math.round(i.pubAttributed + i.pubShared);
  const commission = nbDelivered * COMMISSION_PER_DELIVERED;
  const carburant = i.weeks * CARBURANT_PER_WEEK;
  const repas = i.workdays * REPAS_PER_WORKDAY;
  const coutTotal = pub + commission + carburant + repas;
  const benefice = ca - coutTotal;
  const marge = ca > 0 ? (benefice / ca) * 100 : 0;

  return {
    closeuseIdx: i.closeuseIdx,
    closeuseName: i.closeuseName,
    emoji: i.emoji,
    nbLeads,
    nbOrders,
    nbDelivered,
    nbCancelled: cancelled.length,
    nbRefused: refused.length,
    tauxLivraison: nbOrders ? Math.round((nbDelivered / nbOrders) * 100) : 0,
    tauxConversion: nbLeads ? Math.round((nbOrders / nbLeads) * 1000) / 10 : 0,
    ca,
    pub,
    commission,
    carburant,
    repas,
    coutTotal,
    benefice,
    marge,
    beneficeParLivree: nbDelivered ? Math.round(benefice / nbDelivered) : 0,
    coutParLivree: nbDelivered ? Math.round(coutTotal / nbDelivered) : 0,
    pubParLivree: nbDelivered ? Math.round(pub / nbDelivered) : 0,
  };
}

// Jours ouvrés Lun-Ven inclus dans [from, to]
export function countWorkdays(from: Date, to: Date): number {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);
  let n = 0;
  while (d <= end) {
    const day = d.getDay(); // 0 dim, 6 sam
    if (day >= 1 && day <= 5) n++;
    d.setDate(d.getDate() + 1);
  }
  return n;
}

// Identifiant de semaine ISO (lundi)
export function weekKey(d: Date): string {
  const x = new Date(d);
  const day = x.getDay() || 7;
  x.setDate(x.getDate() + 1 - day); // lundi
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
}

export function dateKey(d: Date | string): string {
  const dt = typeof d === 'string' ? new Date(d) : d;
  return dt.toISOString().slice(0, 10);
}

export function alertLevel(r: ProfitRow): 'red' | 'orange' | 'green' | 'neutral' {
  if (r.ca === 0) return 'neutral';
  if (r.coutTotal > r.ca) return 'red';
  if (r.marge < 20) return 'orange';
  if (r.marge > 50) return 'green';
  return 'neutral';
}
