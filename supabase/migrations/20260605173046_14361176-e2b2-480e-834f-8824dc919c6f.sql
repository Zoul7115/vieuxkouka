
-- Améliorations système multi-closeuses

-- 1. Colonnes leads: motif refus, UTM, last activity, daily objective config (sur closeuse)
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS refusal_reason text,
  ADD COLUMN IF NOT EXISTS refusal_comment text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS utm_adset text,
  ADD COLUMN IF NOT EXISTS utm_ad text,
  ADD COLUMN IF NOT EXISTS campaign text,
  ADD COLUMN IF NOT EXISTS adset text,
  ADD COLUMN IF NOT EXISTS ad text;

-- 2. Verrouillage commande validée + UTM sur orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS locked boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS refusal_reason text,
  ADD COLUMN IF NOT EXISTS refusal_comment text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS utm_adset text,
  ADD COLUMN IF NOT EXISTS utm_ad text,
  ADD COLUMN IF NOT EXISTS campaign text,
  ADD COLUMN IF NOT EXISTS adset text,
  ADD COLUMN IF NOT EXISTS ad text;

-- 3. Closeuses: dernière activité + objectif quotidien
ALTER TABLE public.closeuses
  ADD COLUMN IF NOT EXISTS last_activity_at timestamptz,
  ADD COLUMN IF NOT EXISTS daily_objective integer NOT NULL DEFAULT 5;

-- 4. Table relances planifiées
CREATE TABLE IF NOT EXISTS public.lead_relances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL,
  closeuse_idx integer NOT NULL,
  scheduled_at timestamptz NOT NULL,
  kind text NOT NULL,
  done_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_relances TO anon, authenticated;
GRANT ALL ON public.lead_relances TO service_role;
ALTER TABLE public.lead_relances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read lead_relances" ON public.lead_relances FOR SELECT USING (true);
CREATE POLICY "Anyone can insert lead_relances" ON public.lead_relances FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update lead_relances" ON public.lead_relances FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete lead_relances" ON public.lead_relances FOR DELETE USING (true);

CREATE INDEX IF NOT EXISTS idx_lead_relances_closeuse ON public.lead_relances(closeuse_idx, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_leads_status_closeuse ON public.leads(closeuse_idx, status);
CREATE INDEX IF NOT EXISTS idx_orders_closeuse ON public.orders(closeuse_idx);

-- 5. Trigger : verrouiller la commande quand validée par closeuse + créer relances J+1/J+3/J+7 quand lead = a_relancer
CREATE OR REPLACE FUNCTION public.lock_order_on_validation()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.closeuse_idx IS NOT NULL AND NEW.status IN ('confirmed','delivered','expediee','livree','valide') THEN
    NEW.locked := true;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_lock_order_on_validation ON public.orders;
CREATE TRIGGER trg_lock_order_on_validation
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.lock_order_on_validation();

CREATE OR REPLACE FUNCTION public.create_relances_on_a_relancer()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'a_relancer' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'a_relancer') THEN
    -- évite doublons : ne crée que si pas déjà planifié
    IF NOT EXISTS (SELECT 1 FROM public.lead_relances WHERE lead_id = NEW.id AND done_at IS NULL) THEN
      INSERT INTO public.lead_relances (lead_id, closeuse_idx, scheduled_at, kind) VALUES
        (NEW.id, NEW.closeuse_idx, now() + interval '1 day', 'J+1'),
        (NEW.id, NEW.closeuse_idx, now() + interval '3 days', 'J+3'),
        (NEW.id, NEW.closeuse_idx, now() + interval '7 days', 'J+7');
    END IF;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_create_relances ON public.leads;
CREATE TRIGGER trg_create_relances
  AFTER INSERT OR UPDATE OF status ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.create_relances_on_a_relancer();
