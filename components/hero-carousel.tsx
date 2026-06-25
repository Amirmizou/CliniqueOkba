'use client'

import { useState, useEffect, useRef } from 'react'
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
} from 'framer-motion'
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Phone,
    CalendarHeart,
    Play,
    Pause,
} from 'lucide-react'
import { UniversalPlayer } from '@/components/ui/universal-player'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { urlFor, sanityImageLoader } from '@/sanity/lib/image'
import { siteConfig } from '@/data/site-config'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { AnimatedLogo } from '@/components/ui/animated-logo'
import { WordReveal } from '@/components/ui/reveal-text'
import { Magnetic } from '@/components/ui/magnetic'

// Courbe d'easing forte (sortie) — plus de « punch » que les easings CSS par défaut
const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface HeroCarouselProps {
    slides?: any[]
    siteSettings?: {
        clinicName?: string
        clinicName_ar?: string
        whatsappNumber?: string
        appointmentMessage?: string
        appointmentMessage_ar?: string
        phone?: string
        hours?: { emergency?: string; weekdays?: string; saturday?: string }
        heroStats?: { value?: string; label?: string }[]
    }
    sectionContent?: {
        badge?: string
        badge_ar?: string
        title?: string
        title_ar?: string
        subtitle?: string
        subtitle_ar?: string
    }
}

