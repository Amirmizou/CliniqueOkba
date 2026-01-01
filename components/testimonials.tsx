'use client'

import { useState, useEffect } from 'react'
import ScrollAnimation from '@/components/ui/scroll-animation'
import StaggerContainer from '@/components/ui/stagger-container'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface SanityImage {
    _type: 'image'
    asset: {
        _ref: string
        _type: 'reference'
    }
}

interface Testimonial {
    _id?: string
    id?: string
    name: string
    role?: string
    service?: string
    content?: string
    comment?: string
    rating: number
    image?: string
    avatar?: SanityImage | string
    visible?: boolean
    verified?: boolean
}

interface SectionContent {
    badge?: string
    title?: string
    subtitle?: string
}

interface TestimonialsProps {
    data?: Testimonial[]
    sectionContent?: SectionContent
}

export default function Testimonials({ data, sectionContent }: TestimonialsProps) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(data || [])
    const [isLoading, setIsLoading] = useState(!data)

    // Fallback to API if no Sanity data provided
    useEffect(() => {
        if (data && data.length > 0) {
            setTestimonials(data)
            setIsLoading(false)
            return
        }

        const loadData = async () => {
            try {
                const res = await fetch('/api/admin/testimonials', { cache: 'no-store' })
                if (res.ok) {
                    const apiData = await res.json()
                    setTestimonials(apiData.filter((t: Testimonial) => t.visible !== false))
                }
            } catch (error) {
                console.error('Failed to load testimonials:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [data])

    // Default content if not from Sanity
    const title = sectionContent?.title || 'Ce que disent nos patients'
    const subtitle = sectionContent?.subtitle || 'Votre satisfaction est notre priorité'
    const badge = sectionContent?.badge || 'Témoignages'

    // Helper to get image URL
    const getImageUrl = (testimonial: Testimonial): string | null => {
        if (testimonial.image) return testimonial.image
        if (testimonial.avatar) {
            if (typeof testimonial.avatar === 'string') return testimonial.avatar
            if (typeof testimonial.avatar === 'object' && testimonial.avatar.asset) {
                return urlFor(testimonial.avatar).width(100).height(100).url()
            }
        }
        return null
    }

    if (isLoading) {
        return (
            <section id='testimonials' className='bg-muted/30 py-20'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <div className='animate-pulse space-y-8'>
                        <div className='h-8 bg-muted rounded w-1/3 mx-auto'></div>
                        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className='h-64 bg-muted rounded-2xl'></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (!testimonials || testimonials.length === 0) {
        return null // Don't render section if no testimonials
    }

    return (
        <section id='testimonials' className='bg-muted/30 py-20'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <ScrollAnimation variant="fadeUp" className='mb-16 text-center'>
                    {badge && (
                        <p className='text-primary text-sm font-semibold tracking-wide uppercase mb-2'>
                            {badge}
                        </p>
                    )}
                    <h2 className='text-foreground text-3xl font-bold sm:text-4xl'>
                        {title}
                    </h2>
                    <p className='text-muted-foreground mt-4 text-lg'>
                        {subtitle}
                    </p>
                </ScrollAnimation>

                <StaggerContainer className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                    {testimonials.map((testimonial) => {
                        const testimonialId = testimonial._id || testimonial.id || testimonial.name
                        const testimonialContent = testimonial.content || testimonial.comment || ''
                        const testimonialRole = testimonial.role || testimonial.service || 'Patient'
                        const imageUrl = getImageUrl(testimonial)

                        return (
                            <ScrollAnimation key={testimonialId} variant="scaleUp" as="div">
                                <Card className='glass-card h-full border-0 hover-lift relative overflow-hidden'>
                                    {/* Decorative quote mark background */}
                                    <div className="absolute top-4 right-4 text-primary/5">
                                        <Quote size={80} />
                                    </div>

                                    {/* Verified badge */}
                                    {testimonial.verified && (
                                        <div className="absolute top-4 left-4 bg-green-500/10 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                                            ✓ Vérifié
                                        </div>
                                    )}

                                    <CardContent className='pt-8 pb-8 px-6 relative z-10'>
                                        <div className='mb-6 flex justify-center'>
                                            <div className='bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full shadow-inner'>
                                                <Quote className='text-primary h-6 w-6' />
                                            </div>
                                        </div>

                                        <div className='flex justify-center gap-1 mb-6'>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < testimonial.rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'fill-gray-200 text-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        <p className='text-muted-foreground mb-8 text-center italic text-lg leading-relaxed'>
                                            "{testimonialContent}"
                                        </p>

                                        <div className='flex items-center justify-center gap-4 border-t border-border/50 pt-6'>
                                            <div className='relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/20'>
                                                {imageUrl ? (
                                                    <Image
                                                        src={imageUrl}
                                                        alt={testimonial.name}
                                                        fill
                                                        sizes="48px"
                                                        className='object-cover'
                                                    />
                                                ) : (
                                                    <div className='flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-lg'>
                                                        {testimonial.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className='text-left'>
                                                <h4 className='text-foreground font-bold'>
                                                    {testimonial.name}
                                                </h4>
                                                <p className='text-primary text-sm font-medium'>
                                                    {testimonialRole}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </ScrollAnimation>
                        )
                    })}
                </StaggerContainer>
            </div>
        </section>
    )
}
