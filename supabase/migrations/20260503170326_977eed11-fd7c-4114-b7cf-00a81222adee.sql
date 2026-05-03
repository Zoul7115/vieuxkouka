
CREATE TABLE public.weekly_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start date NOT NULL,
  week_end date NOT NULL,
  kpi jsonb NOT NULL DEFAULT '{}'::jsonb,
  ia_report text,
  finance_reco jsonb NOT NULL DEFAULT '{}'::jsonb,
  alerts jsonb NOT NULL DEFAULT '[]'::jsonb,
  generated_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz,
  UNIQUE(week_start)
);

ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read weekly_reports" ON public.weekly_reports FOR SELECT USING (true);
CREATE POLICY "Anyone can insert weekly_reports" ON public.weekly_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update weekly_reports" ON public.weekly_reports FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete weekly_reports" ON public.weekly_reports FOR DELETE USING (true);

CREATE TABLE public.app_settings (
  key text NOT NULL PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read app_settings" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert app_settings" ON public.app_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update app_settings" ON public.app_settings FOR UPDATE USING (true);

INSERT INTO public.app_settings (key, value) VALUES
  ('finance_rules', '{"pub_pct":40,"stock_pct":30,"epargne_pct":20,"perso_pct":10}'::jsonb)
ON CONFLICT (key) DO NOTHING;
