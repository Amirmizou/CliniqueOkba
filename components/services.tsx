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
  Home,
  Pill,
  Thermometer,
  Hospital,
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
  Scissors,
  Home,
  Pill,
  Thermometer,
  Hospital,
}

interface Service {
  _id?: string
  id?: string
  name?: string
  title?: string
  description: string
  icon: string
}

interface SectionContent {
  badge?: string
  title?: string
  subtitle?: string
}

interface ServicesProps {
  data?: Service[]
  sectionContent?: SectionContent
}

export default function Services({ data, sectionContent }: ServicesProps) {
  const [services, setServices] = useState<Service[]>(data || [])
  const [isLoading, setIsLoading] = useState(!data)

  // Fallback to API if no Sanity data provided
  useEffect(() => {
    if (data && data.length > 0) {
      setServices(data)
      setIsLoading(false)
      return
    }

    const loadData = async () => {
      try {
        const res = await fetch('/api/admin/services', { cache: 'no-store' })
        if (res.ok) {
          const apiData = await res.json()
          setServices(apiData)
        }
      } catch (error) {
        console.error('Failed to load services:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [data])

  // Default content if not from Sanity
  const title = sectionContent?.title || 'Nos Services Médicaux'
  const subtitle = sectionContent?.subtitle || 'Une expertise complète pour votre santé'
  const badge = sectionContent?.badge || 'Services'

  if (isLoading) {
    return (
      <section id='services' className='bg-background py-12 sm:py-16 md:py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='animate-pulse space-y-8'>
            <div className='h-8 bg-muted rounded w-1/3 mx-auto'></div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className='h-48 bg-muted rounded-2xl'></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id='services' className='bg-background py-12 sm:py-16 md:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <ScrollAnimation variant="fadeUp" className='mb-16 text-center'>
          {badge && (
            <p className='text-primary text-sm font-semibold tracking-wide uppercase mb-2'>
              {badge}
            </p>
          )}
          <h2 className='text-foreground text-2xl sm:text-3xl md:text-4xl font-bold'>
            {title}
          </h2>
          <p className='text-muted-foreground mt-4 text-base sm:text-lg'>
            {subtitle}
          </p>
        </ScrollAnimation>

        <StaggerContainer className='grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Activity
            const serviceName = service.name || service.title || 'Service'
            const serviceId = service._id || service.id || serviceName

            return (
              <ScrollAnimation key={serviceId} variant="fadeUp" as="div">
                <SpotlightCard className='glass-card group h-full border-0 hover-lift flex flex-col p-6' spotlightColor="rgba(44, 133, 222, 0.2)">
                  <div className='bg-primary/10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:bg-primary group-hover:scale-110 group-hover:shadow-lg'>
                    <Icon className='text-primary h-7 w-7 transition-colors group-hover:text-white' />
                  </div>
                  <h3 className='text-xl font-bold mb-3'>{serviceName}</h3>
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
