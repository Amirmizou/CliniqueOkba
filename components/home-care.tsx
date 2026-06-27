'use client'

import { Stethoscope, Home, PhoneCall, Clock, CheckCircle2, Syringe, HeartPulse, Thermometer, ArrowRight, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

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

const SERVICE_ICONS = [Syringe, HeartPulse, Thermometer, Shield, Stethoscope, CheckCircle2]

export default function HomeCare({ data, sectionContent }: HomeCareProps) {
  const scrollToContact = () => {
    const url = new URL(window.location.href)
    url.hash = 'contact'
    url.searchParams.set('service', 'home-care')
    window.location.href = url.toString()
  }

  const locale = useLocale()
  const t = useTranslations('homeCare')
  const isAr = locale === 'ar'

  const hasArabicLetters = (text?: string) => /[\u0600-\u06FF]/.test(text || '');

  const badge = sectionContent?.badge && (!isAr || hasArabicLetters(sectionContent.badge)) ? sectionContent.badge : data?.badge && (!isAr || hasArabicLetters(data.badge)) ? data.badge : t('badge')
  const title = sectionContent?.title && (!isAr || hasArabicLetters(sectionContent.title)) ? sectionContent.title : data?.title && (!isAr || hasArabicLetters(data.title)) ? data.title : t('title')
  const subtitle = sectionContent?.subtitle && (!isAr || hasArabicLetters(sectionContent.subtitle)) ? sectionContent.subtitle : data?.subtitle && (!isAr || hasArabicLetters(data.subtitle)) ? data.subtitle : data?.description || t('subtitle')
  const prestations = data?.services?.length && (!isAr || data.services.some(s => hasArabicLetters(s.name))) ? data.services.map(s => s.name) : []
  const availabilityText = data?.availability && (!isAr || hasArabicLetters(data.availability)) ? data.availability : t('availabilityText')
  const availabilityTitle = data?.availabilityTitle && (!isAr || hasArabicLetters(data.availabilityTitle)) ? data.availabilityTitle : t('availabilityTitle')
  const contactPrompt = data?.contactPrompt && (!isAr || hasArabicLetters(data.contactPrompt)) ? data.contactPrompt : t('contactPrompt')
  const ctaText = data?.callToAction?.text && (!isAr || hasArabicLetters(data.callToAction.text)) ? data.callToAction.text : t('ctaText')

  const defaultPrestations = isAr
    ? ['حقن وإعطاء الأدوية', 'تغيير الضمادات', 'مراقبة العلامات الحيوية']
    : ['Injections et administration de médicaments', 'Changement de pansements', 'Surveillance des constantes vitales']

  const displayPrestations = prestations.length > 0 ? prestations : defaultPrestations

  return (
    <section id='home-care' className='relative overflow-hidden bg-gradient-to-br from-[#006633] via-[#004d26] to-[#002211] py-24 sm:py-32'>
      
      {/* ── Décor de fond Premium ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-[800px] w-[800px] -translate-y-1/3 translate-x-1/3 rounded-full bg-[#4caf6e]/20 blur-[150px]" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-y-1/3 -translate-x-1/3 rounded-full bg-[#FDE68A]/10 blur-[120px]" />
        {/* Bruit de fond subtil pour la texture */}
        <div 
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
      </div>

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className="grid gap-16 lg:grid-cols-12 lg:items-start lg:gap-8">
          
          {/* ── Colonne Gauche : Texte et Services ── */}
          <div className="flex flex-col pt-4 lg:col-span-6 xl:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#FDE68A]/30 bg-[#FDE68A]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#FDE68A]">
                <Home className="h-3.5 w-3.5" />
                {badge}
              </span>
              
              <h2 className="mt-8 text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-5xl xl:text-6xl">
                {title}
              </h2>
              
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                {subtitle}
              </p>
            </motion.div>

            {/* Grille de Prestations (Bento) */}
            <motion.div 
              className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {displayPrestations.map((item, i) => {
                const IconComp = SERVICE_ICONS[i % SERVICE_ICONS.length]
                return (
                  <div 
                    key={item} 
                    className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:border-[#FDE68A]/30 hover:bg-white/[0.04]"
                  >
                    <IconComp className="mb-4 h-6 w-6 text-[#FDE68A]" />
                    <h4 className="text-sm font-semibold leading-snug text-white/90">{item}</h4>
                  </div>
                )
              })}
            </motion.div>
          </div>

          {/* ── Colonne Droite : Image & CTA ── */}
          <div className="relative mt-8 lg:col-span-6 lg:mt-0 xl:col-span-7 xl:pl-12">
            
            {/* Image Container */}
            <motion.div 
              className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl lg:aspect-auto lg:h-[720px]"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/spec/home-care-generated.png"
                alt={title || 'Soins à domicile'}
                fill
                className="object-cover transition-transform duration-1000 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002211]/90 via-[#002211]/20 to-transparent lg:bg-none" />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#FDE68A]/20" />
            </motion.div>

            {/* Badge 24/7 flottant */}
            <motion.div 
              className={cn(
                "absolute flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md",
                isAr ? "top-8 -right-4 sm:-right-8" : "top-8 -left-4 sm:-left-8"
              )}
              initial={{ opacity: 0, x: isAr ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDE68A]/20 text-[#FDE68A]">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold leading-none text-white">7j/7</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/70">{availabilityText}</p>
              </div>
            </motion.div>

            {/* Carte de Contact (Glassmorphism, Overlapping) */}
            <motion.div 
              className={cn(
                "relative mx-4 -mt-24 rounded-3xl border border-[#FDE68A]/20 bg-[#002211]/80 p-6 shadow-[0_8px_30px_rgba(0,102,51,0.3)] backdrop-blur-2xl sm:mx-12 sm:p-8 lg:absolute lg:bottom-12 lg:m-0 lg:w-[420px]",
                isAr ? "lg:-right-16" : "lg:-left-16"
              )}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FDE68A]/10">
                  <PhoneCall className="h-5 w-5 text-[#FDE68A]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{availabilityTitle}</h3>
                  <p className="text-sm text-white/60">{contactPrompt}</p>
                </div>
              </div>
              
              <div className="mb-6 space-y-3" dir="ltr">
                <a href="tel:0563015916" className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-white transition hover:border-[#FDE68A]/30 hover:bg-white/10">
                  <span className="font-bold tracking-wider">0563 01 59 16</span>
                  <ArrowRight className="h-4 w-4 text-[#FDE68A] transition-transform group-hover:translate-x-1" />
                </a>
                <a href="tel:0563015917" className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-white transition hover:border-[#FDE68A]/30 hover:bg-white/10">
                  <span className="font-bold tracking-wider">0563 01 59 17</span>
                  <ArrowRight className="h-4 w-4 text-[#FDE68A] transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              <button 
                onClick={scrollToContact} 
                className="w-full rounded-xl bg-[#FDE68A] py-4 text-sm font-bold text-[#002211] shadow-lg shadow-[#FDE68A]/20 transition hover:bg-[#fcd34d] active:scale-[0.98]"
              >
                {ctaText}
              </button>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  )
}
