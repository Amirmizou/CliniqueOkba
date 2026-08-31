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
  Award,
  Baby,
  Activity,
  Stethoscope,
  Ear,
  Heart,
  HeartPulse,
  Smile,
  FlaskConical,
  Brain,
  Bone,
  Eye,
  ScanLine,
  Microscope,
  TestTube,
  Dna,
  Droplet,
  Wind,
  Pill,
  Syringe,
  Scissors,
  Cross,
  Thermometer,
  Hand,
  Ribbon,
  Accessibility,
  PersonStanding,
  Footprints,
  type LucideIcon,
} from 'lucide-react'
import { doctors, CLINIC_WHATSAPP, CLINIC_PHONE, type Doctor } from '@/data/doctors'
import { urlFor, sanityImageLoader, hiResImage } from '@/sanity/lib/image'
import { AnimatedSection } from '@/components/ui/animated-section'
import { LineReveal } from '@/components/ui/reveal-text'
import { UniversalPlayer } from '@/components/ui/universal-player'
import { cn } from '@/lib/utils'
import SectionGlow from '@/components/ui/section-glow'
import SectionHeader from '@/components/ui/section-header'

/* Couverture thématique « laboratoire » — utilisée quand un médecin ne
   souhaite pas que sa photo soit partagée. Remplace l'affiche par un visuel
   propre et lisible lié au laboratoire (sans aucune photo). */
function DoctorLabCover({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #8B5CF6 0%, #4f46e5 46%, #1e1b4b 100%)' }} />
      {/* Trame de points (molécules) */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1.2px, transparent 1.2px)', backgroundSize: '24px 24px' }} />
      {/* Halos doux */}
      <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
      {/* Grande fiole centrale */}
      <div className="absolute inset-0 flex items-center justify-center">
        <FlaskConical className="h-28 w-28 text-white/25" strokeWidth={1.1} aria-hidden="true" />
      </div>
      {/* Badge « Laboratoire » */}
      <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white ring-1 ring-white/20 backdrop-blur-sm">
        <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </div>
    </div>
  )
}

