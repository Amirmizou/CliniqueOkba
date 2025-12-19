'use client'

import Image from 'next/image'
import { ServiceShowcase } from '@/components/ui/service-showcase'
import { AnimatedSection, AnimatedItem } from '@/components/ui/animated-section'
import { SpecialtyCard3D } from '@/components/ui/specialty-card-3d'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import {
  Heart,
  Wind,
  Brain,
  Eye,
  Smile,
  Baby,
  Stethoscope,
  Bone,
  Ear,
  Syringe,
} from 'lucide-react'

export default function Specialties() {
  const t = useTranslations('specialties')

  // Specialty data with colors, gradients, sizes, and animation types
  const specialties = [
    {
      name: t('items.cardiology.name'),
      icon: Heart,
      image: '/images/specialties/cardiology.png',
      description: t('items.cardiology.desc'),
      color: '#EF4444',
      gradient: 'from-red-600 via-red-500 to-orange-500',
      size: 'large' as const,
      animationType: 'heartbeat' as const,
    },
    {
      name: t('items.pneumology.name'),
      icon: Wind,
      image: '/images/specialties/pneumology.png',
      description: t('items.pneumology.desc'),
      color: '#06B6D4',
      gradient: 'from-cyan-500 via-cyan-400 to-blue-500',
      size: 'medium' as const,
      animationType: 'breathing' as const,
    },
    {
      name: t('items.internalMedicine.name'),
      icon: Stethoscope,
      image: '/images/specialties/internal-medicine.png',
      description: t('items.internalMedicine.desc'),
      color: '#3B82F6',
      gradient: 'from-blue-600 via-blue-500 to-indigo-500',
      size: 'medium' as const,
      animationType: 'scan' as const,
    },
    {
      name: t('items.dermatology.name'),
      icon: Syringe,
      image: '/images/specialties/dermatology.png',
      description: t('items.dermatology.desc'),
      color: '#EC4899',
      gradient: 'from-pink-500 via-pink-400 to-purple-500',
      size: 'medium' as const,
      animationType: 'scan' as const,
    },
    {
      name: t('items.gynecology.name'),
      icon: Baby,
      image: '/images/specialties/gynecology.png',
      description: t('items.gynecology.desc'),
      color: '#A855F7',
      gradient: 'from-purple-500 via-purple-400 to-pink-500',
      size: 'medium' as const,
      animationType: 'pulse' as const,
    },
    {
      name: t('items.pediatrics.name'),
      icon: Baby,
      image: '/images/specialties/pediatrics.png',
      description: t('items.pediatrics.desc'),
      color: '#FBBF24',
      gradient: 'from-yellow-400 via-yellow-300 to-orange-400',
      size: 'small' as const,
      animationType: 'playful' as const,
    },
    {
      name: t('items.neurology.name'),
      icon: Brain,
      image: '/images/specialties/neurology.png',
      description: t('items.neurology.desc'),
      color: '#6366F1',
      gradient: 'from-indigo-600 via-indigo-500 to-purple-500',
      size: 'medium' as const,
      animationType: 'synapse' as const,
    },
    {
      name: t('items.dentistry.name'),
      icon: Smile,
      image: '/images/specialties/dentistry.png',
      description: t('items.dentistry.desc'),
      color: '#10B981',
      gradient: 'from-emerald-500 via-emerald-400 to-teal-500',
      size: 'small' as const,
      animationType: 'shine' as const,
    },
  ]

  return (
    <section id='specialties' className='bg-background py-12 sm:py-16 md:py-20 overflow-hidden'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative'>
        {/* Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <AnimatedSection animation="fade" className='mb-16 space-y-4 text-center relative z-10'>
          <div className="animate-item">
            <p className='text-primary text-sm font-semibold tracking-wide uppercase'>
              {t('sectionTitle')}
            </p>
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4'>
              <span className="text-gradient">Nos Spécialités</span> <br />
              <span className="text-foreground">d'Excellence</span>
            </h2>
            <p className='text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg'>
              {t('subtitle')}
            </p>
          </div>
        </AnimatedSection>

        {/* Modern Clinic Presentation Section - Enhanced 2025 Design */}
        <AnimatedSection animation="scale" className="mb-24 relative z-10">
          <div className="animate-item relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 bg-gradient-to-br from-primary/5 via-background to-blue-500/5">
            {/* Animated gradient border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary via-blue-500 to-primary opacity-20 blur-xl animate-pulse" style={{ animationDuration: '4s' }}></div>

            {/* Background Glow Effects */}
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/30 blur-[120px] opacity-40 animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-600/30 blur-[120px] opacity-40 animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />

            {/* Main content with glassmorphism */}
            <div className="relative backdrop-blur-sm bg-white/5 dark:bg-black/20 rounded-3xl p-8 md:p-12">
              <div className="grid gap-12 md:grid-cols-2 md:items-center lg:gap-16">
                {/* Content Side */}
                <div className="space-y-8 order-2 md:order-1">
                  {/* Premium badge with glow */}
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-5 py-2 text-sm font-semibold backdrop-blur-md border border-green-500/20 shadow-lg shadow-green-500/10">
                    <span className="relative flex h-2.5 w-2.5 mr-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">
                      Excellence & Innovation Médicale
                    </span>
                  </div>

                  {/* Title with modern gradient */}
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl tracking-tight">
                      <span className="text-foreground">Une Prise en Charge</span>
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary bg-[length:200%_auto] animate-gradient">
                        Globale & Personnalisée
                      </span>
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                      Notre clinique s'engage à vous offrir les meilleurs soins grâce à une approche multidisciplinaire.
                      Découvrez l'étendue de nos services et notre plateau technique de pointe.
                    </p>
                  </div>

                  {/* Feature badges with modern design */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <div className="group flex items-center gap-3 text-sm font-medium bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 p-4 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-lg hover:shadow-primary/20 cursor-pointer">
                      <div className="p-2.5 rounded-xl bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg">
                        <Heart className="h-5 w-5 animate-medical-pulse" />
                      </div>
                      <span className="font-semibold text-foreground">Soins Complets</span>
                    </div>
                    <div className="group flex items-center gap-3 text-sm font-medium bg-gradient-to-r from-blue-500/10 to-blue-500/5 hover:from-blue-500/20 hover:to-blue-500/10 p-4 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 cursor-pointer">
                      <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-lg">
                        <Stethoscope className="h-5 w-5 animate-medical-pulse" style={{ animationDelay: '0.5s' }} />
                      </div>
                      <span className="font-semibold text-foreground">Experts Dévoués</span>
                    </div>
                  </div>
                </div>

                {/* Poster Side - Enhanced 3D Showcase */}
                <div className="relative mx-auto w-full max-w-md order-1 md:order-2">
                  {/* Floating glow effect behind image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-3xl blur-2xl transform scale-110 animate-pulse" style={{ animationDuration: '5s' }}></div>

                  <div className="relative">
                    <ServiceShowcase
                      imageSrc="/images/specialties/542708336_122130558224898854_370190308713876437_n.jpg"
                      className="shadow-2xl shadow-primary/30 ring-2 ring-primary/10 hover:ring-primary/30 transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Modern 3D Specialty Cards - Bento Grid Layout */}
        <div className="relative z-10">
          {/* Bento Grid - Asymmetric Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-auto gap-4 md:gap-6">
            {specialties.map((specialty, index) => (
              <SpecialtyCard3D
                key={index}
                title={specialty.name}
                icon={specialty.icon}
                image={specialty.image}
                description={specialty.description}
                color={specialty.color}
                gradient={specialty.gradient}
                size={specialty.size}
                index={index}
                animationType={specialty.animationType}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
