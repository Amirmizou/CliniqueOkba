-- Migration : justificatif de propriété (facture électricité / gaz / eau)
-- pour les acquéreurs (Promotion Dembri). Fichier stocké dans le bucket privé
-- "beneficiaires", ce champ ne contient que son chemin.
-- À exécuter UNE FOIS dans le SQL Editor de Supabase.
ALTER TABLE public.beneficiaries ADD COLUMN IF NOT EXISTS justificatif_path text;
