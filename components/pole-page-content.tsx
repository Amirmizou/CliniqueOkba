'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Stethoscope,
  Phone,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Play,
  Activity,
  Layers,
  Clock,
} from 'lucide-react'
import { Link } from '@/navigation'
import { ECGLine, ecgVariantForIcon } from '@/components/ui/ecg-line'
import { PoleMotif, motifVariantForIcon } from '@/components/ui/pole-motif'
import { urlFor, hiResImage, sanityImageLoader } from '@/sanity/lib/image'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import {
  ImagerieIcon,
  DentaireIcon,
  ConsultationsIcon,
  UrgencesIcon,
  LaboratoireIcon,
  ChirurgieIcon,
  NucleaireIcon,
} from '@/components/icons/custom-pole-icons'
import { CLINIC_WHATSAPP } from '@/data/doctors'

const ICONS: Record<string, any> = {
  ScanLine: ImagerieIcon,
  Smile: DentaireIcon,
  Stethoscope: ConsultationsIcon,
  Siren: UrgencesIcon,
  FlaskConical: LaboratoireIcon,
  Eye: ChirurgieIcon,
  Radiation: NucleaireIcon,
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export interface PolePhoto {
  id: string
  src: string
  title: string
  description?: string
}

export interface PoleVideo {
  title?: string
  videoUrl?: string
  poster?: any
}

export interface PolePageData {
  slug: string
  title: string
  description: string
  intro?: string
  items: string[]
  iconName: string
  accent: string
  badge?: string
  urgent?: boolean
  videos?: PoleVideo[]
}

export default function PolePageContent({
  pole,
  photos,
  phone,
  equipments,
}: {
  pole: PolePageData
  photos: PolePhoto[]
  phone: string
  equipments?: any[]
}) {
  const t = useTranslations('polePage')
  const tc = useTranslations('common')
  const tv = useTranslations('videosGallery')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const prefersReducedMotion = useReducedMotion()
  const [index, setIndex] = useState<number | null>(null)

  const Icon = ICONS[pole.iconName] || Stethoscope
  const ecgVariant = ecgVariantForIcon(pole.iconName)
  const motif = motifVariantForIcon(pole.iconName)

  const videos = (pole.videos || []).filter((v) => v.videoUrl)
  const [activeVideo, setActiveVideo] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const posterUrlOf = (v?: PoleVideo, w = 1600, h = 900) =>
    v?.poster ? urlFor(v.poster).width(w).height(h).url() : undefined
  const current = videos[activeVideo]
  const selectVideo = (i: number) => {
    if (i === activeVideo) return
    setVideoPlaying(false)
    setActiveVideo(i)
  }

  const go = useCallback(
    (dir: number) => {
      setIndex((i) => (i === null ? i : (i + dir + photos.length) % photos.length))
    },
    [photos.length],
  )

  useEffect(() => {
    if (index === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIndex(null)
      if (e.key === 'ArrowRight') go(isAr ? -1 : 1)
      if (e.key === 'ArrowLeft') go(isAr ? 1 : -1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, go, isAr])

  const waMessage = encodeURIComponent(
    isAr
      ? `مرحباً، أرغب في حجز موعد في قسم ${pole.title} بعيادة OKBA.`
      : `Bonjour, je souhaite prendre rendez-vous au ${pole.title} à la Clinique OKBA.`,
  )

  const hasMedia = photos.length > 0 || videos.length > 0

  return (
    <>
      {/* ══════════════════════════════════ HERO ══════════════════════════════════ */}
      <section className="relative overflow-hidden bg-background">
        {/* Accent edge stripe */}
        <div
          className={`absolute inset-y-0 z-20 w-1.5 ${isAr ? 'right-0' : 'left-0'}`}
          style={{ background: pole.accent }}
        />

        <PoleMotif variant={motif} color={pole.accent} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10 sm:pb-24 sm:pt-14 lg:px-8">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <ArrowLeft className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
            {t('backHome')}
          </Link>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* ── Left: Content ── */}
            <motion.div
              initial={{ opacity: 0, x: isAr ? 24 : -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-start"
            >
              {/* "Pôle actif" status chip */}
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white"
                style={{ backgroundColor: pole.accent }}
              >
                {!prefersReducedMotion && (
                  <span className="relative flex h-2 w-2">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"
                      style={{ animationDuration: '2s' }}
                    />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                )}
                {t('poleActive')}
              </div>

              {/* Large layered icon badge */}
              <div className="relative mb-6 h-20 w-20">
                <div
                  aria-hidden="true"
                  className="absolute -inset-2 rounded-[1.5rem] opacity-30 blur-2xl"
                  style={{ background: pole.accent }}
                />
                <div
                  className="relative flex h-full w-full items-center justify-center rounded-[1.375rem] text-white"
                  style={{
                    background: `linear-gradient(140deg, ${pole.accent}d0 0%, ${pole.accent} 100%)`,
                    boxShadow: `0 8px 32px ${pole.accent}50, inset 0 1.5px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.12)`,
                  }}
                >
                  <Icon className="h-10 w-10 drop-shadow-sm" />
                </div>
              </div>

              {/* Title */}
              <h1 className="mb-4 text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">
                {pole.title}
              </h1>

              {/* ECG signal */}
              <div className="mb-5 h-9 w-full max-w-xs">
                <ECGLine color={pole.accent} height={36} variant={ecgVariant} />
              </div>

              {/* Badge */}
              {pole.badge && (
                <div className="mb-5">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold"
                    style={{ backgroundColor: `${pole.accent}18`, color: pole.accent }}
                  >
                    {pole.urgent && (
                      <span className="relative flex h-2 w-2">
                        <span
                          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                          style={{ backgroundColor: pole.accent, animationDuration: '1.4s' }}
                        />
                        <span
                          className="relative inline-flex h-2 w-2 rounded-full"
                          style={{ backgroundColor: pole.accent }}
                        />
                      </span>
                    )}
                    {pole.badge}
                  </span>
                </div>
              )}

              {/* Intro */}
              <p className="mb-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {pole.intro || pole.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
                  style={{ backgroundColor: pole.accent }}
                >
                  <Phone className="h-4 w-4" />
                  {t('bookAppointment')}
                </a>
                <a
                  href={`https://wa.me/${CLINIC_WHATSAPP}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-[#22c55e] active:scale-[0.97]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </a>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground/80 transition-colors duration-200 hover:bg-foreground/5 active:scale-[0.97]"
                >
                  {t('locate')}
                </Link>
              </div>
            </motion.div>

            {/* ── Right: Featured photo with scan beam ── */}
            {hasMedia && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto w-full max-w-lg lg:max-w-none"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-border/50">
                  <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />
                  {photos.length > 0 ? (
                    <Image
                      loader={sanityImageLoader}
                      src={photos[0].src}
                      alt={pole.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="bg-muted/30 object-cover"
                      priority
                    />
                  ) : (
                    <Image
                      loader={sanityImageLoader}
                      src={posterUrlOf(videos[0]) || ''}
                      alt={pole.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="bg-muted/30 object-cover"
                      priority
                    />
                  )}
                  {/* Scan beam — one-shot on page load, evoking medical imaging */}
                  {!prefersReducedMotion && (
                    <motion.div
                      className="absolute inset-x-0 z-20 h-px"
                      style={{
                        background: `linear-gradient(90deg, transparent 0%, ${pole.accent}bb 40%, ${pole.accent} 50%, ${pole.accent}bb 60%, transparent 100%)`,
                        boxShadow: `0 0 8px 2px ${pole.accent}50`,
                      }}
                      initial={{ top: '0%', opacity: 0 }}
                      animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 2.8, delay: 0.9, ease: 'linear' }}
                    />
                  )}
                </div>
                {/* Decorative offset frame */}
                <div
                  className={`absolute -bottom-3 ${isAr ? '-left-3' : '-right-3'} -z-10 h-full w-full rounded-3xl border-2 opacity-40`}
                  style={{ borderColor: pole.accent }}
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ VITAL STRIP ══════════════════════════════ */}
      <section className="border-y border-border/30 py-8" style={{ backgroundColor: `${pole.accent}08` }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            className={`grid grid-cols-2 gap-6 ${equipments && equipments.length > 0 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-3xl font-black tabular-nums" style={{ color: pole.accent }}>
                  {pole.items.length}
                </span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t('prestationsLabel')}
              </span>
            </motion.div>

            {equipments && equipments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.06 }}
                className="flex flex-col items-center gap-1 text-center"
              >
                <span className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-3xl font-black tabular-nums" style={{ color: pole.accent }}>
                    {equipments.length}
                  </span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t('equipmentsLabel')}
                </span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-3xl font-black tabular-nums" style={{ color: pole.accent }}>
                  {pole.urgent ? '24/7' : '7j/7'}
                </span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t('availableLabel')}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ PRESTATIONS ══════════════════════════════ */}
      {pole.items.length > 0 && (
        <section className="bg-background py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="mb-10 text-2xl font-bold sm:text-3xl">{t('prestationsSection')}</h2>
            {/* Numbered grid with hairline bg-border/20 separators */}
            <div className="overflow-hidden rounded-2xl border border-border/30 bg-border/20">
              <div className="grid gap-px bg-border/20 sm:grid-cols-2 lg:grid-cols-3">
                {pole.items.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.35, delay: (i % 3) * 0.06 }}
                    className="flex items-start gap-4 bg-background px-6 py-5"
                  >
                    <span
                      className="mt-0.5 shrink-0 text-lg font-black tabular-nums leading-none"
                      style={{ color: `${pole.accent}70` }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-semibold leading-snug text-foreground/90">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ECG divider before media sections */}
      {hasMedia && (
        <div className="h-10 w-full overflow-hidden opacity-50">
          <ECGLine color={pole.accent} height={40} variant={ecgVariant} />
        </div>
      )}

      {/* ════════════════════════════════ VIDÉOS ══════════════════════════════════ */}
      {videos.length > 0 && current && (
        <section className="bg-background py-14 sm:py-16">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold sm:text-3xl">{t('inVideo')}</h2>

            <div className="group relative overflow-hidden rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-border/50">
              <div className="relative z-10 overflow-hidden rounded-[2rem] bg-black">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeVideo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="relative aspect-video w-full"
                  >
                    {videoPlaying ? (
                      <video
                        src={current.videoUrl}
                        poster={posterUrlOf(current)}
                        controls
                        autoPlay
                        playsInline
                        preload="metadata"
                        onEnded={() => setVideoPlaying(false)}
                        className="h-full w-full object-contain"
                        aria-label={current.title || pole.title}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setVideoPlaying(true)}
                        aria-label={tv('play')}
                        className="group/play relative block h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                      >
                        {posterUrlOf(current) ? (
                          <Image
                            loader={sanityImageLoader}
                            src={posterUrlOf(current)!}
                            alt={current.title || pole.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 1024px"
                            className="object-cover transition-transform duration-700 group-hover/play:scale-[1.02]"
                          />
                        ) : (
                          <div
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(135deg, ${pole.accent}, #001b10)` }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
                            {!prefersReducedMotion && (
                              <span
                                className="absolute inset-0 animate-ping rounded-full bg-white/20"
                                style={{ animationDuration: '2.2s' }}
                              />
                            )}
                            <span className="relative flex h-full w-full items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md transition-all duration-300 group-hover/play:scale-110">
                              <Play className="ms-1 h-8 w-8 fill-white text-white sm:h-10 sm:w-10" />
                            </span>
                          </span>
                        </span>
                        {current.title && (
                          <span
                            className="absolute inset-x-0 bottom-0 block p-5 text-start text-lg font-bold text-white sm:p-6 sm:text-xl"
                            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.6)' }}
                          >
                            {current.title}
                          </span>
                        )}
                      </button>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {videos.length > 1 && (
              <div className="mt-5 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
                {videos.map((v, i) => {
                  const isActive = i === activeVideo
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectVideo(i)}
                      aria-current={isActive}
                      aria-label={v.title || `${tv('play')} ${i + 1}`}
                      className={`group/thumb relative w-40 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 text-start transition-all duration-300 sm:w-52 ${
                        isActive ? 'shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      style={isActive ? { borderColor: pole.accent } : undefined}
                    >
                      <span className="relative block aspect-video w-full bg-muted">
                        {posterUrlOf(v, 416, 234) ? (
                          <Image
                            loader={sanityImageLoader}
                            src={posterUrlOf(v, 416, 234)!}
                            alt={v.title || ''}
                            fill
                            sizes="208px"
                            className="object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                          />
                        ) : (
                          <span
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(135deg, ${pole.accent}, #001b10)` }}
                          />
                        )}
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <Play className="ms-0.5 h-4 w-4 fill-white text-white" />
                          </span>
                        </span>
                      </span>
                      {v.title && (
                        <span className="block truncate bg-card px-3 py-2 text-xs font-semibold text-foreground">
                          {v.title}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════════════════════════════ GALERIE ═════════════════════════════════ */}
      {photos.length > 0 && (
        <section className="bg-muted/20 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold sm:text-3xl">{t('inImages')}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((p, i) => (
                <motion.button
                  key={p.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative block overflow-hidden rounded-2xl text-left shadow-lg ring-1 ring-black/5"
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      loader={sanityImageLoader}
                      src={p.src}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                      <ZoomIn className="h-4 w-4" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="text-base font-bold text-white drop-shadow">{p.title}</h3>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════ ÉQUIPEMENTS ═════════════════════════════ */}
      {equipments && equipments.length > 0 && (
        <section className="relative overflow-hidden bg-background py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t('equipments')}
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t('capabilities')}</p>
            </div>

            <div className="space-y-16">
              {equipments.map((eq, i) => (
                <motion.div
                  key={eq._id || i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex flex-col gap-8 md:items-center ${
                    i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                >
                  {/* Photo */}
                  <div className="w-full md:w-1/2">
                    {eq.image || eq.imageUrl ? (
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-muted shadow-2xl ring-1 ring-border/50">
                        <Image
                          loader={sanityImageLoader}
                          src={
                            eq.image
                              ? urlFor(eq.image).width(800).height(600).url()
                              : eq.imageUrl
                          }
                          alt={eq.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                        {eq.brand && (
                          <div
                            className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
                            style={{ backgroundColor: pole.accent }}
                          >
                            {eq.brand}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-muted/50 ring-1 ring-border/50">
                        <Icon className="h-20 w-20 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex w-full flex-col justify-center md:w-1/2 md:px-6">
                    <div className="mb-4">
                      {eq.brand && (
                        <span
                          className="mb-2 block text-sm font-bold uppercase tracking-wider"
                          style={{ color: pole.accent }}
                        >
                          {eq.brand}
                        </span>
                      )}
                      <h3 className="text-2xl font-bold text-foreground sm:text-3xl">{eq.name}</h3>
                      {eq.model && eq.model !== eq.name && (
                        <p className="mt-1 text-lg font-medium text-foreground/80">
                          Modèle : {eq.model}
                        </p>
                      )}
                    </div>
                    <p className="mb-8 leading-relaxed text-muted-foreground">{eq.description}</p>

                    {eq.features && eq.features.length > 0 && (
                      <div>
                        <h4 className="mb-4 font-semibold text-foreground">{t('capabilities')}</h4>
                        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {eq.features.map((feat: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <div
                                className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                                style={{
                                  backgroundColor: `${pole.accent}20`,
                                  color: pole.accent,
                                }}
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-foreground/90">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════ CLOSING CTA ═════════════════════════════ */}
      <section
        className="py-16 sm:py-24"
        style={{
          backgroundColor: `${pole.accent}0A`,
          borderTop: `1px solid ${pole.accent}20`,
        }}
      >
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-8 h-10 max-w-xs opacity-60">
            <ECGLine color={pole.accent} height={40} variant={ecgVariant} />
          </div>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            {t('ctaTitle')}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">{t('ctaSubtitle')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-xl transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
              style={{ backgroundColor: pole.accent }}
            >
              <Phone className="h-5 w-5" />
              {t('bookAppointment')}
            </a>
            <a
              href={`https://wa.me/${CLINIC_WHATSAPP}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-xl transition-all duration-200 hover:bg-[#22c55e] active:scale-[0.97]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ LIGHTBOX ════════════════════════════════ */}
      <AnimatePresence>
        {index !== null && photos[index] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIndex(null)}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setIndex(null)}
              aria-label={tc('close')}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/30"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                go(-1)
              }}
              aria-label={tc('previous')}
              className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/30 sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                go(1)
              }}
              aria-label={tc('next')}
              className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/30 sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={photos[index].id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-4xl flex-col"
              >
                <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src={hiResImage(photos[index].src)}
                    alt={photos[index].title}
                    width={2400}
                    height={1800}
                    quality={100}
                    unoptimized
                    className="h-auto max-h-[72vh] w-full object-contain"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold text-white sm:text-xl">
                    {photos[index].title}
                  </h3>
                  {photos[index].description && (
                    <p className="mx-auto mt-1 max-w-xl text-sm text-white/75">
                      {photos[index].description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-white/50">
                    {index + 1} / {photos.length}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
