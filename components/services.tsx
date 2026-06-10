'use client'


import ScrollAnimation from '@/components/ui/scroll-animation'
import StaggerContainer from '@/components/ui/stagger-container'
import {
  Stethoscope,
  Heart,
  Activity,
  Baby,
  Brain,
  Eye,
  Ear,
  Smile,
  Microscope,
  Syringe,
  Ambulance,
  Scan,
  Scissors,
  Home,
  Pill,
  Thermometer,
  Hospital,
} from 'lucide-react'
import { SpotlightCard } from '@/components/ui/spotlight-card'

const iconMap: any = {
  Stethoscope,
  Heart,
  Activity,
  Baby,
  Brain,
  Eye,
  Ear,
  Smile,
  Microscope,
  Syringe,
  Ambulance,
  Scan,
  Scalpel: Scissors,
  Scissors,
  Home,
  Pill,
  Thermometer,
  Hospital,
}

interface Service {
  _id?: string
  id?: string
  name?: string
  title?: string
  description: string
  icon: string
}

interface SectionContent {
  badge?: string
  title?: string
  subtitle?: string
}

interface ServicesProps {
  data?: Service[]
  sectionContent?: SectionContent
}

// Services par défaut (affichés si aucune donnée Sanity n'est disponible)
// Liste détaillée des actes, regroupant les pôles de la clinique.
const defaultServices: Service[] = [
  // --- Imagerie ---
  {
    id: 'scanner',
    name: 'Scanner (TDM)',
    description:
      'Tomodensitométrie haute résolution pour explorer l’ensemble du corps en quelques secondes.',
    icon: 'Scan',
  },
  {
    id: 'irm',
    name: 'IRM',
    description:
      'Imagerie par résonance magnétique, précise et sans rayons X.',
    icon: 'Brain',
  },
  {
    id: 'radiologie',
    name: 'Radiologie & mammographie',
    description:
      'Radiographie numérique et dépistage du sein à faible irradiation.',
    icon: 'Activity',
  },
  {
    id: 'echographie',
    name: 'Échographie',
    description:
      'Échographie et doppler en temps réel pour un diagnostic ciblé.',
    icon: 'Heart',
  },
  // --- Pôle dentaire ---
  {
    id: 'dentaire-consultation',
    name: 'Consultation dentaire',
    description:
      'Bilan bucco-dentaire, soins conservateurs et prévention.',
    icon: 'Smile',
  },
  {
    id: 'dentaire-chirurgie',
    name: 'Chirurgie dentaire',
    description:
      'Extractions, implants et interventions bucco-dentaires.',
    icon: 'Scissors',
  },
  {
    id: 'dentaire-odf',
    name: 'Orthodontie (ODF)',
    description:
      'Orthodontie dento-faciale pour aligner et corriger la dentition.',
    icon: 'Smile',
  },
  {
    id: 'dentaire-prothese',
    name: 'Prothèse dentaire',
    description:
      'Conception de prothèses fixes et amovibles sur mesure.',
    icon: 'Smile',
  },
  // --- Chirurgie spécialisée ---
  {
    id: 'chirurgie-ophtalmo',
    name: 'Chirurgie ophtalmologique',
    description:
      'Interventions de l’œil au bloc opératoire aux normes.',
    icon: 'Eye',
  },
  {
    id: 'chirurgie-orl',
    name: 'Chirurgie ORL',
    description:
      'Chirurgie de l’oreille, du nez et de la gorge.',
    icon: 'Ear',
  },
  // --- Laboratoire & urgences ---
  {
    id: 'laboratoire',
    name: 'Laboratoire d’analyses',
    description:
      'Bilans sanguins et prélèvements sur automates de dernière génération.',
    icon: 'Microscope',
  },
  {
    id: 'urgences',
    name: 'Urgences 24h/24',
    description:
      'Une équipe médicale de garde, disponible jour et nuit, 7j/7.',
    icon: 'Ambulance',
  },
]

export default function Services({ data = [], sectionContent }: ServicesProps) {
  const services = data && data.length > 0 ? data : defaultServices

  // Default content if not from Sanity
  const title = sectionContent?.title || 'Nos Services Médicaux'
  const subtitle = sectionContent?.subtitle || 'Une expertise complète pour votre santé'
  const badge = sectionContent?.badge || 'Services'



  return (
    <section id='services' className='bg-background py-12 sm:py-16 md:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <ScrollAnimation variant="fadeUp" className='mb-16 text-center'>
          {badge && (
            <p className='text-primary text-sm font-semibold tracking-wide uppercase mb-2'>
              {badge}
            </p>
          )}
          <h2 className='text-foreground text-2xl sm:text-3xl md:text-4xl font-bold'>
            {title}
          </h2>
          <p className='text-muted-foreground mt-4 text-base sm:text-lg'>
            {subtitle}
          </p>
        </ScrollAnimation>

        <StaggerContainer className='grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Activity
            const serviceName = service.name || service.title || 'Service'
            const serviceId = service._id || service.id || serviceName

            return (
              <ScrollAnimation key={serviceId} variant="fadeUp" as="div">
                <SpotlightCard className='glass-card group h-full border-0 hover-lift flex flex-col p-6' spotlightColor="rgba(44, 133, 222, 0.2)">
                  <div className='bg-primary/10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:bg-primary group-hover:scale-110 group-hover:shadow-lg'>
                    <Icon className='text-primary h-7 w-7 transition-colors group-hover:text-white' />
                  </div>
                  <h3 className='text-xl font-bold mb-3'>{serviceName}</h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    {service.description}
                  </p>
                </SpotlightCard>
              </ScrollAnimation>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
