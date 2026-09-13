/**
 * Ajoute la convention ONA (Ordre National des Architectes) aux partenaires
 * de la section « Prise en charge », avec son lien d'inscription.
 *
 * Jusqu'ici l'ONA n'existait pas dans Sanity : elle était injectée en dur par
 * components/insurance.tsx, donc impossible à modifier depuis le Studio. Ce
 * script la fait passer du code au CMS, comme les six autres conventions.
 *
 *   node scripts/add-ona-convention.mjs
 */
import { createClient } from 'next-sanity'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const envPath = join(root, file)
    if (!existsSync(envPath)) continue
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      if (!(m[1] in process.env)) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
    }
  }
}
loadEnv()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
if (!projectId || !token) {
  console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID ou SANITY_API_TOKEN manquant dans .env')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false })

// Meme forme que les autres entrees du tableau : une cle lisible, pas de _type
// explicite (le schema le fournit), pas de logo tant qu'on n'a pas le visuel.
const ONA = {
  _key: 'ona',
  name: 'ONA – Ordre National des Architectes',
  name_ar: 'النقابة الوطنية للمهندسين المعماريين',
  description:
    "Convention spéciale pour les architectes affiliés et leurs familles. Inscrivez-vous en ligne pour bénéficier de la prise en charge.",
  description_ar:
    'اتفاقية خاصة للمهندسين المعماريين المنتسبين وعائلاتهم. سجّل عبر الإنترنت للاستفادة من التكفل.',
  registrationLink: 'https://facture.cliniqueokba.com/ona-inscription',
}

const doc = await client.fetch(
  `*[_type == "insuranceSection"][0]{ _id, "providers": providers[]{ _key, name, registrationLink } }`,
)

if (!doc?._id) {
  console.error('❌ Aucun document « insuranceSection » trouvé dans le dataset.')
  process.exit(1)
}

// Detection stricte : `includes('ona')` matche « Ecole Nati-ona-le » (ENSB).
// On exige l'acronyme isole ou le mot « architecte ».
const isONA = (name) => /ona/i.test(name || '') || /architect/i.test(name || '')

const existing = (doc.providers || []).find((p) => isONA(p?.name))

if (existing) {
  // Deja presente : on se contente de (re)poser le lien d'inscription.
  await client
    .patch(doc._id)
    .set({ [`providers[_key=="${existing._key}"].registrationLink`]: ONA.registrationLink })
    .commit()
  console.log(`✔ Convention déjà présente (« ${existing.name} ») — lien d'inscription mis à jour.`)
} else {
  await client
    .patch(doc._id)
    .setIfMissing({ providers: [] })
    .append('providers', [ONA])
    .commit()
  console.log('✔ Convention ONA ajoutée aux partenaires.')
}

const after = await client.fetch(
  `*[_type == "insuranceSection"][0].providers[]{ name, registrationLink }`,
)
console.log('\nPartenaires de la section :')
for (const p of after || []) {
  console.log(` - ${p.name}${p.registrationLink ? `  →  ${p.registrationLink}` : ''}`)
}
