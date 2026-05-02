ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS sav_followed_up_at timestamptz NULL,
ADD COLUMN IF NOT EXISTS sav_notes text NULL;