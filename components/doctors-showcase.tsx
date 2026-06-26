'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import {
  motion,
  AnimatePresence,
} from 'framer-motion'
import {
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  X,
  Sparkles,
  Maximize2,
  Play,
  GraduationCap,
  Award,
  Baby,
  Activity,
  Stethoscope,
  Ear,
  Heart,
  Smile,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react'
import { doctors, CLINIC_WHATSAPP, CLINIC_PHONE, type Doctor } from '@/data/doctors'
import { urlFor, sanityImageLoader, hiResImage } from '@/sanity/lib/image'
import { AnimatedSection } from '@/components/ui/animated-section'
import { LineReveal } from '@/components/ui/reveal-text'
import { UniversalPlayer } from '@/components/ui/universal-player'

// Résolution des icônes Sanity (chaîne -> composant Lucide)
const ICONS: Record<string, LucideIcon> = {
  Baby,
  Activity,
  Stethoscope,
  Ear,
  Heart,
  Smile,
  FlaskConical,
}

/* Normalise un libellé pour la correspondance FR → AR (insensible à la casse,
   aux civilités « Dr./Pr. », à la ponctuation et aux espaces multiples). */
function normalizeKey(s?: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/\b(dr|pr|prof|docteur|professeur)\b\.?/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

/* Dictionnaires FR → AR construits à partir des données locales (data/doctors.ts).
   Sert de filet de sécurité : même si le contenu Sanity n'a pas de champ _ar,
   on retrouve la traduction arabe par correspondance sur le libellé français. */
const AR_NAME = new Map<string, string>()
const AR_SPECIALTY = new Map<string, string>()
const AR_SUBTITLE = new Map<string, string>()
const AR_EXPERIENCE = new Map<string, string>()
const AR_DAYS = new Map<string, string>()
const AR_HOURS = new Map<string, string>()
const AR_SERVICE = new Map<string, string>()
for (const d of doctors) {
  if (d.name_ar) AR_NAME.set(normalizeKey(d.name), d.name_ar)
  if (d.specialty_ar) AR_SPECIALTY.set(normalizeKey(d.specialty), d.specialty_ar)
  if (d.subtitle_ar) AR_SUBTITLE.set(normalizeKey(d.subtitle), d.subtitle_ar)
  if (d.experience_ar) AR_EXPERIENCE.set(normalizeKey(d.experience), d.experience_ar)
  if (d.days_ar) AR_DAYS.set(normalizeKey(d.days), d.days_ar)
  if (d.hours_ar) AR_HOURS.set(normalizeKey(d.hours), d.hours_ar)
  if (d.services_ar) {
    d.services.forEach((s, idx) => {
      const ar = d.services_ar?.[idx]
      if (ar) AR_SERVICE.set(normalizeKey(s), ar)
    })
  }
}

/* Traduit en arabe un médecin déjà résolu, via les dictionnaires FR → AR.
   Si une valeur est déjà en arabe (Sanity localisé) ou inconnue, on la garde. */
function toArabic(doc: Doctor): Doctor {
  const tr = (map: Map<string, string>, v?: string) =>
    (v && map.get(normalizeKey(v))) || v
  return {
    ...doc,
    name: tr(AR_NAME, doc.name) || doc.name,
    specialty: tr(AR_SPECIALTY, doc.specialty) || doc.specialty,
    subtitle: tr(AR_SUBTITLE, doc.subtitle),
    experience: tr(AR_EXPERIENCE, doc.experience),
    customBadge: doc.customBadge_ar || doc.customBadge,
    days: tr(AR_DAYS, doc.days) || doc.days,
    hours: tr(AR_HOURS, doc.hours) || doc.hours,
    services: doc.services.map((s) => AR_SERVICE.get(normalizeKey(s)) || s),
  }
}

/** Convertit les médecins Sanity en Doctor[] (repli sur les données locales) */
function resolveDoctors(data: any[] | undefined, locale: string): Doctor[] {
  const base: Doctor[] =
    !data || data.length === 0
      ? doctors
      : data.map((d, i) => ({
          id: d._id || String(i),
          name: [d.title, d.name].filter(Boolean).join(' ').trim() || d.name,
          specialty: d.specialty || '',
          subtitle: d.subtitle || undefined,
          services: Array.isArray(d.services) ? d.services : [],
          experience: d.experience || undefined,
          customBadge: d.customBadge || undefined,
          customBadge_ar: d.customBadge_ar || undefined,
          days: d.consultationDays || '',
          hours: d.consultationHours || '',
          poster: d.image ? urlFor(d.image).width(620).height(827).url() : '',
          icon: ICONS[d.iconName] || Stethoscope,
          accent: d.accentColor || '#006633',
          gradient: '',
          videos: Array.isArray(d.videos) ? d.videos.filter(Boolean) : [],
        }))

  return locale === 'ar' ? base.map(toArabic) : base
}

/* -------------------------------------------------------------------------- */

function DoctorCard({
  doctor,
  index,
  onOpen,
  onPlay,
  sectionAccent,
}: {
  doctor: Doctor
  index: number
  onOpen: (d: Doctor) => void
  onPlay: (d: Doctor) => void
  sectionAccent?: string
}) {
  const t = useTranslations('doctors')
  const locale = useLocale()

  const Icon = doctor.icon
  // Si une couleur de section est définie, elle s'applique à tous les médecins,
  // sinon on utilise la couleur propre au médecin, ou le vert par défaut.
  const accent = sectionAccent || doctor.accent || '#006633'
  const hasVideos = Array.isArray(doctor.videos) && doctor.videos.length > 0
  const waMessage = encodeURIComponent(
    locale === 'ar'
      ? `مرحباً، أرغب في حجز موعد مع ${doctor.name} (${doctor.specialty}) في عيادة OKBA.`
      : `Bonjour, je souhaite prendre rendez-vous avec ${doctor.name} (${doctor.specialty}) à la Clinique OKBA.`,
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-full"
    >
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/40 bg-white shadow-soft ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated dark:border-white/10 dark:bg-slate-900"
        style={{ '--tw-ring-color': `${accent}1A` } as React.CSSProperties}
      >
        {/* ----- Affiche ----- */}
        <button
          type="button"
          onClick={() => onOpen(doctor)}
          aria-label={`Agrandir la photo de ${doctor.name}`}
          className="relative block aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-zoom-in touch-manipulation"
        >
          <Image
            loader={sanityImageLoader}
            src={doctor.poster}
            alt={`Photo ${doctor.name} – ${doctor.specialty}`}
            fill
            draggable={false}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06] select-none"
          />

          {/* Liseré supérieur (identité visuelle) */}
          <div 
            className="absolute inset-x-0 top-0 h-1" 
            style={{ backgroundImage: `linear-gradient(to right, ${accent}, #FDE68A, ${accent})` }}
          />

          {/* Voile sombre bas (lisibilité du nom) */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Indice "agrandir" */}
          <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
          </div>

          {/* Spécialité, Nom + expérience (toujours visibles, posés sur le voile) */}
          <div
            className="absolute inset-x-0 bottom-0 p-5 text-left flex flex-col items-start"
          >
            {/* Badge spécialité déplacé en bas pour ne pas cacher le visage */}
            <div
              className="mb-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
              style={{ backgroundColor: `${accent}E6` }}
            >
              <Icon className="h-3.5 w-3.5" />
              {doctor.specialty}
            </div>
            
            <h3 className="text-lg font-bold leading-tight text-white drop-shadow">
              {doctor.name}
            </h3>
            {doctor.subtitle && (
              <p className="mt-0.5 text-sm font-medium text-white/85">
                {doctor.subtitle}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {doctor.experience && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  <Award className="h-3 w-3 text-amber-300" />
                  {doctor.experience}
                </span>
              )}
              {doctor.customBadge && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDE68A] px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow-md">
                  <Sparkles className="h-3 w-3" />
                  {doctor.customBadge}
                </span>
              )}
            </div>
          </div>
        </button>

        {/* ─── Vidéo éducative — affordances créatives (si le médecin a des vidéos) ─── */}
        {hasVideos && (
          <>
            {/* Badge animé toujours visible (mobile + desktop) — pastille play + pulse sonar */}
            <button
              type="button"
              onClick={() => onPlay(doctor)}
              aria-label={locale === 'ar' ? `مشاهدة الفيديو التعليمي لـ ${doctor.name}` : `Voir la vidéo éducative de ${doctor.name}`}
              className="group/play absolute left-3 top-3 z-20 inline-flex items-center gap-2 rounded-full bg-white/92 py-1.5 pl-1.5 pr-3 shadow-lg ring-1 ring-black/5 backdrop-blur-md transition-transform duration-200 hover:scale-[1.04] active:scale-95 dark:bg-slate-900/90"
            >
              <span
                className="relative flex h-7 w-7 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: accent }}
              >
                {/* Onde sonar (invite à lire) */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: accent, opacity: 0.35 }}
                />
                <Play className="relative ml-0.5 h-3.5 w-3.5 fill-current" />
              </span>
              <span className="flex flex-col items-start leading-none">
                <span className="text-[11px] font-bold" style={{ color: accent }}>
                  {locale === 'ar' ? 'فيديو تعليمي' : 'Vidéo éducative'}
                </span>
              </span>
            </button>

            {/* Voile doux au survol (desktop) — décoratif, laisse passer le clic vers le zoom */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[9] hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block"
              style={{ background: 'radial-gradient(circle at 50% 42%, rgba(0,0,0,0.45), rgba(0,0,0,0.12) 60%, transparent 82%)' }}
            />
            {/* Gros bouton play centré (desktop) — apparaît au survol, lance la vidéo */}
            <button
              type="button"
              onClick={() => onPlay(doctor)}
              tabIndex={-1}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[42%] z-10 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 sm:flex"
            >
              <span className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full bg-white/25 ring-1 ring-white/50 backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
                <span aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-white/70 animate-ping" />
                <Play className="ml-1 h-7 w-7 fill-white text-white" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                <GraduationCap className="h-3.5 w-3.5 text-[#FDE68A]" />
                {locale === 'ar' ? 'شاهد الفيديو التعليمي' : 'Voir la vidéo éducative'}
              </span>
            </button>
          </>
        )}

        {/* ----- Panneau d'informations ----- */}
        <div className="flex flex-1 flex-col gap-4 p-5">
          {/* Services — toujours visibles (max 7 + compteur) */}
          <div className="flex flex-wrap gap-1.5">
            {doctor.services.slice(0, 7).map((s) => (
              <span
                key={s}
                className="rounded-lg border px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                style={{
                  borderColor: `${accent}40`,
                  backgroundColor: `${accent}10`,
                }}
              >
                {s}
              </span>
            ))}
            {doctor.services.length > 7 && (
              <span
                className="rounded-lg border px-2.5 py-1 text-[11px] font-semibold"
                style={{ borderColor: `${accent}30`, color: accent }}
              >
                +{doctor.services.length - 7}
              </span>
            )}
          </div>

          {/* Horaires */}
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" style={{ color: accent }} />
              <span>{doctor.days}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" style={{ color: accent }} />
              <span>{doctor.hours}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto flex gap-2 pt-1">
            <a
              href={`https://wa.me/${CLINIC_WHATSAPP}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.03] active:scale-95 touch-target"
              style={{ backgroundColor: accent }}
            >
              <MessageCircle className="h-4 w-4" />
              {t('bookShort')}
            </a>
            <a
              href={`tel:${CLINIC_PHONE}`}
              aria-label={t('callFor', { name: doctor.name })}
              className="inline-flex items-center justify-center rounded-xl border px-3 py-2.5 text-foreground/80 transition-colors hover:bg-foreground/5 touch-target min-w-[48px]"
              style={{ borderColor: `${accent}55` }}
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Lightbox affiche plein écran                                              */
/* -------------------------------------------------------------------------- */

function PosterLightbox({
  doctor,
  onClose,
}: {
  doctor: Doctor
  onClose: () => void
}) {
  const tc = useTranslations('common')
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={tc('close')}
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/30"
      >
        <X className="h-5 w-5" />
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[88vh] w-auto overflow-hidden rounded-2xl shadow-2xl ring-2 ring-[#FDE68A]/40"
      >
        <Image
          src={hiResImage(doctor.poster, 1600)}
          alt={`Affiche ${doctor.name}`}
          width={1200}
          height={1600}
          quality={100}
          unoptimized
          className="h-auto max-h-[88vh] w-auto object-contain"
        />
      </motion.div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Lightbox vidéo                                                            */
/* -------------------------------------------------------------------------- */

function VideoLightbox({
  doctor,
  onClose,
}: {
  doctor: Doctor
  onClose: () => void
}) {
  const tc = useTranslations('common')
  const locale = useLocale()
  const videos = doctor.videos || []
  const [index, setIndex] = useState(0)
  const current = videos[index]
  const accent = doctor.accent || '#006633'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={tc('close')}
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/30"
      >
        <X className="h-5 w-5" />
      </button>

      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl"
      >
        <div className="mb-3 flex flex-col items-center text-center">
          <span
            className="mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg backdrop-blur-sm"
            style={{ backgroundColor: `${accent}E6` }}
          >
            <GraduationCap className="h-3.5 w-3.5 text-[#FDE68A]" />
            {locale === 'ar' ? 'فيديو تعليمي' : 'Vidéo éducative'}
          </span>
          <h3 className="text-lg font-bold text-white">{doctor.name}</h3>
          <p className="text-sm text-white/70">{doctor.specialty}</p>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-2 ring-[#FDE68A]/40">
          {current && (
            <UniversalPlayer
              key={current}
              url={current}
              playing
              controls
              className="absolute inset-0 h-full w-full"
            />
          )}
        </div>

        {videos.length > 1 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {videos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Vidéo ${i + 1}`}
                className={`h-9 min-w-[2.25rem] rounded-full px-3 text-sm font-semibold transition-colors ${
                  i === index
                    ? 'bg-white text-slate-900'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Section principale                                                         */
/* -------------------------------------------------------------------------- */

interface SectionContent {
  badge?: string
  badge_ar?: string
  title?: string
  title_ar?: string
  subtitle?: string
  subtitle_ar?: string
  accentColor?: string
}

export default function DoctorsShowcase({ data, sectionContent }: { data?: any[], sectionContent?: SectionContent }) {
  const t = useTranslations('doctors')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const [active, setActive] = useState<Doctor | null>(null)
  const [videoDoctor, setVideoDoctor] = useState<Doctor | null>(null)
  const list = resolveDoctors(data, locale)
  
  const sectionAccent = sectionContent?.accentColor || '#006633'

  return (
    <section
      id="medecins"
      className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24"
    >
      {/* Décor d'ambiance dynamique */}
      <div 
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full blur-[130px]" 
        style={{ backgroundColor: `${sectionAccent}26` }}
      />
      <div 
        className="pointer-events-none absolute -bottom-32 left-0 h-96 w-96 rounded-full blur-[130px]" 
        style={{ backgroundColor: `${sectionAccent}1A` }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <AnimatedSection animation="fade" className="mb-14 text-center">
          <div className="animate-item">
            <span 
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold leading-normal"
              style={{ 
                color: sectionAccent, 
                backgroundColor: `${sectionAccent}0D`, 
                borderColor: `${sectionAccent}33` 
              }}
            >
              <Sparkles className="h-4 w-4" />
              {isAr ? (sectionContent?.badge_ar || sectionContent?.badge || t('badge')) : (sectionContent?.badge || t('badge'))}
            </span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              {locale === 'ar' ? (
                <LineReveal className="text-gradient">
                  {sectionContent?.title_ar || sectionContent?.title ? (
                    (sectionContent?.title_ar || sectionContent?.title) as string
                  ) : (
                    <>{t('titleLine1')} <span className="text-foreground">{t('titleLine2')}</span></>
                  )}
                </LineReveal>
              ) : (
                <>
                  {sectionContent?.title ? (
                    <LineReveal className="text-gradient">{sectionContent.title}</LineReveal>
                  ) : (
                    <>
                      <LineReveal className="text-gradient">{t('titleLine1')}</LineReveal>
                      <br />
                      <LineReveal className="text-foreground" delay={0.12}>{t('titleLine2')}</LineReveal>
                    </>
                  )}
                </>
              )}
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              {isAr ? (sectionContent?.subtitle_ar || sectionContent?.subtitle || t('subtitle')) : (sectionContent?.subtitle || t('subtitle'))}
            </p>
          </div>
        </AnimatedSection>

        {/* Grille (flex centré : s'équilibre quel que soit le nombre de médecins) */}
        <div className="relative">
          {/* Fondu droit — indicateur de scroll mobile */}
          <div className="pointer-events-none absolute bottom-8 right-0 top-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:hidden" aria-hidden="true" />

          <div className="flex flex-nowrap overflow-x-auto pb-8 snap-x snap-proximity touch-pan-x gap-4 overscroll-x-contain sm:gap-6 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0 sm:snap-none sm:touch-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {list.map((doctor, i) => (
              <div
                key={doctor.id}
                className="w-[85vw] shrink-0 snap-center sm:w-[calc(50%-0.75rem)] sm:shrink lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)]"
              >
                <DoctorCard doctor={doctor} index={i} onOpen={setActive} onPlay={setVideoDoctor} sectionAccent={sectionAccent} />
              </div>
            ))}
          </div>

          {/* Hint textuel swipe — mobile uniquement */}
          <p className="mt-1 text-center text-xs text-muted-foreground/60 sm:hidden" aria-hidden="true">
            {isAr ? '← اسحب لمزيد من الأطباء' : 'Glisser pour voir tous les médecins →'}
          </p>
        </div>
      </div>

      {/* Lightbox affiche */}
      <AnimatePresence>
        {active && <PosterLightbox doctor={active} onClose={() => setActive(null)} />}
      </AnimatePresence>

      {/* Lightbox vidéo */}
      <AnimatePresence>
        {videoDoctor && <VideoLightbox doctor={videoDoctor} onClose={() => setVideoDoctor(null)} />}
      </AnimatePresence>
    </section>
  )
}
