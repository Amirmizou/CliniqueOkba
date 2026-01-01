'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import type { ComponentType } from 'react'

// Common props interfaces
interface SectionContent {
    badge?: string
    title?: string
    subtitle?: string
}

interface LazyComponentProps {
    sectionContent?: SectionContent
    data?: any
}

// Loading skeletons
const MedicalTechSkeleton = () => (
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
)

const HomeCareSkeleton = () => (
    <div className="py-20 px-4">
        <Skeleton className="h-96 w-full max-w-7xl mx-auto" />
    </div>
)

const GallerySkeleton = () => (
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
)

const TestimonialsSkeleton = () => (
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
)

// Dynamic imports with proper typing
const MedicalTechnologyComponent = dynamic<LazyComponentProps>(
    () => import('@/components/medical-technology').then(mod => mod.default as ComponentType<LazyComponentProps>),
    { loading: MedicalTechSkeleton, ssr: false }
)

const HomeCareComponent = dynamic<LazyComponentProps>(
    () => import('@/components/home-care').then(mod => mod.default as ComponentType<LazyComponentProps>),
    { loading: HomeCareSkeleton, ssr: false }
)

const GalleryComponent = dynamic<LazyComponentProps>(
    () => import('@/components/gallery').then(mod => mod.default as ComponentType<LazyComponentProps>),
    { loading: GallerySkeleton, ssr: false }
)

const TestimonialsComponent = dynamic<LazyComponentProps>(
    () => import('@/components/testimonials').then(mod => mod.default as ComponentType<LazyComponentProps>),
    { loading: TestimonialsSkeleton, ssr: false }
)

// Export wrapper components that forward props
export function LazyMedicalTechnology({ sectionContent }: LazyComponentProps) {
    return <MedicalTechnologyComponent sectionContent={sectionContent} />
}

export function LazyHomeCare({ data, sectionContent }: LazyComponentProps) {
    return <HomeCareComponent data={data} sectionContent={sectionContent} />
}

export function LazyGallery({ sectionContent }: LazyComponentProps) {
    return <GalleryComponent sectionContent={sectionContent} />
}

export function LazyTestimonials({ data, sectionContent }: LazyComponentProps) {
    return <TestimonialsComponent data={data} sectionContent={sectionContent} />
}
