
-- 1. Table closeuses
CREATE TABLE public.closeuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idx serial UNIQUE NOT NULL,
  name text NOT NULL,
  whatsapp text NOT NULL UNIQUE,
  password_hash text,
  session_token text,
  active boolean NOT NULL DEFAULT true,
  emoji text DEFAULT '👩‍💼',
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.closeuses TO anon, authenticated;
GRANT ALL ON public.closeuses TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.closeuses_idx_seq TO anon, authenticated, service_role;

ALTER TABLE public.closeuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read closeuses" ON public.closeuses FOR SELECT USING (true);
CREATE POLICY "Anyone can insert closeuses" ON public.closeuses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update closeuses" ON public.closeuses FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete closeuses" ON public.closeuses FOR DELETE USING (true);

CREATE TRIGGER closeuses_updated_at
BEFORE UPDATE ON public.closeuses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Ajout closeuse_idx sur orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS closeuse_idx integer;
CREATE INDEX IF NOT EXISTS idx_orders_closeuse_idx ON public.orders(closeuse_idx);

-- 3. Étendre trigger stock pour gérer INSERT direct avec status='delivered'
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
  ELSIF COALESCE(NEW.product_slug, '') = 'tonic-kouka'
     OR NEW.product_name ILIKE '%tonic%'
     OR v_label ILIKE '%tonic%' THEN
    v_short_name := 'Tonic KOUKA';
  ELSIF COALESCE(NEW.product_slug, '') = 'kouka'
     OR NEW.product_name ILIKE '%poudre%'
     OR v_label ILIKE '%poudre%'
     OR NEW.product_name ILIKE '%kouka%' THEN
    v_short_name := 'KOUKA';
  ELSE
    v_short_name := COALESCE(NEW.product_slug, NEW.product_name, 'Produit KOUKA');
  END IF;

  v_units := 1;
  v_explicit := substring(v_label_l from '(\d+)\s*(?:sachet|flacon|bidon|bouteille|unit|piece|pièce)s?');
  IF v_explicit IS NOT NULL AND v_explicit::int > 0 THEN
    v_units := v_explicit::int;
  ELSIF v_label_l ~ '3\s*\+\s*2' THEN
    v_units := 5;
  ELSIF v_label_l ~ '2\s*\+\s*1' THEN
    v_units := 3;
  ELSIF v_label_l ~ '1\s*(sachet|flacon|bouteille)|démarrage|demarrage' THEN
    v_units := 1;
  END IF;

  IF v_label_l ~ 'bump' THEN
    v_units := v_units + 1;
  END IF;

  v_motif := 'Livraison auto · ' || COALESCE(NEW.order_number, NEW.id::text);

  -- INSERT direct avec status delivered (cas closeuse)
  IF TG_OP = 'INSERT' AND NEW.status = 'delivered' THEN
    INSERT INTO public.stock_transactions (produit, type, quantite, livreur_idx, motif)
    SELECT v_short_name, 'sortie', v_units, NEW.livreur_idx, v_motif
    WHERE NOT EXISTS (
      SELECT 1 FROM public.stock_transactions WHERE motif = v_motif AND type = 'sortie'
    );
    RETURN NEW;
  END IF;

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

-- Attacher le trigger si pas déjà attaché (INSERT + UPDATE)
DROP TRIGGER IF EXISTS orders_stock_change ON public.orders;
CREATE TRIGGER orders_stock_change
AFTER INSERT OR UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_order_stock_change();
