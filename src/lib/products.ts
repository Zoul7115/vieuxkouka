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

export const KOUKA: Product = {
  slug: 'kouka',
  name: 'Poudre KOUKA du Vieux',
  shortName: 'KOUKA',
  pathology: 'Hémorroïdes · Ulcères · Colopathie · Ballonnements · Gaz',
  emoji: '🌿',
  tagline: 'Hémorroïdes (koko), rectum qui sort, ulcères, brûlures d\'estomac, ballonnements, gaz, colopathie — traités à la racine en 1 à 2 semaines.',
  heroImage: 'https://cdn.youcan.shop/stores/a76c79b31be4cda2922d7beba207931b/products/EDjfpxH9Yy2PTTBDXi88S5QwnTMzetV8Gd7bLrDF.webp',
  metaTitle: 'Poudre KOUKA — Hémorroïdes, Ulcères, Colopathie & Ballonnements',
  metaDesc: 'La Poudre du Vieux KOUKA traite à la racine : hémorroïdes, ulcères, colopathie, ballonnements et gaz. Soulagement dès J3, guérison en 1 à 2 semaines. 100% naturel · Paiement à la livraison.',
  offers: standardOffers,
};

export const PRODUCTS: Product[] = [KOUKA];

export const getProduct = (slug: string) => (slug === KOUKA.slug ? KOUKA : undefined);

/** Retrouve une offre à partir du libellé stocké dans la commande */
export const findOfferByLabel = (label: string | null | undefined): Offer | undefined => {
  if (!label) return undefined;
  return KOUKA.offers.find((o) => label.includes(o.label) || label === o.label);
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
