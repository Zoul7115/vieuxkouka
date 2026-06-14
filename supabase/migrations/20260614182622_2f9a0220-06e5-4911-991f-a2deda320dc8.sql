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
  v_motif_liv text;
  v_motif_conf text;
  v_motif_in text;
  v_explicit text;
  v_already_liv boolean;
  v_already_conf boolean;
BEGIN
  v_label := COALESCE(NEW.offer_label, NEW.product_name, '');
  v_label_l := lower(v_label);

  IF COALESCE(NEW.product_slug, '') = 'anti-diabete'
     OR NEW.product_name ILIKE '%anti-diab%' OR NEW.product_name ILIKE '%anti diab%'
     OR v_label ILIKE '%anti-diab%' OR v_label ILIKE '%anti diab%' THEN
    v_short_name := 'Anti-Diabète';
  ELSIF COALESCE(NEW.product_slug, '') = 'sirop-kouka'
     OR NEW.product_name ILIKE '%sirop%' OR v_label ILIKE '%sirop%' THEN
    v_short_name := 'Sirop KOUKA';
  ELSIF COALESCE(NEW.product_slug, '') = 'tonic-kouka'
     OR NEW.product_name ILIKE '%tonic%' OR v_label ILIKE '%tonic%' THEN
    v_short_name := 'Tonic KOUKA';
  ELSIF COALESCE(NEW.product_slug, '') = 'kouka'
     OR NEW.product_name ILIKE '%poudre%' OR v_label ILIKE '%poudre%'
     OR NEW.product_name ILIKE '%kouka%' THEN
    v_short_name := 'KOUKA';
  ELSE
    v_short_name := COALESCE(NEW.product_slug, NEW.product_name, 'Produit KOUKA');
  END IF;

  v_units := 1;
  v_explicit := substring(v_label_l from '(\d+)\s*(?:sachet|flacon|bidon|bouteille|unit|piece|pièce)s?');
  IF v_explicit IS NOT NULL AND v_explicit::int > 0 THEN
    v_units := v_explicit::int;
  ELSIF v_label_l ~ '3\s*\+\s*2' THEN v_units := 5;
  ELSIF v_label_l ~ '2\s*\+\s*1' THEN v_units := 3;
  ELSIF v_label_l ~ '1\s*(sachet|flacon|bouteille)|démarrage|demarrage' THEN v_units := 1;
  END IF;
  IF v_label_l ~ 'bump' THEN v_units := v_units + 1; END IF;

  v_motif_liv  := 'Livraison auto · ' || COALESCE(NEW.order_number, NEW.id::text);
  v_motif_conf := 'Confirmation · '   || COALESCE(NEW.order_number, NEW.id::text);
  v_motif_in   := 'Annulation livraison · ' || COALESCE(NEW.order_number, NEW.id::text);

  -- Insertion directe en delivered
  IF TG_OP = 'INSERT' AND NEW.status = 'delivered' THEN
    INSERT INTO public.stock_transactions (produit, type, quantite, livreur_idx, motif)
    VALUES (v_short_name, 'sortie', v_units, NEW.livreur_idx, v_motif_liv)
    ON CONFLICT (motif, type) DO NOTHING;
    -- Annule compensation antérieure éventuelle
    DELETE FROM public.stock_transactions WHERE motif = v_motif_in AND type = 'entree';
    RETURN NEW;
  END IF;

  -- Passage vers delivered
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM 'delivered' AND NEW.status = 'delivered' THEN
    SELECT EXISTS(SELECT 1 FROM public.stock_transactions WHERE motif = v_motif_liv AND type = 'sortie') INTO v_already_liv;
    SELECT EXISTS(SELECT 1 FROM public.stock_transactions WHERE motif = v_motif_conf AND type = 'sortie') INTO v_already_conf;

    IF v_already_liv THEN
      -- Une livraison existe déjà (cycle re-livraison). On supprime confirmation doublon et compensation.
      DELETE FROM public.stock_transactions WHERE motif = v_motif_conf AND type = 'sortie';
      DELETE FROM public.stock_transactions WHERE motif = v_motif_in   AND type = 'entree';
      UPDATE public.stock_transactions
        SET livreur_idx = NEW.livreur_idx, produit = v_short_name, quantite = v_units
        WHERE motif = v_motif_liv AND type = 'sortie';
    ELSIF v_already_conf THEN
      -- Convertit la confirmation en livraison
      UPDATE public.stock_transactions
        SET motif = v_motif_liv, livreur_idx = NEW.livreur_idx, produit = v_short_name, quantite = v_units
        WHERE motif = v_motif_conf AND type = 'sortie';
      DELETE FROM public.stock_transactions WHERE motif = v_motif_in AND type = 'entree';
    ELSE
      INSERT INTO public.stock_transactions (produit, type, quantite, livreur_idx, motif)
      VALUES (v_short_name, 'sortie', v_units, NEW.livreur_idx, v_motif_liv)
      ON CONFLICT (motif, type) DO NOTHING;
      DELETE FROM public.stock_transactions WHERE motif = v_motif_in AND type = 'entree';
    END IF;
  END IF;

  -- Changement livreur sur commande livrée
  IF TG_OP = 'UPDATE' AND NEW.status = 'delivered' AND OLD.livreur_idx IS DISTINCT FROM NEW.livreur_idx THEN
    UPDATE public.stock_transactions
      SET livreur_idx = NEW.livreur_idx, produit = v_short_name, quantite = v_units
      WHERE motif = v_motif_liv AND type = 'sortie';
  END IF;

  -- Annulation d'une livraison
  IF TG_OP = 'UPDATE' AND OLD.status = 'delivered' AND NEW.status IS DISTINCT FROM 'delivered' THEN
    INSERT INTO public.stock_transactions (produit, type, quantite, livreur_idx, motif)
    VALUES (v_short_name, 'entree', v_units, OLD.livreur_idx, v_motif_in)
    ON CONFLICT (motif, type) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;