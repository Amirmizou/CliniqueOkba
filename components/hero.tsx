'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Play, Shield, Heart, Users, Stethoscope, Activity } from 'lucide-react'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [heroData, setHeroData] = useState({
    title: "Votre Santé Mérite L'Excellence Absolue",
    subtitle: "Découvrez une nouvelle ère de soins médicaux à la Clinique OKBA. Technologie de pointe, experts dévoués et confort absolu pour votre rétablissement.",
    stats: { patients: "5000+" }
  })

  useEffect(() => {
    setIsVisible(true)
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
  const y2 = useTransform(scrollY, [0, 500], [0, -150])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section
      id='home'
      className='relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-secondary/5 pt-20'
      aria-label="Section d'accueil"
    >
      {/* Dynamic Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <motion.div
          style={{ y: y1, x: -50 }}
          className='absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl'
        />
        <motion.div
          style={{ y: y2, x: 50 }}
          className='absolute bottom-20 right-10 h-96 w-96 rounded-full bg-secondary/10 blur-3xl'
        />
      </div>

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full'>
        <div className='grid items-center gap-12 lg:grid-cols-2 lg:gap-8'>
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className='space-y-8 text-center lg:text-left'
          >
            <motion.div variants={itemVariants} className='inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20'>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Excellence Médicale à Constantine
            </motion.div>

            <motion.h1 variants={itemVariants} className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:leading-tight'>
              {heroData.title.split(' ').slice(0, 3).join(' ')} <br className="hidden lg:block" />
              <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                {heroData.title.split(' ').slice(3).join(' ')}
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className='mx-auto max-w-2xl text-lg text-muted-foreground lg:mx-0'>
              {heroData.subtitle}
            </motion.p>

            <motion.div variants={itemVariants} className='flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start'>
              <Button
                size='lg'
                className='group relative overflow-hidden bg-primary px-8 py-6 text-lg shadow-lg transition-all hover:scale-105 hover:shadow-primary/25'
                onClick={() => scrollToSection('specialties')}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Nos Services
                  <ArrowRight className='h-5 w-5 transition-transform group-hover:translate-x-1' />
                </span>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </Button>

              <Button
                size='lg'
                variant='outline'
                className='group px-8 py-6 text-lg backdrop-blur-sm transition-all hover:bg-secondary/10 hover:text-secondary-foreground'
                onClick={() => scrollToSection('contact')}
              >
                <Play className='mr-2 h-5 w-5 fill-current transition-transform group-hover:scale-110' />
                Visite Virtuelle
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={itemVariants} className='flex items-center justify-center gap-8 pt-8 lg:justify-start grayscale transition-all hover:grayscale-0'>
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                    <Users className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold text-foreground">{heroData.stats.patients} Patients</p>
                <p className="text-muted-foreground">Satisfaits cette année</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='relative mx-auto w-full max-w-[500px] lg:max-w-none'
          >
            <div className='relative aspect-square lg:aspect-[4/5]'>
              {/* Main Image Container */}
              <div className='absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/20 to-secondary/20 p-2'>
                <div className='h-full w-full overflow-hidden rounded-[1.8rem] bg-background relative'>
                  <Image
                    src='/modern-medical-clinic-interior-with-green-plants-a.jpg'
                    alt='Clinique OKBA Interior'
                    fill
                    className='object-cover transition-transform duration-700 hover:scale-105'
                    priority
                    sizes='(max-width: 768px) 100vw, 50vw'
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className='absolute -left-4 top-10 rounded-xl bg-card/90 p-4 shadow-xl backdrop-blur-md border border-border/50'
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-red-100 p-2 text-red-600">
                    <Heart className="h-6 w-6 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Soins</p>
                    <p className="text-sm font-bold text-foreground">Cardiologie</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className='absolute -right-4 bottom-20 rounded-xl bg-card/90 p-4 shadow-xl backdrop-blur-md border border-border/50'
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2 text-green-600">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Qualité</p>
                    <p className="text-sm font-bold text-foreground">Certifiée ISO</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className='absolute -right-8 top-1/2 rounded-xl bg-card/90 p-4 shadow-xl backdrop-blur-md border border-border/50 hidden sm:block'
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Urgences</p>
                    <p className="text-sm font-bold text-foreground">24/7 Ouvert</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
