import { findOfferByLabel, formatFCFA } from './products';
import type { Livreur } from './livreurs';
import { cleanPhone } from './livreurs';

export type WAOrder = {
  order_number: string;
  product_name: string;
  product_price: number;
  offer_label: string | null;
  first_name: string | null;
  last_name: string | null;
  whatsapp: string | null;
  country: string | null;
  city: string | null;
  neighborhood?: string | null;
  car_transport?: string | null;
};

const isOuaga = (order: WAOrder) => {
  const c = (order.city || '').toLowerCase();
  return c.includes('ouaga') || c.includes('ouga') || c.includes('1200') || c.includes('tanghin') || c.includes('zogona');
};

const productLabel = (productName: string) => {
  // ex "Poudre KOUKA du Vieux - 2 + 1 OFFERT — TRAITEMENT COMPLET"
  if (/sirop/i.test(productName)) return 'Sirop du Vieux KOUKA';
  return 'Poudre du Vieux KOUKA';
};

const pathologyLabel = (productName: string) =>
  /sirop/i.test(productName)
    ? 'les troubles intimes et la vitalité'
    : 'les ulcères, la colopathie et les hémorroïdes';

const unitsLabel = (units: number) =>
  /sirop/i.test('') ? `${units} flacon${units > 1 ? 's' : ''}` : `${units} sachet${units > 1 ? 's' : ''}`;

const sachetWord = (productName: string, n: number) => {
  const sirop = /sirop/i.test(productName);
  const w = sirop ? 'flacon' : 'sachet';
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

✅ Votre commande de la *${productLabel(order.product_name)}* contre ${pathologyLabel(order.product_name)} a bien été reçue !

📦 Vous avez commandé *${sachetWord(order.product_name, paid)}* à *${formatFCFA(order.product_price)}*.${bonus > 0 ? `
🎁 Nous vous offrons *${sachetWord(order.product_name, bonus)} bonus* pour un traitement plus complet.` : ''}

🛵 Notre livreur va vous contacter très prochainement pour la livraison à domicile.

Merci pour votre confiance ! 🙏`;
  }

  // Hors Ouaga — le product_price stocké en BDD inclut déjà les 1000 FCFA
  const transport = order.car_transport || 'votre car de transport';
  const productOnly = Math.max(0, order.product_price - 1000);
  return `Bonjour *${fullName}* 🌿

✅ Votre commande de la *${productLabel(order.product_name)}* contre ${pathologyLabel(order.product_name)} a bien été reçue !

📦 Vous avez commandé *${sachetWord(order.product_name, paid)}* à *${formatFCFA(productOnly)}*.${bonus > 0 ? `
🎁 Nous allons vous offrir *${sachetWord(order.product_name, bonus)} bonus* pour un traitement plus complet.` : ''}

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
  const productUpper = /sirop/i.test(order.product_name) ? 'SIROP KOUKA' : 'POUDRE KOUKA';
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
