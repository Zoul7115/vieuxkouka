CREATE TABLE IF NOT EXISTS public.daily_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL DEFAULT 'autre',
  label TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read daily_expenses"
  ON public.daily_expenses FOR SELECT USING (true);
CREATE POLICY "Anyone can insert daily_expenses"
  ON public.daily_expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update daily_expenses"
  ON public.daily_expenses FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete daily_expenses"
  ON public.daily_expenses FOR DELETE USING (true);

CREATE TRIGGER update_daily_expenses_updated_at
  BEFORE UPDATE ON public.daily_expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_daily_expenses_date ON public.daily_expenses(expense_date DESC);