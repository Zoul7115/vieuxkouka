import { createServerFn } from '@tanstack/react-start';

type CapiInput = {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string;
  value?: number;
  currency?: string;
  contentName?: string;
  phone?: string;
  country?: string;
  city?: string;
  fbp?: string;
  fbc?: string;
  userAgent?: string;
};

export const sendFbCapiEvent = createServerFn({ method: 'POST' })
  .inputValidator((input: CapiInput) => input)
  .handler(async ({ data }) => {
    const pixelId = process.env['FB_PIXEL_ID'] || '2277004996431360';
    const token = process.env['FB_CAPI_TOKEN_MAIN'];
    if (!token) return { ok: false, skipped: true };

    const enc = async (v?: string) => {
      if (!v) return undefined;
      const norm = v.trim().toLowerCase().replace(/\s+/g, '');
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(norm));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    };

    const phoneDigits = data.phone ? data.phone.replace(/\D/g, '') : undefined;

    const user_data: Record<string, unknown> = {};
    const ph = await enc(phoneDigits);
    if (ph) user_data['ph'] = [ph];
    const ct = await enc(data.city);
    if (ct) user_data['ct'] = [ct];
    const co = await enc(data.country);
    if (co) user_data['country'] = [co];
    if (data.fbp) user_data['fbp'] = data.fbp;
    if (data.fbc) user_data['fbc'] = data.fbc;
    if (data.userAgent) user_data['client_user_agent'] = data.userAgent;

    const body = {
      data: [
        {
          event_name: data.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: data.eventId,
          event_source_url: data.eventSourceUrl,
          action_source: 'website',
          user_data,
          custom_data: {
            ...(data.value !== undefined ? { value: data.value } : {}),
            ...(data.currency ? { currency: data.currency } : {}),
            ...(data.contentName ? { content_name: data.contentName } : {}),
          },
        },
      ],
    };

    try {
      const res = await fetch(
        `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
      );
      const json = await res.json().catch(() => ({}));
      return { ok: res.ok, response: json };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  });
