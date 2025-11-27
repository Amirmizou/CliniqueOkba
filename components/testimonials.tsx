'use client'

import { useState, useEffect } from 'react'
import ScrollAnimation from '@/components/ui/scroll-animation'
import StaggerContainer from '@/components/ui/stagger-container'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

interface Testimonial {
    id: string
    name: string
    role: string
    content: string
    rating: number
    image: string
    visible: boolean
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch('/api/admin/testimonials', { cache: 'no-store' })
                if (res.ok) {
                    const data = await res.json()
                    setTestimonials(data.filter((t: Testimonial) => t.visible))
                }
            } catch (error) {
                console.error('Failed to load testimonials:', error)
            }
        }
        loadData()
    }, [])

    return (
        <section id='testimonials' className='bg-muted/30 py-20'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <ScrollAnimation variant="fadeUp" className='mb-16 text-center'>
                    <h2 className='text-foreground text-3xl font-bold sm:text-4xl'>
                        Ce que disent nos patients
                    </h2>
                    <p className='text-muted-foreground mt-4 text-lg'>
                        Votre satisfaction est notre priorité
                    </p>
                </ScrollAnimation>

                <StaggerContainer className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                    {testimonials.map((testimonial, index) => (
                        <ScrollAnimation key={testimonial.id} variant="scaleUp" as="div">
                            <Card className='glass-card h-full border-0 hover-lift relative overflow-hidden'>
                                {/* Decorative quote mark background */}
                                <div className="absolute top-4 right-4 text-primary/5">
                                    <Quote size={80} />
                                </div>

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
                                        "{testimonial.content}"
                                    </p>

                                    <div className='flex items-center justify-center gap-4 border-t border-border/50 pt-6'>
                                        <div className='relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/20'>
                                            {testimonial.image ? (
                                                <Image
                                                    src={testimonial.image}
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
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    )
}
