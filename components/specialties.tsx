import Image from 'next/image'
import { Card } from '@/components/ui/card'
import ScrollAnimation from '@/components/ui/scroll-animation'
import StaggerContainer from '@/components/ui/stagger-container'
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

  const specialties = [
    {
      name: t('items.cardiology.name'),
      icon: Heart,
      image: '/images/specialties/cardiology.png',
      description: t('items.cardiology.desc'),
    },
    {
      name: t('items.pneumology.name'),
      icon: Wind,
      image: '/images/specialties/pneumology.png',
      description: t('items.pneumology.desc'),
    },
    {
      name: t('items.internalMedicine.name'),
      icon: Stethoscope,
      image: '/images/specialties/internal-medicine.png',
      description: t('items.internalMedicine.desc'),
    },
    {
      name: t('items.dermatology.name'),
      icon: Syringe,
      image: '/images/specialties/dermatology.png',
      description: t('items.dermatology.desc'),
    },
    {
      name: t('items.gynecology.name'),
      icon: Baby,
      image: '/images/specialties/gynecology.png',
      description: t('items.gynecology.desc'),
    },
    {
      name: t('items.pediatrics.name'),
      icon: Baby,
      image: '/images/specialties/pediatrics.png',
      description: t('items.pediatrics.desc'),
    },
    {
      name: t('items.neurology.name'),
      icon: Brain,
      image: '/images/specialties/neurology.png',
      description: t('items.neurology.desc'),
    },
    {
      name: t('items.dentistry.name'),
      icon: Smile,
      image: '/images/specialties/dentistry.png',
      description: t('items.dentistry.desc'),
    },
    {
      name: t('items.rheumatology.name'),
      icon: Bone,
      image: '/images/specialties/rheumatology.png',
      description: t('items.rheumatology.desc'),
    },
    {
      name: t('items.ophthalmology.name'),
      icon: Eye,
      image: '/images/specialties/ophthalmology.png',
      description: t('items.ophthalmology.desc'),
    },
    {
      name: t('items.orl.name'),
      icon: Ear,
      image: '/images/specialties/orl.png',
      description: t('items.orl.desc'),
    },
  ]

  return (
    <section id='specialties' className='bg-background py-12 sm:py-16 md:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <ScrollAnimation variant="fadeUp" className='mb-16 space-y-4 text-center'>
          <p className='text-primary text-sm font-semibold tracking-wide uppercase'>
            {t('sectionTitle')}
          </p>
          <h2 className='text-foreground text-2xl sm:text-3xl md:text-4xl font-bold'>
            {t('title')}
          </h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg'>
            {t('subtitle')}
          </p>
        </ScrollAnimation>

        {/* Services Poster Section - Redesigned */}
        <ScrollAnimation variant="fadeUp" className="mb-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-2xl border border-white/10">
            {/* Background Glow Effects */}
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-[100px] opacity-50" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px] opacity-50" />

            <div className="relative grid gap-12 p-8 md:grid-cols-2 md:items-center md:p-12 lg:gap-16">
              {/* Content Side */}
              <div className="space-y-8 order-2 md:order-1">
                <div className="inline-flex items-center rounded-full bg-white/5 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-md border border-white/10 shadow-sm">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Excellence & Innovation
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl tracking-tight">
                    Une Prise en Charge <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                      Globale & Personnalisée
                    </span>
                  </h3>
                  <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                    Notre clinique s'engage à vous offrir les meilleurs soins grâce à une approche multidisciplinaire.
                    Découvrez l'étendue de nos services et notre plateau technique de pointe.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="p-1.5 rounded-full bg-primary/20 text-primary">
                      <Heart className="h-4 w-4" />
                    </div>
                    <span>Soins Complets</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="p-1.5 rounded-full bg-blue-500/20 text-blue-400">
                      <Stethoscope className="h-4 w-4" />
                    </div>
                    <span>Experts Dévoués</span>
                  </div>
                </div>
              </div>

              {/* Poster Side */}
              <div className="relative mx-auto w-full max-w-md order-1 md:order-2">
                <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-800/50 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/20 border border-white/10 ring-1 ring-white/5">
                  <Image
                    src="/images/specialties/542708336_122130558224898854_370190308713876437_n.jpg"
                    alt="Affiche des services Clinique Okba"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                  />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
                {/* Decorative blurred backdrop behind poster */}
                <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/30 to-blue-600/30 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              </div>
            </div>
          </div>
        </ScrollAnimation>

        <StaggerContainer className='grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {specialties.map((specialty, index) => {
            const Icon = specialty.icon
            return (
              <ScrollAnimation key={index} variant="fadeUp" as="div">
                <Card
                  className='glass-card group cursor-pointer border-0 hover-lift h-full overflow-hidden flex flex-col relative'
                >
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10">
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>
                  <div className='relative h-40 sm:h-48 w-full overflow-hidden'>
                    {specialty.image ? (
                      <Image
                        src={specialty.image}
                        alt={specialty.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className='object-cover transition-transform duration-500 group-hover:scale-110'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-colors'>
                        <Icon className='text-primary h-16 w-16 opacity-50 group-hover:scale-110 transition-transform duration-500' />
                      </div>
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  </div>

                  <div className='p-6 flex-1 flex flex-col relative'>
                    {/* Floating Icon for image cards */}
                    {specialty.image && (
                      <div className='absolute -top-8 right-6 bg-background/80 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/20 group-hover:scale-110 transition-transform duration-300'>
                        <Icon className='text-primary h-6 w-6' />
                      </div>
                    )}

                    <h3 className='text-foreground text-xl font-bold mb-3 group-hover:text-primary transition-colors'>
                      {specialty.name}
                    </h3>
                    <p className='text-muted-foreground text-sm leading-relaxed'>
                      {specialty.description}
                    </p>
                  </div>
                </Card>
              </ScrollAnimation>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
