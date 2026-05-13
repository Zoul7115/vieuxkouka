-- Ajout d'une date de livraison effective sur les commandes
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivered_at timestamptz;

-- Trigger: maintient delivered_at synchronisé avec le statut
CREATE OR REPLACE FUNCTION public.sync_delivered_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'delivered' AND (OLD.status IS DISTINCT FROM 'delivered' OR NEW.delivered_at IS NULL) THEN
    NEW.delivered_at := COALESCE(NEW.delivered_at, now());
  ELSIF NEW.status IS DISTINCT FROM 'delivered' AND OLD.status = 'delivered' THEN
    NEW.delivered_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_delivered_at ON public.orders;
CREATE TRIGGER trg_sync_delivered_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.sync_delivered_at();

-- Backfill: pour les commandes déjà livrées sans delivered_at, on prend created_at
UPDATE public.orders
SET delivered_at = created_at
WHERE status = 'delivered' AND delivered_at IS NULL;