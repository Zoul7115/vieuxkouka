CREATE TABLE public.blocked_customers (
  whatsapp text PRIMARY KEY,
  reason text,
  blocked_by text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_customers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_customers TO authenticated;
GRANT ALL ON public.blocked_customers TO service_role;

ALTER TABLE public.blocked_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blocked_customers" ON public.blocked_customers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert blocked_customers" ON public.blocked_customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete blocked_customers" ON public.blocked_customers FOR DELETE USING (true);