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
  metaDesc: '+200 personnes guéries. Fini les saignements, brûlures et ballonnements. Soulagement dès J3, guérison en 7 à 14 jours. 100% plantes. Livraison gratuite Ouaga · Paiement cash · Satisfait ou remboursé.',
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

export const PRODUCTS: Product[] = [KOUKA, SIROP_KOUKA];

export const getProduct = (slug: string) => PRODUCTS.find((product) => product.slug === slug);

/** Retrouve une offre à partir du libellé stocké dans la commande */
export const findOfferByLabel = (label: string | null | undefined): Offer | undefined => {
  if (!label) return undefined;
  return PRODUCTS.flatMap((product) => product.offers).find((o) => label.includes(o.label) || label === o.label);
};

export const COUNTRIES = [
  { code: 'BF', label: '🇧🇫 Burkina Faso', prefix: '+226' },
  { code: 'BJ', label: '🇧🇯 Bénin', prefix: '+229' },
  { code: 'SN', label: '🇸🇳 Sénégal', prefix: '+221' },
  { code: 'CI', label: '🇨🇮 Côte d\'Ivoire', prefix: '+225' },
  { code: 'ML', label: '🇲🇱 Mali', prefix: '+223' },
  { code: 'TG', label: '🇹🇬 Togo', prefix: '+228' },
  { code: 'NE', label: '🇳🇪 Niger', prefix: '+227' },
  { code: 'GN', label: '🇬🇳 Guinée', prefix: '+224' },
  { code: 'OTHER', label: '🌍 Autre', prefix: '+' },
];

export const ADMIN_WHATSAPP = '22658444818';

export const formatFCFA = (n: number) => `${n.toLocaleString('fr-FR')} FCFA`;

/** Coût d'achat unitaire (PA) par produit, en FCFA */
export const PRODUCT_COSTS: Record<string, number> = {
  KOUKA: 2000,
  'Sirop KOUKA': 3000,
};

/** Coût livraison par commande livrée (FCFA) */
export const DELIVERY_COST = 2000;

/** Renvoie le PA total d'une commande livrée (PA unitaire × nombre d'unités, bonus inclus) */
export function orderProductCost(productName: string, units: number): number {
  const isSirop = /sirop/i.test(productName);
  const pa = isSirop ? PRODUCT_COSTS['Sirop KOUKA'] : PRODUCT_COSTS['KOUKA'];
  return pa * Math.max(1, units);
}
