'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Loading component réutilisable
const LoadingFallback = ({ height = 'h-96' }: { height?: string }) => (
    <div className={`${height} flex items-center justify-center bg-muted/30 rounded-lg animate-pulse`}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
)

// Lazy load des composants lourds (below the fold)
export const LazyGallery = dynamic(() => import('@/components/gallery'), {
    loading: () => <LoadingFallback />,
})

export const LazyTestimonials = dynamic(() => import('@/components/testimonials'), {
    loading: () => <LoadingFallback height="h-64" />,
})

export const LazyMedicalTechnology = dynamic(() => import('@/components/medical-technology'), {
    loading: () => <LoadingFallback />,
})

export const LazyMap = dynamic(() => import('@/components/map'), {
    loading: () => <LoadingFallback height="h-64" />,
})

export const LazyHomeCare = dynamic(() => import('@/components/home-care'), {
    loading: () => <LoadingFallback height="h-64" />,
})
