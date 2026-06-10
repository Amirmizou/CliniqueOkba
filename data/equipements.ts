// Galerie « Plateau technique & espaces » de la Clinique OKBA
// Photos réelles optimisées : public/images/equipements/eq-01.jpg … eq-43.jpg
// Chaque cliché a été analysé puis classé par pôle.

import {
  ScanLine,
  Activity,
  FlaskConical,
  BedDouble,
  Stethoscope,
  Building2,
  type LucideIcon,
} from 'lucide-react'

export type EquipementCategoryId =
  | 'imagerie'
  | 'bloc'
  | 'laboratoire'
  | 'hospitalisation'
  | 'consultation'
  | 'accueil'

export interface EquipementCategory {
  id: EquipementCategoryId
  label: string
  /** Phrase courte décrivant le pôle */
  tagline: string
  icon: LucideIcon
  /** Couleur d'accent (HEX) */
  accent: string
}

export interface EquipementItem {
  id: string
  src: string
  category: EquipementCategoryId
  title: string
  description: string
  /** Met l'image en avant (grande tuile dans la grille) */
  featured?: boolean
}

export const equipementCategories: EquipementCategory[] = [
  {
    id: 'imagerie',
    label: 'Imagerie médicale',
    tagline: 'Scanner, IRM, scintigraphie, mammographie & radiologie numérique',
    icon: ScanLine,
    accent: '#3B82F6',
  },
  {
    id: 'bloc',
    label: 'Bloc opératoire',
    tagline: 'Salles d’opération aux normes, équipées pour la chirurgie',
    icon: Activity,
    accent: '#10B981',
  },
  {
    id: 'laboratoire',
    label: 'Laboratoire d’analyses',
    tagline: 'Automates de dernière génération & prélèvements',
    icon: FlaskConical,
    accent: '#8B5CF6',
  },
  {
    id: 'hospitalisation',
    label: 'Hospitalisation',
    tagline: 'Chambres confortables & unités de soins',
    icon: BedDouble,
    accent: '#F59E0B',
  },
  {
    id: 'consultation',
    label: 'Consultation & exploration',
    tagline: 'Cabinets, échographie & salles d’examen',
    icon: Stethoscope,
    accent: '#EC4899',
  },
  {
    id: 'accueil',
    label: 'Espaces d’accueil',
    tagline: 'Réception, attente & circulation lumineuses',
    icon: Building2,
    accent: '#14B8A6',
  },
]

