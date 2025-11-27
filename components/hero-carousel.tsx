'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlaying || slides.length === 0) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length)
        }, 7000) // 7 seconds

        return () => clearInterval(interval)
    }, [isAutoPlaying, slides.length])

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length)
        setIsAutoPlaying(false)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
        setIsAutoPlaying(false)
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
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
            className='relative min-h-screen flex items-center justify-center overflow-hidden'
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Background Images with Fade Transition */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className='absolute inset-0 z-0'
                >
                    {/* Blurred Background for Fill */}
                    <div className='absolute inset-0'>
                        <Image
                            src={currentSlide.image}
                            alt=""
                            fill
                            sizes="100vw"
                            className='object-cover blur-xl scale-110 opacity-50'
                            priority
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* Main Image - Contained */}
                    <div className='relative w-full h-full'>
                        <Image
                            src={currentSlide.image}
                            alt={currentSlide.title}
                            fill
                            className='object-contain object-center'
                            priority
                            sizes="100vw"
                        />
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
                            className="mb-3 sm:mb-4 inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground text-xs sm:text-sm font-medium relative z-10"
                        >
                            Excellence Médicale
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight leading-tight drop-shadow-lg'
                        >
                            {currentSlide.title}
                        </motion.h1>
                        {currentSlide.subtitle && (
                            <motion.p
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className='text-lg sm:text-xl md:text-2xl text-gray-100 mb-6 sm:mb-8 md:mb-10 font-light drop-shadow-md max-w-2xl'
                            >
                                {currentSlide.subtitle}
                            </motion.p>
                        )}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                        >
                            <button
                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/50 hover:scale-105 active:scale-95 flex items-center gap-2 min-h-[44px]"
                            >
                                Prendre Rendez-vous
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className='absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center'
                        aria-label='Previous slide'
                    >
                        <ChevronLeft className='h-5 w-5 sm:h-6 sm:w-6 text-white' />
                    </button>
                    <button
                        onClick={nextSlide}
                        className='absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center'
                        aria-label='Next slide'
                    >
                        <ChevronRight className='h-5 w-5 sm:h-6 sm:w-6 text-white' />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {slides.length > 1 && (
                <div className='absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2'>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2.5 sm:h-2 rounded-full transition-all min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center ${index === currentIndex
                                ? 'w-2.5 sm:w-8 bg-white'
                                : 'w-2.5 sm:w-2 bg-white/50 hover:bg-white/75 active:bg-white'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            <span className="sr-only">Slide {index + 1}</span>
                        </button>
                    ))}
                </div>
            )}
        </section>
    )
}
