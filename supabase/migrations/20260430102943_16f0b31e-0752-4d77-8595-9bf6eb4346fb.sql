ALTER TABLE public.livreurs ADD COLUMN IF NOT EXISTS delivery_fee integer NOT NULL DEFAULT 2000;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_fee integer;