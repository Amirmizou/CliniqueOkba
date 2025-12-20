'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load heavy components with loading skeletons
export const LazyMedicalTechnology = dynamic(
    () => import('@/components/medical-technology'),
    {
        loading: () => (
            <div className="py-20 px-4">
                <div className="max-w-7xl mx-auto space-y-8">
                    <Skeleton className="h-12 w-64 mx-auto" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-64 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        ),
        ssr: false, // Disable SSR for below-the-fold content
    }
)

export const LazyHomeCare = dynamic(
    () => import('@/components/home-care'),
    {
        loading: () => (
            <div className="py-20 px-4">
                <Skeleton className="h-96 w-full max-w-7xl mx-auto" />
            </div>
        ),
        ssr: false,
    }
)

export const LazyGallery = dynamic(
    () => import('@/components/gallery'),
    {
        loading: () => (
            <div className="py-20 px-4">
                <div className="max-w-7xl mx-auto space-y-8">
                    <Skeleton className="h-12 w-48 mx-auto" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} className="aspect-square w-full" />
                        ))}
                    </div>
                </div>
            </div>
        ),
        ssr: false,
    }
)

export const LazyTestimonials = dynamic(
    () => import('@/components/testimonials'),
    {
        loading: () => (
            <div className="py-20 px-4">
                <div className="max-w-7xl mx-auto space-y-8">
                    <Skeleton className="h-12 w-64 mx-auto" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-48 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        ),
        ssr: false,
    }
)
