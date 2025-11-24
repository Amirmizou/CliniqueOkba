import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { revalidateAllPages } from '@/lib/revalidate'

const dataPath = path.join(process.cwd(), 'data', 'clinic.json')

export async function GET() {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        return NextResponse.json(data.gallery || [])
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load gallery' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        const newImage = await request.json()

        // Generate ID if not provided
        if (!newImage.id) {
            const maxId = data.gallery?.reduce((max: number, img: any) =>
                Math.max(max, parseInt(img.id) || 0), 0) || 0
            newImage.id = String(maxId + 1)
        }

        data.gallery = data.gallery || []
        data.gallery.push(newImage)

        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        revalidateAllPages()
        return NextResponse.json({ success: true, image: newImage })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add image' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        const updatedImage = await request.json()

        const index = data.gallery?.findIndex((img: any) => img.id === updatedImage.id)
        if (index === -1) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 })
        }

        data.gallery[index] = updatedImage
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        revalidateAllPages()
        return NextResponse.json({ success: true, image: updatedImage })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update image' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Image ID required' }, { status: 400 })
        }

        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)

        data.gallery = data.gallery?.filter((img: any) => img.id !== id) || []

        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        revalidateAllPages()
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
    }
}
