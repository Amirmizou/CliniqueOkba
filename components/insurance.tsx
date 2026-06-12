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

  return (
    <section
      id="prise-en-charge"
      className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24"
    >
      {/* Décor d'ambiance */}
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#006633]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-[#FDE68A]/15 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade" className="mb-12 text-center">
          <div className="animate-item">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
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

        {/* Grille des organismes */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.providers.map((provider, i) => {
            const logoUrl = typeof provider.logo === 'string'
              ? provider.logo
              : provider.logo
                ? urlFor(provider.logo).width(160).height(160).fit('max').url()
                : ''
            return (
              <motion.div
                key={provider.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col items-start rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={provider.name}
                      width={56}
                      height={56}
                      className="h-full w-full object-contain p-1.5"
                    />
                  ) : (
                    <BadgeCheck className="h-7 w-7" />
                  )}
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {isAr ? (provider.name_ar || provider.name) : provider.name}
                </h3>
                {(provider.description || provider.description_ar) && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {isAr ? (provider.description_ar || provider.description) : provider.description}
                  </p>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Note + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center gap-5 rounded-2xl border border-primary/15 bg-primary/[0.04] p-6 text-center sm:flex-row sm:justify-between sm:text-left"
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
