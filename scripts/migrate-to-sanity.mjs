// Script de migration des données vers Sanity
// Exécuter avec: node scripts/migrate-to-sanity.mjs

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = createClient({
  projectId: 'ox121huo',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function migrate() {
  console.log('🚀 Début de la migration vers Sanity...\n')

  // Lire les données existantes
  const dataPath = path.join(__dirname, '..', 'data', 'clinic.json')
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  // Migration des Hero Slides
  console.log('📸 Migration des Hero Slides...')
  for (const slide of data.heroSlides || []) {
    try {
      await client.create({
        _type: 'heroSlide',
        title: slide.title,
        subtitle: slide.subtitle || '',
        order: slide.order || 1,
        active: slide.active !== false,
      })
      console.log(`  ✅ Slide créé: ${slide.title}`)
    } catch (error) {
      console.error(`  ❌ Erreur slide ${slide.title}:`, error.message)
    }
  }

  // Migration des Équipements
  console.log('\n🏥 Migration des Équipements...')
  for (const equip of data.equipment || []) {
    try {
      await client.create({
        _type: 'equipment',
        name: equip.name,
        brand: equip.brand,
        model: equip.model,
        category: equip.category,
        description: equip.description,
        icon: equip.icon,
        features: equip.features || [],
        order: parseInt(equip.id) || 0,
      })
      console.log(`  ✅ Équipement créé: ${equip.name}`)
    } catch (error) {
      console.error(`  ❌ Erreur équipement ${equip.name}:`, error.message)
    }
  }

  // Migration de la Galerie
  console.log('\n🖼️ Migration de la Galerie...')
  for (const img of data.gallery || []) {
    try {
      await client.create({
        _type: 'galleryImage',
        caption: img.caption || '',
        category: img.category,
        order: parseInt(img.id) || 0,
      })
      console.log(`  ✅ Image galerie créée: ${img.caption || 'Sans titre'}`)
    } catch (error) {
      console.error(`  ❌ Erreur galerie:`, error.message)
    }
  }

  // Migration des Paramètres du Site
  console.log('\n⚙️ Création des Paramètres du Site...')
  try {
    await client.createOrReplace({
      _id: 'siteSettings',
      _type: 'siteSettings',
      clinicName: 'Clinique OKBA',
      description: 'Clinique privée moderne à Constantine, Algérie',
      phone: '+213 555 123 456',
      email: 'contact@cliniqueokba.com',
      address: 'Nouvelle ville Ali Mendjeli, Constantine, Algérie',
      coordinates: {
        lat: 36.241485,
        lng: 6.550478,
      },
      hours: {
        emergency: '24h/24 - 7j/7',
        weekdays: '08:00 - 18:00',
        saturday: '08:00 - 14:00',
      },
      social: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
      },
    })
    console.log('  ✅ Paramètres du site créés')
  } catch (error) {
    console.error('  ❌ Erreur paramètres:', error.message)
  }

  console.log('\n✨ Migration terminée!')
  console.log('\n⚠️  Note: Les images doivent être uploadées manuellement via le studio Sanity.')
}

migrate().catch(console.error)
