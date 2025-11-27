import { NextResponse } from 'next/server'
import { heroSlides } from '@/data/hero-slides'

// API en lecture seule - Les slides sont configurés dans data/hero-slides.ts
// Pour modifier, éditez ce fichier et pushez sur Git

export async function GET() {
    try {
        const activeSlides = heroSlides
            .filter(s => s.active)
            .sort((a, b) => a.order - b.order)
        return NextResponse.json(activeSlides)
    } catch (error) {
        console.error('Failed to fetch slides:', error)
        return NextResponse.json([])
    }
}

// Les méthodes POST, PUT, DELETE ne sont plus supportées
// Éditer directement data/hero-slides.ts pour modifier les slides
export async function POST() {
    return NextResponse.json({
        error: 'Les slides sont maintenant configurés dans data/hero-slides.ts. Modifiez ce fichier et redéployez.'
    }, { status: 405 })
}

export async function PUT() {
    return NextResponse.json({
        error: 'Les slides sont maintenant configurés dans data/hero-slides.ts. Modifiez ce fichier et redéployez.'
    }, { status: 405 })
}

export async function DELETE() {
    return NextResponse.json({
        error: 'Les slides sont maintenant configurés dans data/hero-slides.ts. Modifiez ce fichier et redéployez.'
    }, { status: 405 })
}
