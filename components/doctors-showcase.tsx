'use client'

import { useRef, useState, type MouseEvent } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  X,
  Sparkles,
  Maximize2,
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
import { urlFor } from '@/sanity/lib/image'
import { AnimatedSection } from '@/components/ui/animated-section'
import { LineReveal } from '@/components/ui/reveal-text'

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
          days: d.consultationDays || '',
          hours: d.consultationHours || '',
          poster: d.image ? urlFor(d.image).width(620).height(827).url() : '',
          icon: ICONS[d.iconName] || Stethoscope,
          accent: d.accentColor || '#006633',
          gradient: '',
        }))

  return locale === 'ar' ? base.map(toArabic) : base
}

/* -------------------------------------------------------------------------- */
/*  Carte médecin 3D                                                          */
/* -------------------------------------------------------------------------- */

function DoctorCard({
  doctor,
  index,
  onOpen,
}: {
  doctor: Doctor
  index: number
  onOpen: (d: Doctor) => void
}) {
  const t = useTranslations('doctors')
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  // Suivi de la souris pour l'inclinaison 3D
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), {
    stiffness: 150,
    damping: 18,
  })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), {
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
    setHovered(false)
  }

  const Icon = doctor.icon
  const waMessage = encodeURIComponent(
    `Bonjour, je souhaite prendre rendez-vous avec ${doctor.name} (${doctor.specialty}) à la Clinique OKBA.`,
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-full"
      style={{ perspective: 1200 }}
    >
      {/* Halo coloré derrière la carte */}
      <div
        className="absolute -inset-2 rounded-[2rem] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
        style={{
          background: `radial-gradient(60% 60% at 50% 0%, ${doctor.accent}66, transparent 70%)`,
        }}
      />

      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/40 bg-white/70 shadow-xl ring-1 ring-[#006633]/15 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
      >
        {/* ----- Affiche ----- */}
        <button
          type="button"
          onClick={() => onOpen(doctor)}
          aria-label={`Agrandir la photo de ${doctor.name}`}
          className="relative block aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-[#006633] via-[#0a7a3f] to-[#FDE68A]"
        >
          <Image
            src={doctor.poster}
            alt={`Photo ${doctor.name} – ${doctor.specialty}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />

          {/* Voile de marque haut : le fond clair des portraits prend l'identité visuelle */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#006633]/35 via-[#006633]/10 to-transparent" />

          {/* Liseré doré supérieur (identité visuelle) */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#006633] via-[#FDE68A] to-[#006633]" />

          {/* Voile vert dégradé bas (lisibilité du nom + identité) */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#00401f] via-[#006633]/45 to-transparent" />

          {/* Indice "agrandir" */}
          <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
          </div>

          {/* Spécialité, Nom + expérience (toujours visibles, posés sur le voile) */}
          <div
            className="absolute inset-x-0 bottom-0 p-5 text-left flex flex-col items-start"
            style={{ transform: 'translateZ(30px)' }}
          >
            {/* Badge spécialité déplacé en bas pour ne pas cacher le visage */}
            <div
              className="mb-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
              style={{ backgroundColor: `${doctor.accent}E6` }}
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
            {doctor.experience && (
              <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-amber-400/95 px-2.5 py-1 text-[11px] font-bold text-amber-950 shadow">
                <Award className="h-3 w-3" />
                {doctor.experience}
              </span>
            )}
          </div>
        </button>

        {/* ----- Panneau d'informations ----- */}
        <div className="flex flex-1 flex-col gap-4 p-5">
          {/* Services */}
          <div className="flex flex-wrap gap-1.5">
            {doctor.services.slice(0, hovered ? doctor.services.length : 4).map((s) => (
              <span
                key={s}
                className="rounded-lg border px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                style={{
                  borderColor: `${doctor.accent}40`,
                  backgroundColor: `${doctor.accent}10`,
                }}
              >
                {s}
              </span>
            ))}
            {!hovered && doctor.services.length > 4 && (
              <span className="rounded-lg px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                +{doctor.services.length - 4}
              </span>
            )}
          </div>

          {/* Horaires */}
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" style={{ color: doctor.accent }} />
              <span>{doctor.days}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" style={{ color: doctor.accent }} />
              <span>{doctor.hours}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto flex gap-2 pt-1">
            <a
              href={`https://wa.me/${CLINIC_WHATSAPP}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.03] active:scale-95"
              style={{ backgroundColor: doctor.accent }}
            >
              <MessageCircle className="h-4 w-4" />
              {t('bookShort')}
            </a>
            <a
              href={`tel:${CLINIC_PHONE}`}
              aria-label={t('callFor', { name: doctor.name })}
              className="inline-flex items-center justify-center rounded-xl border px-3 py-2.5 text-foreground/80 transition-colors hover:bg-foreground/5"
              style={{ borderColor: `${doctor.accent}55` }}
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
      </motion.div>
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
          src={doctor.poster}
          alt={`Affiche ${doctor.name}`}
          width={620}
          height={827}
          className="h-auto max-h-[88vh] w-auto object-contain"
        />
      </motion.div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Section principale                                                         */
/* -------------------------------------------------------------------------- */

export default function DoctorsShowcase({ data }: { data?: any[] }) {
  const t = useTranslations('doctors')
  const locale = useLocale()
  const [active, setActive] = useState<Doctor | null>(null)
  const list = resolveDoctors(data, locale)

  return (
    <section
      id="medecins"
      className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24"
    >
      {/* Décor d'ambiance */}
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-[#006633]/15 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 left-0 h-96 w-96 rounded-full bg-[#FDE68A]/20 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <AnimatedSection animation="fade" className="mb-14 text-center">
          <div className="animate-item">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              {t('badge')}
            </span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              <LineReveal className="text-gradient">{t('titleLine1')}</LineReveal>
              <br />
              <LineReveal className="text-foreground" delay={0.12}>{t('titleLine2')}</LineReveal>
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              {t('subtitle')}
            </p>
          </div>
        </AnimatedSection>

        {/* Grille (flex centré : s'équilibre quel que soit le nombre de médecins) */}
        <div className="flex flex-wrap justify-center gap-6">
          {list.map((doctor, i) => (
            <div
              key={doctor.id}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)]"
            >
              <DoctorCard doctor={doctor} index={i} onOpen={setActive} />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active && <PosterLightbox doctor={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  )
}
