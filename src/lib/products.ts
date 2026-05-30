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
    label: '1 SACHET',
    units: 1,
    paidUnits: 1,
    bonusUnits: 0,
    price: 10000,
    oldPrice: 10000,
    description: '1 sachet — Traitement individuel',
  },
];

const siropOffers: Offer[] = [
  {
    id: 11,
    label: '1 FLACON',
    units: 1,
    paidUnits: 1,
    bonusUnits: 0,
    price: 12000,
    oldPrice: 20000,
    description: '1 flacon — Traitement individuel',
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
    label: '1 SACHET',
    units: 1,
    paidUnits: 1,
    bonusUnits: 0,
    price: 12500,
    oldPrice: 12500,
    description: '1 sachet — Traitement individuel',
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
  pathology: 'Hémorroïdes · Ulcères · Diabète · Hypertension · Fibromes · Faiblesse sexuelle · +6 maux',
  emoji: '🌿',
  tagline: 'Un seul flacon. 12 maux soulagés. L\'élixir traditionnel 12-en-1 du Vieux KOUKA — 100% plantes naturelles, recette transmise depuis +60 ans.',
  heroImage: '/src/assets/tonic-kouka-bouteille.jpg',
  metaTitle: 'Tonic du Vieux KOUKA — Élixir 12-en-1 (Burkina · Niger)',
  metaDesc: 'Hémorroïdes, ulcères, diabète, hypertension, fibromes, faiblesse sexuelle… Le Tonic du Vieux KOUKA agit sur 12 maux à la fois. 100% plantes africaines. Livraison gratuite Ouaga & Niamey · Cash à la livraison.',
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
