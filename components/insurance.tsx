'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShieldCheck, BadgeCheck, ArrowRight } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { insuranceFallback } from '@/data/insurance'
import { AnimatedSection } from '@/components/ui/animated-section'

interface InsuranceProvider {
  name: string
  description?: string
  logo?: any
}

interface ResolvedContent {
  badge: string
  title: string
  subtitle: string
  providers: InsuranceProvider[]
  note: string
  ctaText: string
}

interface InsuranceProps {
  data?: {
    badge?: string
    title?: string
    subtitle?: string
    providers?: InsuranceProvider[]
    note?: string
    ctaText?: string
  } | null
}

/** Fusionne les données Sanity avec le repli local (Sanity prioritaire) */
function resolveContent(data?: InsuranceProps['data']): ResolvedContent {
  if (!data) return insuranceFallback
  return {
    badge: data.badge || insuranceFallback.badge,
    title: data.title || insuranceFallback.title,
    subtitle: data.subtitle || insuranceFallback.subtitle,
    providers:
      data.providers && data.providers.length > 0
        ? data.providers
        : insuranceFallback.providers,
    note: data.note || insuranceFallback.note,
    ctaText: data.ctaText || insuranceFallback.ctaText,
  }
}

export default function Insurance({ data }: InsuranceProps) {
  const content = resolveContent(data)

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
              {content.badge}
            </span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              <span className="text-foreground">{content.title}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              {content.subtitle}
            </p>
          </div>
        </AnimatedSection>

        {/* Grille des organismes */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.providers.map((provider, i) => {
            const logoUrl = provider.logo
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
                  {provider.name}
                </h3>
                {provider.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {provider.description}
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
          {content.note && (
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {content.note}
            </p>
          )}
          <a
            href="#contact"
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-95"
          >
            {content.ctaText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
