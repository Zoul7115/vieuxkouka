
DROP INDEX IF EXISTS public.stock_transactions_motif_type_uidx;
-- Nettoyer d'éventuels doublons résiduels avant l'index strict
DELETE FROM public.stock_transactions s
USING public.stock_transactions s2
WHERE s.ctid < s2.ctid AND s.motif = s2.motif AND s.type = s2.type AND s.motif IS NOT NULL;
CREATE UNIQUE INDEX stock_transactions_motif_type_uidx
  ON public.stock_transactions (motif, type);
