CREATE TABLE public.livreurs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idx integer NOT NULL UNIQUE,
  name text NOT NULL,
  whatsapp text NOT NULL,
  zone text,
  emoji text DEFAULT '🛵',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.livreurs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read livreurs" ON public.livreurs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert livreurs" ON public.livreurs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update livreurs" ON public.livreurs FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete livreurs" ON public.livreurs FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_livreurs_updated_at
BEFORE UPDATE ON public.livreurs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.livreurs (idx, name, whatsapp, zone, emoji, active) VALUES
  (1, 'KABORE Hamidou', '22658741857', 'Ouagadougou', '🛵', true),
  (2, 'OUOBA Josué', '22675980480', 'Ouagadougou', '🛵', true);