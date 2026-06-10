// Données des médecins de la Clinique OKBA
// Extraites des affiches officielles (public/images/spec)

import {
  Baby,
  Activity,
  Stethoscope,
  Ear,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react'

export interface Doctor {
  id: string
  /** Civilité + nom complet tel qu'affiché */
  name: string
  /** Spécialité principale */
  specialty: string
  /** Sous-titre / mention (ex : "Ancienne Maître Assistante") */
  subtitle?: string
  /** Liste des actes / prestations */
  services: string[]
  /** Mention d'expérience facultative (ex : "+25 ans d'expérience") */
  experience?: string
  /** Jours de consultation */
  days: string
  /** Plage horaire */
  hours: string
  /** Affiche officielle (chemin public) */
  poster: string
  /** Icône lucide représentant la spécialité */
  icon: LucideIcon
  /** Couleur d'accent (HEX) pour les dégradés et halos */
  accent: string
  /** Dégradé Tailwind d'accompagnement */
  gradient: string
}

export const doctors: Doctor[] = [
  {
    id: 'meskaldji-rima',
    name: 'Dr. Meskaldji Rima ep. Benabdi',
    specialty: 'Gynécologie Obstétrique',
    subtitle: 'Ancienne Maître Assistante',
    services: [
      'Suivi de grossesse',
      'Accouchement normal',
      'Césarienne',
      'Échographie 3D / 4D',
      'Doppler – ERCF',
      'Colposcopie',
      'Hystéroscopie',
      'Infertilité du couple',
      'Sénologie',
      'Cœlioscopie',
      'Chirurgie gynécologique',
    ],
    days: 'Du samedi au jeudi',
    hours: '08h00 – 16h00',
    poster: '/images/spec/portrait-meskaldji-rima.jpeg',
    icon: Baby,
    accent: '#A855F7',
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
  },
  {
    id: 'ameziane-leila',
    name: 'Dr. Ameziane Leila',
    specialty: 'Endocrinologue',
    subtitle: 'Diabétologue',
    services: [
      'Diabétologie',
      'Métabolisme',
      'Maladies nutritionnelles',
    ],
    experience: 'Plus de 25 ans d’expérience',
    days: 'Du samedi au jeudi',
    hours: '08h00 – 16h00',
    poster: '/images/spec/portrait-ameziane-leila.jpeg',
    icon: Activity,
    accent: '#10B981',
    gradient: 'from-emerald-500 via-emerald-400 to-teal-500',
  },
  {
    id: 'boukredera-amira',
    name: 'Dr. Boukredera Amira',
    specialty: 'Pédiatre',
    services: [
      'Consultation',
      'Suivi des maladies chroniques',
      'Suivi du développement de l’enfant',
    ],
    days: 'Du samedi au jeudi',
    hours: '08h00 – 16h00',
    poster: '/images/spec/portrait-boukredera-amira.jpeg',
    icon: Baby,
    accent: '#F59E0B',
    gradient: 'from-amber-400 via-yellow-400 to-orange-400',
  },
  {
    id: 'zerizer-loubna',
    name: 'Dr. Zerizer Loubna',
    specialty: 'Médecine interne',
    services: [
      'Diabète & glande thyroïde',
      'Maladies de l’appareil digestif & du foie',
      'Maladies auto-immunes & rhumatismes',
      'Maladies rares',
      'Cholestérol élevé',
      'Anémie',
    ],
    days: 'Du samedi au jeudi',
    hours: '08h00 – 16h00',
    poster: '/images/spec/portrait-zerizer-loubna.jpeg',
    icon: Stethoscope,
    accent: '#3B82F6',
    gradient: 'from-blue-600 via-blue-500 to-indigo-500',
  },
  {
    id: 'boughanout-seyfeddine',
    name: 'Dr. Boughanout Seyfeddine',
    specialty: 'ORL',
    subtitle: 'Chirurgie de l’oreille, du nez, de la gorge, de la face & du cou',
    services: [
      'Traitement des allergies & vertiges',
      'Audiométrie & tympanométrie',
      'Endoscopie de l’oreille & du nez',
      'Chirurgie des amygdales & végétations',
      'Chirurgie de la thyroïde, glandes salivaires & lymphatiques',
      'Chirurgie endoscopique',
    ],
    days: 'Du samedi au mercredi',
    hours: '08h00 – 16h00',
    poster: '/images/spec/portrait-boughanout-seyfeddine.jpeg',
    icon: Ear,
    accent: '#F97316',
    gradient: 'from-orange-500 via-orange-400 to-yellow-500',
  },
  {
    id: 'aissaoui-laboratoire',
    name: 'Pr. Aissaoui',
    specialty: 'Responsable laboratoire',
    subtitle: 'Biologie médicale',
    services: [
      'Analyses biologiques',
      'Hématologie',
      'Biochimie',
      'Sérologie & immunologie',
      'Bactériologie',
    ],
    days: 'Du samedi au jeudi',
    hours: '08h00 – 16h00',
    poster: '/images/spec/portrait-aissaoui.png',
    icon: FlaskConical,
    accent: '#0EA5E9',
    gradient: 'from-sky-500 via-cyan-500 to-teal-500',
  },
]

/** Numéro WhatsApp principal de la clinique (format international, sans +) */
export const CLINIC_WHATSAPP = '213770884242'
/** Numéro d'appel principal */
export const CLINIC_PHONE = '+213770884242'
