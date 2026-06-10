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
  Activity,
} from 'lucide-react'

interface SectionContent {
  badge?: string
  title?: string
  subtitle?: string
}

interface SpecialtiesProps {
  sectionContent?: SectionContent
}

export default function Specialties({ sectionContent }: SpecialtiesProps) {
  const t = useTranslations('specialties')

  // Specialty data with colors, gradients, sizes, and animation types
  const specialties = [
    {
      name: t('items.endocrinology.name'),
      icon: Activity,
      image: '',
      description: t('items.endocrinology.desc'),
      color: '#10B981',
      gradient: 'from-emerald-500 via-emerald-400 to-teal-500',
      size: 'large' as const,
      animationType: 'scan' as const,
      comingSoon: false,
    },
    {
      name: t('items.gynecology.name'),
      icon: Baby,
      image: '',
      description: t('items.gynecology.desc'),
      color: '#A855F7',
      gradient: 'from-purple-500 via-purple-400 to-pink-500',
      size: 'medium' as const,
      animationType: 'pulse' as const,
      comingSoon: false,
    },
    {
      name: t('items.internalMedicine.name'),
      icon: Stethoscope,
      image: '',
      description: t('items.internalMedicine.desc'),
      color: '#3B82F6',
      gradient: 'from-blue-600 via-blue-500 to-indigo-500',
      size: 'medium' as const,
      animationType: 'scan' as const,
      comingSoon: false,
    },
    {
      name: t('items.orl.name'),
      icon: Ear,
      image: '',
      description: t('items.orl.desc'),
      color: '#F97316',
      gradient: 'from-orange-500 via-orange-400 to-yellow-500',
      size: 'medium' as const,
      animationType: 'breathing' as const,
      comingSoon: false,
    },
    {
      name: t('items.cardiology.name'),
      icon: Heart,
      image: '',
      description: t('items.cardiology.desc'),
      color: '#EF4444',
      gradient: 'from-red-600 via-red-500 to-orange-500',
      size: 'medium' as const,
      animationType: 'heartbeat' as const,
      comingSoon: true,
    },
    {
      name: t('items.pediatrics.name'),
      icon: Baby,
      image: '',
      description: t('items.pediatrics.desc'),
      color: '#FBBF24',
      gradient: 'from-yellow-400 via-yellow-300 to-orange-400',
      size: 'large' as const,
      animationType: 'playful' as const,
      comingSoon: false,
    },
    {
      name: t('items.pneumology.name'),
      icon: Wind,
      image: '',
      description: t('items.pneumology.desc'),
      color: '#06B6D4',
      gradient: 'from-cyan-500 via-cyan-400 to-blue-500',
      size: 'medium' as const,
      animationType: 'breathing' as const,
      comingSoon: true,
    },
    {
      name: t('items.dermatology.name'),
      icon: Syringe,
      image: '',
      description: t('items.dermatology.desc'),
      color: '#EC4899',
      gradient: 'from-pink-500 via-pink-400 to-purple-500',
      size: 'medium' as const,
      animationType: 'scan' as const,
      comingSoon: true,
    },
    {
      name: t('items.neurology.name'),
      icon: Brain,
      image: '',
      description: t('items.neurology.desc'),
      color: '#6366F1',
      gradient: 'from-indigo-600 via-indigo-500 to-purple-500',
      size: 'medium' as const,
      animationType: 'synapse' as const,
      comingSoon: true,
    },
    {
      name: t('items.dentistry.name'),
      icon: Smile,
      image: '',
      description: t('items.dentistry.desc'),
      color: '#10B981',
      gradient: 'from-emerald-500 via-emerald-400 to-teal-500',
      size: 'medium' as const,
      animationType: 'shine' as const,
      comingSoon: true,
    },
  ]

  return (
    <section id='specialties' className='bg-background py-12 sm:py-16 md:py-20 overflow-hidden'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative'>
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-5" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }}
        />
        
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
            {/* Légende : statut des spécialités */}
            <div className='flex items-center justify-center gap-6 pt-3 text-sm text-muted-foreground'>
              <span className='inline-flex items-center gap-2'>
                <span className='h-2.5 w-2.5 rounded-full bg-primary' />
                Disponibles
              </span>
              <span className='inline-flex items-center gap-2'>
                <span className='h-2.5 w-2.5 rounded-full bg-muted-foreground/40' />
                Prochainement
              </span>
            </div>
          </div>
        </AnimatedSection>

        {/* Modern Clinic Presentation Section - Enhanced 2025 Design */}
        <AnimatedSection animation="scale" className="mb-24 relative z-10">
          <div className="animate-item relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 bg-gradient-to-br from-primary/5 via-background to-[#FDE68A]/10">
            {/* Static gradient border accent */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#006633] via-[#4caf6e] to-[#FDE68A] opacity-10 blur-xl"></div>

            {/* Static background glow */}
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#006633]/25 blur-[120px] opacity-30" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#FDE68A]/20 blur-[120px] opacity-30" />

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
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006633] via-[#4caf6e] to-[#FDE68A]">
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
                        <Heart className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-foreground">Soins Complets</span>
                    </div>
                    <div className="group flex items-center gap-3 text-sm font-medium bg-gradient-to-r from-amber-400/10 to-amber-400/5 hover:from-amber-400/20 hover:to-amber-400/10 p-4 rounded-2xl border border-amber-400/20 hover:border-amber-400/40 transition-all duration-300 shadow-lg hover:shadow-amber-400/20 cursor-pointer">
                      <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-600 group-hover:bg-amber-400 group-hover:text-white transition-all duration-300 shadow-lg">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-foreground">Experts Dévoués</span>
                    </div>
                  </div>
                </div>

                {/* Poster Side - Enhanced 3D Showcase */}
                <div className="relative mx-auto w-full max-w-md order-1 md:order-2">
                  {/* Static glow behind image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-[#FDE68A]/20 rounded-3xl blur-2xl transform scale-110"></div>

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
                comingSoon={specialty.comingSoon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
