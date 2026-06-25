import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

import { poles } from '../data/poles'
import { equipements } from '../data/equipements'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-03-20',
})

function getBrandFromTitle(title: string): string {
    const t = title.toLowerCase()
    if (t.includes('siemens')) return 'Siemens Healthineers'
    if (t.includes('biosystems')) return 'BioSystems'
    if (t.includes('alegria')) return 'Orgentec'
    if (t.includes('genexpert')) return 'Cepheid'
    if (t.includes('beckman')) return 'Beckman Coulter'
    if (t.includes('maglumi')) return 'Snibe'
    if (t.includes('stryker')) return 'Stryker'
    if (t.includes('planmeca')) return 'Planmeca'
    if (t.includes('roche')) return 'Roche Diagnostics'
    return 'Inconnue'
}

function mapCategory(cat: string): string {
    const mapping: Record<string, string> = {
        'imagerie': 'imaging',
        'nucleaire': 'imaging',
        'bloc': 'surgery',
        'laboratoire': 'laboratory',
        'hospitalisation': 'facility',
        'consultation': 'facility',
        'accueil': 'facility',
        'dentaire': 'facility',
    }
    return mapping[cat] || 'facility'
}

async function uploadImageCached(filePath: string): Promise<string | null> {
    if (!fs.existsSync(filePath)) {
        console.warn(`   ⚠️ Image not found: ${filePath}`)
        return null
    }

    const filename = path.basename(filePath)
    
    // Check if asset already exists in Sanity to save bandwidth/API calls
    const existing = await client.fetch(
        `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]`,
        { filename }
    )

    if (existing) {
        return existing._id
    }

    try {
        const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
            filename,
        })
        return asset._id
    } catch (error: any) {
        console.error(`   ❌ Error uploading image ${filename}:`, error.message)
        return null
    }
}

