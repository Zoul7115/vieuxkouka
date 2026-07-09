
-- =========================================================================
-- 1) Garde-fou : une seule commande par lead
-- =========================================================================
CREATE UNIQUE INDEX IF NOT EXISTS orders_lead_id_unique
  ON public.orders(lead_id)
  WHERE lead_id IS NOT NULL;

-- =========================================================================
-- 2) Garde-fou : pas de double écriture stock pour la même opération
-- =========================================================================
-- On supprime d'éventuels doublons avant de créer l'index
DELETE FROM public.stock_transactions a
USING public.stock_transactions b
WHERE a.ctid < b.ctid
  AND a.motif = b.motif
  AND a.type = b.type
  AND a.motif IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS stock_transactions_motif_type_unique
  ON public.stock_transactions(motif, type)
  WHERE motif IS NOT NULL;

-- =========================================================================
-- 3) Trigger : Lead → Commande
-- =========================================================================
CREATE OR REPLACE FUNCTION public.sync_order_from_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_order_status text;
  v_old_order_status text;
BEGIN
  -- Pas de commande liée → rien à faire
  IF NEW.order_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Mapping lead → order
  v_new_order_status := CASE NEW.status
    WHEN 'nouveau_lead' THEN 'pending'
    WHEN 'discussion'   THEN 'pending'
    WHEN 'a_relancer'   THEN 'pending'
    WHEN 'valide'       THEN 'confirmed'
    WHEN 'expediee'     THEN 'expediee'
    WHEN 'livree'       THEN 'delivered'
    WHEN 'refusee'      THEN 'cancelled'
    WHEN 'annulee'      THEN 'cancelled'
    WHEN 'perdue'       THEN 'cancelled'
    ELSE NULL
  END;

  IF v_new_order_status IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT status INTO v_old_order_status FROM public.orders WHERE id = NEW.order_id;

  -- Idempotent
  IF v_old_order_status IS NOT DISTINCT FROM v_new_order_status THEN
    -- Toujours répercuter motif refus si fourni
    IF v_new_order_status = 'cancelled' THEN
      UPDATE public.orders
      SET refusal_reason = COALESCE(NEW.refusal_reason, refusal_reason),
          refusal_comment = COALESCE(NEW.refusal_comment, refusal_comment)
      WHERE id = NEW.order_id;
    END IF;
    RETURN NEW;
  END IF;

  UPDATE public.orders
  SET status = v_new_order_status,
      -- Annulation → déverrouille pour permettre re-validation
      locked = CASE WHEN v_new_order_status = 'cancelled' THEN false ELSE locked END,
      refusal_reason = CASE WHEN v_new_order_status = 'cancelled' THEN NEW.refusal_reason ELSE refusal_reason END,
      refusal_comment = CASE WHEN v_new_order_status = 'cancelled' THEN NEW.refusal_comment ELSE refusal_comment END
  WHERE id = NEW.order_id;

  -- Historique
  INSERT INTO public.lead_events (lead_id, closeuse_idx, event_type, from_status, to_status, payload)
  VALUES (NEW.id, NEW.closeuse_idx, 'order_synced', v_old_order_status, v_new_order_status,
          jsonb_build_object('order_id', NEW.order_id, 'lead_status', NEW.status));

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_sync_order_from_lead ON public.leads;
CREATE TRIGGER trg_sync_order_from_lead
AFTER UPDATE OF status, refusal_reason, refusal_comment ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.sync_order_from_lead();

-- =========================================================================
-- 4) Stock automatique sur confirmation/annulation
--    On garde l'ancien trigger pour livraison (livreur). On ajoute un
--    trigger qui réserve le stock dès "confirmed" et le réintègre si la
--    commande retombe en pending/cancelled. Idempotent grâce à l'index unique.
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_order_stock_on_confirm()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_short_name text;
  v_units int;
  v_label text;
  v_label_l text;
  v_motif_out text;
  v_motif_in text;
  v_explicit text;
  v_was_decremented boolean;
