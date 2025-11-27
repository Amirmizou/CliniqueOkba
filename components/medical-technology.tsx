'use client'

import { useState, useEffect } from 'react'
import ScrollAnimation from '@/components/ui/scroll-animation'
import StaggerContainer from '@/components/ui/stagger-container'
import Image from 'next/image'
import {
    Scan,
    Brain,
    Activity,
    Heart,
    Radio,
    Smile,
    FlaskConical,
    Scissors,
    CheckCircle2,
    Sparkles
} from 'lucide-react'

interface Equipment {
    id: string
    name: string
    brand: string
    model: string
    category: string
    description: string
    icon: string
    image?: string
    features: string[]
}

const iconMap = {
    Scan,
    Brain,
    Activity,
    Heart,
    Radio,
    Smile,
    FlaskConical,
    Scissors
}

export default function MedicalTechnology() {
    const [equipment, setEquipment] = useState<Equipment[]>([])

    useEffect(() => {
        const loadEquipment = async () => {
            try {
                const res = await fetch('/api/admin/clinic', { cache: 'no-store' })
                if (res.ok) {
                    const data = await res.json()
                    setEquipment(data.equipment || [])
                }
            } catch (error) {
                console.error('Failed to load equipment:', error)
            }
        }
        loadEquipment()
    }, [])

    if (equipment.length === 0) return null

    return (
        <section className='relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20'>
            {/* Background decoration */}
            <div className='absolute inset-0 opacity-30'>
                <div className='absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl' />
                <div className='absolute bottom-20 right-10 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl' />
            </div>

            <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                {/* Header */}
                <ScrollAnimation variant="fadeUp" className='mb-16 text-center'>
                    <div className='mb-4 flex items-center justify-center gap-2'>
                        <Sparkles className='h-6 w-6 text-primary' />
                        <span className='text-sm font-semibold uppercase tracking-wider text-primary'>
                            Innovation Médicale
                        </span>
                    </div>
                    <h2 className='mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl'>
                        Technologies de Pointe
                    </h2>
                    <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
                        Équipements médicaux de dernière génération pour des diagnostics précis et des soins de qualité supérieure
                    </p>
                </ScrollAnimation>

                {/* Equipment Grid */}
                <StaggerContainer className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {equipment.map((item, index) => {
                        const Icon = iconMap[item.icon as keyof typeof iconMap] || Activity

                        return (
                            <ScrollAnimation key={item.id} variant="fadeUp" as="div" className='h-full'>
                                <div
                                    className='group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10'
                                >
                                    {/* Gradient overlay on hover */}
                                    <div className='absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 transition-all duration-500 group-hover:from-primary/5 group-hover:to-blue-500/5' />

                                    <div className='relative p-6'>
                                        {/* Equipment Image (if available) */}
                                        {item.image && (
                                            <div className='relative mb-4 h-48 w-full overflow-hidden rounded-xl'>
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className='object-cover transition-transform duration-500 group-hover:scale-110'
                                                />
                                            </div>
                                        )}

                                        {/* Icon & Brand */}
                                        <div className='mb-4 flex items-start justify-between'>
                                            <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20'>
                                                <Icon className='h-7 w-7 text-primary' />
                                            </div>
                                            <div className='rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 px-3 py-1 text-xs font-semibold text-primary'>
                                                {item.brand}
                                            </div>
                                        </div>

                                        {/* Title & Model */}
                                        <h3 className='mb-2 text-xl font-bold'>{item.name}</h3>
                                        <p className='mb-3 text-sm font-medium text-muted-foreground'>
                                            {item.model}
                                        </p>

                                        {/* Description */}
                                        <p className='mb-4 text-sm text-muted-foreground'>
                                            {item.description}
                                        </p>

                                        {/* Features */}
                                        <div className='space-y-2'>
                                            {item.features.map((feature, idx) => (
                                                <div key={idx} className='flex items-center gap-2'>
                                                    <CheckCircle2 className='h-4 w-4 flex-shrink-0 text-primary' />
                                                    <span className='text-sm text-foreground/80'>{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Bottom accent line */}
                                        <div className='mt-6 h-1 w-0 rounded-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-500 group-hover:w-full' />
                                    </div>
                                </div>
                            </ScrollAnimation>
                        )
                    })}
                </StaggerContainer>

                {/* Bottom CTA */}
                <ScrollAnimation variant="fadeUp" delay={0.4} className='mt-12 text-center'>
                    <p className='text-sm text-muted-foreground'>
                        Tous nos équipements sont régulièrement entretenus et calibrés pour garantir des résultats optimaux
                    </p>
                </ScrollAnimation>
            </div>
        </section>
    )
}
