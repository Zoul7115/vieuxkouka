-- Helper: déduit le shortName produit + units à partir des champs de la commande
CREATE OR REPLACE FUNCTION public.handle_order_stock_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_short_name text;
  v_units int;
  v_label text;
BEGIN
  v_label := COALESCE(NEW.offer_label, NEW.product_name, '');

  -- Détermine le shortName produit
  IF NEW.product_name ILIKE '%sirop%' OR v_label ILIKE '%sirop%' THEN
    v_short_name := 'Sirop KOUKA';
  ELSIF NEW.product_name ILIKE '%poudre%' OR v_label ILIKE '%poudre%' OR NEW.product_name ILIKE '%kouka%' THEN
    v_short_name := 'Poudre KOUKA';
  ELSE
    v_short_name := COALESCE(NEW.product_slug, NEW.product_name);
  END IF;

  -- Détermine les unités à partir du label (1 SACHET, 2+1, 3+2, +1 BUMP)
  v_units := 1;
  IF v_label ~* '3\s*\+\s*2' THEN v_units := 5;
  ELSIF v_label ~* '2\s*\+\s*1' THEN v_units := 3;
  ELSIF v_label ~* '1\s*sachet|1\s*flacon|démarrage' THEN v_units := 1;
  END IF;
  IF v_label ~* 'BUMP' THEN v_units := v_units + 1; END IF;

  -- Cas 1: passage à delivered => sortie de stock
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM 'delivered' AND NEW.status = 'delivered') THEN
    INSERT INTO public.stock_transactions (produit, type, quantite, livreur_idx, motif)
    VALUES (v_short_name, 'sortie', v_units, NEW.livreur_idx, 'Livraison auto · ' || COALESCE(NEW.order_number, ''));
  END IF;

  -- Cas 2: annulation d'une livraison => entrée compensatoire
  IF (TG_OP = 'UPDATE' AND OLD.status = 'delivered' AND NEW.status IS DISTINCT FROM 'delivered') THEN
    INSERT INTO public.stock_transactions (produit, type, quantite, livreur_idx, motif)
    VALUES (v_short_name, 'entree', v_units, OLD.livreur_idx, 'Annulation livraison · ' || COALESCE(NEW.order_number, ''));
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orders_stock_sync ON public.orders;
CREATE TRIGGER trg_orders_stock_sync
AFTER UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_order_stock_change();

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_stock_tx_created_at ON public.stock_transactions (created_at DESC);