async function run() {
    console.log('🚀 Starting Sanity synchronization...\n')

    // 1. Database Cleanup
    console.log('🧹 Cleaning up old duplicate equipments...')
    try {
        const existingEquipments = await client.fetch('*[_type == "equipment"]')
        let deletedCount = 0
        for (const eq of existingEquipments) {
            if (!eq._id.startsWith('equipment-eq-')) {
                console.log(`  Deleting duplicate/old equipment: ${eq.name} (${eq._id})`)
                await client.delete(eq._id)
                deletedCount++
            }
        }
        console.log(`  ✅ Cleaned up ${deletedCount} non-deterministic equipments.\n`)
    } catch (error: any) {
        console.error('  ❌ Error during database cleanup:', error.message)
    }

    // 2. Video Upload for Laboratory Pole
    let videoAssetId: string | null = null
    let posterAssetId: string | null = null
    const videoPath = path.join(process.cwd(), 'public', 'videos', 'Présentation laboratoire OKBA.mp4')
    const posterPath = path.join(process.cwd(), 'public', 'images', 'equipements', 'eq-27.jpg')

    console.log('📹 Processing video presentation...')
    if (fs.existsSync(videoPath)) {
        const videoFilename = 'Présentation laboratoire OKBA.mp4'
        const existingVideo = await client.fetch(
            `*[_type == "sanity.fileAsset" && originalFilename == $videoFilename][0]`,
            { videoFilename }
        )

        if (existingVideo) {
            console.log(`  ✅ Video already uploaded: ${existingVideo._id}`)
            videoAssetId = existingVideo._id
        } else {
            console.log('  📤 Uploading presentation video (this may take a few seconds)...')
            try {
                const asset = await client.assets.upload('file', fs.createReadStream(videoPath), {
                    filename: videoFilename,
                    contentType: 'video/mp4',
                })
                console.log(`  ✅ Video uploaded successfully: ${asset._id}`)
                videoAssetId = asset._id
            } catch (error: any) {
                console.error('  ❌ Error uploading video:', error.message)
            }
        }
    } else {
        console.warn(`  ⚠️ Laboratory presentation video not found at: ${videoPath}`)
    }

    if (fs.existsSync(posterPath)) {
        console.log('📸 Uploading/resolving video poster image...')
        posterAssetId = await uploadImageCached(posterPath)
    }

    // 3. Sync Poles
    console.log('\n🏥 Synchronizing Poles...')
    const existingPoles = await client.fetch('*[_type == "pole"]')
    
    for (const p of poles) {
        try {
            const existing = existingPoles.find((ep: any) => ep.slug?.current === p.slug)
            
            const patchData: any = {
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
                urgent: p.urgent ?? false,
                featured: p.featured ?? false,
            }

            // If this is the laboratory pole, attach the presentation video
            if (p.slug === 'laboratoire' && videoAssetId) {
                patchData.videos = [
                    {
                        _type: 'poleVideo',
                        _key: 'lab-presentation-video',
                        title: 'Présentation du Laboratoire',
                        title_ar: 'عرض المختبر',
                        videoFile: {
                            _type: 'file',
                            asset: {
                                _type: 'reference',
                                _ref: videoAssetId,
                            },
                        },
                        poster: posterAssetId
                            ? {
                                  _type: 'image',
                                  asset: {
                                      _type: 'reference',
                                      _ref: posterAssetId,
                                  },
                              }
                            : undefined,
                    },
                ]
            }

            if (existing) {
                await client.patch(existing._id).set(patchData).commit()
                console.log(`  ✅ Pole patched: ${p.title}`)
            } else {
                await client.create({
                    _id: `pole-${p.slug}`,
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

    // 4. Sync Equipment and Facility Photos
    console.log('\n⚙️ Synchronizing Equipment and Facility Photos...')
    for (const eq of equipements) {
        try {
            const imagePath = path.join(process.cwd(), 'public', eq.src)
            console.log(`⏳ Processing: ${eq.title} (${eq.id})...`)
            
            const imageAssetId = await uploadImageCached(imagePath)
            const brand = getBrandFromTitle(eq.title)
            const mappedCat = mapCategory(eq.category)
            const model = eq.title.replace(/^(Automate|Scanner|IRM|Salle|Réception|Cabinet|Capteur|Unité|Paillasses|Hall)\s+/i, '') || eq.title

            // A. Sync to equipment schema (category: imaging, laboratory, etc.)
            await client.createOrReplace({
                _id: `equipment-${eq.id}`,
                _type: 'equipment',
                name: eq.title,
                name_ar: eq.title_ar,
                description: eq.description,
                description_ar: eq.description_ar,
                brand,
                model,
                category: mappedCat,
                features: [],
                order: parseInt(eq.id.replace('eq-', '')) || 0,
                image: imageAssetId
                    ? {
                          _type: 'image',
                          asset: {
                              _type: 'reference',
                              _ref: imageAssetId,
                          },
                      }
                    : undefined,
            })

            // B. Sync to facilityPhoto schema for the gallery (category: laboratoire, imagerie, etc.)
            await client.createOrReplace({
                _id: `facility-${eq.id}`,
                _type: 'facilityPhoto',
                title: eq.title,
                title_ar: eq.title_ar,
                description: eq.description,
                description_ar: eq.description_ar,
                category: eq.category, // keep French category matching local poles config
                featured: eq.featured ?? false,
                order: parseInt(eq.id.replace('eq-', '')) || 0,
                active: true,
                image: imageAssetId
                    ? {
                          _type: 'image',
                          asset: {
                              _type: 'reference',
                              _ref: imageAssetId,
                          },
                      }
                    : undefined,
            })

            console.log(`  ✅ Synchronized equipment & photo: ${eq.title}`)
        } catch (error: any) {
            console.error(`  ❌ Error processing equipment ${eq.title}:`, error.message)
        }
    }

    console.log('\n✨ Synchronization fully completed!')
}

run().catch(console.error)
