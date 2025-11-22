import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'clinic.json')

export async function GET() {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        return NextResponse.json(data.testimonials || [])
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load testimonials' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        const newTestimonial = await request.json()

        // Generate ID if not provided
        if (!newTestimonial.id) {
            const maxId = data.testimonials?.reduce((max: number, t: any) =>
                Math.max(max, parseInt(t.id) || 0), 0) || 0
            newTestimonial.id = String(maxId + 1)
        }

        data.testimonials = data.testimonials || []
        data.testimonials.push(newTestimonial)

        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        return NextResponse.json({ success: true, testimonial: newTestimonial })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add testimonial' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        const updatedTestimonial = await request.json()

        const index = data.testimonials?.findIndex((t: any) => t.id === updatedTestimonial.id)
        if (index === -1) {
            return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
        }

        data.testimonials[index] = updatedTestimonial
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        return NextResponse.json({ success: true, testimonial: updatedTestimonial })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Testimonial ID required' }, { status: 400 })
        }

        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)

        data.testimonials = data.testimonials?.filter((t: any) => t.id !== id) || []

        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
    }
}
