'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, BadgeCheck, ArrowRight, Camera, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { AnimatedSection } from '@/components/ui/animated-section'
import { useLocale, useTranslations } from 'next-intl'

interface InsuranceProvider {
  name: string
  name_ar?: string
  description?: string
  description_ar?: string
  logo?: any
  signaturePhotos?: any[]
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
  const t = useTranslations('common')
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider | null>(null)
  const [photoIndex, setPhotoIndex] = useState(0)

  // Préparation des cartes pour le cylindre 3D
  let carouselItems = [...data.providers]
  if (carouselItems.length > 0) {
    while (carouselItems.length < 8) {
      carouselItems = [...carouselItems, ...data.providers]
    }
  }

  const total = carouselItems.length
  const angle = 360 / total
  const cardWidth = 260
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
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin-cylinder {
              0% { transform: translateZ(-${tz}px) rotateY(0deg); }
              100% { transform: translateZ(-${tz}px) rotateY(-360deg); }
            }
            .animate-spin-cylinder {
              animation: spin-cylinder ${total * 3.5}s linear infinite;
            }
            .animate-spin-cylinder:hover,
            .is-paused .animate-spin-cylinder {
              animation-play-state: paused;
            }
          `}} />
          
          <div className={`absolute inset-0 [transform-style:preserve-3d] ${selectedProvider ? 'is-paused' : 'animate-spin-cylinder'}`}>
            {carouselItems.map((provider, i) => {
              const logoUrl = typeof provider.logo === 'string'
                ? provider.logo
                : provider.logo
                  ? urlFor(provider.logo).width(320).url()
                  : ''
              
              const hasPhotos = Array.isArray(provider.signaturePhotos) && provider.signaturePhotos.length > 0
              
              return (
                <motion.div
                  key={`${provider.name}-${i}`}
                  layoutId={hasPhotos && !selectedProvider ? `provider-${provider.name}` : undefined}
                  className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl border bg-card/95 p-6 text-center shadow-lg backdrop-blur-md transition-colors hover:bg-card ${hasPhotos ? 'cursor-pointer hover:border-primary/60 border-primary/20' : 'border-border/80'}`}
                  style={{
                    transform: `rotateY(${i * angle}deg) translateZ(${tz}px)`,
                    backfaceVisibility: 'hidden',
                  }}
                  onClick={() => {
                    if (hasPhotos) {
                      setSelectedProvider(provider)
                      setPhotoIndex(0)
                    }
                  }}
                >
                  {hasPhotos && (
                    <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold animate-pulse shadow-sm">
                      <Camera className="h-4 w-4" />
                    </div>
                  )}
                  
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
                  
                  {hasPhotos && (
                    <div className="mt-4 text-[11px] font-semibold text-primary/80 uppercase tracking-wide">
                      {isAr ? 'عرض صور التوقيع' : 'Voir les photos'}
                    </div>
                  )}
                </motion.div>
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

      {/* Galerie Lightbox Plein Écran */}
      <AnimatePresence>
        {selectedProvider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
            onClick={() => setSelectedProvider(null)}
          >
            <button
              className="absolute right-4 top-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:right-8 sm:top-8"
              onClick={() => setSelectedProvider(null)}
            >
              <X className="h-6 w-6" />
            </button>

            <motion.div
              layoutId={`provider-${selectedProvider.name}`}
              className="relative flex h-full max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-background shadow-2xl md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Actuelle */}
              <div className="relative flex-1 bg-black/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={photoIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={urlFor(selectedProvider.signaturePhotos![photoIndex]).width(1200).height(900).url()}
                      alt={`${selectedProvider.name} signature photo ${photoIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Carousel */}
                {selectedProvider.signaturePhotos!.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPhotoIndex((prev) => (prev - 1 + selectedProvider.signaturePhotos!.length) % selectedProvider.signaturePhotos!.length)
                      }}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPhotoIndex((prev) => (prev + 1) % selectedProvider.signaturePhotos!.length)
                      }}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    {/* Indicateurs (dots) */}
                    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 px-3 py-2 backdrop-blur-md">
                      {selectedProvider.signaturePhotos!.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 rounded-full transition-all ${
                            idx === photoIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Panneau d'informations latéral */}
              <div className="flex w-full flex-col justify-center bg-card p-8 md:w-80 lg:w-96">
                <div className="mb-6 flex h-20 w-32 items-center justify-center rounded-2xl bg-primary/5 p-4 shadow-inner">
                  {selectedProvider.logo ? (
                    <Image
                      src={typeof selectedProvider.logo === 'string' ? selectedProvider.logo : urlFor(selectedProvider.logo).width(200).url()}
                      alt={selectedProvider.name}
                      width={128}
                      height={64}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <ShieldCheck className="h-10 w-10 text-primary" />
                  )}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-foreground">
                  {isAr ? (selectedProvider.name_ar || selectedProvider.name) : selectedProvider.name}
                </h3>
                {(selectedProvider.description || selectedProvider.description_ar) && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {isAr ? (selectedProvider.description_ar || selectedProvider.description) : selectedProvider.description}
                  </p>
                )}
                
                <div className="mt-auto pt-8">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                    <ShieldCheck className="h-5 w-5" />
                    {isAr ? 'مؤمن ومدعوم بالكامل' : 'Convention Officielle'}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
