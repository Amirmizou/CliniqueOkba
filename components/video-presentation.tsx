'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { UniversalPlayer } from '@/components/ui/universal-player'
import { useTranslations } from 'next-intl'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { urlFor } from '@/sanity/lib/image'

interface SectionContent {
  badge?: string
  title?: string
  subtitle?: string
  videoUrl?: string
  videoPoster?: any
}

const EASE = [0.22, 1, 0.36, 1] as const

export default function VideoPresentation({
  sectionContent,
}: {
  sectionContent?: SectionContent
}) {
  const t = useTranslations('videoSection')
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)
  // Lecture auto une seule fois par visite (pas de relance auto au re-scroll)
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false)

  // Détection d'entrée dans la vue → déclenche la lecture auto
  // (cible la section : déclenche quand ~40 % est visible)
  const inView = useInView(sectionRef, { amount: 0.4 })

  // Progression de défilement : pilote la transition blanc → noir (cinéma)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  })

  // Mouvements pilotés par le scroll
  const videoScale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
  const videoY = useTransform(scrollYProgress, [0, 1], [80, 0])
  const headerY = useTransform(scrollYProgress, [0, 1], [40, 0])
  const watermarkY = useTransform(scrollYProgress, [0, 1], [120, -40])
  const watermarkOpacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 0.07])

  // Parallax de sortie
  const { scrollYProgress: exitProgress } = useScroll({
    target: sectionRef,
    offset: ['center center', 'end start'],
  })
  const exitY = useTransform(exitProgress, [0, 1], [0, -60])

  // Vidéo : Sanity prioritaire, repli local
  const videoSrc = sectionContent?.videoUrl || '/videos/clinique-okba-promo.mp4'
  const posterSrc = sectionContent?.videoPoster
    ? urlFor(sectionContent.videoPoster).url() // LCP Fix : on utilise directement le CDN Sanity optimisé
    : '/_next/image?url=%2Fvideos%2Fpromo-poster.png&w=1080&q=75' // LCP Fix : on force Next.js à compresser cette image lourde en WebP

  // Lecture automatique UNE SEULE FOIS quand la vidéo entre dans la vue
  useEffect(() => {
    if (prefersReducedMotion) return
    if (inView && !hasAutoPlayed) {
      setIsPlaying(true)
      setHasAutoPlayed(true)
    } else if (!inView) {
      setIsPlaying(false)
    }
  }, [inView, hasAutoPlayed, prefersReducedMotion])

  const togglePlay = () => {
    console.log('[Video Debug] togglePlay clicked. Current state:', isPlaying)
    setHasInteracted(true)
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setHasInteracted(true)
    setIsMuted(!isMuted)
  }

  console.log('[Video Debug] VideoPresentation rendering. videoSrc:', videoSrc, 'isPlaying:', isPlaying)

  return (
    <section
      ref={sectionRef}
      id="video"
      className="relative w-full overflow-hidden bg-background py-20 sm:py-24 md:py-28"
      style={{ position: 'relative' }}
    >
      {/* ---------- Décor d'ambiance ---------- */}
      {/* Filigrane logo géant en parallax */}
      {!prefersReducedMotion && (
        <motion.div
          style={{ y: watermarkY, opacity: watermarkOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[60vw] max-h-[760px] w-[60vw] max-w-[760px] -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        >
          <Image src="/logo.png" alt="" fill sizes="(max-width: 768px) 80vw, 50vw" className="object-contain" />
        </motion.div>
      )}

      {/* Faisceaux lumineux façon projecteur */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-1/4 left-1/4 h-[40rem] w-[18rem] -rotate-[18deg] bg-gradient-to-b from-emerald-400/10 via-emerald-400/5 to-transparent blur-2xl"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-1/4 right-1/4 h-[40rem] w-[16rem] rotate-[16deg] bg-gradient-to-b from-[#FDE68A]/10 via-[#FDE68A]/5 to-transparent blur-2xl"
            animate={{ opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </>
      )}

      <div className="relative z-10 mx-auto w-full max-w-[1700px]">
        {/* ---------- En-tête + logo proéminent ---------- */}
        <motion.div
          style={prefersReducedMotion ? undefined : { y: headerY }}
          className="mb-12 flex flex-col items-center px-4 text-center sm:px-6"
        >
          {/* Logo proéminent, révélation spectaculaire */}
          <motion.div
            initial={{ opacity: 0, scale: 0.4, rotate: -12 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ type: 'spring', stiffness: 160, damping: 14 }}
            className="relative mb-6 h-28 w-28 sm:h-32 sm:w-32"
          >
            {/* Halo pulsé */}
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(253,230,138,0.6), rgba(0,102,51,0.45) 55%, transparent 72%)',
              }}
              animate={
                prefersReducedMotion
                  ? undefined
                  : { opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.12, 0.95] }
              }
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Anneau conique en rotation */}
            <motion.div
              className="absolute -inset-2 rounded-full"
              style={{
                background:
                  'conic-gradient(from 0deg, #006633, #4caf6e, #FDE68A, #006633)',
                WebkitMask:
                  'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))',
              }}
              animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />
            {/* Médaillon logo */}
            <motion.div
              className="absolute inset-[10%] overflow-hidden rounded-full bg-white shadow-2xl ring-1 ring-black/10"
              animate={prefersReducedMotion ? undefined : { y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src="/logo.png"
                alt="Clinique OKBA"
                fill
                sizes="128px"
                className="object-contain p-3"
                priority
              />
            </motion.div>
          </motion.div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {sectionContent?.badge || t('badge')}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            {sectionContent?.title || (
              <>
                {t('titlePrefix')}{' '}
                <span
                  style={{
                    background:
                      'linear-gradient(90deg, #006633 0%, #4caf6e 55%, #FDE68A 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Clinique OKBA
                </span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {sectionContent?.subtitle || t('subtitle')}
          </p>
        </motion.div>

        {/* ---------- Lecteur vidéo pleine largeur ---------- */}
        <motion.div style={prefersReducedMotion ? undefined : { y: exitY }}>
          <motion.div
            style={prefersReducedMotion ? undefined : { scale: videoScale, y: videoY }}
            className="relative px-0 sm:px-6"
          >
            {/* Cadre à bordure conique animée */}
            <div className="group relative overflow-hidden rounded-none p-[2px] sm:rounded-[2rem]">
              {/* Bordure dégradé qui tourne */}
              {!prefersReducedMotion && (
                <motion.div
                  aria-hidden
                  className="absolute inset-[-40%] z-0"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0deg, #006633 60deg, #4caf6e 120deg, #FDE68A 180deg, transparent 240deg)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
              )}

              <div className="relative z-10 overflow-hidden rounded-none bg-black shadow-2xl sm:rounded-[1.9rem]">
                <UniversalPlayer
                  url={videoSrc}
                  poster={posterSrc}
                  muted={isMuted}
                  loop={false}
                  controls={false}
                  playing={isPlaying}
                  className="aspect-video max-h-[88vh] w-full cursor-pointer object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onClick={togglePlay}
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Voile dégradé pour lisibilité des contrôles */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Cadres d'angle cinématographiques */}
                {[
                  'left-4 top-4 border-l-2 border-t-2',
                  'right-4 top-4 border-r-2 border-t-2',
                  'left-4 bottom-4 border-l-2 border-b-2',
                  'right-4 bottom-4 border-r-2 border-b-2',
                ].map((pos) => (
                  <span
                    key={pos}
                    aria-hidden
                    className={`pointer-events-none absolute h-7 w-7 rounded-[3px] border-[#FDE68A]/70 ${pos}`}
                  />
                ))}

                {/* Indicateur lecture auto / REC */}
                <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    {isPlaying && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    )}
                    <span
                      className={`relative inline-flex h-2 w-2 rounded-full ${isPlaying ? 'bg-red-500' : 'bg-white/60'}`}
                    />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90">
                    {isPlaying ? 'En lecture' : 'En pause'}
                  </span>
                </div>

                {/* Gros bouton lecture central (quand en pause) */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.button
                      type="button"
                      onClick={togglePlay}
                      aria-label="Lire la vidéo"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 z-20 flex items-center justify-center"
                    >
                      <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md ring-1 ring-white/30 transition-transform hover:scale-110">
                        {!prefersReducedMotion && (
                          <span className="absolute inset-0 animate-ping rounded-full bg-white/20" />
                        )}
                        <Play className="ml-1 h-9 w-9 fill-white" />
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Contrôles bas droite */}
                <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Mettre en pause' : 'Lire'}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md ring-1 ring-white/20 transition-colors hover:bg-black/60"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="ml-0.5 h-5 w-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                    className="group/sound relative flex h-11 items-center gap-2 rounded-full bg-black/40 px-3 text-white backdrop-blur-md ring-1 ring-white/20 transition-colors hover:bg-black/60"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                    {/* Invite à activer le son tant que muet et non touché */}
                    {isMuted && !hasInteracted && (
                      <span className="hidden text-xs font-semibold sm:inline">
                        Activer le son
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
