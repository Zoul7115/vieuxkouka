export type Offer = {
  id: number;
  label: string;
  /** Nombre total de sachets reçus (achetés + offerts) */
  units: number;
  /** Nombre de sachets payés */
  paidUnits: number;
  /** Nombre de sachets bonus / offerts */
  bonusUnits: number;
  price: number;
  oldPrice: number;
  description: string;
  saving?: string;
  badge?: string;
  recommended?: boolean;
  bestValue?: boolean;
};

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  pathology: string;
  emoji: string;
  tagline: string;
  heroImage: string;
  metaTitle: string;
  metaDesc: string;
  offers: Offer[];
};

const standardOffers: Offer[] = [
  {
    id: 1,
    label: '1 SACHET — DÉMARRAGE',
    units: 1,
    paidUnits: 1,
    bonusUnits: 0,
    price: 10000,
    oldPrice: 10000,
    description: '1 sachet — Pour démarrer le traitement',
  },
  {
    id: 2,
    label: '2 + 1 OFFERT — TRAITEMENT COMPLET',
    units: 3,
    paidUnits: 2,
    bonusUnits: 1,
    price: 20000,
    oldPrice: 30000,
    description: '2 achetés + 1 sachet GRATUIT — Cure complète',
    saving: '1 sachet GRATUIT offert !',
    badge: '🎁 1 OFFERT',
    recommended: true,
  },
  {
    id: 3,
    label: '3 + 2 OFFERTS — CURE FAMILIALE',
    units: 5,
    paidUnits: 3,
    bonusUnits: 2,
    price: 27000,
    oldPrice: 50000,
    description: '3 achetés + 2 sachets GRATUITS — Pour toute la famille',
    saving: '2 sachets GRATUITS offerts !',
    badge: '🔥 PACK FAMILLE',
    bestValue: true,
  },
];

const siropOffers: Offer[] = [
  {
    id: 11,
    label: '1 FLACON — DÉMARRAGE',
    units: 1,
    paidUnits: 1,
    bonusUnits: 0,
    price: 12000,
    oldPrice: 20000,
    description: '1 flacon — Traitement individuel',
  },
  {
    id: 12,
    label: '2 + 1 OFFERT — TRAITEMENT COMPLET',
    units: 3,
    paidUnits: 2,
    bonusUnits: 1,
    price: 25000,
    oldPrice: 36000,
    description: '2 achetés + 1 flacon GRATUIT — Traitement complet',
    saving: 'Tu économises 11 000 FCFA',
    badge: '⭐ POPULAIRE',
    recommended: true,
  },
  {
    id: 13,
    label: '3 + 2 OFFERTS — CURE DE COUPLE',
    units: 5,
    paidUnits: 3,
    bonusUnits: 2,
    price: 30000,
    oldPrice: 60000,
    description: '3 achetés + 2 flacons GRATUITS — Famille ou cure totale',
    saving: 'Tu économises 30 000 FCFA',
    badge: '💎 MEILLEURE OFFRE',
    bestValue: true,
  },
];

export const KOUKA: Product = {
  slug: 'kouka',
  name: 'Poudre KOUKA du Vieux',
  shortName: 'KOUKA',
  pathology: 'Hémorroïdes · Ulcères · Colopathie · Ballonnements · Gaz',
  emoji: '🌿',
  tagline: 'Hémorroïdes (koko), rectum qui sort, ulcères, brûlures d\'estomac, ballonnements, gaz, colopathie — traités à la racine en 7 à 14 jours, sans rechute.',
  heroImage: '/images/poudre-vieux-kouka-hero.png',
  metaTitle: 'Poudre KOUKA — Stoppe Hémorroïdes & Ulcères en 7 jours (Burkina)',
  metaDesc: '+200 personnes guéries. Fini les saignements, brûlures et ballonnements. Soulagement dès J3, guérison en 7 à 14 jours. 100% plantes. Livraison gratuite Ouaga & Niamey · Paiement cash · Satisfait ou remboursé.',
  offers: standardOffers,
};

