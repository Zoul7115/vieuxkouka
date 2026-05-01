
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS address_detail text,
  ADD COLUMN IF NOT EXISTS delivery_slot text,
  ADD COLUMN IF NOT EXISTS secondary_contact text,
  ADD COLUMN IF NOT EXISTS cash_confirmed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS confirmed_via_whatsapp_at timestamp with time zone;

CREATE INDEX IF NOT EXISTS idx_orders_status_created ON public.orders(status, created_at DESC);
