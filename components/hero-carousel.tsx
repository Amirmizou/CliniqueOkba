'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Phone, Play } from 'lucide-react'
import Image from 'next/image'

interface HeroSlide {
    id: string
    image: string
    title: string
    subtitle: string
    order: number
    active: boolean
}

export default function HeroCarousel() {
    const [slides, setSlides] = useState<HeroSlide[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const loadSlides = async () => {
            try {
                const res = await fetch('/api/admin/hero-slides', { cache: 'no-store' })
                if (res.ok) {
                    const data = await res.json()
                    const activeSlides = data
                        .filter((s: HeroSlide) => s.active)
                        .sort((a: HeroSlide, b: HeroSlide) => a.order - b.order)
                    setSlides(activeSlides)
                }
            } catch (error) {
                console.error('Failed to load hero slides:', error)
            }
        }
        loadSlides()
    }, [])

    // Auto-play carousel with progress tracking
    useEffect(() => {
        if (!isAutoPlaying || slides.length === 0) return

        setProgress(0)
        const duration = 7000 // 7 seconds
        const interval = 50 // Update every 50ms for smooth progress
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

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length)
        setProgress(0)
        setIsAutoPlaying(false)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
        setProgress(0)
        setIsAutoPlaying(false)
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
        setProgress(0)
        setIsAutoPlaying(false)
    }

    if (slides.length === 0) {
        return (
            <section className='relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10'>
                <div className='text-center px-4'>
                    <h1 className='text-4xl md:text-6xl font-bold mb-4'>Clinique OKBA</h1>
                    <p className='text-lg md:text-xl text-muted-foreground'>Votre santé, notre priorité</p>
                </div>
            </section>
        )
    }

    const currentSlide = slides[currentIndex]

    return (
        <section
            id="home"
            className='relative min-h-screen flex items-center justify-center overflow-hidden'
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Background Images with Fade Transition */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className='absolute inset-0 z-0'
                >
                    {/* Main Image */}
                    <div className='relative w-full h-full'>
                        <Image
                            src={currentSlide.image}
                            alt={currentSlide.title}
                            fill
                            className='object-cover object-center'
                            priority
                            sizes="100vw"
                            unoptimized={true}
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                    <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10' />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className='relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center'>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className='text-white max-w-3xl py-8 sm:py-0'
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="mb-3 sm:mb-4 inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Excellence Médicale
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className='text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight leading-[1.1] drop-shadow-lg'
                        >
                            {currentSlide.title}
                        </motion.h1>
                        {currentSlide.subtitle && (
                            <motion.p
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className='text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 font-light drop-shadow-md max-w-2xl leading-relaxed'
                            >
                                {currentSlide.subtitle}
                            </motion.p>
                        )}
                        {/* Double CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                        >
                            <button
                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group bg-primary hover:bg-primary/90 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                Prendre Rendez-vous
                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                            <button
                                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-medium text-sm sm:text-base transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center justify-center gap-2"
                            >
                                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                                Découvrir la clinique
                            </button>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows - Hidden on mobile */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className='hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all items-center justify-center group'
                        aria-label='Previous slide'
                    >
                        <ChevronLeft className='h-6 w-6 text-white transition-transform group-hover:-translate-x-0.5' />
                    </button>
                    <button
                        onClick={nextSlide}
                        className='hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all items-center justify-center group'
                        aria-label='Next slide'
                    >
                        <ChevronRight className='h-6 w-6 text-white transition-transform group-hover:translate-x-0.5' />
                    </button>
                </>
            )}

            {/* Progress Bar Indicators */}
            {slides.length > 1 && (
                <div className='absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30'>
                    <div className="flex gap-2 bg-black/30 backdrop-blur-md px-4 py-3 rounded-full border border-white/10">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className="relative h-1.5 w-8 sm:w-12 bg-white/20 rounded-full overflow-hidden transition-all hover:bg-white/30"
                                aria-label={`Go to slide ${index + 1}`}
                            >
                                {index === currentIndex && (
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-white rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                )}
                                {index < currentIndex && (
                                    <div className="absolute inset-0 bg-white/60 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}
