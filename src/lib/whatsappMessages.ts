import { findOfferByLabel, formatFCFA } from './products';
import type { Livreur } from './livreurs';
import { cleanPhone } from './livreurs';

export type WAOrder = {
  order_number: string;
  product_name: string;
  product_slug?: string | null;
  product_price: number;
  offer_label: string | null;
  first_name: string | null;
  last_name: string | null;
  whatsapp: string | null;
  country: string | null;
  city: string | null;
  neighborhood?: string | null;
  car_transport?: string | null;
  delivery_slot?: string | null;
};

const SLOT_LABELS: Record<string, string> = {
  morning: 'matin (8h-12h)',
  noon: 'midi (12h-14h)',
  afternoon: 'après-midi (14h-17h)',
  evening: 'soir (17h-20h)',
};

const formatSlot = (slot?: string | null) =>
  slot ? SLOT_LABELS[slot] || slot : 'à confirmer avec le client';

/**
 * Détermine s'il s'agit d'une livraison locale (capitale) ou d'une expédition.
 * Source de vérité : `car_transport` — rempli UNIQUEMENT quand le client coche
 * « Je suis en dehors de la capitale ». Si vide → livraison locale.
 */
const isLocalDelivery = (order: WAOrder) => {
  return !order.car_transport || !order.car_transport.trim();
};
const isOuaga = isLocalDelivery;

const isAntiDiabete = (productName: string) => /anti.?diab[eè]te/i.test(productName);
const isTonic = (productName: string, slug?: string | null) =>
  slug === 'tonic-kouka' || /tonic/i.test(productName);
const isSirop = (productName: string) => /sirop/i.test(productName);

const productLabel = (productName: string, slug?: string | null) => {
  if (isTonic(productName, slug)) return 'Tonic du Vieux KOUKA';
  if (isSirop(productName)) return 'Sirop du Vieux KOUKA';
  if (isAntiDiabete(productName)) return 'Poudre Anti-Diabète du Vieux KOUKA';
  return 'Poudre du Vieux KOUKA';
};

const pathologyLabel = (productName: string, slug?: string | null) => {
  if (isTonic(productName, slug)) return "l'insomnie, le manque d'appétit, la fatigue, les ulcères et l'hypertension";
  if (isSirop(productName)) return 'les troubles intimes et la vitalité';
  if (isAntiDiabete(productName)) return 'le diabète et la régulation de la glycémie';
  return 'les ulcères, la colopathie et les hémorroïdes';
};

const unitsLabel = (units: number) =>
  `${units} unité${units > 1 ? 's' : ''}`;

const sachetWord = (productName: string, n: number, slug?: string | null) => {
  let w = 'sachet';
  if (isTonic(productName, slug)) w = 'bouteille';
  else if (isSirop(productName)) w = 'flacon';
  return `${n} ${w}${n > 1 ? 's' : ''}`;
};

/** Message 1 — Confirmation client (Ouaga ou hors Ouaga) */
export function buildClientMessage(order: WAOrder): string {
  const offer = findOfferByLabel(order.offer_label);
  const paid = offer?.paidUnits ?? 1;
  const bonus = offer?.bonusUnits ?? 0;
  const fullName = [order.first_name, order.last_name].filter(Boolean).join(' ') || 'cher client';

  if (isOuaga(order)) {
    return `Bonjour *${fullName}* 🌿

✅ Votre commande de la *${productLabel(order.product_name, order.product_slug)}* contre ${pathologyLabel(order.product_name, order.product_slug)} a bien été reçue !

📦 Vous avez commandé *${sachetWord(order.product_name, paid, order.product_slug)}* à *${formatFCFA(order.product_price)}*.${bonus > 0 ? `
🎁 Nous vous offrons *${sachetWord(order.product_name, bonus, order.product_slug)} bonus* pour un traitement plus complet.` : ''}

🛵 Notre livreur va vous contacter très prochainement pour la livraison à domicile.

Merci pour votre confiance ! 🙏`;
  }

  // Hors Ouaga — le product_price stocké en BDD inclut déjà les 1000 FCFA
  const transport = order.car_transport || 'votre car de transport';
  const productOnly = Math.max(0, order.product_price - 1000);
  return `Bonjour *${fullName}* 🌿

✅ Votre commande de la *${productLabel(order.product_name, order.product_slug)}* contre ${pathologyLabel(order.product_name, order.product_slug)} a bien été reçue !

📦 Vous avez commandé *${sachetWord(order.product_name, paid, order.product_slug)}* à *${formatFCFA(productOnly)}*.${bonus > 0 ? `
🎁 Nous allons vous offrir *${sachetWord(order.product_name, bonus, order.product_slug)} bonus* pour un traitement plus complet.` : ''}

🚍 Votre commande sera expédiée via *${transport}*.
💰 *Frais d'expédition : 1 000 FCFA* (déjà inclus dans le total).

🧾 *TOTAL À PAYER : ${formatFCFA(order.product_price)}* (produit + expédition)
Après le dépôt du colis à la gare, nous allons vous envoyer le reçu et vous ferez le paiement complet.

Merci de confirmer votre commande en répondant à ce message.

Merci pour votre confiance ! 🙏`;
}

