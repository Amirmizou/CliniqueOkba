'use client'

import { useTranslations } from 'next-intl'
import ScrollAnimation from '@/components/ui/scroll-animation'
import StaggerContainer from '@/components/ui/stagger-container'
import { Star, Quote, BadgeCheck } from 'lucide-react'
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

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5" aria-label={`${rating} étoiles sur 5`}>
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
                />
            ))}
        </div>
    )
}

function Avatar({ testimonial }: { testimonial: Testimonial }) {
    const getImageUrl = (): string | null => {
        if (testimonial.image) return testimonial.image
        if (testimonial.avatar) {
            if (typeof testimonial.avatar === 'string') return testimonial.avatar
            if (typeof testimonial.avatar === 'object' && testimonial.avatar.asset) {
                return urlFor(testimonial.avatar).width(96).height(96).url()
            }
        }
        return null
    }

    const imageUrl = getImageUrl()
    const initials = testimonial.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    return (
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20">
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={testimonial.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-sm font-bold text-primary">
                    {initials}
                </div>
            )}
        </div>
    )
}

export default function Testimonials({ data = [], sectionContent }: TestimonialsProps) {
    const t = useTranslations('testimonialsSection')
    const testimonials = data.filter((tm: Testimonial) => tm.visible !== false)

    const title = sectionContent?.title || t('title')
    const subtitle = sectionContent?.subtitle || t('subtitle')
    const badge = sectionContent?.badge || t('badge')

    if (!testimonials || testimonials.length === 0) return null

    return (
        <section id="testimonials" className="bg-muted/30 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <ScrollAnimation variant="fadeUp" className="mb-16 text-center">
                    {badge && (
                        <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                            {badge}
                        </span>
                    )}
                    <h2 className="text-foreground text-3xl font-bold sm:text-4xl">
                        {title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                        {subtitle}
                    </p>
                </ScrollAnimation>

                <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial) => {
                        const id = testimonial._id || testimonial.id || testimonial.name
                        const content = testimonial.content || testimonial.comment || ''
                        const role = testimonial.role || testimonial.service || t('patient')

                        return (
                            <ScrollAnimation key={id} variant="fadeUp" as="div">
                                <div className="relative flex h-full flex-col rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
                                    {/* Decorative quote — background only */}
                                    <Quote
                                        className="absolute right-5 top-5 h-12 w-12 text-primary/6"
                                        aria-hidden="true"
                                    />

                                    {/* Top row: stars + verified */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <StarRating rating={testimonial.rating} />
                                        {testimonial.verified && (
                                            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                                                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                                                {t('verified')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Testimonial text */}
                                    <p className="flex-1 text-sm leading-relaxed text-foreground/80 italic">
                                        &ldquo;{content}&rdquo;
                                    </p>

                                    {/* Divider */}
                                    <div className="my-5 h-px bg-border/50" />

                                    {/* Author */}
                                    <div className="flex items-center gap-3">
                                        <Avatar testimonial={testimonial} />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-foreground">
                                                {testimonial.name}
                                            </p>
                                            <p className="truncate text-xs text-primary font-medium">
                                                {role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollAnimation>
                        )
                    })}
                </StaggerContainer>
            </div>
        </section>
    )
}
