import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'clinic.json')

export async function GET() {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        return NextResponse.json(data.services || [])
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load services' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        const newService = await request.json()

        // Generate ID if not provided
        if (!newService.id) {
            const maxId = data.services?.reduce((max: number, s: any) =>
                Math.max(max, parseInt(s.id) || 0), 0) || 0
            newService.id = String(maxId + 1)
        }

        data.services = data.services || []
        data.services.push(newService)

        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        return NextResponse.json({ success: true, service: newService })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add service' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        const updatedService = await request.json()

        const index = data.services?.findIndex((s: any) => s.id === updatedService.id)
        if (index === -1) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 })
        }

        data.services[index] = updatedService
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        return NextResponse.json({ success: true, service: updatedService })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Service ID required' }, { status: 400 })
        }

        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)

        data.services = data.services?.filter((s: any) => s.id !== id) || []

        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
    }
}
