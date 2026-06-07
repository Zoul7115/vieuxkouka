
-- 1) Index unique manquant qui fait échouer ON CONFLICT
CREATE UNIQUE INDEX IF NOT EXISTS stock_transactions_motif_type_uidx
  ON public.stock_transactions (motif, type)
  WHERE motif IS NOT NULL;

-- 2) Index unique pour garantir 1 seule commande par lead
CREATE UNIQUE INDEX IF NOT EXISTS orders_lead_id_uidx
  ON public.orders (lead_id)
  WHERE lead_id IS NOT NULL;

-- 3) Réécriture de handle_order_stock_change : éviter la double sortie
--    quand la commande a déjà été "réservée" via Confirmation.
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
  v_already_out boolean;
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

  -- Insertion directe en delivered (legacy)
  IF TG_OP = 'INSERT' AND NEW.status = 'delivered' THEN
    INSERT INTO public.stock_transactions (produit, type, quantite, livreur_idx, motif)
    VALUES (v_short_name, 'sortie', v_units, NEW.livreur_idx, v_motif_liv)
    ON CONFLICT (motif, type) DO NOTHING;
    RETURN NEW;
  END IF;

  -- Passage vers delivered : si une "Confirmation" existe déjà → on la convertit
  -- (évite la double sortie). Sinon on insère "Livraison auto".
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM 'delivered' AND NEW.status = 'delivered' THEN
    SELECT EXISTS(
      SELECT 1 FROM public.stock_transactions
      WHERE motif = v_motif_conf AND type = 'sortie'
    ) INTO v_already_out;

    IF v_already_out THEN
      UPDATE public.stock_transactions
      SET motif = v_motif_liv,
          livreur_idx = NEW.livreur_idx,
          produit = v_short_name,
          quantite = v_units
      WHERE motif = v_motif_conf AND type = 'sortie';
    ELSE
      INSERT INTO public.stock_transactions (produit, type, quantite, livreur_idx, motif)
      VALUES (v_short_name, 'sortie', v_units, NEW.livreur_idx, v_motif_liv)
      ON CONFLICT (motif, type) DO NOTHING;
    END IF;
  END IF;

  -- Changement de livreur sur une commande déjà livrée
  IF TG_OP = 'UPDATE' AND NEW.status = 'delivered' AND OLD.livreur_idx IS DISTINCT FROM NEW.livreur_idx THEN
    UPDATE public.stock_transactions
    SET livreur_idx = NEW.livreur_idx,
        produit = v_short_name,
        quantite = v_units
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

-- 4) Supprimer le trigger dupliqué (orders_stock_change + trg_handle_order_stock_change + trg_orders_stock_sync = triple appel !)
DROP TRIGGER IF EXISTS orders_stock_change ON public.orders;
DROP TRIGGER IF EXISTS trg_handle_order_stock_change ON public.orders;
-- on garde trg_orders_stock_sync (UPDATE OF status, livreur_idx) + on ajoute INSERT
DROP TRIGGER IF EXISTS trg_orders_stock_sync ON public.orders;
CREATE TRIGGER trg_orders_stock_sync
  AFTER INSERT OR UPDATE OF status, livreur_idx ON public.orders
  FOR EACH ROW EXECUTE FUNCTION handle_order_stock_change();

-- 5) Supprimer le doublon de notification admin
DROP TRIGGER IF EXISTS on_new_order_notify_admin ON public.orders;
