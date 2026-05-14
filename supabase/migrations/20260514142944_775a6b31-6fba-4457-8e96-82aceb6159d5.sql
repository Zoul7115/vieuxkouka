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
  v_label_l text;
  v_motif text;
  v_explicit text;
BEGIN
  v_label := COALESCE(NEW.offer_label, NEW.product_name, '');
  v_label_l := lower(v_label);

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

  -- Quantité explicite (ex: "10 flacons", "3 sachets") — case-insensitive via lowercase
  v_explicit := substring(v_label_l from '(\d+)\s*(?:sachet|flacon|bidon|unit|piece|pièce)s?');
  IF v_explicit IS NOT NULL AND v_explicit::int > 0 THEN
    v_units := v_explicit::int;
  ELSIF v_label_l ~ '3\s*\+\s*2' THEN
    v_units := 5;
  ELSIF v_label_l ~ '2\s*\+\s*1' THEN
    v_units := 3;
  ELSIF v_label_l ~ '1\s*(sachet|flacon)|démarrage|demarrage' THEN
    v_units := 1;
  END IF;

  IF v_label_l ~ 'bump' THEN
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

-- Backfill: corriger les transactions de stock existantes pour les commandes livrées
-- dont la quantité déduite ne correspond pas à l'offre réelle.
DO $$
DECLARE
  r record;
  v_label_l text;
  v_explicit text;
  v_units int;
BEGIN
  FOR r IN
    SELECT o.id, o.order_number, o.offer_label, o.product_name, st.id AS tx_id, st.quantite AS old_qty
    FROM public.orders o
    JOIN public.stock_transactions st
      ON st.motif = 'Livraison auto · ' || o.order_number
     AND st.type = 'sortie'
    WHERE o.status = 'delivered'
  LOOP
    v_label_l := lower(COALESCE(r.offer_label, r.product_name, ''));
    v_units := 1;
    v_explicit := substring(v_label_l from '(\d+)\s*(?:sachet|flacon|bidon|unit|piece|pièce)s?');
    IF v_explicit IS NOT NULL AND v_explicit::int > 0 THEN
      v_units := v_explicit::int;
    ELSIF v_label_l ~ '3\s*\+\s*2' THEN
      v_units := 5;
    ELSIF v_label_l ~ '2\s*\+\s*1' THEN
      v_units := 3;
    END IF;
    IF v_label_l ~ 'bump' THEN
      v_units := v_units + 1;
    END IF;

    IF v_units <> r.old_qty THEN
      UPDATE public.stock_transactions
      SET quantite = v_units
      WHERE id = r.tx_id;
    END IF;
  END LOOP;
END $$;