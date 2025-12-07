import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { heroSlidesQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
    try {
        const slides = await client.fetch(heroSlidesQuery)

        // Transform Sanity data to match existing format
        const transformedSlides = slides.map((slide: any, index: number) => ({
            id: slide._id,
            title: slide.title,
            subtitle: slide.subtitle || '',
            image: slide.image ? urlFor(slide.image).width(1920).height(1080).url() : '',
            order: slide.order || index,
            active: true,
        }))

        return NextResponse.json(transformedSlides)
    } catch (error) {
        console.error('Error fetching hero slides from Sanity:', error)
        return NextResponse.json([], { status: 500 })
    }
}
