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
import SectionHeader from '@/components/ui/section-header'
import { LineReveal } from '@/components/ui/reveal-text'
import SectionGlow from '@/components/ui/section-glow'

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
    phone: d.phone || undefined,
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

  // Ligne directe du service si renseignée, sinon numéro principal de la clinique.
  const callNumber = pole.phone || CLINIC_PHONE
  const callHref = `tel:${callNumber.replace(/[^+\d]/g, '')}`
  const callLabel = `${t('call')} — ${title}`

  // Image de fond : Sanity > fallback local
  const bgImage = pole.imageUrl || DEFAULT_IMAGES[pole.iconName] || '/images/specialties/internal-medicine.png'

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.99 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl bg-card border transition-all duration-300 hover:-translate-y-1.5 ${
          pole.urgent
            ? 'border-red-200 shadow-md hover:shadow-xl hover:shadow-red-500/10'
            : pole.featured
              ? 'border-primary/20 shadow-md hover:shadow-xl hover:shadow-primary/10'
              : 'border-border shadow-sm hover:shadow-lg'
        }`}
      >
        {/* ── Bandeau supérieur (Image) ── */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-56">
          <Image
            src={bgImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Overlay léger pour adoucir l'image */}
          <div className="absolute inset-0 bg-black/5 transition-opacity duration-300 group-hover:bg-black/0" />
          
          {/* Ruban « À la une » pour le pôle vedette */}
          {pole.featured && !pole.urgent && (
            <span
              className="absolute right-0 top-0 z-20 rounded-bl-xl px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-white shadow-sm"
              style={{ backgroundColor: pole.accent }}
            >
              {t('featured')}
            </span>
          )}

          {/* Badge additionnel (ex: 24/7) */}
          {badge && (
            <div className="absolute left-4 top-4 z-20">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.65rem] font-bold text-white shadow-sm"
                style={{ backgroundColor: pole.urgent ? '#ef4444' : pole.accent }}
              >
                {pole.urgent && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                )}
                {badge}
              </span>
            </div>
          )}

        </div>

        {/* Icône flottante premium avec dégradé d'accent, halo et ring glassmorphism.
            Elle est volontairement SŒUR du bandeau image et non son enfant : le
            bandeau porte overflow-hidden, qui rognait la moitié débordante de la
            pastille. Ancrée ici sur la carte, elle chevauche proprement la limite
            image / texte.
            top = hauteur du bandeau (12rem, 14rem en sm) − hauteur de la pastille
            + le débord de 1.5rem d'origine. */}
        <motion.div
          className="absolute right-6 top-40 z-30 flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl ring-4 ring-background backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 sm:top-[11.5rem] sm:h-16 sm:w-16"
          style={{
            background: `linear-gradient(135deg, ${pole.urgent ? '#ef4444' : pole.accent} 0%, ${pole.urgent ? '#dc2626' : pole.accent}dd 60%, ${pole.urgent ? '#991b1b' : pole.accent}99 100%)`,
            boxShadow: `0 8px 24px -4px ${pole.urgent ? '#ef4444' : pole.accent}66, 0 4px 12px -2px ${pole.urgent ? '#ef4444' : pole.accent}40`,
          }}
          whileHover={{ scale: 1.12, rotate: 3 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        >
          {/* Lueur interne subtile */}
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <Icon className="relative z-10 h-7 w-7 text-white drop-shadow-md" />
        </motion.div>

        {/* ── Contenu texte ── */}
        <div className="relative z-10 flex flex-1 flex-col p-6 sm:p-7">
          <h3 className="pr-12 text-xl font-bold leading-tight text-card-foreground sm:text-[1.35rem]">
            {title}
          </h3>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-muted-foreground line-clamp-3">
            {description}
          </p>

          {/* Accordéon : prestations / actes */}
          {items.length > 0 && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-[0.75rem] font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                {t('prestations', { count: items.length })}
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 ${
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
                    <div className="mt-3 space-y-2 rounded-2xl bg-muted/30 p-3.5 ring-1 ring-border/50">
                      {items.map((item, i) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-start gap-2.5 text-[0.8rem] text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                          <span className="leading-snug">{item}</span>
                        </motion.li>
                      ))}
                    </div>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="mt-auto pt-6" />

          {/* Ligne ECG de séparation subtile */}
          <div className="-mx-2 mb-4 h-4 opacity-10">
            <ECGLine color="currentColor" height={16} variant={variant} />
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href={`/poles/${pole.slug}`}
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground"
            >
              {t('discover')}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            
            {pole.urgent || pole.phone ? (
              <a
                href={callHref}
                aria-label={callLabel}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] active:scale-95"
                style={{ backgroundColor: pole.urgent ? '#ef4444' : pole.accent }}
              >
                <Phone className="h-4 w-4" />
                {t('call')}
              </a>
            ) : (
              <a
                href={callHref}
                aria-label={callLabel}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground active:scale-95"
              >
                <Phone className="h-4 w-4" />
              </a>
            )}
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
      <SectionGlow
        glows={[
          { at: '0% 0%', size: 384, color: 'var(--color-brand-green)', opacity: 0.12 },
          { at: '100% 100%', size: 384, color: 'var(--color-brand-gold)', opacity: 0.2 },
        ]}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade">
          <SectionHeader
            className="animate-item"
            badgeIcon={
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
            }
            badge={t('badge')}
            title={
              isAr ? (
                <LineReveal className="text-gradient">
                  {t('titleLine1')} <span className="text-foreground">{t('titleLine2')}</span>
                </LineReveal>
              ) : (
                <>
                  <LineReveal className="text-gradient">{t('titleLine1')}</LineReveal>
                  <br />
                  <LineReveal className="text-foreground" delay={0.12}>{t('titleLine2')}</LineReveal>
                </>
              )
            }
            divider={
              <div className="mx-auto mb-4 h-8 max-w-md">
                <ECGLine height={32} />
              </div>
            }
            subtitle={t('subtitle')}
          />
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