// Résolution des icônes Sanity (chaîne -> composant Lucide).
// Couvre toutes les spécialités proposées dans le schéma Sanity (doctor.iconName).
const ICONS: Record<string, LucideIcon> = {
  Baby,
  Activity,
  Stethoscope,
  Ear,
  Heart,
  HeartPulse,
  Smile,
  FlaskConical,
  Brain,
  Bone,
  Eye,
  ScanLine,
  Microscope,
  TestTube,
  Dna,
  Droplet,
  Wind,
  Pill,
  Syringe,
  Scissors,
  Cross,
  Thermometer,
  Hand,
  Ribbon,
  Accessibility,
  PersonStanding,
  Footprints,
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

/* Dictionnaire local par nom : sert à COMPLÉTER une fiche Sanity dont certains
   champs (spécialité, prestations…) ne sont pas encore renseignés. On ne
   remplit que ce qui manque — Sanity reste prioritaire quand il est rempli. */
const LOCAL_BY_NAME = new Map<string, Doctor>()
for (const d of doctors) LOCAL_BY_NAME.set(normalizeKey(d.name), d)

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

/** Sanitise a video URL — Sanity's URL field can contain duplicated/concatenated
 *  URLs when the user pastes repeatedly. Extract the first valid URL. */
function sanitizeVideoUrl(raw: any): string | null {
  if (typeof raw !== 'string' || !raw) return null
  const match = raw.match(/https?:\/\/(?:(?!https?:\/\/)[^\s"'<>])+?\.(mp4|webm|mov|m4v)/ig)
    || raw.match(/https?:\/\/(?:(?!https?:\/\/)[^\s"'<>])+(?:youtube\.com|youtu\.be|facebook\.com|fb\.watch)[^\s"'<>]+/ig)

  if (match && match.length > 0) {
    // Return the shortest match to avoid accidentally matching concatenated garbage
    return match.reduce((shortest: string, current: string) => current.length < shortest.length ? current : shortest)
  }
  return raw.trim()
}

/** Convertit les médecins Sanity en Doctor[] (repli sur les données locales) */
function resolveDoctors(data: any[] | undefined, locale: string): Doctor[] {
  const base: Doctor[] =
    !data || data.length === 0
      ? doctors
      : data.map((d, i) => {
          // Complément local (par nom) pour les champs non renseignés dans Sanity.
          const normalizedSanityName = normalizeKey(d.name || '')
          let local = LOCAL_BY_NAME.get(normalizedSanityName)
          if (!local && normalizedSanityName.length > 2) {
            local = Array.from(LOCAL_BY_NAME.values()).find((doc) => {
              const localName = normalizeKey(doc.name)
              if (localName.includes(normalizedSanityName) || normalizedSanityName.includes(localName)) return true
              // Correspondance par mot-clé (ex: "Ferdi Nihed" matchera "Ferdi Rania Nihed")
              const sanityTokens = normalizedSanityName.split(' ').filter(Boolean)
              const localTokens = localName.split(' ').filter(Boolean)
              return sanityTokens.some(t => t.length > 2 && localTokens.includes(t))
            })
          }

          const sanityServices = Array.isArray(d.services)
            ? d.services.filter((s: unknown) => typeof s === 'string' && s.trim().length > 0)
            : []
            
          return {
            id: d._id || String(i),
            name: [d.title, d.name].filter(Boolean).join(' ').trim() || d.name,
            specialty: (d.specialty || '').trim() || local?.specialty || '',
            subtitle: (d.subtitle || '').trim() || local?.subtitle || undefined,
            services: sanityServices.length > 0 ? sanityServices : (local?.services || []),
            experience: (d.experience || '').trim() || local?.experience || undefined,
            customBadge: (d.customBadge || '').trim() || undefined,
            customBadge_ar: (d.customBadge_ar || '').trim() || undefined,
            days: (d.consultationDays || '').trim() || local?.days || '',
            hours: (d.consultationHours || '').trim() || local?.hours || '',
            poster: d.image ? urlFor(d.image).width(620).height(827).url() : (local?.poster || ''),
            icon: ICONS[d.iconName] || local?.icon || Stethoscope,
            accent: d.accentColor || local?.accent || '#006633',
            gradient: '',
            videos: Array.isArray(d.videos)
              ? d.videos.map(sanitizeVideoUrl).filter(Boolean) as string[]
              : [],
            phone: (d.phone || '').trim() || local?.phone,
          }
        })

  return locale === 'ar' ? base.map(toArabic) : base
}

function isDirector(doc: Doctor): boolean {
  const str = `${doc.name} ${doc.specialty} ${doc.subtitle} ${doc.customBadge}`.toLowerCase()
  return str.includes('directeur') || str.includes('direction')
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
  const director = isDirector(doctor)
  // On utilise la couleur propre au médecin (définie dans Sanity), 
  // sinon on utilise la couleur de section, ou le vert par défaut.
  // Si c'est le directeur, on force souvent une couleur plus "or" ou on garde son accent.
  const accent = director ? '#D97706' : (doctor.accent || sectionAccent || '#006633')
  const hasVideos = Array.isArray(doctor.videos) && doctor.videos.length > 0
  // Dr Aissaoui ne souhaite pas que sa photo soit partagée : on remplace
  // l'affiche par une couverture thématique « laboratoire » (et pas de zoom).
  const photoHidden = /aissaoui/i.test(doctor.name || '')
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
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white/95 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 dark:bg-slate-900/95",
          director 
            ? "border-amber-400/80 shadow-[0_10px_35px_rgba(245,158,11,0.22)] ring-2 ring-amber-400/50 hover:shadow-[0_16px_45px_rgba(245,158,11,0.35)]" 
            : "border-border/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-8px_var(--hover-glow)] dark:border-white/10 dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)]"
        )}
        style={{
          '--hover-glow': `${accent}33`,
          borderColor: !director ? `${accent}25` : undefined,
        } as React.CSSProperties}
      >
        {director && (
          <div className="absolute -right-12 top-6 z-30 rotate-45 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-1.5 text-center shadow-lg w-48 ring-1 ring-white/30">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-950 drop-shadow-sm flex items-center justify-center gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              {locale === 'ar' ? 'الإدارة الطبية' : 'Direction Médicale'}
            </span>
          </div>
        )}

        {/* ----- Affiche / Photo ----- */}
        <button
          type="button"
          onClick={photoHidden ? undefined : () => onOpen(doctor)}
          aria-label={photoHidden ? doctor.name : `Agrandir la photo de ${doctor.name}`}
          className={cn(
            'relative block aspect-[3/4] w-full overflow-hidden bg-slate-100 touch-manipulation dark:bg-slate-800',
            photoHidden ? 'cursor-default' : 'cursor-zoom-in',
          )}
        >
          {photoHidden ? (
            <DoctorLabCover label={locale === 'ar' ? 'المختبر الطبي' : 'Laboratoire médical'} />
          ) : (
            <Image
              loader={sanityImageLoader}
              src={doctor.poster}
              alt={`Photo ${doctor.name} – ${doctor.specialty}`}
              fill
              draggable={false}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] select-none"
            />
          )}

          {/* Liseré supérieur bicolore luxueux */}
          <div
            className="absolute inset-x-0 top-0 h-1.5 z-20"
            style={{ backgroundImage: `linear-gradient(90deg, ${accent}, #FDE68A 50%, ${accent})` }}
          />

          {/* Voile sombre bas avec dégradé doux pour une lisibilité parfaite */}
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />

          {/* Indice "agrandir" (sauf si la photo est masquée) */}
          {!photoHidden && (
            <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:scale-105 ring-1 ring-white/20">
              <Maximize2 className="h-4 w-4" />
            </div>
          )}

          {/* Spécialité, Nom + expérience (toujours visibles, posés sur le voile) */}
          <div
            className="absolute inset-x-0 bottom-0 p-5 text-left flex flex-col items-start z-10"
          >
            {/* Badge spécialité glassmorphism */}
            <div
              className="mb-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-md ring-1 ring-white/25"
              style={{ 
                backgroundColor: `${accent}E6`,
                boxShadow: `0 4px 12px ${accent}40`,
              }}
            >
              <Icon className="h-3.5 w-3.5 drop-shadow-sm" />
              <span>{doctor.specialty}</span>
            </div>
            
            <h3 className="text-lg sm:text-[1.2rem] font-bold leading-tight text-white drop-shadow-md">
              {doctor.name}
            </h3>
            {doctor.subtitle && (
              <p className="mt-0.5 text-xs sm:text-sm font-medium text-white/90 drop-shadow">
                {doctor.subtitle}
              </p>
            )}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {doctor.experience && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md ring-1 ring-white/20">
                  <Award className="h-3 w-3 text-amber-300" />
                  {doctor.experience}
                </span>
              )}
              {doctor.customBadge && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-200 to-yellow-300 px-2.5 py-0.5 text-[11px] font-bold text-slate-950 shadow-md">
                  <Sparkles className="h-3 w-3" />
                  {doctor.customBadge}
                </span>
              )}
            </div>
          </div>
        </button>

        {/* ─── Vidéo — affordances créatives (si le médecin a des vidéos) ─── */}
        {hasVideos && (
          <>
            {/* Badge animé toujours visible (mobile + desktop) — pastille play + pulse sonar */}
            <button
              type="button"
              onClick={() => onPlay(doctor)}
              aria-label={locale === 'ar' ? `مشاهدة فيديو ${doctor.name}` : `Voir la vidéo de ${doctor.name}`}
              className="group/play absolute left-3.5 top-3.5 z-20 inline-flex items-center gap-2 rounded-full bg-white/95 py-1.5 pl-1.5 pr-3 shadow-xl ring-1 ring-black/10 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 dark:bg-slate-900/95 dark:ring-white/15"
            >
              <span
                className="relative flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm"
                style={{ backgroundColor: accent }}
              >
                {/* Onde sonar */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: accent, opacity: 0.4 }}
                />
                <Play className="relative ml-0.5 h-3.5 w-3.5 fill-current" />
              </span>
              <span className="text-[11px] font-bold tracking-wide" style={{ color: accent }}>
                {locale === 'ar' ? 'فيديو' : 'Vidéo'}
              </span>
            </button>

            {/* Voile doux au survol (desktop) */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[9] hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block"
              style={{ background: 'radial-gradient(circle at 50% 42%, rgba(0,0,0,0.5), rgba(0,0,0,0.15) 60%, transparent 85%)' }}
            />
            {/* Gros bouton play centré (desktop) */}
            <div
              onClick={() => onPlay(doctor)}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[42%] z-10 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2.5 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100 sm:flex cursor-pointer"
            >
              <span 
                className="relative flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white/30 ring-2 ring-white/60 backdrop-blur-md shadow-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ boxShadow: `0 8px 30px ${accent}80` }}
              >
                <span aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-white/80 animate-ping" />
                <Play className="ml-1 h-7 w-7 fill-white text-white drop-shadow" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md shadow-lg ring-1 ring-white/20">
                <Play className="h-3 w-3 fill-amber-300 text-amber-300" />
                {locale === 'ar' ? 'شاهد الفيديو' : 'Voir la vidéo'}
              </span>
            </div>
          </>
        )}

        {/* ----- Panneau d'informations ----- */}
        <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
          {/* Services — badges interactifs */}
          {doctor.services.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {doctor.services.slice(0, 7).map((s) => (
                <span
                  key={s}
                  className="rounded-lg border px-2.5 py-1 text-[11px] font-medium text-foreground/85 transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    borderColor: `${accent}35`,
                    backgroundColor: `${accent}0D`,
                  }}
                >
                  {s}
                </span>
              ))}
              {doctor.services.length > 7 && (
                <span
                  className="rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-all"
                  style={{ 
                    borderColor: `${accent}45`, 
                    color: accent,
                    backgroundColor: `${accent}14`,
                  }}
                >
                  +{doctor.services.length - 7}
                </span>
              )}
            </div>
          )}

          {/* Horaires et jours de consultation */}
          {(doctor.days || doctor.hours) && (
            <div className="space-y-1.5 text-sm text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/40">
              {doctor.days && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0" style={{ color: accent }} />
                  <span className="text-xs sm:text-[13px] font-medium text-foreground/80">{doctor.days}</span>
                </div>
              )}
              {doctor.hours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" style={{ color: accent }} />
                  <span className="text-xs sm:text-[13px] font-medium text-foreground/80">{doctor.hours}</span>
                </div>
              )}
            </div>
          )}

          {/* CTAs */}
          <div className="mt-auto flex gap-2 pt-2">
            <a
              href={`https://wa.me/${CLINIC_WHATSAPP}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-95 touch-target"
              style={{ 
                background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`,
                boxShadow: `0 4px 14px 0 ${accent}45`,
              }}
            >
              {/* Reflet Shimmer au hover */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
              <MessageCircle className="h-4 w-4 relative z-10" />
              <span className="relative z-10">{t('bookShort')}</span>
            </a>
            <a
              href={`tel:${doctor.phone || CLINIC_PHONE}`}
              aria-label={t('callFor', { name: String(doctor.name ?? '') })}
              className="inline-flex items-center justify-center rounded-xl border border-border/80 bg-background px-3 py-2.5 text-foreground/80 shadow-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 touch-target min-w-[46px]"
              style={{ borderColor: `${accent}40` }}
            >
              <Phone className="h-4 w-4" style={{ color: accent }} />
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
  const videoUrl = doctor.videos?.[0]
  if (!videoUrl) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={tc('close')}
        className="absolute right-5 top-5 z-[110] flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/30"
      >
        <X className="h-5 w-5" />
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl aspect-video overflow-hidden rounded-2xl shadow-2xl bg-black"
      >
        <UniversalPlayer
          url={videoUrl}
          playing={true}
          controls={true}
          className="h-full w-full object-contain bg-black"
        />
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
  const [activeVideo, setActiveVideo] = useState<Doctor | null>(null)
  
  const list = resolveDoctors(data, locale).sort((a, b) => {
    const aDir = isDirector(a) ? 1 : 0
    const bDir = isDirector(b) ? 1 : 0
    return bDir - aDir // Director comes first
  })
  
  const handlePlayVideo = (doctor: Doctor) => {
    setActiveVideo(doctor)
  }
  
  const sectionAccent = sectionContent?.accentColor || '#006633'

  return (
    <section
      id="medecins"
      className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24"
    >
      {/* Décor d'ambiance dynamique — teinte pilotée par le pôle affiché */}
      <SectionGlow
        glows={[
          { at: '100% 0%', size: 384, color: sectionAccent, opacity: 0.15 },
          { at: '0% 100%', size: 384, color: sectionAccent, opacity: 0.1 },
        ]}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <AnimatedSection animation="fade">
          <SectionHeader
            className="animate-item mb-14"
            accent={sectionAccent}
            badgeIcon={<Sparkles className="h-4 w-4" />}
            badge={isAr ? (sectionContent?.badge_ar || sectionContent?.badge || t('badge')) : (sectionContent?.badge || t('badge'))}
            title={
              locale === 'ar' ? (
                <LineReveal className="text-gradient">
                  {sectionContent?.title_ar || sectionContent?.title ? (
                    (sectionContent?.title_ar || sectionContent?.title) as string
                  ) : (
                    <>{t('titleLine1')} <span className="text-foreground">{t('titleLine2')}</span></>
                  )}
                </LineReveal>
              ) : sectionContent?.title ? (
                <LineReveal className="text-gradient">{sectionContent.title}</LineReveal>
              ) : (
                <>
                  <LineReveal className="text-gradient">{t('titleLine1')}</LineReveal>
                  <br />
                  <LineReveal className="text-foreground" delay={0.12}>{t('titleLine2')}</LineReveal>
                </>
              )
            }
            subtitle={isAr ? (sectionContent?.subtitle_ar || sectionContent?.subtitle || t('subtitle')) : (sectionContent?.subtitle || t('subtitle'))}
          />
        </AnimatedSection>

        {/* Grille (flex centré : s'équilibre quel que soit le nombre de médecins) */}
        <div className="relative">
          {/* Fondu droit — indicateur de scroll mobile */}
          <div className="pointer-events-none absolute bottom-8 right-0 top-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:hidden" aria-hidden="true" />

          <div className="flex flex-nowrap overflow-x-auto pb-8 snap-x snap-proximity touch-pan-x touch-pan-y gap-4 overscroll-x-contain sm:gap-6 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0 sm:snap-none sm:touch-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {list.map((doctor, i) => (
              <div
                key={doctor.id}
                className="w-[85vw] shrink-0 snap-center sm:w-[calc(50%-0.75rem)] sm:shrink lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)]"
              >
                <DoctorCard doctor={doctor} index={i} onOpen={setActive} onPlay={handlePlayVideo} sectionAccent={sectionAccent} />
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
        {activeVideo && <VideoLightbox doctor={activeVideo} onClose={() => setActiveVideo(null)} />}
      </AnimatePresence>
    </section>
  )
}
