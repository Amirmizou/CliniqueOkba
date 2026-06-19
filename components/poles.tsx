'use client'

import { useRef, useState, type MouseEvent, type CSSProperties } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [expanded, setExpanded] = useState(false)

  const title = locale === 'ar' && pole.title_ar ? pole.title_ar : pole.title
  const description = locale === 'ar' && pole.description_ar ? pole.description_ar : pole.description
  const badge = locale === 'ar' && pole.badge_ar ? pole.badge_ar : pole.badge
  const intro = locale === 'ar' && pole.intro_ar ? pole.intro_ar : pole.intro
  const items = locale === 'ar' && pole.items_ar && pole.items_ar.length > 0 ? pole.items_ar : pole.items

  const Icon = ICONS[pole.iconName] || Stethoscope
  const variant = ecgVariantForIcon(pole.iconName)
  const motif = motifVariantForIcon(pole.iconName)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.99 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
      className="group relative h-full cursor-default"
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

      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated dark:bg-slate-900 sm:p-7 ${
          pole.urgent
            ? 'border-red-400/40 ring-1 ring-red-400/30'
            : pole.featured
              ? 'border-transparent shadow-xl ring-2'
              : 'border-border/40 dark:border-white/10'
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

        {/* Icône + badge */}
        <div className="mb-5 flex items-start justify-between">
          <div className="relative h-14 w-14 shrink-0">
            {/* Halo ambiant (glow derrière la pastille) */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl opacity-25 blur-xl transition-opacity duration-500 group-hover:opacity-55"
              style={{ background: pole.accent }}
            />
            {/* Pastille icône avec gradient + reflet interne */}
            <motion.div
              className="relative flex h-full w-full items-center justify-center rounded-2xl text-white"
              style={{
                background: `linear-gradient(140deg, ${pole.accent}d0 0%, ${pole.accent} 100%)`,
                boxShadow: `0 4px 18px ${pole.accent}50, inset 0 1px 0 rgba(255,255,255,0.18)`,
              }}
              whileHover={{ scale: 1.06, y: -1 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              <Icon className="h-7 w-7 drop-shadow-sm" />
            </motion.div>
          </div>
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
                  transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
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
        <div className="mt-auto flex items-center gap-2 pt-5">
          <Link
            href={`/poles/${pole.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200 hover:gap-2.5"
            style={{ color: pole.accent, backgroundColor: `${pole.accent}12` }}
          >
            {t('discover')}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          {pole.urgent ? (
            <a
              href={`tel:${CLINIC_PHONE}`}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.03] active:scale-95"
              style={{ backgroundColor: pole.accent }}
            >
              <Phone className="h-4 w-4" />
              {t('call')}
            </a>
          ) : (
            <a
              href={`tel:${CLINIC_PHONE}`}
              aria-label={t('call')}
              className="inline-flex items-center justify-center rounded-full border p-2 transition-colors duration-200 hover:bg-foreground/5 touch-target min-w-[40px]"
              style={{ borderColor: `${pole.accent}40`, color: pole.accent }}
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Signal ECG propre au pôle (alimentation moniteur) */}
        <div className="-mx-6 -mb-6 mt-5 h-7 opacity-70 sm:-mx-7 sm:-mb-7">
          <ECGLine color={pole.accent} height={28} variant={variant} />
        </div>
      </div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */

export default function Poles({ data }: { data?: any[] }) {
  const t = useTranslations('poles')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const [list] = useState(() => resolvePoles(data))

  return (
    <section
      id="specialties"
      className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24"
    >
      {/* Décor */}
      <div className="pointer-events-none absolute -top-32 left-0 h-96 w-96 rounded-full bg-brand-green/12 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-brand-gold/20 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade" className="mb-12 text-center">
          <div className="animate-item">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold leading-normal text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {t('badge')}
            </span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              {isAr ? (
                <LineReveal className="text-gradient">
                  {t('titleLine1')} <span className="text-foreground">{t('titleLine2')}</span>
                </LineReveal>
              ) : (
                <>
                  <LineReveal className="text-gradient">{t('titleLine1')}</LineReveal>
                  <br />
                  <LineReveal className="text-foreground" delay={0.12}>{t('titleLine2')}</LineReveal>
                </>
              )}
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
