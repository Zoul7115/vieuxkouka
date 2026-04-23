export type Offer = {
  id: number;
  label: string;
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
  { id: 1, label: '1 SACHET', price: 10000, oldPrice: 10000, description: '1 sachet — Pour commencer' },
  { id: 2, label: '2 + 1 OFFERT', price: 20000, oldPrice: 30000, description: '2 achetés + 1 sachet GRATUIT', saving: '1 sachet GRATUIT offert !', badge: '🎁 1 OFFERT', recommended: true },
  { id: 3, label: '3 + 2 OFFERTS', price: 27000, oldPrice: 50000, description: '3 achetés + 2 sachets GRATUITS', saving: '2 sachets GRATUITS offerts !', badge: '🔥 2 OFFERTS', bestValue: true },
];

const sirOffers: Offer[] = [
  { id: 1, label: '1 FLACON', price: 8000, oldPrice: 8000, description: '1 flacon — Pour commencer' },
  { id: 2, label: '2 + 1 OFFERT', price: 16000, oldPrice: 24000, description: '2 flacons + 1 GRATUIT', saving: '1 flacon GRATUIT !', badge: '🎁 1 OFFERT', recommended: true },
  { id: 3, label: '3 + 2 OFFERTS', price: 22000, oldPrice: 40000, description: '3 flacons + 2 GRATUITS', saving: '2 flacons GRATUITS !', badge: '🔥 2 OFFERTS', bestValue: true },
];

export const PRODUCTS: Product[] = [
  {
    slug: 'kouka',
    name: 'Poudre KOUKA',
    shortName: 'KOUKA',
    pathology: 'Hémorroïdes & Ulcères',
    emoji: '🌿',
    tagline: 'Hémorroïdes (koko), rectum qui sort, ulcères — traités à la racine en 1 à 2 semaines.',
    heroImage: 'https://cdn.youcan.shop/stores/a76c79b31be4cda2922d7beba207931b/products/EDjfpxH9Yy2PTTBDXi88S5QwnTMzetV8Gd7bLrDF.webp',
    metaTitle: 'Poudre KOUKA — Hémorroïdes et Ulcères Traités Définitivement',
    metaDesc: 'Hémorroïdes, ulcères, ballonnements depuis des années ? La Poudre du Vieux KOUKA traite à la racine en 1 à 2 semaines. 100% naturel, paiement à la livraison.',
    offers: standardOffers,
  },
  {
    slug: 'kouka-colopathie',
    name: 'Poudre KOUKA Colopathie',
    shortName: 'KOUKA Colopathie',
    pathology: 'Colopathie & Côlon irritable',
    emoji: '💧',
    tagline: 'Ballonnements, gaz, transit anarchique, douleurs au ventre — apaise et régule en profondeur.',
    heroImage: '/images/kouka-solution.png',
    metaTitle: 'Poudre KOUKA Colopathie — Côlon irritable & Ballonnements',
    metaDesc: 'Côlon irritable, ballonnements, transit anarchique. La Poudre KOUKA Colopathie régule en profondeur. 100% naturel, paiement à la livraison.',
    offers: standardOffers,
  },
  {
    slug: 'kouka-ulceres',
    name: 'Poudre KOUKA Ulcères',
    shortName: 'KOUKA Ulcères',
    pathology: 'Ulcères & Brûlures gastriques',
    emoji: '🔥',
    tagline: 'Brûlures d\'estomac, ulcères, gastrite — répare la muqueuse gastrique naturellement.',
    heroImage: '/images/kouka-solution.png',
    metaTitle: 'Poudre KOUKA Ulcères — Soulagement Naturel Gastrique',
    metaDesc: 'Ulcères, brûlures d\'estomac, gastrite ? La Poudre KOUKA Ulcères répare la muqueuse en profondeur. 100% naturel, paiement à la livraison.',
    offers: standardOffers,
  },
  {
    slug: 'sirop-kouka',
    name: 'Sirop KOUKA',
    shortName: 'Sirop KOUKA',
    pathology: 'Diarrhée & Coliques',
    emoji: '💊',
    tagline: 'Diarrhée, coliques, troubles digestifs aigus — agit rapidement, formule liquide naturelle.',
    heroImage: '/images/kouka-flacon.png',
    metaTitle: 'Sirop KOUKA — Diarrhée et Coliques Soulagées',
    metaDesc: 'Sirop naturel KOUKA — soulagement rapide de la diarrhée, des coliques et des troubles digestifs. 100% naturel, paiement à la livraison.',
    offers: sirOffers,
  },
];

export const getProduct = (slug: string) => PRODUCTS.find(p => p.slug === slug);

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
