'use client'

import { useRef, useState, type MouseEvent, type CSSProperties } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
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

/** Images de fond par défaut (photos réelles de la clinique & spécialités) */
const DEFAULT_IMAGES: Record<string, string> = {
  ScanLine: 'https://cdn.sanity.io/images/ox121huo/production/2131088c8ef7bbe9fbea5fbb8138e0141afeb108-960x720.webp',
  Radiation: 'https://cdn.sanity.io/images/ox121huo/production/88b2db71d90062f73179411ac73c94020ddbeab1-472x476.png',
  Smile: 'https://cdn.sanity.io/images/ox121huo/production/e090e3347d9554481b0c27c9c7c5d13b44038c0a-2752x1536.png',
  Stethoscope: 'https://cdn.sanity.io/images/ox121huo/production/f2462ecffc66194467fa60cb31da515094f6a834-1264x848.jpg',
  Siren: 'https://cdn.sanity.io/images/ox121huo/production/92e468456b67480ffcf824c16d77c5d064a5ad3b-1201x1600.jpg',
  FlaskConical: 'https://cdn.sanity.io/images/ox121huo/production/757b4e28bcfaa11d23804e928e749064562fc631-1600x744.jpg',
  Eye: 'https://cdn.sanity.io/images/ox121huo/production/3ff593e8d95b85af2f1658c2e405523f45162149-1600x809.jpg',
  Heart: 'https://cdn.sanity.io/images/ox121huo/production/790004232ac8c08fc220ade3534c6e0b5d7a8a2b-1234x823.jpg',
  Baby: 'https://cdn.sanity.io/images/ox121huo/production/f2462ecffc66194467fa60cb31da515094f6a834-1264x848.jpg',
  ScanEye: 'https://cdn.sanity.io/images/ox121huo/production/3ff593e8d95b85af2f1658c2e405523f45162149-1600x809.jpg',
  Pill: 'https://cdn.sanity.io/images/ox121huo/production/cbb7cd26b49f2157bf8bc9738f1527fad86539ca-1280x720.jpg',
  Activity: 'https://cdn.sanity.io/images/ox121huo/production/cbb7cd26b49f2157bf8bc9738f1527fad86539ca-1280x720.jpg',
}

/** Convertit les pôles Sanity en Pole[] (repli sur les données locales) */
function resolvePoles(data?: any[]): (Pole & { imageUrl?: string })[] {
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
    imageUrl: d.imageUrl || undefined,
  }))
}

/* -------------------------------------------------------------------------- */
/*  Carte pôle — design photo immersif                                         */
/* -------------------------------------------------------------------------- */

function PoleCard({ pole, index }: { pole: Pole & { imageUrl?: string }; index: number }) {
  const t = useTranslations('poles')
  const locale = useLocale()
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const title = locale === 'ar' && pole.title_ar ? pole.title_ar : pole.title
  const description = locale === 'ar' && pole.description_ar ? pole.description_ar : pole.description
  const badge = locale === 'ar' && pole.badge_ar ? pole.badge_ar : pole.badge
  const items = locale === 'ar' && pole.items_ar && pole.items_ar.length > 0 ? pole.items_ar : pole.items

  const Icon = ICONS[pole.iconName] || Stethoscope
  const variant = ecgVariantForIcon(pole.iconName)

  // Image de fond : Sanity > fallback local
  const bgImage = pole.imageUrl || DEFAULT_IMAGES[pole.iconName] || '/images/specialties/internal-medicine.png'

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.99 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Halo coloré au hover */}
      <div
        className={`absolute -inset-2 rounded-[2rem] blur-2xl transition-opacity duration-500 ${
          pole.featured ? 'opacity-40 group-hover:opacity-60' : 'opacity-0 group-hover:opacity-50'
        }`}
        style={{
          background: `radial-gradient(60% 60% at 50% 40%, ${pole.accent}55, transparent 70%)`,
        }}
      />

      <div
        className={`relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-1.5 ${
          pole.urgent
            ? 'border-red-400/50 shadow-lg shadow-red-500/10 ring-1 ring-red-400/30'
            : pole.featured
              ? 'border-white/20 shadow-xl ring-1 ring-white/10'
              : 'border-white/10 shadow-lg'
        }`}
      >
        {/* ── Photo de fond ── */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Overlay gradient (du bas vers le haut) */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: `linear-gradient(
                to top,
                ${pole.accent}f0 0%,
                ${pole.accent}cc 25%,
                ${pole.accent}88 50%,
                ${pole.accent}30 75%,
                transparent 100%
              )`,
            }}
          />
          {/* Secondary dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Bandeau accent haut (fin trait lumineux) */}
        <div
          className="absolute inset-x-0 top-0 z-10 h-1"
          style={{ background: `linear-gradient(90deg, transparent, ${pole.accent}, transparent)` }}
        />

        {/* Ruban « À la une » pour le pôle vedette */}
        {pole.featured && !pole.urgent && (
          <span
            className="absolute right-0 top-0 z-20 rounded-bl-xl rounded-tr-3xl px-3.5 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white shadow-lg backdrop-blur-sm"
            style={{ background: `${pole.accent}cc` }}
          >
            {t('featured')}
          </span>
        )}

        {/* ── Contenu ── */}
        <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-7">

          {/* Icône flottante (en haut à gauche de la zone de contenu) */}
          <div className="mb-auto flex items-start justify-between">
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-white backdrop-blur-md"
              style={{
                background: `${pole.accent}90`,
                boxShadow: `0 4px 20px ${pole.accent}40`,
              }}
              whileHover={{ scale: 1.08, y: -2 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              <Icon className="h-6 w-6 drop-shadow-md" />
            </motion.div>

            {badge && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.65rem] font-bold text-white backdrop-blur-md"
                style={{ backgroundColor: `${pole.accent}99` }}
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
          <h3 className="text-xl font-bold leading-tight text-white drop-shadow-lg sm:text-[1.35rem]">
            {title}
          </h3>
          <p className="mt-1.5 text-[0.8rem] leading-relaxed text-white/80 line-clamp-2 drop-shadow">
            {description}
          </p>

          {/* Accordéon : prestations / actes */}
          {items.length > 0 && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.7rem] font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                <Activity className="h-3 w-3" />
                {t('prestations', { count: items.length })}
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-300 ${
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
                    <div className="mt-2.5 space-y-1.5 rounded-2xl bg-white/10 p-3 backdrop-blur-md">
                      {items.map((item, i) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-center gap-2 text-[0.78rem] text-white/90"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
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
          <div className="mt-4 flex items-center gap-2">
            <Link
              href={`/poles/${pole.slug}`}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white/15 px-3 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/25 hover:gap-2.5"
            >
              {t('discover')}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            {pole.urgent ? (
              <a
                href={`tel:${CLINIC_PHONE}`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold shadow-lg transition-transform duration-200 hover:scale-[1.03] active:scale-95"
                style={{ color: pole.accent }}
              >
                <Phone className="h-4 w-4" />
                {t('call')}
              </a>
            ) : (
              <a
                href={`tel:${CLINIC_PHONE}`}
                aria-label={t('call')}
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 p-2.5 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/25 touch-target min-w-[40px]"
              >
                <Phone className="h-4 w-4" />
              </a>
            )}
          </div>

          {/* Signal ECG (ligne basse) */}
          <div className="-mx-6 -mb-6 mt-4 h-6 opacity-50 sm:-mx-7 sm:-mb-7">
            <ECGLine color="rgba(255,255,255,0.7)" height={24} variant={variant} />
          </div>
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