export const SIROP_KOUKA: Product = {
  slug: 'sirop-kouka',
  name: 'Sirop KOUKA',
  shortName: 'Sirop KOUKA',
  pathology: 'faiblesse sexuelle · érection molle · libido faible · éjaculation précoce',
  emoji: '🍯',
  tagline: 'Tiens 30 minutes au lieu de 2. Érection dure comme à 20 ans. Désir qui revient — dès la 2ᵉ nuit.',
  heroImage: '/images/kouka-flacon.png',
  metaTitle: 'Sirop KOUKA — Dure +30 min · Érection ferme dès J2',
  metaDesc: 'Éjaculation précoce, érection molle, libido en panne ? Le Sirop du Vieux KOUKA agit dès la 2ᵉ nuit. 100% plantes africaines. Livraison discrète · Paiement cash · Satisfait ou remboursé.',
  offers: siropOffers,
};

const antiDiabeteOffers: Offer[] = [
  {
    id: 21,
    label: 'OFFRE DÉCOUVERTE — 1 SACHET',
    units: 1,
    paidUnits: 1,
    bonusUnits: 0,
    price: 12500,
    oldPrice: 12500,
    description: 'Idéal pour tester le produit',
  },
  {
    id: 22,
    label: 'TRAITEMENT COMPLET RECOMMANDÉ — 3 SACHETS',
    units: 3,
    paidUnits: 3,
    bonusUnits: 0,
    price: 25000,
    oldPrice: 25000,
    description: 'Cure complète recommandée — résultats durables',
    badge: '⭐ LE PLUS RECOMMANDÉ',
    recommended: true,
  },
];

export const ANTI_DIABETE: Product = {
  slug: 'anti-diabete',
  name: 'Poudre Anti-Diabète du Vieux KOUKA',
  shortName: 'Anti-Diabète',
  pathology: 'Diabète · Glycémie instable · Fatigue · Vision floue · Soif excessive',
  emoji: '🩸',
  tagline: 'Le traitement complet recommandé pour des résultats durables : glycémie stabilisée, énergie restaurée, vision plus claire — la formule naturelle du Vieux KOUKA.',
  heroImage: '/images/anti-diabete-sachet-illustre.png',
  metaTitle: 'Poudre Anti-Diabète KOUKA — Glycémie stabilisée naturellement',
  metaDesc: 'Picotements, soif excessive, fatigue, vision floue ? La Poudre Anti-Diabète du Vieux KOUKA régule ta glycémie naturellement. 100% plantes. Livraison gratuite Ouaga & Niamey · Cash à réception · Satisfait ou remboursé.',
  offers: antiDiabeteOffers,
};

const tonicOffers: Offer[] = [
  {
    id: 31,
    label: '1 BOUTEILLE — DÉCOUVERTE',
    units: 1,
    paidUnits: 1,
    bonusUnits: 0,
    price: 11000,
    oldPrice: 15000,
    description: '1 bouteille — Pour démarrer la cure',
  },
  {
    id: 32,
    label: '2 + 1 OFFERT — CURE COMPLÈTE',
    units: 3,
    paidUnits: 2,
    bonusUnits: 1,
    price: 22000,
    oldPrice: 33000,
    description: '2 achetés + 1 bouteille GRATUITE — Cure complète 30 jours',
    saving: '1 bouteille GRATUITE offerte !',
    badge: '⭐ POPULAIRE',
    recommended: true,
  },
  {
    id: 33,
    label: '3 + 2 OFFERTS — CURE FAMILIALE',
    units: 5,
    paidUnits: 3,
    bonusUnits: 2,
    price: 33000,
    oldPrice: 55000,
    description: '3 achetés + 2 bouteilles GRATUITES — Pour toute la famille',
    saving: '2 bouteilles GRATUITES offertes !',
    badge: '🔥 PACK FAMILLE',
    bestValue: true,
  },
];

export const TONIC_KOUKA: Product = {
  slug: 'tonic-kouka',
  name: 'Tonic du Vieux KOUKA',
  shortName: 'Tonic KOUKA',
  pathology: 'Insomnie · Manque d\'appétit · Fatigue · Ulcères · Hypertension',
  emoji: '🌿',
  tagline: 'Une seule bouteille pour 5 maux : insomnie, manque d\'appétit, fatigue, ulcères, hypertension. 100% plantes naturelles du Vieux KOUKA.',
  heroImage: '/src/assets/tonic-kouka-bouteille.jpg',
  metaTitle: 'Tonic du Vieux KOUKA — Sommeil, appétit, fatigue, ulcères, tension',
  metaDesc: 'Insomnie, manque d\'appétit, fatigue, ulcères, hypertension : le Tonic du Vieux KOUKA agit sur ces 5 maux. 100% plantes africaines. Livraison Ouaga & Niamey · Cash à la livraison.',
  offers: tonicOffers,
};

