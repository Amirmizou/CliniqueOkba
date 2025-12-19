'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Phone, Play, Heart, Activity, Shield, Stethoscope } from 'lucide-react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

// Register GSAP plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

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
    const prefersReducedMotion = useReducedMotion()

    // Refs for GSAP animations
    const heroRef = useRef<HTMLElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const ekgRef = useRef<SVGSVGElement>(null)
    const floatingIconsRef = useRef<HTMLDivElement>(null)

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

    // GSAP Scroll Animations
    useEffect(() => {
        if (prefersReducedMotion || !heroRef.current) return

        const ctx = gsap.context(() => {
            // Parallax effect on content
            if (contentRef.current) {
                gsap.to(contentRef.current, {
                    y: 100,
                    opacity: 0.5,
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1,
                    },
                })
            }

            // EKG line animation
            if (ekgRef.current) {
                const path = ekgRef.current.querySelector('path')
                if (path) {
                    gsap.to(path, {
                        strokeDashoffset: -1000,
                        scrollTrigger: {
                            trigger: heroRef.current,
                            start: 'top top',
                            end: 'bottom top',
                            scrub: 0.5,
                        },
                    })
                }
            }

            // Floating medical icons parallax
            if (floatingIconsRef.current) {
                const icons = floatingIconsRef.current.querySelectorAll('.floating-icon')
                icons.forEach((icon, index) => {
                    gsap.to(icon, {
                        y: -150 * (index + 1) * 0.3,
                        rotation: 360,
                        scrollTrigger: {
                            trigger: heroRef.current,
                            start: 'top top',
                            end: 'bottom top',
                            scrub: 1 + index * 0.2,
                        },
                    })
                })
            }
        }, heroRef)

        return () => ctx.revert()
    }, [prefersReducedMotion, slides.length])

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
            ref={heroRef}
            id="home"
            className='relative min-h-screen flex items-center justify-center overflow-hidden'
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Floating Medical Icons - Background Layer */}
            <div ref={floatingIconsRef} className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
                <div className="floating-icon absolute top-[20%] left-[10%] opacity-10">
                    <Heart className="w-16 h-16 text-primary animate-medical-pulse" />
                </div>
                <div className="floating-icon absolute top-[60%] left-[15%] opacity-10">
                    <Activity className="w-20 h-20 text-primary animate-medical-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="floating-icon absolute top-[40%] right-[10%] opacity-10">
                    <Shield className="w-24 h-24 text-primary animate-medical-pulse" style={{ animationDelay: '1s' }} />
                </div>
                <div className="floating-icon absolute top-[70%] right-[20%] opacity-10">
                    <Stethoscope className="w-18 h-18 text-primary animate-medical-pulse" style={{ animationDelay: '1.5s' }} />
                </div>
            </div>

            {/* EKG Heartbeat Line */}
            <svg
                ref={ekgRef}
                className="absolute top-1/2 left-0 w-full h-32 opacity-5 z-[6] pointer-events-none"
                preserveAspectRatio="none"
                viewBox="0 0 1200 100"
            >
                <path
                    d="M0,50 L200,50 L210,20 L220,80 L230,50 L400,50 L410,20 L420,80 L430,50 L600,50 L610,20 L620,80 L630,50 L800,50 L810,20 L820,80 L830,50 L1000,50 L1010,20 L1020,80 L1030,50 L1200,50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                    strokeDasharray="1000"
                    strokeDashoffset="0"
                />
            </svg>

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
            <div ref={contentRef} className='relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center'>
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

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 w-full z-20 overflow-hidden leading-[0]">
                <svg className="relative block w-[calc(100%+1.3px)] h-[60px] sm:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
                </svg>
            </div>
        </section>
    )
}
