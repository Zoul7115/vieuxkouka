-- Table des abonnements Web Push (un appareil = une subscription)
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- L'admin (et le SW) peuvent enregistrer leur appareil ; le service role gère le reste
CREATE POLICY "Anyone can insert push subscriptions"
  ON public.push_subscriptions FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can read push subscriptions"
  ON public.push_subscriptions FOR SELECT TO public USING (true);

CREATE POLICY "Anyone can delete push subscriptions"
  ON public.push_subscriptions FOR DELETE TO public USING (true);

CREATE INDEX idx_push_subs_endpoint ON public.push_subscriptions(endpoint);

-- Trigger: à chaque nouvelle commande, appeler l'edge function send-push via pg_net
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.notify_admin_new_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_url text := 'https://lndmvaqjsihcbcgvhqzv.supabase.co/functions/v1/send-push';
  v_body jsonb;
BEGIN
  v_body := jsonb_build_object(
    'order_number', NEW.order_number,
    'first_name', COALESCE(NEW.first_name, 'Client'),
    'city', COALESCE(NEW.city, ''),
    'product_name', COALESCE(NEW.product_name, ''),
    'product_price', NEW.product_price
  );

  PERFORM extensions.http_post(
    url := v_url,
    body := v_body,
    headers := jsonb_build_object('Content-Type', 'application/json')
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Ne jamais bloquer la commande si la notif échoue
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_order_notify_admin
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_new_order();