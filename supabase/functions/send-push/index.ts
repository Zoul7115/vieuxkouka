// Edge function: send-push
// Reçoit les nouveaux ordres via le trigger DB et envoie une notification Web Push
// à toutes les souscriptions enregistrées (admins). Utilise VAPID.
//
// Body attendu: { order_number, first_name, city, product_name, product_price }

import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const VAPID_PUBLIC = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE_KEY')!;
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@kouka.app';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  // GET → renvoie la clé publique VAPID pour permettre la souscription côté navigateur
  if (req.method === 'GET') {
    return new Response(JSON.stringify({ publicKey: VAPID_PUBLIC }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const orderNumber = body.order_number || '';
    const firstName = body.first_name || 'Client';
    const city = body.city || '';
    const productName = body.product_name || '';
    const price = Number(body.product_price || 0);

    const title = `🌿 Nouvelle commande ${orderNumber}`;
    const messageBody = `${firstName} · ${city} · ${price.toLocaleString('fr-FR')} FCFA${productName ? ` · ${productName}` : ''}`;

    const payload = JSON.stringify({
      title,
      body: messageBody,
      tag: `order-${orderNumber || Date.now()}`,
      url: '/admin',
    });

    const { data: subs, error } = await admin
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth');

    if (error) throw error;

    const results = await Promise.allSettled(
      (subs || []).map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload,
            { TTL: 60 }
          );
          return { id: s.id, ok: true };
        } catch (err: any) {
          // 404/410 = subscription expirée, on la supprime
          const code = err?.statusCode;
          if (code === 404 || code === 410) {
            await admin.from('push_subscriptions').delete().eq('id', s.id);
          }
          return { id: s.id, ok: false, code, error: String(err?.message || err) };
        }
      })
    );

    const sent = results.filter((r) => r.status === 'fulfilled' && (r.value as any).ok).length;
    return new Response(JSON.stringify({ ok: true, total: subs?.length || 0, sent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('send-push error', e);
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
