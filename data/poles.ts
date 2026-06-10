// Pôles d'excellence de la Clinique OKBA
// Vue d'ensemble des grands départements + page dédiée par pôle.

import type { EquipementCategoryId } from './equipements'
import { CLINIC_PHONE } from './doctors'

export { CLINIC_PHONE }

export interface Pole {
  id: string
  /** Identifiant d'URL : /poles/<slug> */
  slug: string
  title: string
  description: string
  /** Sous-spécialités / prestations clés du pôle */
  items: string[]
  /** Nom de l'icône Lucide (résolu côté composant) */
  iconName: string
  /** Couleur d'accent (HEX) */
  accent: string
  /** Badge (ex : « 24h/24 ») */
  badge?: string
  /** Pôle mis en avant (urgences) avec style distinct */
  urgent?: boolean
  /** Catégories de la galerie correspondant à ce pôle (photos de la page dédiée) */
  galleryCategories: EquipementCategoryId[]
  /** Introduction longue affichée sur la page dédiée */
  intro?: string
}

export const poles: Pole[] = [
  {
    id: 'imagerie',
    slug: 'imagerie',
    title: 'Imagerie médicale de pointe',
    description:
      'Un plateau d’imagerie complet pour des diagnostics rapides et précis.',
    items: [
      'Scanner (TDM)',
      'IRM',
      'Mammographie',
      'Radiologie numérique',
      'Échographie',
      'Scintigraphie',
    ],
    iconName: 'ScanLine',
    accent: '#3B82F6',
    galleryCategories: ['imagerie'],
    intro:
      'Notre service d’imagerie réunit scanner, IRM, mammographie, radiologie numérique, échographie et scintigraphie. Des équipements de dernière génération, au service d’un diagnostic fiable et rapide.',
  },
  {
    id: 'dentaire',
    slug: 'dentaire',
    title: 'Pôle dentaire',
    description: 'Toutes les spécialités dentaires réunies sous un même toit.',
    items: [
      'Consultation dentaire',
      'Chirurgie dentaire',
      'Orthodontie (ODF)',
      'Prothèse dentaire',
    ],
    iconName: 'Smile',
    accent: '#06B6D4',
    galleryCategories: [],
    intro:
      'Un pôle dentaire complet : consultation, chirurgie, orthodontie dento-faciale (ODF) et prothèse dentaire, pour prendre en charge tous vos besoins bucco-dentaires.',
  },
  {
    id: 'consultations',
    slug: 'consultations',
    title: 'Consultations spécialisées',
    description:
      'Des médecins spécialistes à votre écoute pour un suivi personnalisé.',
    items: [
      'Gynécologie-obstétrique',
      'Endocrinologie',
      'Pédiatrie',
      'Médecine interne',
      'ORL',
    ],
    iconName: 'Stethoscope',
    accent: '#A855F7',
    galleryCategories: ['consultation'],
    intro:
      'Nos médecins spécialistes vous reçoivent dans des cabinets modernes et équipés : gynécologie-obstétrique, endocrinologie, pédiatrie, médecine interne et ORL.',
  },
  {
    id: 'urgences',
    slug: 'urgences',
    title: 'Urgences 24h/24',
    description: 'Une équipe médicale de garde, disponible jour et nuit, 7j/7.',
    items: ['Accueil permanent', 'Équipe de garde', 'Prise en charge immédiate'],
    iconName: 'Siren',
    accent: '#EF4444',
    badge: '24h/24 · 7j/7',
    urgent: true,
    galleryCategories: ['accueil'],
    intro:
      'Un service d’urgences ouvert 24h/24 et 7j/7. Une équipe de garde vous accueille et vous prend en charge sans délai, à toute heure.',
  },
  {
    id: 'laboratoire',
    slug: 'laboratoire',
    title: 'Laboratoire d’analyses médicales',
    description:
      'Analyses biologiques fiables grâce à des automates de dernière génération.',
    items: [
      'Bilans sanguins',
      'Prélèvements',
      'Biochimie',
      'Sérologie',
      'Hématologie',
    ],
    iconName: 'FlaskConical',
    accent: '#8B5CF6',
    galleryCategories: ['laboratoire'],
    intro:
      'Notre laboratoire d’analyses médicales réalise vos bilans sanguins et prélèvements sur des automates de dernière génération, pour des résultats fiables et rapides.',
  },
  {
    id: 'chirurgie',
    slug: 'chirurgie',
    title: 'Chirurgie spécialisée',
    description:
      'Bloc opératoire aux normes pour la chirurgie ophtalmologique et ORL.',
    items: ['Chirurgie ophtalmologique', 'Chirurgie ORL'],
    iconName: 'Eye',
    accent: '#10B981',
    galleryCategories: ['bloc'],
    intro:
      'Nos blocs opératoires aux normes accueillent la chirurgie ophtalmologique et ORL, dans des conditions d’asepsie et de sécurité optimales.',
  },
]

export function getPoleBySlug(slug: string): Pole | undefined {
  return poles.find((p) => p.slug === slug)
}
