/**
 * Crée / met à jour la fiche médecin « Dr. Latreche Khadidja » (radiologue)
 * dans Sanity, avec sa photo et toutes ses spécificités (bilingue FR/AR).
 *
 * Données reprises de data/doctors.ts (slug: latreche-khadidja).
 *
 * Pré-requis : SANITY_API_TOKEN (Editor) dans .env
 * Lancement  : node scripts/add-doctor-latreche.mjs
 */

import { createClient } from 'next-sanity'
import { readFileSync, createReadStream, existsSync } from 'node:fs'
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

if (!projectId) {
  console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID manquant dans .env')
  process.exit(1)
}
if (!token) {
  console.error('❌ SANITY_API_TOKEN manquant (token « Editor » sur sanity.io/manage)')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false })

async function uploadImageCached(relPath) {
  const abs = join(root, relPath)
  if (!existsSync(abs)) {
    console.warn(`   ⚠️  image introuvable : ${relPath}`)
    return null
  }
  const filename = relPath.split(/[\\/]/).pop()
  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}`,
    { filename },
  )
  if (existing?._id) {
    console.log(`   ♻️  image déjà présente : ${filename}`)
    return { _type: 'image', asset: { _type: 'reference', _ref: existing._id } }
  }
  const asset = await client.assets.upload('image', createReadStream(abs), { filename })
  console.log(`   📤 image uploadée : ${filename}`)
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

const doctor = {
  _id: 'doctor-latreche-khadidja',
  _type: 'doctor',
  slug: { _type: 'slug', current: 'latreche-khadidja' },
  title: 'Dr.',
  name: 'Latreche Khadidja',
  title_ar: 'د.',
  name_ar: 'لطرش خديجة',
  specialty: 'Médecin radiologue',
  specialty_ar: 'طبيبة أشعة',
  subtitle: 'Spécialiste en imagerie médicale & radiologie',
  subtitle_ar: 'أخصائية في التصوير الطبي والأشعة',
  services: [
    'IRM 1,5T',
    'Scanner',
    'Radiologie numérique',
    'Mammographie numérique',
    'Échographie',
    'Écho-Doppler',
    'Élastométrie',
  ],
  services_ar: [
    'الرنين المغناطيسي 1.5 تسلا',
    'السكانير',
    'الأشعة الرقمية',
    'تصوير الثدي الرقمي',
    'التصوير بالصدى',
    'دوبلر',
    'قياس المرونة (إيلاستوغرافيا)',
  ],
  consultationDays: 'Du samedi au jeudi',
  consultationDays_ar: 'من السبت إلى الخميس',
  consultationHours: '08h00 – 16h00',
  consultationHours_ar: 'من 08:00 إلى 16:00',
  phone: '0560782767',
  accentColor: '#3B82F6',
  iconName: 'ScanLine',
  order: 5,
  active: true,
}

async function run() {
  console.log('👩‍⚕️  Fiche : Dr. Latreche Khadidja (radiologue)')
  const image = await uploadImageCached('public/images/spec/portrait-latreche-khadidja.jpg')

  const existing = await client.fetch(
    `*[_type == "doctor" && (slug.current == "latreche-khadidja" || _id == "doctor-latreche-khadidja")][0]{_id}`,
  )

  if (existing?._id) {
    await client
      .patch(existing._id)
      .set({ ...doctor, ...(image ? { image } : {}) })
      .commit()
    console.log(`   ✅ mise à jour : ${existing._id}`)
  } else {
    const created = await client.create({ ...doctor, ...(image ? { image } : {}) })
    console.log(`   ✅ créé : ${created._id}`)
  }

  console.log('\n✨ Terminé. Vérifie dans /admin/dashboard (Studio) et sur la page Équipe.')
}

run().catch((err) => {
  console.error('\n❌ Erreur :', err.message)
  process.exit(1)
})
