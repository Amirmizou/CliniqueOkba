'use client'

import { Stethoscope, Home, PhoneCall, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface SectionContent {
  badge?: string
  title?: string
  subtitle?: string
}

interface HomeCareData {
  title?: string
  subtitle?: string
  description?: string
  services?: Array<{ name: string; description?: string }>
  benefits?: string[]
  availability?: string
  callToAction?: { text?: string; phone?: string }
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

  return (
    <section id='home-care' className='bg-background py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 space-y-4 text-center'>
          <p className='text-primary text-sm font-semibold tracking-wide uppercase'>
            Service dédié
          </p>
          <h2 className='text-foreground text-4xl font-bold'>
            Soins à domicile
          </h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
            Une équipe mobile pour des soins médicaux de qualité, chez vous, en toute sécurité.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2'>
          <motion.div
            className='bg-card relative overflow-hidden rounded-2xl border p-8 shadow-sm'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <div className='mb-6 flex items-center gap-3'>
              <Home className='text-primary h-6 w-6' />
              <h3 className='text-foreground text-xl font-semibold'>Prestations</h3>
            </div>
            <ul className='space-y-3'>
              {[
                'Consultations générales et de suivi',
                'Pansements, injections, perfusions',
                'Prélèvements et examens à domicile',
                'Surveillance de patients chroniques',
              ].map((item) => (
                <li key={item} className='flex items-start gap-3'>
                  <CheckCircle2 className='text-primary mt-0.5 h-5 w-5 flex-shrink-0' />
                  <span className='text-foreground'>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className='bg-card relative overflow-hidden rounded-2xl border p-8 shadow-sm'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className='mb-6 flex items-center gap-3'>
              <Stethoscope className='text-primary h-6 w-6' />
              <h3 className='text-foreground text-xl font-semibold'>Disponibilité</h3>
            </div>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Clock className='text-primary h-5 w-5' />
                <p className='text-muted-foreground'>Interventions sur rendez-vous et urgences selon disponibilité</p>
              </div>
              <div className='flex items-center gap-3'>
                <PhoneCall className='text-primary h-5 w-5' />
                <p className='text-muted-foreground'>Contactez-nous pour planifier une visite à domicile</p>
              </div>
              <div className='pt-2'>
                <Button onClick={scrollToContact} className='bg-primary hover:bg-primary/90 text-primary-foreground'>
                  Demander une intervention à domicile
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}



