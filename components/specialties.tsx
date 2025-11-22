import Image from 'next/image'
import { Card } from '@/components/ui/card'
import ScrollAnimation from '@/components/ui/scroll-animation'
import StaggerContainer from '@/components/ui/stagger-container'
import {
  Heart,
  Bug as Lung,
  Brain,
  Eye,
  Smile,
  Baby,
  Stethoscope,
  Bone,
  Ear,
  Syringe,
} from 'lucide-react'

const specialties = [
  {
    name: 'Cardiologie',
    icon: Heart,
    image: '/images/specialties/cardiology.png',
    description: 'Maladies du cœur et des vaisseaux sanguins',
  },
  {
    name: 'Pneumologie',
    icon: Lung,
    image: '/images/specialties/pneumology.png',
    description: 'Maladies de la respiration et du système pulmonaire',
  },
  {
    name: 'Médecine interne',
    icon: Stethoscope,
    image: '/images/specialties/internal-medicine.png',
    description: 'Diagnostic et traitement médical général',
  },
  {
    name: 'Dermatologie & esthétique',
    icon: Syringe,
    image: '/images/specialties/dermatology.png',
    description: 'Soins de la peau et traitements esthétiques',
  },
  {
    name: 'Gynécologie & obstétrique',
    icon: Baby,
    image: '/images/specialties/gynecology.png',
    description: 'Santé féminine et suivi de maternité',
  },
  {
    name: 'Pédiatrie',
    icon: Baby,
    image: '/images/specialties/pediatrics.png',
    description: 'Soins spécialisés des enfants et nourrissons',
  },
  {
    name: 'Neurologie',
    icon: Brain,
    image: '/images/specialties/neurology.png',
    description: 'Maladies du système nerveux',
  },
  {
    name: 'Dentisterie',
    icon: Smile,
    // image: '/images/specialties/dentistry.png', // Pending generation
    description: 'Soins dentaires complets et chirurgie dentaire',
  },
  {
    name: 'Rhumatologie',
    icon: Bone,
    // image: '/images/specialties/rheumatology.png', // Pending generation
    description: 'Maladies des articulations et rhumatismes',
  },
  {
    name: 'Ophtalmologie',
    icon: Eye,
    // image: '/images/specialties/ophthalmology.png', // Pending generation
    description: 'Soins des yeux et chirurgie ophtalmologique',
  },
  {
    name: 'ORL',
    icon: Ear,
    // image: '/images/specialties/orl.png', // Pending generation
    description: 'Oto-rhino-laryngologie et chirurgie ORL',
  },
]

export default function Specialties() {
  return (
    <section id='specialties' className='bg-background py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <ScrollAnimation variant="fadeUp" className='mb-16 space-y-4 text-center'>
          <p className='text-primary text-sm font-semibold tracking-wide uppercase'>
            Nos services
          </p>
          <h2 className='text-foreground text-4xl font-bold'>
            Nos Spécialités
          </h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
            Une gamme complète de spécialités médicales pour répondre à tous vos
            besoins de santé
          </p>
        </ScrollAnimation>

        <StaggerContainer className='grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {specialties.map((specialty, index) => {
            const Icon = specialty.icon
            return (
              <ScrollAnimation key={index} variant="fadeUp" as="div">
                <Card
                  className='glass-card group cursor-pointer border-0 hover-lift h-full overflow-hidden flex flex-col'
                >
                  <div className='relative h-48 w-full overflow-hidden'>
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
