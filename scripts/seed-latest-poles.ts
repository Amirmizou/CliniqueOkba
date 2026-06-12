import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

import { poles } from '../data/poles'
import { equipements } from '../data/equipements'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-03-20',
})

async function seedLatest() {
    console.log('🚀 Seeding latest modifications to Sanity...')
    
    // Seed Equipments
    console.log('📸 Seeding equipments...')
    for (const eq of equipements) {
        try {
            await client.create({
                _type: 'equipment',
                name: eq.title,
                name_ar: eq.title_ar,
                description: eq.description,
                description_ar: eq.description_ar,
                brand: 'Inconnue', // Default
                category: eq.category,
                features: [],
                order: parseInt(eq.id.replace('eq-', '')) || 0,
            })
            console.log(`  ✅ Equipment created: ${eq.title}`)
        } catch (error: any) {
            console.error(`  ❌ Error equipment ${eq.title}:`, error.message)
        }
    }

    // Seed Poles (or patch existing)
    console.log('\n🏥 Seeding/Patching Poles...')
    const existingPoles = await client.fetch('*[_type == "pole"]')
    
    for (const p of poles) {
        try {
            const existing = existingPoles.find((ep: any) => ep.slug?.current === p.slug)
            const patchData = {
                title: p.title,
                title_ar: p.title_ar,
                description: p.description,
                description_ar: p.description_ar,
                intro: p.intro,
                intro_ar: p.intro_ar,
                badge: p.badge,
                badge_ar: p.badge_ar,
                items: p.items,
                items_ar: p.items_ar,
                iconName: p.iconName,
                accentColor: p.accent,
                galleryCategories: p.galleryCategories,
                urgent: p.urgent,
            }
            
            if (existing) {
                await client.patch(existing._id).set(patchData).commit()
                console.log(`  ✅ Pole patched: ${p.title}`)
            } else {
                await client.create({
                    _type: 'pole',
                    ...patchData,
                    slug: { _type: 'slug', current: p.slug },
                })
                console.log(`  ✅ Pole created: ${p.title}`)
            }
        } catch (error: any) {
            console.error(`  ❌ Error pole ${p.title}:`, error.message)
        }
    }

    console.log('\n✨ Seeding completed!')
}

seedLatest().catch(console.error)
