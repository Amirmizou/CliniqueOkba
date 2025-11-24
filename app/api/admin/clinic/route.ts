import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { ClinicData } from '@/lib/admin-data'

const dataPath = path.join(process.cwd(), 'data', 'clinic.json')

export async function GET() {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data: ClinicData = JSON.parse(fileContent)
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load data' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const newData: ClinicData = await request.json()
        await fs.writeFile(dataPath, JSON.stringify(newData, null, 2), 'utf-8')

        // Revalidate all pages that use clinic data
        revalidatePath('/', 'layout')

        return NextResponse.json({ success: true, data: newData })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
    }
}
