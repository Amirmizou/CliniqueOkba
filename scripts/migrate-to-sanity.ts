// Script de migration des données vers Sanity
// Exécuter avec: npx ts-node --skip-project scripts/migrate-to-sanity.ts

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'

const client = createClient({
    projectId: 'ox121huo',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN, // Vous devez définir ce token
})

interface ClinicData {
    heroSlides: Array<{
        id: string
        title: string
        subtitle: string
        image: string
        order: number
        active: boolean
    }>
    equipment: Array<{
        id: string
        name: string
        brand: string
        model: string
        category: string
        description: string
        icon: string
        image: string
        features: string[]
    }>
    gallery: Array<{
        id: string
        image: string
        caption: string
        category: string
    }>
}

async function migrate() {
    console.log('🚀 Début de la migration vers Sanity...\n')

    // Lire les données existantes
    const dataPath = path.join(process.cwd(), 'data', 'clinic.json')
    const data: ClinicData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

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
                // Note: Les images devront être uploadées manuellement via le studio
            })
            console.log(`  ✅ Slide créé: ${slide.title}`)
        } catch (error) {
            console.error(`  ❌ Erreur slide ${slide.title}:`, error)
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
            console.error(`  ❌ Erreur équipement ${equip.name}:`, error)
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
            console.error(`  ❌ Erreur galerie:`, error)
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
        console.error('  ❌ Erreur paramètres:', error)
    }

    console.log('\n✨ Migration terminée!')
    console.log('\n⚠️  Note: Les images doivent être uploadées manuellement via le studio Sanity.')
}

migrate().catch(console.error)
