-- ============================================================================
-- Clinique OKBA — Bénéficiaires des organismes conventionnés
-- ============================================================================
-- À exécuter UNE FOIS dans l'éditeur SQL du projet Supabase
-- (Dashboard Supabase → SQL Editor → coller → Run).
--
-- Modèle : chaque bénéficiaire soumet ses coordonnées, éventuellement son
-- numéro d'assuré, la liste des membres de sa famille (JSONB structuré) et
-- deux fichiers (photo + fiche familiale scannée) stockés dans un bucket PRIVÉ.
-- Toutes les lectures/écritures passent par le serveur Next.js avec la
-- SERVICE_ROLE_KEY ; l'accès anonyme direct est bloqué par RLS.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Table principale
-- ----------------------------------------------------------------------------
create table if not exists public.beneficiaries (
  id             uuid primary key default gen_random_uuid(),
  organisme      text        not null,            -- nom de l'organisme (repris de la section Conventions)
  nom            text        not null,
  prenom         text        not null,
  telephone      text        not null,
  email          text,
  adresse        text,
  num_assure     text,                            -- matricule / n° d'assuré (optionnel)
  situation_familiale text                         -- 'celibataire' | 'marie' (oriente les ayants droit)
                 check (situation_familiale in ('celibataire', 'marie')),
  -- Membres de la famille : tableau d'objets
  -- [{ nom, prenom, date_naissance, lien_parente }]
  family_members jsonb       not null default '[]'::jsonb,
  photo_path     text,                            -- chemin dans le bucket "beneficiaires"
  document_path  text,                            -- chemin dans le bucket "beneficiaires"
  status         text        not null default 'en_attente'
                 check (status in ('en_attente', 'valide', 'rejete')),
  -- "Traité" : les coordonnées ont été utilisées pour compléter/créer le
  -- dossier du bénéficiaire dans l'application métier externe.
  traite         boolean     not null default false,
  traite_at      timestamptz,
  notes_admin    text,                            -- note interne facultative
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists beneficiaries_organisme_idx on public.beneficiaries (organisme);
create index if not exists beneficiaries_status_idx    on public.beneficiaries (status);
create index if not exists beneficiaries_traite_idx    on public.beneficiaries (traite);
create index if not exists beneficiaries_created_idx   on public.beneficiaries (created_at desc);

-- Maintien de updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists beneficiaries_set_updated_at on public.beneficiaries;
create trigger beneficiaries_set_updated_at
  before update on public.beneficiaries
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security : personne en anon/authenticated ne peut lire/écrire.
-- La SERVICE_ROLE_KEY (utilisée côté serveur uniquement) contourne la RLS.
-- ----------------------------------------------------------------------------
alter table public.beneficiaries enable row level security;
-- Aucune policy => aucun accès pour anon/authenticated. C'est voulu.

-- ----------------------------------------------------------------------------
-- Bucket de stockage PRIVÉ pour les photos et fiches familiales
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('beneficiaires', 'beneficiaires', false)
on conflict (id) do nothing;

-- Pas de policy storage pour anon/authenticated : accès uniquement via
-- SERVICE_ROLE_KEY (upload serveur) et URLs signées générées côté admin.