/** Message livreur — Livraison locale (Ouaga) ou expédition (hors Ouaga) */
export function buildLivreurMessage(order: WAOrder): string {
  const offer = findOfferByLabel(order.offer_label);
  const totalUnits = offer?.units ?? 1;
  const fullName = [order.first_name, order.last_name].filter(Boolean).join(' ') || '—';
  const productUpper = /sirop/i.test(order.product_name)
    ? 'SIROP KOUKA'
    : isAntiDiabete(order.product_name)
      ? 'POUDRE ANTI-DIABÈTE'
      : 'POUDRE KOUKA';
  const phone = order.whatsapp ? `+${cleanPhone(order.whatsapp)}` : '—';

  if (isOuaga(order)) {
    return `🌿 *LIVRAISON — ${productUpper}*

👤 *Client :* ${fullName}
📞 *Tél :* ${phone}
📦 *À livrer :* ${sachetWord(order.product_name, totalUnits)}
💰 *Prix à encaisser :* ${formatFCFA(order.product_price)}
📍 *Adresse :* ${order.city || '—'}${order.neighborhood ? ' / ' + order.neighborhood : ''}, ${order.country || ''}

_Merci de confirmer la réception 🙏_`;
  }

  // Expédition
  const transport = order.car_transport || '—';
  return `🌿 *EXPÉDITION — ${productUpper}*

👤 *Client :* ${fullName}
📞 *Tél :* ${phone}
📦 *${/sirop/i.test(order.product_name) ? 'Flacons' : 'Sachets'} à livrer :* ${sachetWord(order.product_name, totalUnits)}
💰 *Prix à encaisser :* ${formatFCFA(order.product_price)}
🚍 *Mode :* Expédition par car — *${transport}*
📍 *Ville :* ${order.city || '—'}, ${order.country || ''}

_Merci de confirmer le dépôt au car 🙏_`;
}

/** Construit l'URL wa.me */
export function waUrl(phone: string, message: string): string {
  return `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(message)}`;
}

export function waClientUrl(order: WAOrder): string | null {
  if (!order.whatsapp) return null;
  return waUrl(order.whatsapp, buildClientMessage(order));
}

export function waLivreurUrl(order: WAOrder, livreur: Livreur): string {
  // Les liens de groupe WhatsApp n'acceptent pas de texte pré-rempli
  if (livreur.wa_group_url) return livreur.wa_group_url;
  return waUrl(livreur.whatsapp, buildLivreurMessage(order));
}

/** Message SAV — Relance J+7 après livraison pour prendre des nouvelles */
export function buildSAVMessage(order: WAOrder): string {
  const fullName = [order.first_name, order.last_name].filter(Boolean).join(' ') || 'cher client';
  const isSirop = /sirop/i.test(order.product_name);

  if (isSirop) {
    return `Bonjour *${fullName}* 👋

C'est l'équipe discrète du *Vieux KOUKA* 🌿

Cela fait *7 jours* depuis ta commande du *Sirop KOUKA*. On voulait prendre de tes nouvelles, en toute discrétion 🤐

👉 Comment te sens-tu depuis le début du traitement ?
👉 As-tu remarqué un changement (énergie, tenue, désir) ?
👉 Es-tu satisfait des résultats ?

Ton retour reste *100% confidentiel* et nous aide énormément à améliorer le produit pour les autres hommes qui souffrent comme toi avant.

Merci pour ta confiance 🙏
_— Le Vieux KOUKA_`;
  }

  if (isAntiDiabete(order.product_name)) {
    return `Bonjour *${fullName}* 🌿

C'est l'équipe du *Vieux KOUKA*. Cela fait *7 jours* depuis ta commande de la *Poudre Anti-Diabète*.

On voulait prendre de tes nouvelles 🙏

👉 Comment te sens-tu depuis le début du traitement ?
👉 As-tu mesuré ta glycémie ? Y a-t-il une baisse ?
👉 Les picotements / la soif / la fatigue ont-ils diminué ?

Ton retour est très important pour nous — et il aide d'autres personnes qui souffrent comme toi avant.

Merci pour ta confiance 🌿
_— Le Vieux KOUKA_`;
  }

  return `Bonjour *${fullName}* 🌿

C'est l'équipe du *Vieux KOUKA*. Cela fait *7 jours* depuis ta commande de la *Poudre KOUKA*.

On voulait juste prendre de tes nouvelles 🙏

👉 Comment vas-tu depuis que tu as commencé le traitement ?
👉 Les saignements / brûlures / ballonnements ont-ils diminué ?
👉 Es-tu satisfait des résultats ?

Ton retour est très important pour nous — et il aide d'autres personnes qui souffrent comme toi avant.

Merci pour ta confiance 🌿
_— Le Vieux KOUKA_`;
}

export function waSAVUrl(order: WAOrder): string | null {
  if (!order.whatsapp) return null;
  return waUrl(order.whatsapp, buildSAVMessage(order));
}

// Suppression du faux suppression d'avert eslint sur sirop check
void unitsLabel;
