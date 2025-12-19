'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import clinicData from '@/data/clinic.json'
import { useTranslations } from 'next-intl'
import { Check, Award, Users, Clock } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function About() {
  const t = useTranslations('about')
  const prefersReducedMotion = useReducedMotion()

  // Refs for GSAP animations
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  const stats = [
    { value: '24/7', label: 'Urgences disponibles', icon: Clock },
    { value: '30+', label: 'Médecins spécialistes', icon: Users },
    { value: '11', label: 'Spécialités médicales', icon: Award },
  ]

  // GSAP Scroll Animations
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      // Image reveal with surgical curtain effect (horizontal wipe)
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            clipPath: 'inset(0 100% 0 0)',
            opacity: 0,
          },
          {
            clipPath: 'inset(0 0% 0 0)',
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 80%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Features stagger with heartbeat rhythm
      if (featuresRef.current) {
        const features = featuresRef.current.querySelectorAll('.feature-item')
        gsap.fromTo(
          features,
          {
            opacity: 0,
            x: -50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.6, // Heartbeat rhythm timing
            ease: 'power2.out',
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        // Check icons scale in with bounce
        const checkIcons = featuresRef.current.querySelectorAll('.check-icon')
        gsap.fromTo(
          checkIcons,
          {
            scale: 0,
            rotation: -180,
          },
          {
            scale: 1,
            rotation: 0,
            duration: 0.5,
            stagger: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Stats horizontal scroll reveal with radial progress
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll('.stat-card')
        gsap.fromTo(
          statCards,
          {
            opacity: 0,
            x: 100,
            scale: 0.8,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        // Animate stat numbers with counter effect
        const statNumbers = statsRef.current.querySelectorAll('.stat-number')
        statNumbers.forEach((num) => {
          const target = num.textContent || '0'
          const numValue = parseInt(target.replace(/\D/g, '')) || 0

          gsap.fromTo(
            num,
            { textContent: 0 },
            {
              textContent: numValue,
              duration: 2,
              ease: 'power1.out',
              snap: { textContent: 1 },
              scrollTrigger: {
                trigger: statsRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
              onUpdate: function () {
                const current = Math.round(this.targets()[0].textContent)
                if (target.includes('+')) {
                  num.textContent = current + '+'
                } else if (target.includes('/')) {
                  num.textContent = '24/7'
                } else {
                  num.textContent = current.toString()
                }
              }
            }
          )
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <section ref={sectionRef} id='about' className='bg-card py-12 sm:py-16 md:py-20 overflow-hidden'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid items-center gap-12 md:grid-cols-2'>
          {/* Image with surgical curtain reveal */}
          <div ref={imageRef} className='relative order-2 h-64 sm:h-80 md:h-96 md:order-1 rounded-2xl overflow-hidden'>
            <div className='from-secondary/30 to-primary/20 absolute inset-0 bg-gradient-to-br z-10'></div>
            <Image
              src='/uploads/hero/1763825620251-Gemini_Generated_Image_gzjk7ygzjk7ygzjk.png'
              alt='Façade architecturale moderne de la Clinique OKBA située à Constantine, Ali Mendjeli'
              className='h-full w-full object-cover'
              fill
              sizes='(max-width: 768px) 100vw, 50vw'
              loading='lazy'
            />
          </div>

          {/* Content */}
          <div className='order-1 space-y-6 md:order-2'>
            <div className='space-y-2'>
              <p className='text-primary text-sm font-semibold tracking-wide uppercase'>
                {t('title')}
              </p>
              <h2 className='text-foreground text-2xl sm:text-3xl md:text-4xl font-bold'>
                {clinicData.name}
              </h2>
            </div>

            <p className='text-muted-foreground text-base sm:text-lg leading-relaxed'>
              {clinicData.description || t('description')}
            </p>

            <div ref={featuresRef} className='space-y-4'>
              <div className='feature-item flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl'>
                    <Check className='check-icon text-primary h-6 w-6 stroke-[3]' />
                  </div>
                </div>
                <div>
                  <h3 className='text-foreground font-semibold'>
                    {t('features.equipment.title')}
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    {t('features.equipment.desc')}
                  </p>
                </div>
              </div>

              <div className='feature-item flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl'>
                    <Check className='check-icon text-primary h-6 w-6 stroke-[3]' />
                  </div>
                </div>
                <div>
                  <h3 className='text-foreground font-semibold'>
                    {t('features.team.title')}
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    {t('features.team.desc')}
                  </p>
                </div>
              </div>

              <div className='feature-item flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl'>
                    <Check className='check-icon text-primary h-6 w-6 stroke-[3]' />
                  </div>
                </div>
                <div>
                  <h3 className='text-foreground font-semibold'>
                    {t('features.care.title')}
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    {t('features.care.desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section with horizontal scroll reveal */}
        <div ref={statsRef} className="mt-16">
          <div className="grid grid-cols-3 gap-4 sm:gap-6 p-6 sm:p-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-2xl border border-border/50">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="stat-card text-center group">
                  <div className="flex justify-center mb-3">
                    <div className="p-2 sm:p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-medical-pulse" />
                    </div>
                  </div>
                  <p className="stat-number text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
