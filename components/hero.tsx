'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, Shield, Heart, Activity, Star, ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export default function Hero() {
  const t = useTranslations('hero')
  const [heroData, setHeroData] = useState({
    stats: { patients: "5000+" }
  })

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    fetch('/api/admin/clinic')
      .then(res => res.json())
      .then(data => {
        if (data && data.hero) {
          setHeroData(data.hero)
        }
      })
      .catch(err => console.error(err))
  }, [])

  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const carouselItems = [
    {
      id: 1,
      title: t('carousel.tech.title'),
      desc: t('carousel.tech.desc'),
      image: "/uploads/hero/1763826628906-Gemini_Generated_Image_ubdtr0ubdtr0ubdt.png",
      icon: <Activity className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      id: 2,
      title: t('carousel.expert.title'),
      desc: t('carousel.expert.desc'),
      image: "/uploads/hero/1763825620251-Gemini_Generated_Image_gzjk7ygzjk7ygzjk.png",
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      color: "bg-yellow-500/10 text-yellow-500"
    },
    {
      id: 3,
      title: t('carousel.care.title'),
      desc: t('carousel.care.desc'),
      image: "/uploads/hero/1763975074979-GeminiGeneratedImagecv1y7ncv1y7ncv1y.png",
      icon: <Heart className="w-6 h-6 text-red-500" />,
      color: "bg-red-500/10 text-red-500"
    }
  ]

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % carouselItems.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      id='home'
      className='relative flex min-h-[95vh] items-center justify-center overflow-hidden bg-background pt-20'
      aria-label="Section d'accueil"
    >
      {/* Animated Background Pulse */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-secondary/5 blur-3xl"
        />

        {/* EKG Line Animation */}
        <svg className="absolute top-1/2 left-0 w-full h-32 opacity-10" preserveAspectRatio="none">
          <motion.path
            d="M0,16 L200,16 L210,0 L220,32 L230,16 L400,16 L410,0 L420,32 L430,16 L600,16 L610,0 L620,32 L630,16 L800,16 L810,0 L820,32 L830,16 L1000,16 L1010,0 L1020,32 L1030,16 L1200,16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            initial={{ pathLength: 0, x: -1000 }}
            animate={{ pathLength: 1, x: 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full'>
        <div className='grid items-center gap-12 lg:grid-cols-2 lg:gap-16'>

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className='space-y-8 text-center lg:text-left'
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              <span className="text-sm font-medium text-secondary-foreground">{t('badge')}</span>
            </div>

            <h1 className='text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:leading-[1.1]'>
              {t('titlePart1')} <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 relative'>
                {t('titlePart2')}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>

            <p className='mx-auto max-w-2xl text-lg text-muted-foreground lg:mx-0 leading-relaxed'>
              {t('subtitle')}
            </p>

            <div className='flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start'>
              <Button
                size='lg'
                className='h-14 px-8 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:scale-105'
                onClick={() => scrollToSection('specialties')}
              >
                {t('cta.services')}
                <ArrowRight className='ml-2 h-5 w-5 rtl:rotate-180' />
              </Button>

              <Button
                size='lg'
                variant='outline'
                className='h-14 px-8 rounded-full border-2 hover:bg-secondary/5 transition-all hover:scale-105'
                onClick={() => scrollToSection('contact')}
              >
                <Play className='mr-2 h-4 w-4 fill-current' />
                {t('cta.discover')}
              </Button>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-border/50 mt-8">
              <div>
                <p className="text-3xl font-bold text-foreground">{heroData.stats.patients}</p>
                <p className="text-sm text-muted-foreground">{t('stats.patients')}</p>
              </div>
              <div className="w-px h-12 bg-border/50" />
              <div>
                <p className="text-3xl font-bold text-foreground">24/7</p>
                <p className="text-sm text-muted-foreground">{t('stats.emergency')}</p>
              </div>
              <div className="w-px h-12 bg-border/50" />
              <div>
                <p className="text-3xl font-bold text-foreground">15+</p>
                <p className="text-sm text-muted-foreground">{t('stats.specialties')}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - 3D Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='relative h-[500px] w-full perspective-1000'
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, rotateY: -20, x: 100 }}
                  animate={{ opacity: 1, rotateY: 0, x: 0 }}
                  exit={{ opacity: 0, rotateY: 20, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-card/30 backdrop-blur-md group z-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />

                  <Image
                    src={carouselItems[activeIndex].image}
                    alt={carouselItems[activeIndex].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className={cn("inline-flex p-3 rounded-2xl mb-4 backdrop-blur-md bg-white/10 border border-white/20", carouselItems[activeIndex].color.split(' ')[1])}
                    >
                      {carouselItems[activeIndex].icon}
                    </motion.div>
                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-bold text-white mb-2"
                    >
                      {carouselItems[activeIndex].title}
                    </motion.h3>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/80"
                    >
                      {carouselItems[activeIndex].desc}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="absolute bottom-8 right-8 z-30 flex gap-2">
                <button
                  onClick={prevSlide}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                </button>
              </div>

              {/* Progress Indicators */}
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                {carouselItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      idx === activeIndex ? "h-8 bg-primary" : "bg-muted-foreground/30 hover:bg-primary/50"
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
