'use client'

import { useState, useEffect } from 'react'
import ScrollAnimation from '@/components/ui/scroll-animation'
import StaggerContainer from '@/components/ui/stagger-container'
import {
  Stethoscope,
  Heart,
  Activity,
  Baby,
  Brain,
  Eye,
  Microscope,
  Syringe,
  Ambulance,
  Scan,
  Scissors,
} from 'lucide-react'
import { SpotlightCard } from '@/components/ui/spotlight-card'

const iconMap: any = {
  Stethoscope,
  Heart,
  Activity,
  Baby,
  Brain,
  Eye,
  Microscope,
  Syringe,
  Ambulance,
  Scan,
  Scalpel: Scissors,
}

interface Service {
  id: string
  title: string
  description: string
  icon: string
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/admin/services', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setServices(data)
        }
      } catch (error) {
        console.error('Failed to load services:', error)
      }
    }
    loadData()
  }, [])

  return (
    <section id='services' className='bg-background py-12 sm:py-16 md:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <ScrollAnimation variant="fadeUp" className='mb-16 text-center'>
          <h2 className='text-foreground text-2xl sm:text-3xl md:text-4xl font-bold'>
            Nos Services Médicaux
          </h2>
          <p className='text-muted-foreground mt-4 text-base sm:text-lg'>
            Une expertise complète pour votre santé
          </p>
        </ScrollAnimation>

        <StaggerContainer className='grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Activity
            return (
              <ScrollAnimation key={service.id} variant="fadeUp" as="div">
                <SpotlightCard className='glass-card group h-full border-0 hover-lift flex flex-col p-6' spotlightColor="rgba(44, 133, 222, 0.2)">
                  <div className='bg-primary/10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:bg-primary group-hover:scale-110 group-hover:shadow-lg'>
                    <Icon className='text-primary h-7 w-7 transition-colors group-hover:text-white' />
                  </div>
                  <h3 className='text-xl font-bold mb-3'>{service.title}</h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    {service.description}
                  </p>
                </SpotlightCard>
              </ScrollAnimation>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
