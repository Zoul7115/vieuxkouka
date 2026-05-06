CREATE TABLE public.form_drafts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  full_name text,
  whatsapp text,
  country_code text,
  city text,
  product_slug text,
  offer_label text,
  page text,
  user_agent text,
  source text,
  recovered boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id)
);

CREATE INDEX idx_form_drafts_updated_at ON public.form_drafts(updated_at DESC);
CREATE INDEX idx_form_drafts_whatsapp ON public.form_drafts(whatsapp);

ALTER TABLE public.form_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert form_drafts" ON public.form_drafts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read form_drafts" ON public.form_drafts FOR SELECT USING (true);
CREATE POLICY "Anyone can update form_drafts" ON public.form_drafts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete form_drafts" ON public.form_drafts FOR DELETE USING (true);

CREATE TRIGGER update_form_drafts_updated_at
BEFORE UPDATE ON public.form_drafts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Marque le brouillon comme récupéré quand une commande arrive sur le même WhatsApp
CREATE OR REPLACE FUNCTION public.mark_draft_recovered()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.whatsapp IS NOT NULL THEN
    UPDATE public.form_drafts
    SET recovered = true
    WHERE whatsapp = NEW.whatsapp AND recovered = false;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_mark_draft_recovered
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.mark_draft_recovered();