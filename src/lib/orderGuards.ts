import { supabase } from '@/integrations/supabase/client';

export function normalizeWhatsApp(raw: string | null | undefined): string {
  return (raw || '').replace(/\D/g, '');
}

/** Récupère l'IP publique du client (cache session). */
export async function getClientIp(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    const cached = sessionStorage.getItem('kouka_client_ip');
    if (cached) return cached;
  } catch {}
  try {
    const r = await fetch('https://api.ipify.org?format=json');
    const j = (await r.json()) as { ip?: string };
    const ip = j.ip || null;
    if (ip) {
      try { sessionStorage.setItem('kouka_client_ip', ip); } catch {}
    }
    return ip;
  } catch {
    return null;
  }
}

/** Bloqué par WhatsApp ? */
async function checkBlockedWhatsApp(whatsapp: string): Promise<string | null> {
  const wa = normalizeWhatsApp(whatsapp);
  if (!wa) return null;
  const { data } = await supabase
    .from('blocked_customers')
    .select('whatsapp, reason')
    .or(`whatsapp.eq.${wa},whatsapp.eq.+${wa}`)
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return data.reason || 'Client bloqué';
}

/** Bloqué par IP ? */
async function checkBlockedIp(ip: string | null): Promise<string | null> {
  if (!ip) return null;
  const { data } = await supabase
    .from('blocked_ips')
    .select('ip, reason')
    .eq('ip', ip)
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return data.reason || 'Adresse IP bloquée';
}

/** Doublon WhatsApp/IP sur le même produit dans les 24h. */
async function hasRecentDuplicate(
  whatsapp: string,
  ip: string | null,
  productSlug: string,
): Promise<boolean> {
  const wa = normalizeWhatsApp(whatsapp);
  if (!productSlug) return false;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const filters: string[] = [];
  if (wa) filters.push(`whatsapp.eq.${wa}`, `whatsapp.eq.+${wa}`, `whatsapp.like.%${wa}`);
  if (ip) filters.push(`client_ip.eq.${ip}`);
  if (filters.length === 0) return false;

  const { count } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('product_slug', productSlug)
    .or(filters.join(','))
    .gte('created_at', since);
  return (count || 0) > 0;
}

/**
 * Lance toutes les vérifications. Retourne un message d'erreur ou null.
 * Renvoie aussi l'IP collectée pour la stocker sur la commande.
 */
export async function validateOrderEligibility(
  whatsapp: string,
  productSlug: string,
): Promise<{ error: string | null; ip: string | null }> {
  const ip = await getClientIp();
  const [bWa, bIp, dup] = await Promise.all([
    checkBlockedWhatsApp(whatsapp),
    checkBlockedIp(ip),
    hasRecentDuplicate(whatsapp, ip, productSlug),
  ]);
  if (bWa) return { error: `🚫 Commande refusée : ${bWa}`, ip };
  if (bIp) return { error: `🚫 Commande refusée : ${bIp}`, ip };
  if (dup) return {
    error: '⚠️ Une commande du même produit a déjà été passée récemment depuis ce numéro ou cet appareil. Limite : 1 par 24h.',
    ip,
  };
  return { error: null, ip };
}
