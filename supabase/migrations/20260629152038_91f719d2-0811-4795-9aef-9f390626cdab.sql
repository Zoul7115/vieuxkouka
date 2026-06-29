ALTER TABLE public.daily_expenses ADD COLUMN IF NOT EXISTS closeuse_idx integer NULL;
CREATE INDEX IF NOT EXISTS idx_daily_expenses_closeuse ON public.daily_expenses(closeuse_idx);