/**
 * Seed Sanity avec le contenu actuel (médecins + galerie « Plateau technique »).
 *
 * Pré-requis :
 *   1. Crée un token d'écriture sur https://www.sanity.io/manage
 *      (API > Tokens > Add API token > Editor)
 *   2. Ajoute-le dans .env :  SANITY_API_TOKEN=skXXXXXXXX
 *
 * Lancement :
 *   node scripts/seed-sanity.mjs
 *
 * Le script est idempotent : relancé, il met à jour les mêmes documents
 * (identifiants déterministes) sans créer de doublons.
 */

import { createClient } from 'next-sanity'
import { readFileSync, createReadStream, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// ---- Chargement minimal du .env -------------------------------------------
function loadEnv() {
  const envPath = join(root, '.env')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    const key = m[1]
    let val = m[2].trim().replace(/^["']|["']$/g, '')
    if (!(key in process.env)) process.env[key] = val
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
  console.error(
    '❌ SANITY_API_TOKEN manquant. Crée un token « Editor » sur sanity.io/manage et ajoute-le au .env',
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
// We will read the updated data that we generate first.
const data = JSON.parse(readFileSync(join(__dirname, 'seed-data-updated.json'), 'utf8'))

// Cache d'upload pour ne pas ré-uploader une image déjà envoyée
async function uploadImage(relPath) {
  const abs = join(root, relPath)
  if (!existsSync(abs)) {
    console.warn(`   ⚠️  image introuvable : ${relPath}`)
    return null
  }
  const filename = relPath.split(/[\\/]/).pop()
  const asset = await client.assets.upload('image', createReadStream(abs), {
    filename,
  })
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }
}

async function run() {
  console.log(`🚀 Seed du dataset « ${dataset} » (projet ${projectId})\n`)

  // ---- Section À propos ---------------------------------------------------
  if (data.about) {
    console.log('📖  Section À propos…')
    await client.createOrReplace({
      _id: 'aboutSection',
      _type: 'aboutSection',
      title: data.about.title,
      subtitle: data.about.subtitle,
      description: data.about.description,
      values: (data.about.values || []).map((v, i) => ({
        _key: `val-${i}`,
        ...v,
      })),
      stats: (data.about.stats || []).map((s, i) => ({
        _key: `stat-${i}`,
        ...s,
      })),
    })
    console.log('   ✅ À propos')
  }

  // ---- Paramètres du site -------------------------------------------------
  if (data.siteSettings) {
    console.log('\n⚙️  Paramètres du site…')
    await client.createOrReplace({
      _id: 'siteSettings',
      _type: 'siteSettings',
      ...data.siteSettings,
      heroStats: (data.siteSettings.heroStats || []).map((s, i) => ({
        _key: `hs-${i}`,
        ...s,
      })),
    })
    console.log('   ✅ Paramètres')
  }

  // ---- Pied de page -------------------------------------------------------
  if (data.footerContent) {
    console.log('\n📄  Pied de page…')
    await client.createOrReplace({
      _id: 'footerContent',
      _type: 'footerContent',
      ...data.footerContent,
    })
    console.log('   ✅ Footer')
  }

  // ---- Soins à domicile ---------------------------------------------------
  if (data.homeCare) {
    console.log('\n🏠  Soins à domicile…')
    await client.createOrReplace({
      _id: 'homeCare',
      _type: 'homeCare',
      ...data.homeCare,
      services: (data.homeCare.services || []).map((s, i) => ({
        _key: `svc-${i}`,
        ...s,
      })),
      active: true,
    })
    console.log('   ✅ Soins à domicile')
  }

  // ---- Contenus des sections (titres / sous-titres) -----------------------
  if (data.sectionContent) {
    console.log('\n📝  Contenus des sections…')
    for (const sc of data.sectionContent) {
      await client.createOrReplace({
        _id: `sectionContent-${sc.sectionId}`,
        _type: 'sectionContent',
        ...sc,
      })
      console.log(`   ✅ ${sc.sectionId}`)
    }
  }

  // ---- Témoignages --------------------------------------------------------
  if (data.testimonials) {
    console.log('\n⭐  Témoignages…')
    let ti = 0
    for (const tt of data.testimonials) {
      await client.createOrReplace({
        _id: `testimonial-${ti}`,
        _type: 'testimonial',
        ...tt,
        active: true,
        order: ti,
      })
      console.log(`   ✅ ${tt.name}`)
      ti++
    }
  }

  // ---- Pôles d'excellence -------------------------------------------------
  console.log('⭐  Pôles d’excellence…')
  let poleOrder = 0
  for (const p of data.poles || []) {
    await client.createOrReplace({
      _id: `pole-${p.slug}`,
      _type: 'pole',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      description: p.description,
      title_ar: p.title_ar,
      description_ar: p.description_ar,
      items_ar: p.items_ar,
      badge_ar: p.badge_ar,
      iconName: p.iconName,
      accentColor: p.accentColor,
      galleryCategories: p.galleryCategories || [],
      badge: p.badge,
      urgent: p.urgent ?? false,
      featured: p.featured ?? false,
      order: poleOrder++,
      active: true,
    })
    console.log(`   ✅ ${p.title}`)
  }

  // ---- Médecins -----------------------------------------------------------
  console.log('👩‍⚕️  Médecins…')
  for (const d of data.doctors) {
    const image = await uploadImage(d.poster)
    await client.createOrReplace({
      _id: `doctor-${d.slug}`,
      _type: 'doctor',
      name: d.name,
      slug: { _type: 'slug', current: d.slug },
      title: d.title,
      specialty: d.specialty,
      subtitle: d.subtitle,
      experience: d.experience,
      services: d.services,
      consultationDays: d.consultationDays,
      consultationHours: d.consultationHours,
      accentColor: d.accentColor,
      iconName: d.iconName,
      order: d.order,
      active: true,
      ...(image ? { image } : {}),
    })
    console.log(`   ✅ ${d.title} ${d.name}`)
  }

  // ---- Galerie « Plateau technique & espaces » ----------------------------
  console.log('\n🏥  Galerie (plateau technique & espaces)…')
  let order = 0
  for (const p of data.facilityPhotos) {
    const image = await uploadImage(`public/images/equipements/${p.file}.jpg`)
    if (!image) continue
    await client.createOrReplace({
      _id: `facility-${p.file}`,
      _type: 'facilityPhoto',
      title: p.title,
      description: p.description,
      category: p.category,
      featured: p.featured,
      order: order++,
      active: true,
      image,
    })
    console.log(`   ✅ ${p.file} – ${p.title}`)
  }

  console.log('\n✨ Terminé. Ouvre Sanity Studio (/studio) pour modifier le contenu.')
}

run().catch((err) => {
  console.error('\n❌ Erreur :', err.message)
  process.exit(1)
})
