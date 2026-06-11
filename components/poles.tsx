'use client'

import { useRef, useState, type MouseEvent, type CSSProperties } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  ScanLine,
  Smile,
  Stethoscope,
  Siren,
  FlaskConical,
  Eye,
  ScanEye,
  Heart,
  Baby,
  Pill,
  Activity,
  ArrowRight,
  Phone,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'
import { poles, CLINIC_PHONE, type Pole } from '@/data/poles'
import { Link } from '@/navigation'
import { AnimatedSection } from '@/components/ui/animated-section'
import { ECGLine, ecgVariantForIcon } from '@/components/ui/ecg-line'
import { LineReveal } from '@/components/ui/reveal-text'
import { PoleMotif, motifVariantForIcon } from '@/components/ui/pole-motif'

import {
  ImagerieIcon,
  DentaireIcon,
  ConsultationsIcon,
  UrgencesIcon,
  LaboratoireIcon,
  ChirurgieIcon,
  NucleaireIcon,
} from '@/components/icons/custom-pole-icons'

const ICONS: Record<string, any> = {
  ScanLine: ImagerieIcon,
  Smile: DentaireIcon,
  Stethoscope: ConsultationsIcon,
  Siren: UrgencesIcon,
  FlaskConical: LaboratoireIcon,
  Eye: ChirurgieIcon,
  Radiation: NucleaireIcon,
  ScanEye,
  Heart,
  Baby,
  Pill,
  Activity,
}

/** Convertit les pôles Sanity en Pole[] (repli sur les données locales) */
function resolvePoles(data?: any[]): Pole[] {
  if (!data || data.length === 0) return poles
  return data.map((d, i) => ({
    id: d._id || String(i),
    slug: d.slug?.current || d.slug || String(i),
    title: d.title || '',
    description: d.description || '',
    items: Array.isArray(d.items) ? d.items : [],
    iconName: d.iconName || 'Stethoscope',
    accent: d.accentColor || '#006633',
    badge: d.badge || undefined,
    urgent: d.urgent ?? false,
    featured: d.featured ?? false,
    galleryCategories: Array.isArray(d.galleryCategories) ? d.galleryCategories : [],
  }))
}

/* -------------------------------------------------------------------------- */
/*  Carte pôle (effet moniteur : battement + ECG)                             */
/* -------------------------------------------------------------------------- */