export const equipements: EquipementItem[] = [
  /* ----------------------------- Imagerie médicale ----------------------------- */
  {
    id: 'eq-03',
    src: '/images/equipements/eq-03.jpg',
    category: 'imagerie',
    title: 'Scanner Siemens SOMATOM go.Top',
    description:
      'Scanner haute définition pour des images en coupes ultra-précises, en quelques secondes.',
    featured: true,
  },
  {
    id: 'eq-33',
    src: '/images/equipements/eq-33.jpg',
    category: 'imagerie',
    title: 'IRM Siemens',
    description:
      'Imagerie par résonance magnétique dans un environnement apaisant (plafond panoramique).',
    featured: true,
  },
  {
    id: 'eq-02',
    src: '/images/equipements/eq-02.jpg',
    category: 'imagerie',
    title: 'Gamma caméra – Scintigraphie',
    description:
      'Médecine nucléaire : exploration fonctionnelle des organes par imagerie isotopique.',
    featured: true,
  },
  {
    id: 'eq-35',
    src: '/images/equipements/eq-35.jpg',
    category: 'imagerie',
    title: 'Mammographe numérique',
    description: 'Dépistage et diagnostic du sein avec un faible niveau d’irradiation.',
  },
  {
    id: 'eq-40',
    src: '/images/equipements/eq-40.jpg',
    category: 'imagerie',
    title: 'Salle de radiologie',
    description: 'Radiographie numérique pour os, thorax et explorations courantes.',
  },
  {
    id: 'eq-43',
    src: '/images/equipements/eq-43.jpg',
    category: 'imagerie',
    title: 'Capteur de radiographie numérique',
    description: 'Tube et capteur plan dynamique pour des clichés nets et immédiats.',
  },
  {
    id: 'eq-32',
    src: '/images/equipements/eq-32.jpg',
    category: 'imagerie',
    title: 'IRM – salle de commande',
    description: 'Poste de pilotage et de reconstruction des images IRM.',
  },
  {
    id: 'eq-37',
    src: '/images/equipements/eq-37.jpg',
    category: 'imagerie',
    title: 'IRM – poste de contrôle',
    description: 'Supervision de l’examen depuis la salle technique vitrée.',
  },
  {
    id: 'eq-04',
    src: '/images/equipements/eq-04.jpg',
    category: 'imagerie',
    title: 'Scanner – vue de la salle',
    description: 'Salle de scanner spacieuse et entièrement aux normes radioprotection.',
  },
  {
    id: 'eq-31',
    src: '/images/equipements/eq-31.jpg',
    category: 'imagerie',
    title: 'Scanner – salle d’examen',
    description: 'Environnement lumineux pensé pour le confort du patient.',
  },
  {
    id: 'eq-08',
    src: '/images/equipements/eq-08.jpg',
    category: 'imagerie',
    title: 'Médecine nucléaire',
    description: 'Détecteurs double tête de la gamma caméra pour la scintigraphie.',
  },

  /* ------------------------------- Bloc opératoire ----------------------------- */
  {
    id: 'eq-09',
    src: '/images/equipements/eq-09.jpg',
    category: 'bloc',
    title: 'Bloc opératoire',
    description:
      'Table chirurgicale, bras plafonniers et éclairage scialytique de haute précision.',
    featured: true,
  },
  {
    id: 'eq-11',
    src: '/images/equipements/eq-11.jpg',
    category: 'bloc',
    title: 'Salle d’opération',
    description: 'Salle aux normes d’asepsie, équipée pour la chirurgie spécialisée.',
  },
  {
    id: 'eq-12',
    src: '/images/equipements/eq-12.jpg',
    category: 'bloc',
    title: 'Bloc – plateau technique',
    description: 'Bras de distribution des fluides médicaux et colonnes opératoires.',
  },
  {
    id: 'eq-10',
    src: '/images/equipements/eq-10.jpg',
    category: 'bloc',
    title: 'Bloc opératoire',
    description: 'Éclairage opératoire LED et surfaces facilement décontaminables.',
  },
  {
    id: 'eq-13',
    src: '/images/equipements/eq-13.jpg',
    category: 'bloc',
    title: 'Salle chirurgicale',
    description: 'Espace dédié aux interventions, ventilation et hygiène maîtrisées.',
  },

  /* ----------------------------- Laboratoire ----------------------------------- */
  {
    id: 'eq-27',
    src: '/images/equipements/eq-27.jpg',
    category: 'laboratoire',
    title: 'Laboratoire d’analyses',
    description:
      'Plateau d’analyses médicales automatisé pour des résultats fiables et rapides.',
    featured: true,
  },
  {
    id: 'eq-23',
    src: '/images/equipements/eq-23.jpg',
    category: 'laboratoire',
    title: 'Automate Alegria',
    description: 'Analyseur immunologique à écran tactile pour les bilans sanguins.',
  },
  {
    id: 'eq-26',
    src: '/images/equipements/eq-26.jpg',
    category: 'laboratoire',
    title: 'Automate de biochimie',
    description: 'Traitement des échantillons sous contrôle informatique permanent.',
  },
  {
    id: 'eq-25',
    src: '/images/equipements/eq-25.jpg',
    category: 'laboratoire',
    title: 'Paillasses techniques',
    description: 'Postes de travail ergonomiques et lumineux pour les biologistes.',
  },
  {
    id: 'eq-30',
    src: '/images/equipements/eq-30.jpg',
    category: 'laboratoire',
    title: 'Salle technique',
    description: 'Espace d’analyse organisé pour un flux d’échantillons optimisé.',
  },
  {
    id: 'eq-28',
    src: '/images/equipements/eq-28.jpg',
    category: 'laboratoire',
    title: 'Salle de prélèvement',
    description: 'Accueil confortable des patients pour les prises de sang.',
  },
  {
    id: 'eq-24',
    src: '/images/equipements/eq-24.jpg',
    category: 'laboratoire',
    title: 'Accueil du laboratoire',
    description: 'Réception dédiée aux analyses, claire et accessible.',
  },

  /* --------------------------- Hospitalisation --------------------------------- */
  {
    id: 'eq-05',
    src: '/images/equipements/eq-05.jpg',
    category: 'hospitalisation',
    title: 'Chambre d’hospitalisation',
    description: 'Lits médicalisés et espace baigné de lumière naturelle.',
    featured: true,
  },
  {
    id: 'eq-41',
    src: '/images/equipements/eq-41.jpg',
    category: 'hospitalisation',
    title: 'Unité de soins',
    description: 'Salle de surveillance avec chariot d’urgence et poste infirmier.',
  },
  {
    id: 'eq-06',
    src: '/images/equipements/eq-06.jpg',
    category: 'hospitalisation',
    title: 'Chambre confortable',
    description: 'Mobilier médical complet pour un séjour serein.',
  },
  {
    id: 'eq-19',
    src: '/images/equipements/eq-19.jpg',
    category: 'hospitalisation',
    title: 'Chambre collective',
    description: 'Lits réglables et chevets dédiés à chaque patient.',
  },
  {
    id: 'eq-20',
    src: '/images/equipements/eq-20.jpg',
    category: 'hospitalisation',
    title: 'Salle d’hospitalisation',
    description: 'Espace propre, spacieux et facile d’accès pour le personnel.',
  },
  {
    id: 'eq-07',
    src: '/images/equipements/eq-07.jpg',
    category: 'hospitalisation',
    title: 'Salle de surveillance',
    description: 'Lits de soins et poste de suivi rapproché des patients.',
  },
  {
    id: 'eq-14',
    src: '/images/equipements/eq-14.jpg',
    category: 'hospitalisation',
    title: 'Chambre d’hospitalisation',
    description: 'Confort, hygiène et luminosité au service du repos.',
  },
  {
    id: 'eq-15',
    src: '/images/equipements/eq-15.jpg',
    category: 'hospitalisation',
    title: 'Chambre patient',
    description: 'Lits médicalisés modernes dans un cadre apaisant.',
  },
  {
    id: 'eq-16',
    src: '/images/equipements/eq-16.jpg',
    category: 'hospitalisation',
    title: 'Chambre double',
    description: 'Aménagement équilibré pour le confort de deux patients.',
  },
  {
    id: 'eq-22',
    src: '/images/equipements/eq-22.jpg',
    category: 'hospitalisation',
    title: 'Chambre lumineuse',
    description: 'Grandes ouvertures et finitions soignées.',
  },

  /* ---------------------- Consultation & exploration --------------------------- */
  {
    id: 'eq-29',
    src: '/images/equipements/eq-29.jpg',
    category: 'consultation',
    title: 'Salle d’échographie',
    description: 'Échographe performant pour l’imagerie en temps réel.',
    featured: true,
  },
  {
    id: 'eq-01',
    src: '/images/equipements/eq-01.jpg',
    category: 'consultation',
    title: 'Salle d’exploration gynécologique',
    description: 'Table d’examen et échographe dédiés au suivi de la femme.',
  },
  {
    id: 'eq-42',
    src: '/images/equipements/eq-42.jpg',
    category: 'consultation',
    title: 'Salle d’examen',
    description: 'Espace d’examen équipé et préservant l’intimité du patient.',
  },
  {
    id: 'eq-21',
    src: '/images/equipements/eq-21.jpg',
    category: 'consultation',
    title: 'Cabinet médical',
    description: 'Cabinet de consultation moderne et accueillant.',
  },
  {
    id: 'eq-17',
    src: '/images/equipements/eq-17.jpg',
    category: 'consultation',
    title: 'Salle de consultation',
    description: 'Espace de dialogue avec le médecin et table d’examen.',
  },
  {
    id: 'eq-36',
    src: '/images/equipements/eq-36.jpg',
    category: 'consultation',
    title: 'Cabinet de consultation',
    description: 'Environnement clair, pensé pour le confort de l’échange.',
  },

  /* ----------------------------- Espaces d'accueil ----------------------------- */
  {
    id: 'eq-34',
    src: '/images/equipements/eq-34.jpg',
    category: 'accueil',
    title: 'Réception principale',
    description: 'Un hall spacieux et lumineux pour vous orienter dès l’arrivée.',
    featured: true,
  },
  {
    id: 'eq-38',
    src: '/images/equipements/eq-38.jpg',
    category: 'accueil',
    title: 'Accueil pédiatrie',
    description: 'Un espace coloré et rassurant, pensé pour les enfants.',
  },
  {
    id: 'eq-39',
    src: '/images/equipements/eq-39.jpg',
    category: 'accueil',
    title: 'Espace d’attente',
    description: 'Salles d’attente confortables réparties à chaque étage.',
  },
  {
    id: 'eq-18',
    src: '/images/equipements/eq-18.jpg',
    category: 'accueil',
    title: 'Hall & ascenseur',
    description: 'Circulation fluide et accessible entre les services.',
  },
]
