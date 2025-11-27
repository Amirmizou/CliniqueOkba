import { NextResponse } from 'next/server'
import { galleryImages } from '@/data/gallery'

// API en lecture seule - Les images sont configurées dans data/gallery.ts
// Pour modifier, éditez ce fichier et pushez sur Git

export async function GET() {
    try {
        // Retourne simplement le tableau statique
        return NextResponse.json(galleryImages)
    } catch (error) {
        console.error('Failed to fetch gallery:', error)
        return NextResponse.json([])
    }
}

// Les méthodes POST, PUT, DELETE ne sont plus supportées
// Éditer directement data/gallery.ts pour modifier la galerie
export async function POST() {
    return NextResponse.json({
        error: 'La galerie est maintenant gérée via data/gallery.ts. Modifiez ce fichier et redéployez.'
    }, { status: 405 })
}

export async function PUT() {
    return NextResponse.json({
        error: 'La galerie est maintenant gérée via data/gallery.ts. Modifiez ce fichier et redéployez.'
    }, { status: 405 })
}

export async function DELETE() {
    return NextResponse.json({
        error: 'La galerie est maintenant gérée via data/gallery.ts. Modifiez ce fichier et redéployez.'
    }, { status: 405 })
}
