ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS client_ip text;
CREATE INDEX IF NOT EXISTS idx_orders_client_ip ON public.orders(client_ip);

CREATE TABLE public.blocked_ips (
  ip text PRIMARY KEY,
  reason text,
  blocked_by text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_ips TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_ips TO authenticated;
GRANT ALL ON public.blocked_ips TO service_role;

ALTER TABLE public.blocked_ips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blocked_ips" ON public.blocked_ips FOR SELECT USING (true);
CREATE POLICY "Anyone can insert blocked_ips" ON public.blocked_ips FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete blocked_ips" ON public.blocked_ips FOR DELETE USING (true);