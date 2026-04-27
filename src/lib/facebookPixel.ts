// Helpers Facebook Pixel + Conversions API
// Pixel ID: 848736567802748

export const FB_PIXEL_ID = '848736567802748';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[2]) : undefined;
}

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

type CapiUser = { phone?: string; country?: string; city?: string };

/**
 * Track un événement Pixel + envoie en parallèle sur la Conversions API
 * pour fiabilité (event_id partagé pour dédupliquer).
 */
export async function trackFB(
  eventName: string,
  params: { value?: number; currency?: string; content_name?: string } = {},
  user: CapiUser = {},
) {
  if (typeof window === 'undefined') return;
  const eventId = uuid();

  // 1) Pixel client
  if (window.fbq) {
    try { window.fbq('track', eventName, params, { eventID: eventId }); } catch {}
  }

  // 2) CAPI serveur (best effort, ne bloque jamais l'UX)
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) return;
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    fetch(`${supabaseUrl}/functions/v1/fb-capi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        value: params.value,
        currency: params.currency,
        content_name: params.content_name,
        event_source_url: window.location.href,
        user: { ...user, fbp, fbc, ua: navigator.userAgent },
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
