// Facebook Conversions API — relai serveur pour fiabiliser le tracking
// Envoie chaque événement en parallèle aux 2 pixels avec le même event_id
// afin que Meta déduplique avec le pixel client (browser).
// Reçoit: { event_name, event_id, value?, currency?, content_name?, user: { phone?, country?, city?, fbp?, fbc?, ip?, ua? }, event_source_url? }
// Renvoie: { ok: true, results: [...] } ou { ok: false, error }

type PixelCfg = { id: string; token: string };

const PIXELS: PixelCfg[] = [
  { id: '848736567802748', token: Deno.env.get('FB_CAPI_TOKEN') || '' },
  { id: '1595256252207737', token: Deno.env.get('FB_CAPI_TOKEN_2') || '' },
].filter((p) => p.token); // n'envoie qu'aux pixels dont le token est configuré

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function sha256(str: string): Promise<string> {
  const data = new TextEncoder().encode(str.trim().toLowerCase());
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function normalizePhone(p: string): string {
  return p.replace(/[^\d]/g, '');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (PIXELS.length === 0) {
    return new Response(JSON.stringify({ ok: false, error: 'No FB_CAPI_TOKEN configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { event_name, event_id, value, currency, content_name, user = {}, event_source_url } = body || {};
    if (!event_name) throw new Error('event_name requis');

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || user.ip || '';
    const ua = req.headers.get('user-agent') || user.ua || '';

    const userData: Record<string, unknown> = {
      client_ip_address: ip || undefined,
      client_user_agent: ua || undefined,
    };
    if (user.phone) userData.ph = [await sha256(normalizePhone(user.phone))];
    if (user.country) userData.country = [await sha256(user.country)];
    if (user.city) userData.ct = [await sha256(user.city)];
    if (user.fbp) userData.fbp = user.fbp;
    if (user.fbc) userData.fbc = user.fbc;

    const customData: Record<string, unknown> = {};
    if (typeof value === 'number') customData.value = value;
    if (currency) customData.currency = currency;
    if (content_name) customData.content_name = content_name;

    // Même event_id partagé entre client et serveur = clé de déduplication Meta.
    const sharedEventId = event_id || crypto.randomUUID();

    const payload = {
      data: [{
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: sharedEventId,
        action_source: 'website',
        event_source_url: event_source_url || undefined,
        user_data: userData,
        custom_data: Object.keys(customData).length ? customData : undefined,
      }],
    };

    // Envoi en parallèle vers chaque pixel configuré
    const results = await Promise.all(PIXELS.map(async (px) => {
      try {
        const resp = await fetch(
          `https://graph.facebook.com/v18.0/${px.id}/events?access_token=${px.token}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          },
        );
        const out = await resp.json();
        if (!resp.ok) console.error('FB CAPI error', px.id, out);
        return { pixel_id: px.id, ok: resp.ok, fb: out };
      } catch (e) {
        console.error('FB CAPI fetch failed', px.id, e);
        return { pixel_id: px.id, ok: false, error: String(e) };
      }
    }));

    const allOk = results.every((r) => r.ok);
    return new Response(JSON.stringify({ ok: allOk, event_id: sharedEventId, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
