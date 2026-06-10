/**
 * Met à jour UNIQUEMENT les photos des médecins dans Sanity + ajoute la carte
 * « Pr. Aissaoui (Responsable laboratoire) ».
 *
 * Contrairement à `seed-sanity.mjs` (qui remplace TOUT le contenu), ce script
 * est volontairement minimal :
 *   - pour les médecins existants : il ne modifie que le champ `image` (patch),
 *     toutes les autres données saisies dans le Studio sont préservées ;
 *   - pour la nouvelle entrée Aissaoui : createOrReplace.
 *
 * Pré-requis :
 *   1. Token d'écriture « Editor » sur https://www.sanity.io/manage
 *   2. Dans .env :  SANITY_API_TOKEN=skXXXXXXXX
 *
 * Lancement :  node scripts/update-doctor-photos.mjs
 */

import { createClient } from 'next-sanity'
import { readFileSync, createReadStream, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function loadEnv() {
  const envPath = join(root, '.env')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    if (!(m[1] in process.env)) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}
loadEnv()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) {
  console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID manquant dans .env')
  process.exit(1)
}
if (!token) {
  console.error('❌ SANITY_API_TOKEN manquant. Crée un token « Editor » sur sanity.io/manage et ajoute-le au .env')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false })

async function uploadImage(relPath) {
  const abs = join(root, relPath)
  if (!existsSync(abs)) {
    console.warn(`   ⚠️  image introuvable : ${relPath}`)
    return null
  }
  const asset = await client.assets.upload('image', createReadStream(abs), {
    filename: relPath.split(/[\\/]/).pop(),
  })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

// Nouvelles photos par slug de médecin existant (patch image uniquement)
const photoUpdates = {
  'meskaldji-rima': 'public/images/spec/portrait-meskaldji-rima.jpeg',
  'ameziane-leila': 'public/images/spec/portrait-ameziane-leila.jpeg',
  'boukredera-amira': 'public/images/spec/portrait-boukredera-amira.jpeg',
  'zerizer-loubna': 'public/images/spec/portrait-zerizer-loubna.jpeg',
  'boughanout-seyfeddine': 'public/images/spec/portrait-boughanout-seyfeddine.jpeg',
}

// Nouvelle carte : responsable laboratoire
const aissaoui = {
  _id: 'doctor-aissaoui-laboratoire',
  _type: 'doctor',
  name: 'Aissaoui',
  slug: { _type: 'slug', current: 'aissaoui-laboratoire' },
  title: 'Pr.',
  specialty: 'Responsable laboratoire',
  subtitle: 'Biologie médicale',
  services: ['Analyses biologiques', 'Hématologie', 'Biochimie', 'Sérologie & immunologie', 'Bactériologie'],
  consultationDays: 'Du samedi au jeudi',
  consultationHours: '08h00 – 16h00',
  accentColor: '#0EA5E9',
  iconName: 'FlaskConical',
  order: 6,
  active: true,
}

async function run() {
  console.log('🖼️  Mise à jour des photos des médecins…')
  for (const [slug, poster] of Object.entries(photoUpdates)) {
    const image = await uploadImage(poster)
    if (!image) continue
    await client.patch(`doctor-${slug}`).set({ image }).commit()
    console.log(`   ✅ ${slug}`)
  }

  console.log('🧪  Ajout / mise à jour : Pr. Aissaoui (laboratoire)…')
  const image = await uploadImage('public/images/spec/portrait-aissaoui.jpeg')
  await client.createOrReplace({ ...aissaoui, ...(image ? { image } : {}) })
  console.log('   ✅ aissaoui-laboratoire')

  console.log('\n✨ Terminé. Vérifie dans /studio et sur la page Équipe.')
}

run().catch((err) => {
  console.error('\n❌ Erreur :', err.message)
  process.exit(1)
})
