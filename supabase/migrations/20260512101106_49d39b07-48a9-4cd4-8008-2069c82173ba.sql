CREATE OR REPLACE FUNCTION public.handle_order_stock_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_short_name text;
  v_units int;
  v_label text;
  v_motif text;
  v_explicit text;
BEGIN
  v_label := COALESCE(NEW.offer_label, NEW.product_name, '');

  IF COALESCE(NEW.product_slug, '') = 'anti-diabete'
     OR NEW.product_name ILIKE '%anti-diab%'
     OR NEW.product_name ILIKE '%anti diab%'
     OR v_label ILIKE '%anti-diab%'
     OR v_label ILIKE '%anti diab%' THEN
    v_short_name := 'Anti-Diabète';
  ELSIF COALESCE(NEW.product_slug, '') = 'sirop-kouka'
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

  v_explicit := substring(v_label from '(\d+)\s*(?:sachet|flacon|bidon|unit|piece|pièce)s?');
  IF v_explicit IS NOT NULL AND v_explicit::int > 0 THEN
    v_units := v_explicit::int;
  ELSIF v_label ~* '3\s*\+\s*2' THEN
    v_units := 5;
  ELSIF v_label ~* '2\s*\+\s*1' THEN
    v_units := 3;
  ELSIF v_label ~* '1\s*(sachet|flacon)|démarrage|demarrage' THEN
    v_units := 1;
  END IF;

  IF v_label ~* 'BUMP' THEN
    v_units := v_units + 1;
  END IF;

  v_motif := 'Livraison auto · ' || COALESCE(NEW.order_number, NEW.id::text);

  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM 'delivered' AND NEW.status = 'delivered' THEN
    INSERT INTO public.stock_transactions (produit, type, quantite, livreur_idx, motif)
    SELECT v_short_name, 'sortie', v_units, NEW.livreur_idx, v_motif
    WHERE NOT EXISTS (
      SELECT 1 FROM public.stock_transactions WHERE motif = v_motif AND type = 'sortie'
    );
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.status = 'delivered' AND OLD.livreur_idx IS DISTINCT FROM NEW.livreur_idx THEN
    UPDATE public.stock_transactions
    SET livreur_idx = NEW.livreur_idx,
        produit = v_short_name,
        quantite = v_units
    WHERE motif = v_motif
      AND type = 'sortie';
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
$function$;

-- Reclasse les anciennes transactions de stock liées à des commandes Anti-Diabète
UPDATE public.stock_transactions st
SET produit = 'Anti-Diabète'
FROM public.orders o
WHERE st.produit = 'KOUKA'
  AND (st.motif LIKE 'Livraison auto · ' || o.order_number
       OR st.motif LIKE 'Annulation livraison · ' || o.order_number)
  AND (o.product_slug = 'anti-diabete'
       OR o.product_name ILIKE '%anti-diab%'
       OR o.product_name ILIKE '%anti diab%');
