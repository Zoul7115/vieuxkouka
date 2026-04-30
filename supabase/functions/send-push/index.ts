// Edge function: envoie une notification Web Push à tous les appareils admin abonnés.
// Appelée par un trigger Postgres à chaque INSERT sur public.orders.

import webpush from "npm:web-push@3.6.7";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY")!;
const RAW_SUBJECT = Deno.env.get("VAPID_SUBJECT") || "admin@kouka.app";
// web-push exige un mailto: ou une URL — on normalise au cas où
const VAPID_SUBJECT = /^(mailto:|https?:\/\/)/i.test(RAW_SUBJECT) ? RAW_SUBJECT : `mailto:${RAW_SUBJECT}`;

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const orderNumber = body.order_number || "";
    const firstName = body.first_name || "Client";
    const city = body.city || "";
    const product = body.product_name || "";
    const price = body.product_price || 0;

    const title = `🌿 Nouvelle commande ${orderNumber}`;
    const message = `${firstName} · ${city} · ${product} · ${price.toLocaleString("fr-FR")} FCFA`;

    const { data: subs, error } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth");

    if (error) throw error;
    if (!subs || subs.length === 0) {
      return Response.json({ ok: true, sent: 0, message: "no subscribers" }, { headers: corsHeaders });
    }

    const payload = JSON.stringify({
      title,
      body: message,
      tag: `order-${orderNumber || Date.now()}`,
      url: "/admin",
    });

    let sent = 0;
    let removed = 0;
    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload,
            { TTL: 3600, urgency: "high" },
          );
          sent++;
        } catch (e) {
          // 404/410 = subscription expirée → on la supprime
          const code = (e as { statusCode?: number }).statusCode;
          if (code === 404 || code === 410) {
            await supabase.from("push_subscriptions").delete().eq("id", s.id);
            removed++;
          } else {
            console.error("push error", code, (e as Error).message);
          }
        }
      }),
    );

    return Response.json({ ok: true, sent, removed }, { headers: corsHeaders });
  } catch (e) {
    console.error("send-push error", e);
    return Response.json({ ok: false, error: (e as Error).message }, { status: 500, headers: corsHeaders });
  }
});