BEGIN
  v_label   := COALESCE(NEW.offer_label, NEW.product_name, '');
  v_label_l := lower(v_label);

  -- Nom court produit (même règle que handle_order_stock_change)
  IF COALESCE(NEW.product_slug,'') = 'anti-diabete'
     OR NEW.product_name ILIKE '%anti-diab%' OR NEW.product_name ILIKE '%anti diab%'
     OR v_label ILIKE '%anti-diab%' OR v_label ILIKE '%anti diab%' THEN
    v_short_name := 'Anti-Diabète';
  ELSIF COALESCE(NEW.product_slug,'') = 'sirop-kouka'
     OR NEW.product_name ILIKE '%sirop%' OR v_label ILIKE '%sirop%' THEN
    v_short_name := 'Sirop KOUKA';
  ELSIF COALESCE(NEW.product_slug,'') = 'tonic-kouka'
     OR NEW.product_name ILIKE '%tonic%' OR v_label ILIKE '%tonic%' THEN
    v_short_name := 'Tonic KOUKA';
  ELSIF COALESCE(NEW.product_slug,'') = 'kouka'
     OR NEW.product_name ILIKE '%poudre%' OR v_label ILIKE '%poudre%'
     OR NEW.product_name ILIKE '%kouka%' THEN
    v_short_name := 'KOUKA';
  ELSE
    v_short_name := COALESCE(NEW.product_slug, NEW.product_name, 'Produit KOUKA');
  END IF;

  -- Quantité
  v_units := 1;
  v_explicit := substring(v_label_l from '(\d+)\s*(?:sachet|flacon|bidon|bouteille|unit|piece|pièce)s?');
  IF v_explicit IS NOT NULL AND v_explicit::int > 0 THEN
    v_units := v_explicit::int;
  ELSIF v_label_l ~ '3\s*\+\s*2' THEN v_units := 5;
  ELSIF v_label_l ~ '2\s*\+\s*1' THEN v_units := 3;
  END IF;
  IF v_label_l ~ 'bump' THEN v_units := v_units + 1; END IF;

  v_motif_out := 'Confirmation · ' || COALESCE(NEW.order_number, NEW.id::text);
  v_motif_in  := 'Réintégration · ' || COALESCE(NEW.order_number, NEW.id::text);

  -- Cas 1 : passage → confirmed
  IF NEW.status = 'confirmed' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'confirmed') THEN
    -- Évite double décrément si déjà sortie pour cette commande
    SELECT EXISTS(
      SELECT 1 FROM public.stock_transactions
      WHERE motif = v_motif_out AND type = 'sortie'
    ) INTO v_was_decremented;

    IF NOT v_was_decremented THEN
      INSERT INTO public.stock_transactions (produit, type, quantite, livreur_idx, motif)
      VALUES (v_short_name, 'sortie', v_units, NEW.livreur_idx, v_motif_out)
      ON CONFLICT (motif, type) DO NOTHING;

      -- Si une réintégration antérieure existait (cycle annul → re-valid), on l'annule par compensation
      DELETE FROM public.stock_transactions WHERE motif = v_motif_in AND type = 'entree';
    END IF;
  END IF;

  -- Cas 2 : retour de confirmed/expediee vers pending/cancelled → réintégrer
  IF TG_OP = 'UPDATE'
     AND OLD.status IN ('confirmed','expediee')
     AND NEW.status IN ('pending','cancelled')
  THEN
    -- Réintègre seulement si on avait bien décrémenté
    IF EXISTS (
      SELECT 1 FROM public.stock_transactions
      WHERE motif = v_motif_out AND type = 'sortie'
    ) THEN
      INSERT INTO public.stock_transactions (produit, type, quantite, livreur_idx, motif)
      VALUES (v_short_name, 'entree', v_units, NEW.livreur_idx, v_motif_in)
      ON CONFLICT (motif, type) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_order_stock_confirm ON public.orders;
CREATE TRIGGER trg_order_stock_confirm
AFTER INSERT OR UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_order_stock_on_confirm();

-- =========================================================================
-- 5) Realtime : s'assurer que les tables clés sont publiées
-- =========================================================================
DO $$
BEGIN
  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='orders';
  IF NOT FOUND THEN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.orders'; END IF;

  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='lead_relances';
  IF NOT FOUND THEN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_relances'; END IF;

  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='lead_events';
  IF NOT FOUND THEN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_events'; END IF;

  PERFORM 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='stock_transactions';
  IF NOT FOUND THEN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_transactions'; END IF;
END $$;
