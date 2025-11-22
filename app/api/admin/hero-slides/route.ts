import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'clinic.json')

export async function GET() {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        return NextResponse.json(data.heroSlides || [])
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load hero slides' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        const newSlide = await request.json()

        // Generate ID if not provided
        if (!newSlide.id) {
            const maxId = data.heroSlides?.reduce((max: number, slide: any) =>
                Math.max(max, parseInt(slide.id) || 0), 0) || 0
            newSlide.id = String(maxId + 1)
        }

        // Set order if not provided
        if (!newSlide.order) {
            const maxOrder = data.heroSlides?.reduce((max: number, slide: any) =>
                Math.max(max, slide.order || 0), 0) || 0
            newSlide.order = maxOrder + 1
        }

        data.heroSlides = data.heroSlides || []
        data.heroSlides.push(newSlide)

        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        return NextResponse.json({ success: true, slide: newSlide })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add slide' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        const updatedSlide = await request.json()

        const index = data.heroSlides?.findIndex((slide: any) => slide.id === updatedSlide.id)
        if (index === -1) {
            return NextResponse.json({ error: 'Slide not found' }, { status: 404 })
        }

        data.heroSlides[index] = updatedSlide
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        return NextResponse.json({ success: true, slide: updatedSlide })
    } catch (error) {
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

        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)

        data.heroSlides = data.heroSlides?.filter((slide: any) => slide.id !== id) || []

        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 })
    }
}
