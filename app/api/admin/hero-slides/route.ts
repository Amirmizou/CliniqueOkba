import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidateAllPages } from '@/lib/revalidate'

export async function GET() {
    try {
        const slides = await prisma.heroSlide.findMany({
            orderBy: { order: 'asc' }
        })
        return NextResponse.json(slides)
    } catch (error) {
        console.error('Failed to fetch slides:', error)
        return NextResponse.json({ error: 'Failed to load hero slides' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()

        // Get max order
        const lastSlide = await prisma.heroSlide.findFirst({
            orderBy: { order: 'desc' }
        })
        const newOrder = (lastSlide?.order ?? 0) + 1

        const newSlide = await prisma.heroSlide.create({
            data: {
                image: data.image,
                title: data.title,
                subtitle: data.subtitle || '',
                order: newOrder,
                active: data.active ?? true
            }
        })

        revalidateAllPages()
        return NextResponse.json({ success: true, slide: newSlide })
    } catch (error) {
        console.error('Failed to create slide:', error)
        return NextResponse.json({ error: 'Failed to add slide' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json()
        const { id, ...updateData } = data

        if (!id) {
            return NextResponse.json({ error: 'Slide ID required' }, { status: 400 })
        }

        const updatedSlide = await prisma.heroSlide.update({
            where: { id },
            data: updateData
        })

        revalidateAllPages()
        return NextResponse.json({ success: true, slide: updatedSlide })
    } catch (error) {
        console.error('Failed to update slide:', error)
        return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Slide ID required' }, { status: 400 })
        }

        await prisma.heroSlide.delete({
            where: { id }
        })

        revalidateAllPages()
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete slide:', error)
        return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 })
    }
}
