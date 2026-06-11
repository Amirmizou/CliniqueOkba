'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ScanLine,
  Smile,
  Stethoscope,
  Siren,
  FlaskConical,
  Eye,
  Radiation,
  Phone,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  type LucideIcon,
} from 'lucide-react'
import { Link } from '@/navigation'
import { ECGLine, ecgVariantForIcon } from '@/components/ui/ecg-line'
import { PoleMotif, motifVariantForIcon } from '@/components/ui/pole-motif'

const ICONS: Record<string, LucideIcon> = {
  ScanLine,
  Smile,
  Stethoscope,
  Siren,
  FlaskConical,
  Eye,
  Radiation,
}

export interface PolePhoto {
  id: string
  src: string
  title: string
  description?: string
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
}

export default function PolePageContent({
  pole,
  photos,
  phone,
}: {
  pole: PolePageData
  photos: PolePhoto[]
  phone: string
}) {
  const t = useTranslations('polePage')
  const tc = useTranslations('common')
  const [index, setIndex] = useState<number | null>(null)
  const Icon = ICONS[pole.iconName] || Stethoscope

  const go = useCallback(
    (dir: number) => {
      setIndex((i) =>
        i === null ? i : (i + dir + photos.length) % photos.length,
      )
    },
    [photos.length],
  )

  useEffect(() => {
    if (index === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIndex(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, go])

  return (
    <>
      {/* ----------------------------- HERO ----------------------------- */}
      <section className="relative overflow-hidden">
        {/* Décor */}
        <div
          className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full blur-[130px]"
          style={{ background: `${pole.accent}33` }}
        />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-[#FDE68A]/20 blur-[130px]" />

        {/* Motif animé propre au domaine du pôle */}
        <PoleMotif variant={motifVariantForIcon(pole.iconName)} color={pole.accent} />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backHome')}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start gap-6"
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg"
                style={{ backgroundColor: pole.accent }}
              >
                <Icon className="h-8 w-8" />
              </div>
              {pole.badge && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white"
                  style={{ backgroundColor: pole.accent }}
                >
                  {pole.urgent && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>
                  )}
                  {pole.badge}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              <span className="text-foreground">{pole.title}</span>
            </h1>

            {/* Signal ECG propre au pôle */}
            <div className="h-8 w-56">
              <ECGLine
                color={pole.accent}
                height={32}
                variant={ecgVariantForIcon(pole.iconName)}
              />
            </div>

            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {pole.intro || pole.description}
            </p>

            {/* Sous-spécialités */}
            <ul className="flex flex-wrap gap-2">
              {pole.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border px-3.5 py-1.5 text-sm font-medium text-foreground/80"
                  style={{
                    borderColor: `${pole.accent}40`,
                    backgroundColor: `${pole.accent}0D`,
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.03] active:scale-95"
                style={{ backgroundColor: pole.accent }}
              >
                <Phone className="h-4 w-4" />
                {t('bookAppointment')}
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground/80 transition-colors hover:bg-foreground/5"
              >
                {t('locate')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --------------------------- GALERIE --------------------------- */}
      {photos.length > 0 && (
        <section className="border-t border-border/50 bg-muted/20 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
              {t('inImages')}
            </h2>

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
                  className="group relative block overflow-hidden rounded-2xl text-left shadow-lg ring-1 ring-black/5"
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
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
                      <h3 className="text-base font-bold text-white drop-shadow">
                        {p.title}
                      </h3>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --------------------------- LIGHTBOX --------------------------- */}
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
                    src={photos[index].src}
                    alt={photos[index].title}
                    width={1280}
                    height={960}
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
