'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShieldCheck, BadgeCheck, ArrowRight } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { AnimatedSection } from '@/components/ui/animated-section'
import { useLocale } from 'next-intl'

interface InsuranceProvider {
  name: string
  name_ar?: string
  description?: string
  description_ar?: string
  logo?: any
}

interface InsuranceProps {
  data?: {
    badge?: string
    badge_ar?: string
    title?: string
    title_ar?: string
    subtitle?: string
    subtitle_ar?: string
    providers?: InsuranceProvider[]
    note?: string
    note_ar?: string
    ctaText?: string
    ctaText_ar?: string
  } | null
}

export default function Insurance({ data }: InsuranceProps) {
  if (!data?.providers || data.providers.length === 0) return null

  const locale = useLocale()
  const isAr = locale === 'ar'

  // Préparation des cartes pour le cylindre 3D
  // Si le nombre de partenaires est trop petit, on duplique pour fermer le cercle.
  let carouselItems = [...data.providers]
  if (carouselItems.length > 0) {
    while (carouselItems.length < 8) {
      carouselItems = [...carouselItems, ...data.providers]
    }
  }

  const total = carouselItems.length
  const angle = 360 / total
  const cardWidth = 260
  // Calcul précis du rayon (translateZ) pour que les cartes ne se chevauchent pas
  const tz = Math.round((cardWidth / 2) / Math.tan(Math.PI / total)) + 30

  return (
    <section
      id="prise-en-charge"
      className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24"
    >
      {/* Décor d'ambiance */}
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-brand-green/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-brand-gold/15 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade" className="mb-12 text-center">
          <div className="animate-item">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold leading-normal text-primary">
              <ShieldCheck className="h-4 w-4" />
              {isAr ? (data.badge_ar || data.badge) : data.badge}
            </span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              <span className="text-foreground">{isAr ? (data.title_ar || data.title) : data.title}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              {isAr ? (data.subtitle_ar || data.subtitle) : data.subtitle}
            </p>
          </div>
        </AnimatedSection>

        {/* Carrousel 3D Cylindrique */}
        <div className="relative mx-auto mt-20 h-[280px] w-full max-w-[260px] [perspective:1400px]">
          {/* Style injecté pour l'animation native CSS (plus performant pour la 3D continue) */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin-cylinder {
              0% { transform: translateZ(-${tz}px) rotateY(0deg); }
              100% { transform: translateZ(-${tz}px) rotateY(-360deg); }
            }
            .animate-spin-cylinder {
              animation: spin-cylinder ${total * 3.5}s linear infinite;
            }
            .animate-spin-cylinder:hover {
              animation-play-state: paused;
            }
          `}} />
          
          <div className="animate-spin-cylinder absolute inset-0 [transform-style:preserve-3d]">
            {carouselItems.map((provider, i) => {
              const logoUrl = typeof provider.logo === 'string'
                ? provider.logo
                : provider.logo
                  ? urlFor(provider.logo).width(320).url()
                  : ''
              
              return (
                <div
                  key={`${provider.name}-${i}`}
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card/95 p-6 text-center shadow-lg backdrop-blur-md transition-colors hover:border-primary/40 hover:bg-card"
                  style={{
                    transform: `rotateY(${i * angle}deg) translateZ(${tz}px)`,
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div className="mb-4 flex h-16 w-full max-w-[160px] items-center justify-center rounded-xl bg-primary/5 p-2 text-primary shadow-inner">
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt={provider.name}
                        width={160}
                        height={64}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <BadgeCheck className="h-8 w-8" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {isAr ? (provider.name_ar || provider.name) : provider.name}
                  </h3>
                  {(provider.description || provider.description_ar) && (
                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-3">
                      {isAr ? (provider.description_ar || provider.description) : provider.description}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Note + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 flex flex-col items-center gap-5 rounded-2xl border border-primary/15 bg-primary/[0.04] p-6 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          {(data.note || data.note_ar) && (
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {isAr ? (data.note_ar || data.note) : data.note}
            </p>
          )}
          <a
            href="#contact"
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-95"
          >
            {isAr ? (data.ctaText_ar || data.ctaText) : data.ctaText}
            <ArrowRight className={isAr ? "h-4 w-4 transition-transform group-hover:-translate-x-1 rotate-180" : "h-4 w-4 transition-transform group-hover:translate-x-1"} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
