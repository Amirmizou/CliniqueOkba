import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { equipmentQuery, siteSettingsQuery, galleryQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
    try {
        // Fetch all data from Sanity
        const [equipment, siteSettings, gallery] = await Promise.all([
            client.fetch(equipmentQuery),
            client.fetch(siteSettingsQuery),
            client.fetch(galleryQuery),
        ])

        // Transform equipment data
        const transformedEquipment = equipment.map((item: any) => ({
            id: item._id,
            name: item.name,
            brand: item.brand,
            model: item.model,
            category: item.category,
            description: item.description,
            icon: item.icon,
            image: item.image ? urlFor(item.image).width(800).height(600).url() : '',
            features: item.features || [],
        }))

        // Transform gallery data
        const transformedGallery = gallery.map((item: any) => ({
            id: item._id,
            image: item.image ? urlFor(item.image).width(800).height(600).url() : '',
            caption: item.caption || '',
            category: item.category,
        }))

        // Build response matching existing format
        const data = {
            name: siteSettings?.clinicName || 'Clinique OKBA',
            description: siteSettings?.description || '',
            contact: {
                email: siteSettings?.email || 'contact@cliniqueokba.com',
                phone: siteSettings?.phone || '+213 555 123 456',
                address: siteSettings?.address || '',
            },
            social: siteSettings?.social || {},
            hours: siteSettings?.hours || {},
            coordinates: siteSettings?.coordinates || { lat: 36.241485, lng: 6.550478 },
            equipment: transformedEquipment,
            gallery: transformedGallery,
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching clinic data from Sanity:', error)
        // Fallback to empty data
        return NextResponse.json({
            equipment: [],
            gallery: [],
            contact: {},
            social: {},
            hours: {},
        }, { status: 500 })
    }
}

export async function POST() {
    return NextResponse.json({
        error: 'Utilisez le studio Sanity pour modifier le contenu: /studio'
    }, { status: 405 })
}
