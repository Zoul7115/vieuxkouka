ALTER TABLE public.closeuses ADD COLUMN IF NOT EXISTS admin_orders_access boolean NOT NULL DEFAULT false;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivered_by_closeuse_idx integer;
CREATE INDEX IF NOT EXISTS orders_delivered_by_closeuse_idx ON public.orders(delivered_by_closeuse_idx);