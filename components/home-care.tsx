'use client'

import { Stethoscope, Home, PhoneCall, Clock, CheckCircle2, Syringe, HeartPulse, Thermometer, ArrowRight, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { ECGLine } from '@/components/ui/ecg-line'

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

/** Icônes pour les prestations par défaut */
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

  // Prestations par défaut si rien de Sanity
  const defaultPrestations = isAr
    ? ['حقن وإعطاء الأدوية', 'تغيير الضمادات', 'مراقبة العلامات الحيوية']
    : ['Injections et administration de médicaments', 'Changement de pansements', 'Surveillance des constantes vitales']

  const displayPrestations = prestations.length > 0 ? prestations : defaultPrestations

  return (
    <section id='home-care' className='relative overflow-hidden bg-gradient-to-br from-[#006633] via-[#004d26] to-[#002211] py-20 sm:py-24 md:py-28'>
      {/* ── Décor de fond ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Glow top-left */}
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#4caf6e]/20 blur-[120px]" />
        {/* Glow bottom-right */}
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#FDE68A]/10 blur-[120px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>

        {/* ── En-tête de section ── */}
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FDE68A]/30 bg-[#FDE68A]/10 px-4 py-2 text-sm font-semibold text-[#FDE68A]">
            <Home className="h-4 w-4" />
            {badge}
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
            {subtitle}
          </p>
          {/* ECG accent */}
          <div className="mx-auto mt-6 h-8 max-w-xs">
            <ECGLine color="#FDE68A" height={32} />
          </div>
        </motion.div>

        {/* ── Layout principal : image + contenu ── */}
        <div className='grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16'>

          {/* Colonne image — ambulance avec overlay */}
          <motion.div
            className='group relative order-2 lg:order-1'
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative h-[400px] w-full overflow-hidden rounded-3xl lg:h-[540px]">
              <Image
                src="/images/spec/home-care-generated.png"
                alt={title || 'Soins à domicile'}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#002211]/90 via-[#002211]/20 to-transparent" />
              {/* Inner ring */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#FDE68A]/20" />

              {/* Badge flottant "24/7" */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-[#FDE68A]/20 bg-[#006633]/80 px-5 py-3.5 backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#006633] to-[#FDE68A] shadow-lg shadow-[#006633]/50">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">7j/7</p>
                  <p className="text-xs text-white/60">{availabilityText}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Colonne contenu */}
          <div className='order-1 space-y-6 lg:order-2'>

            {/* ── Prestations ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDE68A]/10">
                  <Stethoscope className="h-5 w-5 text-[#FDE68A]" />
                </div>
                <h3 className="text-lg font-bold text-white">{t('prestations')}</h3>
              </div>
              <div className="space-y-3">
                {displayPrestations.map((item, i) => {
                  const IconComp = SERVICE_ICONS[i % SERVICE_ICONS.length]
                  return (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                      className="group/item flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.04] p-4 backdrop-blur-sm transition-all duration-300 hover:border-[#FDE68A]/30 hover:bg-white/[0.08]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDE68A]/10 text-[#FDE68A] transition-colors duration-300 group-hover/item:bg-[#FDE68A]/20">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-white/90">{item}</span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* ── Contact & CTA ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border border-[#FDE68A]/20 bg-gradient-to-br from-[#006633]/40 via-[#004d26]/20 to-transparent p-6 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,102,51,0.15)]"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDE68A]/10">
                  <PhoneCall className="h-5 w-5 text-[#FDE68A]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{availabilityTitle}</h3>
                  <p className="text-xs text-white/60">{contactPrompt}</p>
                </div>
              </div>

              {/* Numéros de téléphone */}
              <div className="mb-5 flex flex-col gap-2 sm:flex-row" dir="ltr">
                <a
                  href="tel:0563015916"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base font-bold text-white transition-all duration-200 hover:border-[#FDE68A]/40 hover:bg-white/10"
                >
                  <PhoneCall className="h-4 w-4 text-[#FDE68A]" />
                  0563 01 59 16
                </a>
                <a
                  href="tel:0563015917"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base font-bold text-white transition-all duration-200 hover:border-[#FDE68A]/40 hover:bg-white/10"
                >
                  <PhoneCall className="h-4 w-4 text-[#FDE68A]" />
                  0563 01 59 17
                </a>
              </div>

              {/* CTA button avec dégradé vert -> jaune comme demandé */}
              <button
                onClick={scrollToContact}
                className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#006633] via-[#4caf6e] to-[#FDE68A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#006633]/30 transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
              >
                {ctaText}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
