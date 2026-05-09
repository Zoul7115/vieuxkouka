
CREATE OR REPLACE FUNCTION public.notify_livreur_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_url text := 'https://lndmvaqjsihcbcgvhqzv.supabase.co/functions/v1/send-push';
  v_body jsonb;
BEGIN
  -- Seulement quand un nouveau livreur est assigné (ou changé)
  IF NEW.livreur_idx IS NULL THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.livreur_idx IS NOT DISTINCT FROM NEW.livreur_idx THEN
    RETURN NEW;
  END IF;

  v_body := jsonb_build_object(
    'target', 'livreur',
    'livreur_idx', NEW.livreur_idx,
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
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_livreur_assignment ON public.orders;
CREATE TRIGGER trg_notify_livreur_assignment
AFTER INSERT OR UPDATE OF livreur_idx ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.notify_livreur_assignment();