export default function HeroCarousel({ slides: rawSlides = [], siteSettings, sectionContent }: HeroCarouselProps) {
    const t = useTranslations('hero')
    const locale = useLocale()
    const isAr = locale === 'ar'

    const slides = rawSlides
        .map((slide, index) => ({
            id: slide._id || String(index),
            title: isAr ? (slide.title_ar || slide.title) : slide.title,
            subtitle: isAr ? (slide.subtitle_ar || slide.subtitle) : (slide.subtitle || ''),
            image: slide.image ? urlFor(slide.image).url() : '',
            videoUrl: slide.videoUrl || '',
        }))
        .filter((slide) => slide.image !== '' || slide.videoUrl !== '')

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [progress, setProgress] = useState(0)
    const prefersReducedMotion = useReducedMotion()
    const heroRef = useRef<HTMLElement>(null)

    /* Parallax doux au scroll (Framer) */
    const { scrollY } = useScroll()
    const yImage = useTransform(scrollY, [0, 800], [0, 140])
    const yContent = useTransform(scrollY, [0, 600], [0, 90])
    const contentOpacity = useTransform(scrollY, [0, 480], [1, 0])

    /* Téléphone pour le CTA « Appeler » (Sanity sinon config locale) */
    const phoneDisplay = (siteSettings?.phone || siteConfig.contact.phone).split('/')[0].trim()
    const phoneHref = `tel:${phoneDisplay.replace(/[^+\d]/g, '')}`

    /* Auto-play */
    useEffect(() => {
        if (!isAutoPlaying || slides.length <= 1) return
        setProgress(0)
        const duration = 7000
        const interval = 50
        let elapsed = 0
        const timer = setInterval(() => {
            elapsed += interval
            setProgress((elapsed / duration) * 100)
            if (elapsed >= duration) {
                setCurrentIndex((prev) => (prev + 1) % slides.length)
                elapsed = 0
                setProgress(0)
            }
        }, interval)
        return () => clearInterval(timer)
    }, [isAutoPlaying, slides.length, currentIndex])

    const goTo = (index: number) => {
        setCurrentIndex((index + slides.length) % slides.length)
        setProgress(0)
        setIsAutoPlaying(false)
    }

    const toggleAutoPlay = () => setIsAutoPlaying((prev) => !prev)

    const scrollToId = (id: string) =>
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

    // Prise de rendez-vous : ouvre WhatsApp si configuré, sinon scroll vers Contact
    const handleBooking = () => {
        const defaultClinicName = isAr ? 'المصحة الطبية عقبة' : 'la Clinique OKBA'
        const clinicName = isAr ? (siteSettings?.clinicName_ar || siteSettings?.clinicName) : siteSettings?.clinicName
        const clinic = clinicName || defaultClinicName
        const defaultIntro = isAr 
            ? `مرحباً ${clinic}، أرغب في حجز موعد.`
            : `Bonjour ${clinic}, je souhaite prendre un rendez-vous.`
        const intro = isAr
            ? (siteSettings?.appointmentMessage_ar || siteSettings?.appointmentMessage?.trim())
            : (siteSettings?.appointmentMessage?.trim())
        
        const finalIntro = intro || defaultIntro
        const url = buildWhatsAppUrl(siteSettings?.whatsappNumber, finalIntro)
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer')
        } else {
            scrollToId('contact')
        }
    }

    /* Fallback si aucune slide */
    if (slides.length === 0) {
        return (
            <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5">
                <div className="px-4 text-center">
                    <h1 className="mb-4 text-4xl font-bold md:text-6xl">
                        {isAr ? (siteSettings?.clinicName_ar || siteSettings?.clinicName || 'المصحة الطبية عقبة') : (siteSettings?.clinicName || 'Clinique OKBA')}
                    </h1>
                    <p className="text-lg text-muted-foreground md:text-xl">
                        {isAr ? (sectionContent?.subtitle_ar || sectionContent?.subtitle || 'صحتك، أولويتنا') : (sectionContent?.subtitle || 'Votre santé, notre priorité')}
                    </p>
                </div>
            </section>
        )
    }

    const currentSlide = slides[currentIndex]

    /* H1 FIXE (SEO + marque stable) — ne change pas à chaque slide */
    const heroTitle = isAr
        ? (sectionContent?.title_ar || sectionContent?.title || siteSettings?.clinicName_ar || siteSettings?.clinicName || 'المصحة الطبية عقبة')
        : (sectionContent?.title || siteSettings?.clinicName || 'Clinique OKBA')

    /* Ligne animée par slide (le titre/sous-titre de la slide devient le message tournant) */
    const slideLine = currentSlide.subtitle || currentSlide.title || ''

    /* Chips de réassurance : Sanity (heroStats) sinon valeurs par défaut bilingues */
    const trustChips =
        siteSettings?.heroStats && siteSettings.heroStats.length > 0
            ? siteSettings.heroStats.slice(0, 3).filter((s) => s?.value)
            : isAr
                ? [
                      { value: '24/7', label: 'الإسعافات' },
                      { value: '+6', label: 'أقطاب تميز' },
                      { value: 'SPECT/CT', label: 'تصوير متطور' },
                  ]
                : [
                      { value: '24/7', label: 'Urgences' },
                      { value: '+6', label: "Pôles d'excellence" },
                      { value: 'SPECT/CT', label: 'Imagerie de pointe' },
                  ]

    return (
        <section
            ref={heroRef}
            id="home"
            className="relative flex min-h-[58dvh] lg:min-h-[62dvh] flex-col overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            // Accessibilité clavier : suspendre le défilement auto quand un
            // élément du hero reçoit le focus, reprendre quand il le perd.
            onFocusCapture={() => setIsAutoPlaying(false)}
            onBlurCapture={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setIsAutoPlaying(true)
                }
            }}
        >
            {/* ---------------------------------------------------------- */}
            {/*  Couche image (parallax + ken burns une direction)         */}
            {/* ---------------------------------------------------------- */}
            <motion.div
                style={prefersReducedMotion ? undefined : { y: yImage }}
                className="absolute inset-0 z-0"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <motion.div
                            initial={prefersReducedMotion || !!currentSlide.videoUrl ? undefined : { scale: 1.04 }}
                            animate={prefersReducedMotion || !!currentSlide.videoUrl ? undefined : { scale: 1 }}
                            transition={{ duration: 10, ease: 'easeOut' }}
                            className="relative h-full w-full"
                        >
                            {currentSlide.videoUrl ? (
                                <UniversalPlayer
                                    url={currentSlide.videoUrl}
                                    playing={isAutoPlaying}
                                    muted={true}
                                    loop={true}
                                    controls={false}
                                    className="absolute left-0 top-0 h-full w-full object-cover"
                                />
                            ) : (
                                <Image
                                    loader={sanityImageLoader}
                                    src={currentSlide.image}
                                    alt={currentSlide.title || 'Clinique OKBA'}
                                    fill
                                    className="object-cover object-center"
                                    priority
                                    quality={82}
                                    sizes="100vw"
                                    unoptimized={false}
                                />
                            )}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Scrim de lisibilité — gradient latéral doux côté contenu, vignette basse légère */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/55 via-slate-900/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent" />
                {/* Fondu bas vers le fond (transition vers la vague) */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />



                {/* Texture grille de points (subtile, masquée vers la zone de texte) */}
                <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage:
                            'radial-gradient(currentColor 1px, transparent 1px)',
                        backgroundSize: '26px 26px',
                        color: 'white',
                        maskImage:
                            'radial-gradient(ellipse 75% 60% at 28% 42%, black, transparent 72%)',
                        WebkitMaskImage:
                            'radial-gradient(ellipse 75% 60% at 28% 42%, black, transparent 72%)',
                    }}
                />
            </motion.div>

            {/* ---------------------------------------------------------- */}
            {/*  Contenu principal                                         */}
            {/* ---------------------------------------------------------- */}
            <motion.div
                style={prefersReducedMotion ? undefined : { y: yContent, opacity: contentOpacity }}
                className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pt-10 pb-16 sm:px-6 lg:px-8"
            >
                <div className="grid w-full items-center gap-10 lg:grid-cols-12">
                    {/* Colonne texte */}
                    <div className="lg:col-span-7">
                        {/* Logo animé (motion graphic) */}
                        <AnimatedLogo className="mb-6" size={96} />

                        {/* Badge (fixe) */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md sm:text-sm"
                        >
                            {isAr ? (sectionContent?.badge_ar || sectionContent?.badge || t('badge')) : (sectionContent?.badge || t('badge'))}
                        </motion.div>

                        {/* Titre H1 FIXE (SEO + marque) — révélation mot à mot au montage */}
                        <h1
                            style={{ textShadow: '0 2px 28px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.7)' }}
                            className="text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
                        >
                            <WordReveal text={heroTitle} mode="mount" delay={0.2} />
                        </h1>

                        {/* Filet dégradé signature (épuré) */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5, duration: 0.7, ease: EASE_OUT }}
                            className="mt-5 h-1 w-32 origin-left rounded-full bg-gradient-to-r from-[#006633] to-[#FDE68A]"
                        />

                        {/* Message animé par slide (réserve de hauteur → pas de saut de mise en page) */}
                        <div className="mt-5 min-h-[3.5rem] max-w-xl sm:min-h-[4rem]">
                            <AnimatePresence mode="wait">
                                {slideLine && (
                                    <motion.p
                                        key={currentIndex}
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.5, ease: EASE_OUT }}
                                        style={{ textShadow: '0 1px 14px rgba(0,0,0,0.55)' }}
                                        className="text-base font-light leading-relaxed text-white/90 sm:text-lg"
                                    >
                                        {slideLine}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Chips de réassurance (confiance above-the-fold) */}
                        <motion.ul
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 flex flex-wrap gap-2"
                        >
                            {trustChips.map((c, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + i * 0.07, duration: 0.28 }}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-2 backdrop-blur-md"
                                    style={{ background: 'rgba(255,255,255,0.12)' }}
                                >
                                    <span className="text-sm font-extrabold tabular-nums text-[#FDE68A] leading-none">{c.value}</span>
                                    <span className="h-3 w-px bg-white/25" aria-hidden="true" />
                                    <span className="text-[11px] font-medium text-white/90 leading-none">{c.label}</span>
                                </motion.li>
                            ))}
                        </motion.ul>

                        {/* CTAs (fixe) */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center"
                        >
                            <Magnetic className="w-full sm:w-fit">
                                <button
                                    onClick={handleBooking}
                                    className="group relative inline-flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#006633] shadow-lg transition duration-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 active:scale-[0.98] sm:w-auto sm:text-base touch-target"
                                >
                                    <CalendarHeart className="h-5 w-5" />
                                    {t('cta.appointment')}
                                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </Magnetic>

                            <a
                                href={phoneHref}
                                className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:border-white/50 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30 active:scale-[0.97] sm:w-auto sm:text-base touch-target"
                            >
                                <Phone className="h-5 w-5 text-emerald-300" />
                                {t('cta.call')}
                            </a>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* ---------------------------------------------------------- */}
            {/*  Navigation slides (verticale, à droite)                   */}
            {/* ---------------------------------------------------------- */}
            {slides.length > 1 && (
                <div className="absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
                    <button
                        onClick={() => goTo(currentIndex - 1)}
                        aria-label="Slide précédente"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                    >
                        <ChevronLeft className="h-5 w-5 rotate-90" />
                    </button>

                    <div className="flex flex-col gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goTo(index)}
                                aria-label={`Aller à la slide ${index + 1}`}
                                className="relative h-8 w-1.5 overflow-hidden rounded-full bg-white/25 transition-colors hover:bg-white/40"
                            >
                                {index === currentIndex && (
                                    <span
                                        className="absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-[#FDE68A] to-[#006633]"
                                        style={{ height: `${progress}%` }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => goTo(currentIndex + 1)}
                        aria-label="Slide suivante"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                    >
                        <ChevronRight className="h-5 w-5 rotate-90" />
                    </button>

                    {/* Bouton pause/play — WCAG 2.2.2 */}
                    <button
                        onClick={toggleAutoPlay}
                        aria-label={isAutoPlaying ? 'Mettre en pause' : 'Reprendre'}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    >
                        {isAutoPlaying
                            ? <Pause className="h-4 w-4" />
                            : <Play className="h-4 w-4 ms-0.5" />
                        }
                    </button>
                </div>
            )}

            {/* Indicateurs mobiles (en bas) */}
            {slides.length > 1 && (
                <div className="absolute bottom-28 left-1/2 z-30 -translate-x-1/2 md:hidden">
                    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-md">
                        {/* Bouton pause/play (WCAG 2.2.2) */}
                        <button
                            onClick={toggleAutoPlay}
                            aria-label={isAutoPlaying ? 'Mettre en pause le diaporama' : 'Reprendre le diaporama'}
                            className="me-1 flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                        >
                            {isAutoPlaying
                                ? <Pause className="h-3 w-3" />
                                : <Play className="h-3 w-3 ms-0.5" />
                            }
                        </button>
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goTo(index)}
                                aria-label={`Aller à la slide ${index + 1}`}
                                aria-current={index === currentIndex ? 'true' : undefined}
                                className="flex h-8 min-w-[20px] items-center justify-center px-1"
                            >
                                <span className={`block h-1.5 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                        ? 'w-8 bg-gradient-to-r from-[#006633] to-[#FDE68A]'
                                        : 'w-3 bg-white/30'
                                }`} />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ---------------------------------------------------------- */}
            {/*  Indice de scroll (invite à explorer)                      */}
            {/* ---------------------------------------------------------- */}
            <button
                onClick={() => scrollToId('about')}
                aria-label={isAr ? 'انتقل للأسفل' : 'Défiler vers le bas'}
                className="group absolute bottom-12 left-1/2 z-30 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-1 text-white/70 transition-colors hover:text-white md:flex"
            >
                <span className="text-[10px] font-medium uppercase tracking-[0.2em]">{isAr ? 'اكتشف' : 'Découvrir'}</span>
                <motion.span
                    animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <ChevronDown className="h-5 w-5" />
                </motion.span>
            </button>

            {/* ---------------------------------------------------------- */}
            {/*  Signature ECG (ligne de vie) au bas du hero               */}
            {/* ---------------------------------------------------------- */}
            <div className="pointer-events-none absolute bottom-0 left-0 z-10 w-full overflow-hidden leading-[0]">
                <svg
                    className="relative block h-10 w-full text-[#FDE68A]/45"
                    preserveAspectRatio="none"
                    viewBox="0 0 1200 100"
                >
                    <motion.path
                        d="M0,50 L420,50 L440,20 L460,80 L480,50 L520,50 L540,35 L560,65 L580,50 L1200,50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: 'easeInOut', delay: 0.6 }}
                    />
                </svg>
            </div>
        </section>
    )
}
