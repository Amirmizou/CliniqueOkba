'use client'

import { Stethoscope, Home, PhoneCall, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLocale } from 'next-intl'

interface SectionContent {
  badge?: string
  title?: string
  subtitle?: string
}

export interface HomeCareData {
  badge?: string
  badge_ar?: string
  title?: string
  title_ar?: string
  subtitle?: string
  subtitle_ar?: string
  description?: string
  description_ar?: string
  services?: { name: string; name_ar?: string; description?: string; description_ar?: string; icon?: string; price?: string }[]
  callToAction?: { text?: string; phone?: string }
  callToAction_ar?: { text?: string; phone?: string }
  availability?: string
  availability_ar?: string
  availabilityTitle?: string
  availabilityTitle_ar?: string
  contactPrompt?: string
  contactPrompt_ar?: string
}

interface HomeCareProps {
  data?: HomeCareData
  sectionContent?: SectionContent
}

export default function HomeCare({ data, sectionContent }: HomeCareProps) {
  const scrollToContact = () => {
    const url = new URL(window.location.href)
    url.hash = 'contact'
    url.searchParams.set('service', 'home-care')
    window.location.href = url.toString()
  }

  const locale = useLocale()
  const isAr = locale === 'ar'

  const badge = data?.badge || sectionContent?.badge
  const title = data?.title || sectionContent?.title
  const subtitle = data?.subtitle || sectionContent?.subtitle || data?.description
  const prestations = data?.services?.map(s => s.name) || []
  const availabilityText = data?.availability
  const availabilityTitle = data?.availabilityTitle
  const contactPrompt = data?.contactPrompt
  const ctaText = data?.callToAction?.text

  return (
    <section id='home-care' className='bg-background py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid gap-12 lg:grid-cols-2 lg:items-center'>
          
          <div className='space-y-8'>
            <div className='space-y-4'>
              <p className='text-primary text-sm font-semibold tracking-wide uppercase'>
                {badge}
              </p>
              <h2 className='text-foreground text-4xl font-bold'>
                {title}
              </h2>
              <p className='text-muted-foreground text-lg'>
                {subtitle}
              </p>
            </div>

            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'>
              <motion.div
                className='bg-card relative overflow-hidden rounded-2xl border p-6 shadow-sm'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <div className='mb-4 flex items-center gap-3'>
                  <Home className='text-primary h-6 w-6' />
                  <h3 className='text-foreground text-xl font-semibold'>Prestations</h3>
                </div>
                <ul className='space-y-3'>
                  {prestations.map((item) => (
                    <li key={item} className='flex items-start gap-3'>
                      <CheckCircle2 className='text-primary mt-0.5 h-5 w-5 flex-shrink-0' />
                      <span className='text-foreground text-sm'>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className='bg-card relative overflow-hidden rounded-2xl border p-6 shadow-sm'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className='mb-4 flex items-center gap-3'>
                  <Stethoscope className='text-primary h-6 w-6' />
                  <h3 className='text-foreground text-xl font-semibold'>{availabilityTitle}</h3>
                </div>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <Clock className='text-primary h-5 w-5' />
                    <p className='text-muted-foreground text-sm'>{availabilityText}</p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <PhoneCall className='text-primary h-5 w-5' />
                    <p className='text-muted-foreground text-sm'>{contactPrompt}</p>
                  </div>
                  <div className='pt-2'>
                    <Button onClick={scrollToContact} className='bg-primary hover:bg-primary/90 text-primary-foreground w-full'>
                      {ctaText}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            className='relative h-[400px] w-full overflow-hidden rounded-3xl lg:h-[600px] xl:h-[650px]'
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/images/spec/sad.jpeg"
              alt={title || 'Soins à domicile'}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10" />
          </motion.div>

        </div>
      </div>
    </section>
  )
}



