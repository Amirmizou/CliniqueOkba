/**
 * Migration des fichiers du bucket "beneficiaires" entre deux projets Supabase.
 *
 * La liste des fichiers à copier est lue DANS LA BASE du nouveau projet
 * (colonnes photo_path / document_path / document_verso_path / justificatif_path) :
 * on ne copie donc que les objets réellement référencés par un bénéficiaire,
 * en conservant exactement le même chemin des deux côtés.
 *
 * Usage :
 *   node scripts/migrate-storage.mjs            # copie
 *   node scripts/migrate-storage.mjs --dry-run  # simulation, n'écrit rien
 *
 * Variables requises (dans .env) :
 *   NEXT_PUBLIC_SUPABASE_URL        -> projet DESTINATION (le nouveau)
 *   SUPABASE_SERVICE_ROLE_KEY       -> clé service_role du nouveau projet
 *   OLD_SUPABASE_URL                -> projet SOURCE (l'ancien)
 *   OLD_SUPABASE_SERVICE_ROLE_KEY   -> clé service_role de l'ancien projet
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'beneficiaires'
const CONCURRENCY = 5 // volontairement bas : au-delà, le Storage renvoie des 522
const DRY_RUN = process.argv.includes('--dry-run')

// --- Chargement du .env -----------------------------------------------------
const envPath = path.join(process.cwd(), '.env')
if (!fs.existsSync(envPath)) {
  console.error('.env introuvable. Lance le script depuis la racine du projet.')
  process.exit(1)
}
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.trim().startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]
    }),
)

const missing = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OLD_SUPABASE_URL',
  'OLD_SUPABASE_SERVICE_ROLE_KEY',
].filter((k) => !env[k])
if (missing.length) {
  console.error('Variables manquantes dans .env :\n  ' + missing.join('\n  '))
  process.exit(1)
}

const opts = { auth: { persistSession: false, autoRefreshToken: false } }
const source = createClient(env.OLD_SUPABASE_URL, env.OLD_SUPABASE_SERVICE_ROLE_KEY, opts)
const dest = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, opts)

console.log(`Source      : ${env.OLD_SUPABASE_URL}`)
console.log(`Destination : ${env.NEXT_PUBLIC_SUPABASE_URL}`)
if (DRY_RUN) console.log('MODE SIMULATION — aucun fichier ne sera écrit\n')

// --- Liste des fichiers à copier --------------------------------------------
const { data: rows, error: dbError } = await dest
  .from('beneficiaries')
  .select('photo_path, document_path, document_verso_path, justificatif_path')
if (dbError) {
  // document_verso_path peut ne pas exister si la migration SQL n'a pas été jouée
  console.error('Lecture de la table impossible :', dbError.message)
  console.error("Si l'erreur porte sur document_verso_path, joue d'abord :")
  console.error('  alter table public.beneficiaries add column if not exists document_verso_path text;')
  process.exit(1)
}

const paths = [
  ...new Set(
    rows.flatMap((r) =>
      [r.photo_path, r.document_path, r.document_verso_path, r.justificatif_path].filter(Boolean),
    ),
  ),
]
console.log(`${rows.length} bénéficiaires -> ${paths.length} fichiers à traiter\n`)

// --- Copie ------------------------------------------------------------------
const stats = { copied: 0, skipped: 0, missing: 0, failed: 0 }
const problems = []
let done = 0

async function migrate(p) {
  // Déjà présent côté destination ? (permet de relancer le script sans tout refaire)
  const dir = p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : ''
  const name = p.slice(p.lastIndexOf('/') + 1)
  const { data: existing } = await dest.storage.from(BUCKET).list(dir, { search: name, limit: 1 })
  if (existing?.some((o) => o.name === name)) {
    stats.skipped++
    return
  }

  const { data: blob, error: dlError } = await source.storage.from(BUCKET).download(p)
  if (dlError || !blob) {
    const msg = dlError?.message || 'téléchargement vide'
    if (/not found|does not exist/i.test(msg)) stats.missing++
    else stats.failed++
    problems.push(`${p} -> source: ${msg}`)
    return
  }

  if (DRY_RUN) {
    stats.copied++
    return
  }

  const { error: upError } = await dest.storage.from(BUCKET).upload(p, blob, {
    contentType: blob.type || 'application/octet-stream',
    upsert: true,
  })
  if (upError) {
    stats.failed++
    problems.push(`${p} -> destination: ${upError.message}`)
    return
  }
  stats.copied++
}

const queue = [...paths]
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const p = queue.shift()
      try {
        await migrate(p)
      } catch (e) {
        stats.failed++
        problems.push(`${p} -> ${String(e).slice(0, 120)}`)
      }
      done++
      if (done % 20 === 0 || done === paths.length) {
        process.stdout.write(`\r  ${done}/${paths.length} traités...`)
      }
    }
  }),
)

// --- Rapport ----------------------------------------------------------------
console.log('\n\n--- Résultat ---')
console.log(`Copiés            : ${stats.copied}${DRY_RUN ? ' (simulés)' : ''}`)
console.log(`Déjà présents     : ${stats.skipped}`)
console.log(`Absents de la source : ${stats.missing}`)
console.log(`Échecs            : ${stats.failed}`)

if (problems.length) {
  const report = path.join(process.cwd(), 'migration-storage-problemes.txt')
  fs.writeFileSync(report, problems.join('\n'), 'utf8')
  console.log(`\nDétail des ${problems.length} problème(s) : ${report}`)
}

if (stats.failed) process.exitCode = 1
