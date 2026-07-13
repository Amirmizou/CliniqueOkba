-- Migration : ajout du marqueur "Traité" sur les bénéficiaires
-- À exécuter UNE FOIS dans Supabase → SQL Editor (si la table existe déjà).
-- Idempotent : peut être relancé sans erreur.

alter table public.beneficiaries
  add column if not exists traite    boolean     not null default false,
  add column if not exists traite_at timestamptz;

create index if not exists beneficiaries_traite_idx on public.beneficiaries (traite);