export const PRODUCTS: Product[] = [KOUKA, SIROP_KOUKA, ANTI_DIABETE, TONIC_KOUKA];

export const getProduct = (slug: string) => PRODUCTS.find((product) => product.slug === slug);

/** Retrouve une offre à partir du libellé stocké dans la commande */
export const findOfferByLabel = (label: string | null | undefined): Offer | undefined => {
  if (!label) return undefined;
  return PRODUCTS.flatMap((product) => product.offers).find((o) => label.includes(o.label) || label === o.label);
};

export const COUNTRIES = [
  { code: 'BF', label: '🇧🇫 Burkina Faso', prefix: '+226' },
  { code: 'NE', label: '🇳🇪 Niger', prefix: '+227' },
];

/** Frais de livraison par pays/zone (FCFA), affichés sur les pages de vente */
export const DELIVERY_PRICES: Record<string, { label: string; amount: number; note?: string }> = {
  BF_OUAGA: { label: '🏙️ Ouagadougou', amount: 0, note: 'Livraison gratuite' },
  BF_OTHER: { label: '🇧🇫 Burkina (autres villes)', amount: 1000, note: 'Par car de transport' },
  NE_NIAMEY: { label: '🏙️ Niamey', amount: 0, note: 'Livraison gratuite' },
  NE_OTHER: { label: '🇳🇪 Niger (autres villes)', amount: 1500, note: 'Par car de transport' },
};

/** Configuration livraison par pays */
export const COUNTRY_DELIVERY: Record<string, {
  capital: string;
  outsideFee: number;
  requiresCarTransport: boolean;
}> = {
  BF: { capital: 'Ouagadougou', outsideFee: 1000, requiresCarTransport: true },
  NE: { capital: 'Niamey', outsideFee: 1500, requiresCarTransport: true },
};

export const ADMIN_WHATSAPP = '22658444818';

export const formatFCFA = (n: number) => `${n.toLocaleString('fr-FR')} FCFA`;

/** Coût d'achat unitaire (PA) par produit, en FCFA */
export const PRODUCT_COSTS: Record<string, number> = {
  KOUKA: 2000,
  'Sirop KOUKA': 3000,
  'Anti-Diabète': 2000,
  'Tonic KOUKA': 2500,
};

/** Coût livraison par commande livrée (FCFA) */
export const DELIVERY_COST = 2000;

/** Famille de produit déduite du nom/slug — utilisée pour le PA et l'affichage */
export function productFamily(productName: string, slug?: string | null): 'KOUKA' | 'Sirop KOUKA' | 'Anti-Diabète' | 'Tonic KOUKA' {
  const s = (slug || '').toLowerCase();
  const n = (productName || '').toLowerCase();
  if (s === 'anti-diabete' || /anti[-\s]?diab/.test(n)) return 'Anti-Diabète';
  if (s === 'tonic-kouka' || /tonic/.test(n)) return 'Tonic KOUKA';
  if (s === 'sirop-kouka' || /sirop/.test(n)) return 'Sirop KOUKA';
  return 'KOUKA';
}

/** Libellé court + emoji pour différencier visuellement les produits */
export function productBadge(productName: string, slug?: string | null): { emoji: string; label: string } {
  const fam = productFamily(productName, slug);
  if (fam === 'Anti-Diabète') return { emoji: '🩸', label: 'Anti-Diabète' };
  if (fam === 'Tonic KOUKA') return { emoji: '🌿', label: 'Tonic KOUKA' };
  if (fam === 'Sirop KOUKA') return { emoji: '🍯', label: 'Sirop KOUKA' };
  return { emoji: '🌿', label: 'Poudre KOUKA' };
}

/** Renvoie le PA total d'une commande livrée (PA unitaire × nombre d'unités, bonus inclus) */
export function orderProductCost(productName: string, units: number, slug?: string | null): number {
  const pa = PRODUCT_COSTS[productFamily(productName, slug)] ?? 2000;
  return pa * Math.max(1, units);
}
