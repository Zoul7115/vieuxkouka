
-- 1. Slug closeuses
ALTER TABLE public.closeuses ADD COLUMN IF NOT EXISTS slug text;

UPDATE public.closeuses
SET slug = trim(both '-' from lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')))
WHERE slug IS NULL OR slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS closeuses_slug_uniq ON public.closeuses(slug) WHERE slug IS NOT NULL;

-- 2. Ajouts orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS closeuse_slug text,
  ADD COLUMN IF NOT EXISTS lead_id uuid,
  ADD COLUMN IF NOT EXISTS assigned_at timestamptz;

CREATE INDEX IF NOT EXISTS orders_closeuse_idx_status_idx ON public.orders(closeuse_idx, status);
CREATE INDEX IF NOT EXISTS orders_lead_id_idx ON public.orders(lead_id);

-- 3. Leads
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  closeuse_idx integer NOT NULL,
  closeuse_slug text NOT NULL,
  product_slug text NOT NULL,
  product_name text NOT NULL,
  offer_label text,
  product_price integer NOT NULL DEFAULT 0,
  first_name text,
  last_name text,
  whatsapp text,
  country text,
  city text,
  neighborhood text,
  address_detail text,
  status text NOT NULL DEFAULT 'nouveau_lead',
  notes text,
  client_ip text,
  source text,
  validated_at timestamptz,
  order_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update leads" ON public.leads FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete leads" ON public.leads FOR DELETE USING (true);

CREATE INDEX IF NOT EXISTS leads_closeuse_status_created_idx ON public.leads(closeuse_idx, status, created_at DESC);
CREATE INDEX IF NOT EXISTS leads_whatsapp_idx ON public.leads(whatsapp);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);
CREATE INDEX IF NOT EXISTS leads_product_idx ON public.leads(product_slug);

DROP TRIGGER IF EXISTS leads_updated_at ON public.leads;
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Lead events
CREATE TABLE IF NOT EXISTS public.lead_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL,
  closeuse_idx integer,
  event_type text NOT NULL,
  from_status text,
  to_status text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_events TO anon, authenticated;
GRANT ALL ON public.lead_events TO service_role;
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read lead_events" ON public.lead_events FOR SELECT USING (true);
CREATE POLICY "Anyone can insert lead_events" ON public.lead_events FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS lead_events_lead_id_idx ON public.lead_events(lead_id, created_at DESC);

-- 5. Commission settings
CREATE TABLE IF NOT EXISTS public.commission_settings (
  id integer PRIMARY KEY DEFAULT 1,
  commission_per_validated_order integer NOT NULL DEFAULT 1000,
  commission_per_delivered_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT only_one_row CHECK (id = 1)
);
GRANT SELECT, INSERT, UPDATE ON public.commission_settings TO anon, authenticated;
GRANT ALL ON public.commission_settings TO service_role;
ALTER TABLE public.commission_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read commission_settings" ON public.commission_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can upsert commission_settings" ON public.commission_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update commission_settings" ON public.commission_settings FOR UPDATE USING (true);

INSERT INTO public.commission_settings (id, commission_per_validated_order, commission_per_delivered_order)
VALUES (1, 1000, 0) ON CONFLICT (id) DO NOTHING;

-- 6. Commission payouts
CREATE TABLE IF NOT EXISTS public.commission_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  closeuse_idx integer NOT NULL,
  period_month date NOT NULL,
  validated_count integer NOT NULL DEFAULT 0,
  delivered_count integer NOT NULL DEFAULT 0,
  amount_due integer NOT NULL DEFAULT 0,
  amount_paid integer NOT NULL DEFAULT 0,
  paid_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (closeuse_idx, period_month)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.commission_payouts TO anon, authenticated;
GRANT ALL ON public.commission_payouts TO service_role;
ALTER TABLE public.commission_payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read commission_payouts" ON public.commission_payouts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert commission_payouts" ON public.commission_payouts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update commission_payouts" ON public.commission_payouts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete commission_payouts" ON public.commission_payouts FOR DELETE USING (true);

DROP TRIGGER IF EXISTS commission_payouts_updated_at ON public.commission_payouts;
CREATE TRIGGER commission_payouts_updated_at BEFORE UPDATE ON public.commission_payouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS commission_payouts_period_idx ON public.commission_payouts(period_month DESC);

-- 7. Audit log
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_type text NOT NULL,
  actor_id text,
  actor_name text,
  entity_type text NOT NULL,
  entity_id text,
  action text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_log TO anon, authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read audit_log" ON public.audit_log FOR SELECT USING (true);
CREATE POLICY "Anyone can insert audit_log" ON public.audit_log FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS audit_log_created_idx ON public.audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_log_entity_idx ON public.audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS audit_log_actor_idx ON public.audit_log(actor_type, actor_id);
