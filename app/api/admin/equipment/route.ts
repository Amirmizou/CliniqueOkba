import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { revalidateAllPages } from '@/lib/revalidate'

const dataPath = path.join(process.cwd(), 'data', 'clinic.json')

export async function GET() {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        return NextResponse.json(data.equipment || [])
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load equipment' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        const newEquipment = await request.json()

        // Generate ID if not provided
        if (!newEquipment.id) {
            const maxId = data.equipment?.reduce((max: number, e: any) =>
                Math.max(max, parseInt(e.id) || 0), 0) || 0
            newEquipment.id = String(maxId + 1)
        }

        data.equipment = data.equipment || []
        data.equipment.push(newEquipment)

        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        revalidateAllPages()
        return NextResponse.json({ success: true, equipment: newEquipment })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add equipment' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        const updatedEquipment = await request.json()

        const index = data.equipment?.findIndex((e: any) => e.id === updatedEquipment.id)
        if (index === -1) {
            return NextResponse.json({ error: 'Equipment not found' }, { status: 404 })
        }

        data.equipment[index] = updatedEquipment
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        return NextResponse.json({ success: true, equipment: updatedEquipment })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update equipment' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Equipment ID required' }, { status: 400 })
        }

        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)

        data.equipment = data.equipment?.filter((e: any) => e.id !== id) || []

        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete equipment' }, { status: 500 })
    }
}
