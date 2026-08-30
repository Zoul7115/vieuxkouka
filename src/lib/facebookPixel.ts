import { sendFbCapiEvent } from './fbCapi.functions';

export const FB_PIXEL_ID = '2277004996431360';
export const FB_PIXEL_IDS: readonly string[] = [FB_PIXEL_ID];

type CapiUser = { phone?: string; country?: string; city?: string };

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[2]!) : undefined;
}

function newEventId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Envoie l'événement au Pixel navigateur ET à l'API Conversions (déduplication par event_id). */
export async function trackFB(
  eventName: string,
  params: { value?: number; currency?: string; content_name?: string } = {},
  user: CapiUser = {},
): Promise<void> {
  const eventId = newEventId();

  try {
    const fbq = (globalThis as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
    if (typeof fbq === 'function') {
      fbq('track', eventName, params, { eventID: eventId });
    }
  } catch {
    /* noop */
  }

  try {
    await sendFbCapiEvent({
      data: {
        eventName,
        eventId,
        eventSourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        value: params.value,
        currency: params.currency,
        contentName: params.content_name,
        phone: user.phone,
        country: user.country ?? 'bf',
        city: user.city,
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
    });
  } catch {
    /* noop */
  }
}
