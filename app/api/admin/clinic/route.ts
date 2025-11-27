import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { siteConfig } from '@/data/site-config'

const dataPath = path.join(process.cwd(), 'data', 'clinic.json')

export async function GET() {
    try {
        // On essaie de lire les anciennes données pour les parties non migrées (services, articles...)
        let legacyData = {}
        try {
            const fileContent = await fs.readFile(dataPath, 'utf-8')
            legacyData = JSON.parse(fileContent)
        } catch (e) {
            console.warn('Could not read legacy clinic.json', e)
        }

        // On fusionne avec la config statique qui est prioritaire pour Contact/Social/Hero
        const data = {
            ...legacyData,
            contact: siteConfig.contact,
            social: siteConfig.social,
            // Hero est géré ailleurs maintenant
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load data' }, { status: 500 })
    }
}

export async function POST() {
    return NextResponse.json({
        error: 'La configuration est maintenant statique. Modifiez les fichiers dans data/.'
    }, { status: 405 })
}
