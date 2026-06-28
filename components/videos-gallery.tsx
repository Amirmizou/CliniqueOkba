'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Film, Stethoscope } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { urlFor } from '@/sanity/lib/image'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { AnimatedSection } from '@/components/ui/animated-section'
import { LineReveal } from '@/components/ui/reveal-text'
import { UniversalPlayer } from '@/components/ui/universal-player'

const EASE = [0.22, 1, 0.36, 1] as const

interface VideoItem {
  _id: string
  title?: string
  description?: string
  videoUrl?: string
  category?: string
  poster?: any
  doctor?: {
    _id: string
    name: string
    name_ar?: string
    image?: any
    specialty?: string
    specialty_ar?: string
    accentColor?: string
  }
}

export default function VideosGallery({ data }: { data?: VideoItem[] }) {
  const t = useTranslations('videosGallery')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const prefersReducedMotion = useReducedMotion()

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)

  // Filtrer uniquement les vidéos publiées avec URL
  const availableVideos = (data || []).filter((v) => v.videoUrl)

  // Écoute de l'événement global pour la sélection d'un médecin
  useEffect(() => {
    const handleSelectDoctor = (e: CustomEvent<{ doctorId: string }>) => {
      setSelectedCategory('all')
      setSelectedDoctorId(e.detail.doctorId)
      setIsPlaying(false)
      
      // Trouver la première vidéo du médecin
      const firstDocVideoIndex = availableVideos.filter((v) => v.doctor?._id === e.detail.doctorId).length > 0 ? 0 : -1
      if (firstDocVideoIndex !== -1) {
        setActiveIndex(0)
      }
    }
    
    window.addEventListener('select-doctor-video', handleSelectDoctor as EventListener)
    return () => window.removeEventListener('select-doctor-video', handleSelectDoctor as EventListener)
  }, [availableVideos])

  const videos = availableVideos.filter((v) => {
    const matchCat = selectedCategory === 'all' || v.category === selectedCategory
    const matchDoc = !selectedDoctorId || v.doctor?._id === selectedDoctorId
    return matchCat && matchDoc
  })

  // Extraire les catégories uniques
  const uniqueCategories = Array.from(
    new Set(availableVideos.map((v) => v.category).filter(Boolean))
  ) as string[]
  const categoriesList = ['all', ...uniqueCategories]

  // Extraire les médecins uniques
  const uniqueDoctorsMap = new Map()
  availableVideos.forEach(v => {
    if (v.doctor) {
      uniqueDoctorsMap.set(v.doctor._id, v.doctor)
    }
  })
  const uniqueDoctors = Array.from(uniqueDoctorsMap.values())

  if (availableVideos.length === 0) return null

  // Sécurité si on filtre et que l'index sort des limites
  const active = videos[activeIndex] || videos[0]

  const posterUrl = (v: VideoItem, w = 1600, h = 900) =>
    v.poster ? urlFor(v.poster).width(w).height(h).url() : undefined

  const doctorImageUrl = (doc: any) =>
    doc?.image ? urlFor(doc.image).width(120).height(120).url() : undefined

  const selectVideo = (index: number) => {
    if (index === activeIndex) return
    setIsPlaying(false)
    setActiveIndex(index)
  }

  const play = () => {
    setIsPlaying(true)
  }

  return (
    <section id="videos" className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24">
      {/* Décor d'ambiance */}
      <div className="pointer-events-none absolute -top-32 left-0 h-96 w-96 rounded-full bg-brand-green/12 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-brand-gold/15 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <AnimatedSection animation="fade" className="mb-12 text-center">
          <div className="animate-item">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold leading-normal text-primary">
              <Film className="h-4 w-4" />
              {t.has('badge') ? t('badge') : 'Espace Éducatif'}
            </span>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              {isAr ? (
                <LineReveal className="text-gradient">
                  {t.has('titleLine1') ? t('titleLine1') : 'Bibliothèque'} <span className="text-foreground">{t.has('titleLine2') ? t('titleLine2') : 'Médicale'}</span>
                </LineReveal>
              ) : (
                <>
                  <LineReveal className="text-gradient">{t.has('titleLine1') ? t('titleLine1') : 'Bibliothèque'}</LineReveal>
                  <br />
                  <LineReveal className="text-foreground" delay={0.12}>{t.has('titleLine2') ? t('titleLine2') : 'Médicale'}</LineReveal>
                </>
              )}
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              {t.has('subtitle') ? t('subtitle') : 'Découvrez nos vidéos éducatives et conseils médicaux.'}
            </p>
          </div>
        </AnimatedSection>

        {/* Filtres par médecins (Miniatures) */}
        {uniqueDoctors.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-3">
             <button
                type="button"
                onClick={() => {
                  setSelectedDoctorId(null)
                  setActiveIndex(0)
                  setIsPlaying(false)
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  selectedDoctorId === null
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Tous les médecins
              </button>
            {uniqueDoctors.map((doc) => (
              <button
                key={doc._id}
                type="button"
                onClick={() => {
                  setSelectedDoctorId(doc._id)
                  setSelectedCategory('all')
                  setActiveIndex(0)
                  setIsPlaying(false)
                }}
                className={`group flex items-center gap-2 rounded-full pe-4 ps-1.5 py-1.5 text-sm font-semibold transition-all duration-300 ${
                  selectedDoctorId === doc._id
                    ? 'bg-primary text-white shadow-lg ring-2 ring-primary ring-offset-2'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {doctorImageUrl(doc) ? (
                  <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white/20">
                    <Image src={doctorImageUrl(doc)!} alt={doc.name} fill className="object-cover" sizes="28px" />
                  </div>
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10">
                    <Stethoscope className="h-3.5 w-3.5" />
                  </div>
                )}
                <span>{isAr ? doc.name_ar || doc.name : doc.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Filtres de catégorie classiques */}
        {categoriesList.length > 2 && selectedDoctorId === null && (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat)
                  setActiveIndex(0)
                  setIsPlaying(false)
                }}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {t.has(`categories.${cat}`) ? t(`categories.${cat}`) : cat}
              </button>
            ))}
          </div>
        )}

        {/* Lecteur principal */}
        {videos.length > 0 ? (
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
                    <UniversalPlayer
                      url={active.videoUrl!}
                      playing={true}
                      controls={true}
                      className="h-full w-full object-contain bg-black"
                      onEnded={() => setIsPlaying(false)}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={play}
                      aria-label={t.has('play') ? t('play') : 'Lecture'}
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

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Info du Médecin si présente */}
                      {active.doctor && (
                        <div className="absolute left-5 top-5 z-20 flex items-center gap-3 rounded-full bg-black/40 p-1.5 pe-4 backdrop-blur-md border border-white/10 sm:left-8 sm:top-8">
                           {doctorImageUrl(active.doctor) ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-primary">
                              <Image src={doctorImageUrl(active.doctor)!} alt={active.doctor.name} fill className="object-cover" sizes="40px" />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                              <Stethoscope className="h-5 w-5" />
                            </div>
                          )}
                          <div className="text-start">
                            <span className="block text-xs font-bold text-white shadow-sm sm:text-sm">
                              {isAr ? active.doctor.name_ar || active.doctor.name : active.doctor.name}
                            </span>
                            {(active.doctor.specialty || active.doctor.specialty_ar) && (
                              <span className="block text-[10px] text-white/80 sm:text-xs">
                                {isAr ? active.doctor.specialty_ar || active.doctor.specialty : active.doctor.specialty}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Bouton lecture */}
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

                      {/* Titre */}
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
        ) : (
          <div className="flex h-64 items-center justify-center rounded-[2rem] border-2 border-dashed border-primary/20 bg-primary/5 text-center">
            <p className="text-muted-foreground">{t.has('noVideos') ? t('noVideos') : 'Aucune vidéo disponible pour ce médecin.'}</p>
          </div>
        )}

        {/* Rail de miniatures */}
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
                    {isActive && (
                      <span className="absolute start-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute h-full w-full animate-ping rounded-full bg-white/80" />
                          <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
                        </span>
                        {t.has('nowPlaying') ? t('nowPlaying') : 'En cours'}
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
