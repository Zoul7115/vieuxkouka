-- Normalize historical powder stock rows to match the product name used by the Stock tab
UPDATE public.stock_transactions
SET produit = 'KOUKA'
WHERE produit = 'Poudre KOUKA';

-- Recreate the stock sync function using the visible stock product names
CREATE OR REPLACE FUNCTION public.handle_order_stock_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_short_name text;
  v_units int;
  v_label text;
  v_motif text;
BEGIN
  v_label := COALESCE(NEW.offer_label, NEW.product_name, '');

  IF COALESCE(NEW.product_slug, '') = 'sirop-kouka'
     OR NEW.product_name ILIKE '%sirop%'
     OR v_label ILIKE '%sirop%' THEN
    v_short_name := 'Sirop KOUKA';
  ELSIF COALESCE(NEW.product_slug, '') = 'kouka'
     OR NEW.product_name ILIKE '%poudre%'
     OR v_label ILIKE '%poudre%'
     OR NEW.product_name ILIKE '%kouka%' THEN
    v_short_name := 'KOUKA';
  ELSE
    v_short_name := COALESCE(NEW.product_slug, NEW.product_name, 'Produit KOUKA');
  END IF;

  v_units := 1;
  IF v_label ~* '3\s*\+\s*2' THEN
    v_units := 5;
  ELSIF v_label ~* '2\s*\+\s*1' THEN
    v_units := 3;
  ELSIF v_label ~* '1\s*(sachet|flacon)|démarrage|demarrage' THEN
    v_units := 1;
  END IF;

  IF v_label ~* 'BUMP' THEN
    v_units := v_units + 1;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM 'delivered' AND NEW.status = 'delivered' THEN
    v_motif := 'Livraison auto · ' || COALESCE(NEW.order_number, NEW.id::text);
    INSERT INTO public.stock_transactions (produit, type, quantite, livreur_idx, motif)
    SELECT v_short_name, 'sortie', v_units, NEW.livreur_idx, v_motif
    WHERE NOT EXISTS (
      SELECT 1 FROM public.stock_transactions WHERE motif = v_motif AND type = 'sortie'
    );
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.status = 'delivered' AND NEW.status IS DISTINCT FROM 'delivered' THEN
    v_motif := 'Annulation livraison · ' || COALESCE(NEW.order_number, NEW.id::text);
    INSERT INTO public.stock_transactions (produit, type, quantite, livreur_idx, motif)
    SELECT v_short_name, 'entree', v_units, OLD.livreur_idx, v_motif
    WHERE NOT EXISTS (
      SELECT 1 FROM public.stock_transactions WHERE motif = v_motif AND type = 'entree'
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orders_stock_sync ON public.orders;
CREATE TRIGGER trg_orders_stock_sync
AFTER UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_order_stock_change();

ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.stock_transactions REPLICA IDENTITY FULL;
ALTER TABLE public.daily_expenses REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'stock_transactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_transactions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'daily_expenses'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_expenses;
  END IF;
END $$;