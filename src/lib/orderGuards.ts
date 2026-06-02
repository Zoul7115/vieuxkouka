import { supabase } from '@/integrations/supabase/client';

/** Normalise un numéro WhatsApp (chiffres uniquement). */
export function normalizeWhatsApp(raw: string | null | undefined): string {
  return (raw || '').replace(/\D/g, '');
}

/**
 * Vérifie si un client est bloqué. Retourne la raison si bloqué, null sinon.
 */
export async function checkBlocked(whatsapp: string): Promise<string | null> {
  const wa = normalizeWhatsApp(whatsapp);
  if (!wa) return null;
  // On teste plusieurs variantes possibles (avec/sans préfixe)
  const { data } = await supabase
    .from('blocked_customers')
    .select('whatsapp, reason')
    .or(`whatsapp.eq.${wa},whatsapp.eq.+${wa}`)
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return data.reason || 'Client bloqué';
}

/**
 * Vérifie si un client a déjà commandé le même produit dans les dernières 24h.
 * Retourne true si un doublon existe.
 */
export async function hasRecentDuplicate(
  whatsapp: string,
  productSlug: string,
): Promise<boolean> {
  const wa = normalizeWhatsApp(whatsapp);
  if (!wa || !productSlug) return false;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('product_slug', productSlug)
    .or(`whatsapp.eq.${wa},whatsapp.eq.+${wa},whatsapp.like.%${wa}`)
    .gte('created_at', since);
  return (count || 0) > 0;
}

/**
 * Lance les deux vérifications en parallèle. Retourne un message d'erreur ou null.
 */
export async function validateOrderEligibility(
  whatsapp: string,
  productSlug: string,
): Promise<string | null> {
  const [blocked, dup] = await Promise.all([
    checkBlocked(whatsapp),
    hasRecentDuplicate(whatsapp, productSlug),
  ]);
  if (blocked) return `🚫 Commande refusée : ${blocked}`;
  if (dup) return '⚠️ Tu as déjà commandé ce produit récemment. Une seule commande du même produit par 24h.';
  return null;
}