function PoleCard({ pole, index }: { pole: Pole; index: number }) {
  const t = useTranslations('poles')
  const locale = useLocale()
  const ref = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  const title = locale === 'ar' && pole.title_ar ? pole.title_ar : pole.title
  const description = locale === 'ar' && pole.description_ar ? pole.description_ar : pole.description
  const badge = locale === 'ar' && pole.badge_ar ? pole.badge_ar : pole.badge
  const intro = locale === 'ar' && pole.intro_ar ? pole.intro_ar : pole.intro
  const items = locale === 'ar' && pole.items_ar && pole.items_ar.length > 0 ? pole.items_ar : pole.items

  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [5, -5]), {
    stiffness: 150,
    damping: 18,
  })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-5, 5]), {
    stiffness: 150,
    damping: 18,
  })

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }
  function handleLeave() {
    mx.set(0.5)
    my.set(0.5)
  }

  const Icon = ICONS[pole.iconName] || Stethoscope
  const variant = ecgVariantForIcon(pole.iconName)
  const motif = motifVariantForIcon(pole.iconName)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
      className="group relative h-full"
    >
      {/* Halo coloré (toujours visible pour le pôle vedette) */}
      <div
        className={`absolute -inset-1.5 rounded-[1.75rem] blur-2xl transition-opacity duration-500 group-hover:opacity-70 ${
          pole.featured ? 'opacity-50' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(60% 60% at 50% 0%, ${pole.accent}66, transparent 70%)`,
        }}
      />

      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          ...(pole.featured
            ? ({ '--tw-ring-color': `${pole.accent}66` } as CSSProperties)
            : {}),
        }}
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white/70 p-6 shadow-lg backdrop-blur-md transition-colors dark:bg-white/5 sm:p-7 ${
          pole.urgent
            ? 'border-red-400/40 ring-1 ring-red-400/30'
            : pole.featured
              ? 'border-transparent shadow-xl ring-2'
              : 'border-white/40 dark:border-white/10'
        }`}
      >
        {/* Motif animé propre au domaine du pôle (fond) */}
        <PoleMotif variant={motif} color={pole.accent} />

        {/* Bandeau accent haut */}
        <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: pole.accent }} />

        {/* Ruban « À la une » pour le pôle vedette */}
        {pole.featured && !pole.urgent && (
          <span
            className="absolute right-0 top-0 z-10 rounded-bl-xl rounded-tr-3xl px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white shadow-md"
            style={{ background: pole.accent }}
          >
            {t('featured')}
          </span>
        )}

        {/* Icône (battement de cœur) + badge */}
        <div className="mb-5 flex items-start justify-between">
          <motion.div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
            style={{ backgroundColor: pole.accent }}
            animate={{ scale: [1, 1.08, 1, 1.05, 1] }}
            transition={{
              duration: 1.8,
              times: [0, 0.12, 0.24, 0.36, 0.6],
              repeat: Infinity,
              repeatDelay: 0.6,
              ease: 'easeOut',
            }}
          >
            <Icon className="h-7 w-7" />
          </motion.div>
          {badge && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                pole.urgent ? 'text-white' : 'text-foreground/80'
              }`}
              style={{ backgroundColor: pole.urgent ? pole.accent : `${pole.accent}1A` }}
            >
              {pole.urgent && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
              )}
              {badge}
            </span>
          )}
        </div>

        {/* Titre + description */}
        <h3 className="text-xl font-bold leading-tight text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Accordéon : prestations / actes */}
        {items.length > 0 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
              style={{ backgroundColor: `${pole.accent}12`, color: pole.accent }}
            >
              <Activity className="h-3.5 w-3.5" />
              {t('prestations', { count: items.length })}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ${
                  expanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2">
                    {items.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-2.5 text-sm text-foreground/80"
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: pole.accent }}
                        />
                        {item}
                      </motion.li>
                    ))}
                  </div>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
          <Link
            href={`/poles/${pole.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
            style={{ color: pole.accent }}
          >
            {t('discover')}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          {pole.urgent && (
            <a
              href={`tel:${CLINIC_PHONE}`}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.03] active:scale-95"
              style={{ backgroundColor: pole.accent }}
            >
              <Phone className="h-4 w-4" />
              {t('call')}
            </a>
          )}
        </div>

        {/* Signal ECG propre au pôle (alimentation moniteur) */}
        <div className="-mx-6 -mb-6 mt-5 h-7 opacity-70 sm:-mx-7 sm:-mb-7">
          <ECGLine color={pole.accent} height={28} variant={variant} />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */

export default function Poles({ data }: { data?: any[] }) {
  const t = useTranslations('poles')
  const [list] = useState(() => resolvePoles(data))

  return (
    <section
      id="specialties"
      className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24"
    >
      {/* Décor */}
      <div className="pointer-events-none absolute -top-32 left-0 h-96 w-96 rounded-full bg-[#006633]/12 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#FDE68A]/20 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade" className="mb-12 text-center">
          <div className="animate-item">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {t('badge')}
            </span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              <LineReveal className="text-gradient">{t('titleLine1')}</LineReveal>
              <br />
              <LineReveal className="text-foreground" delay={0.12}>{t('titleLine2')}</LineReveal>
            </h2>
            {/* Ligne ECG sous le titre */}
            <div className="mx-auto mb-4 h-8 max-w-md">
              <ECGLine height={32} />
            </div>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              {t('subtitle')}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((pole, i) => (
            <PoleCard key={pole.id} pole={pole} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
