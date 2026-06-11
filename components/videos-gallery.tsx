'use client'

/**
 * Vidéothèque — section dédiée aux vidéos téléversées par l'admin dans
 * Sanity Studio (schéma `video`). Lecteur principal cinématique + rail de
 * miniatures pour changer de vidéo. La section ne s'affiche que s'il existe
 * au moins une vidéo active (Sanity-first, aucun repli local).
 */

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Film } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { urlFor } from '@/sanity/lib/image'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { AnimatedSection } from '@/components/ui/animated-section'
import { LineReveal } from '@/components/ui/reveal-text'

const EASE = [0.22, 1, 0.36, 1] as const

interface VideoItem {
  _id: string
  title?: string
  description?: string
  videoUrl?: string
  poster?: any
}

export default function VideosGallery({ data }: { data?: VideoItem[] }) {
  const t = useTranslations('videosGallery')
  const prefersReducedMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)

  const videos = (data || []).filter((v) => v.videoUrl)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Sanity-first strict : pas de vidéos publiées → pas de section
  if (videos.length === 0) return null

  const active = videos[activeIndex]
  const posterUrl = (v: VideoItem, w = 1600, h = 900) =>
    v.poster ? urlFor(v.poster).width(w).height(h).url() : undefined

  const selectVideo = (index: number) => {
    if (index === activeIndex) return
    setIsPlaying(false)
    setActiveIndex(index)
  }

  const play = () => {
    setIsPlaying(true)
    // Lance la lecture après le rendu du <video> avec controls
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}))
  }

  return (
    <section id="videos" className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24">
      {/* Décor d'ambiance (langage visuel des autres sections) */}
      <div className="pointer-events-none absolute -top-32 left-0 h-96 w-96 rounded-full bg-[#006633]/12 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#FDE68A]/15 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <AnimatedSection animation="fade" className="mb-12 text-center">
          <div className="animate-item">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              <Film className="h-4 w-4" />
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

        {/* Lecteur principal — cadre à bordure conique animée (signature du site) */}
        <div className="group relative overflow-hidden rounded-[2rem] p-[2px]">
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden
              className="absolute inset-[-40%] z-0"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, #006633 60deg, #4caf6e 120deg, #FDE68A 180deg, transparent 240deg)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
          )}

          <div className="relative z-10 overflow-hidden rounded-[1.9rem] bg-black shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active._id}
                initial={{ opacity: 0, scale: 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="relative aspect-video w-full"
              >
                {isPlaying ? (
                  <video
                    ref={videoRef}
                    src={active.videoUrl}
                    poster={posterUrl(active)}
                    controls
                    playsInline
                    preload="metadata"
                    onEnded={() => setIsPlaying(false)}
                    className="h-full w-full object-contain"
                    aria-label={active.title}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={play}
                    aria-label={t('play')}
                    className="group/play relative block h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FDE68A]/60"
                  >
                    {posterUrl(active) ? (
                      <Image
                        src={posterUrl(active)!}
                        alt={active.title || ''}
                        fill
                        sizes="(max-width: 1280px) 100vw, 1280px"
                        className="object-cover transition-transform duration-700 group-hover/play:scale-[1.02]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00271a] via-[#003a22] to-[#001b10]" />
                    )}

                    {/* Voile de lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Bouton lecture — halo pulsé */}
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
                        {!prefersReducedMotion && (
                          <span className="absolute inset-0 animate-ping rounded-full bg-white/20" style={{ animationDuration: '2.2s' }} />
                        )}
                        <span className="relative flex h-full w-full items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-[#006633]/80">
                          <Play className="ms-1 h-8 w-8 fill-white text-white sm:h-10 sm:w-10" />
                        </span>
                      </span>
                    </span>

                    {/* Titre + description sur l'affiche */}
                    <span className="absolute inset-x-0 bottom-0 block p-5 text-start sm:p-8">
                      {active.title && (
                        <span
                          className="block text-xl font-bold text-white sm:text-2xl md:text-3xl"
                          style={{ textShadow: '0 2px 18px rgba(0,0,0,0.6)' }}
                        >
                          {active.title}
                        </span>
                      )}
                      {active.description && (
                        <span className="mt-2 block max-w-2xl text-sm font-light text-white/85 sm:text-base">
                          {active.description}
                        </span>
                      )}
                    </span>
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Rail de miniatures (si plusieurs vidéos) */}
        {videos.length > 1 && (
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
            {videos.map((video, index) => {
              const isActive = index === activeIndex
              return (
                <motion.button
                  key={video._id}
                  type="button"
                  onClick={() => selectVideo(index)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE, delay: index * 0.06 }}
                  className={`group/thumb relative w-44 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 text-start transition-all duration-300 sm:w-56 ${
                    isActive
                      ? 'border-primary shadow-lg shadow-primary/25'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={video.title}
                  aria-current={isActive}
                >
                  <span className="relative block aspect-video w-full bg-muted">
                    {posterUrl(video, 448, 252) ? (
                      <Image
                        src={posterUrl(video, 448, 252)!}
                        alt={video.title || ''}
                        fill
                        sizes="224px"
                        className="object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#00271a] to-[#003a22]">
                        <Film className="h-6 w-6 text-white/50" />
                      </span>
                    )}
                    {/* Badge lecture en cours */}
                    {isActive && (
                      <span className="absolute start-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute h-full w-full animate-ping rounded-full bg-white/80" />
                          <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
                        </span>
                        {t('nowPlaying')}
                      </span>
                    )}
                  </span>
                  {video.title && (
                    <span className="block truncate bg-card px-3 py-2.5 text-xs font-semibold text-foreground sm:text-sm">
                      {video.title}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
