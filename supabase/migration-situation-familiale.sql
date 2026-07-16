-- Migration: Ajouter la situation familiale du bénéficiaire (célibataire / marié)
-- Oriente la saisie des ayants droit (parents seuls, ou conjoint + enfants + parents).
ALTER TABLE public.beneficiaries
  ADD COLUMN IF NOT EXISTS situation_familiale text
  CHECK (situation_familiale IN ('celibataire', 'marie'));
