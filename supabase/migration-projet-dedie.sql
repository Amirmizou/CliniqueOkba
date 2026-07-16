-- Migration: Ajouter le champ projet_dedie pour les bénéficiaires de la promotion Dambri
ALTER TABLE public.beneficiaries ADD COLUMN projet_dedie text;
