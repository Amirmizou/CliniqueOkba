/**
 * Inventaire des sections éditables du site, utilisé à la fois par le menu
 * latéral et l'accueil du dashboard. `ready: true` = éditeur sur-mesure
 * disponible ; sinon on renvoie vers le Studio Sanity (couvre tout).
 */
export interface AdminSection {
  key: string
  label: string
  description: string
  /** Nom d'icône lucide-react */
  icon: string
  /** Route de l'éditeur sur-mesure (si disponible) */
  href?: string
  ready: boolean
  group: 'Accueil' | 'Équipe & Pôles' | 'Contenu' | 'Configuration'
}

export const adminSections: AdminSection[] = [
  // --- Accueil ---
  {
    key: 'hero',
    label: "Carousel d'accueil",
    description: 'Slides du hero : titres FR/AR, sous-titres et images.',
    icon: 'GalleryHorizontalEnd',
    href: '/admin/hero',
    ready: true,
    group: 'Accueil',
  },
  {
    key: 'sections',
    label: "Sections d'accueil",
    description: 'À propos, statistiques, soins à domicile, témoignages, vidéo.',
    icon: 'LayoutDashboard',
    href: '/admin/sections',
    ready: true,
    group: 'Accueil',
  },
  // --- Équipe & Pôles ---
  {
    key: 'medecins',
    label: 'Médecins',
    description: 'Équipe médicale : noms FR/AR, spécialités, photos, horaires.',
    icon: 'Stethoscope',
    href: '/admin/medecins',
    ready: true,
    group: 'Équipe & Pôles',
  },
  {
    key: 'poles',
    label: "Pôles d'excellence",
    description: 'Départements : descriptions FR/AR, prestations.',
    icon: 'Activity',
    href: '/admin/poles',
    ready: true,
    group: 'Équipe & Pôles',
  },
  // --- Contenu (via Studio pour l'instant) ---
  {
    key: 'actualites',
    label: 'Actualités',
    description: 'Articles de blog et annonces.',
    icon: 'Newspaper',
    href: '/admin/actualites',
    ready: true,
    group: 'Contenu',
  },
  {
    key: 'evenements',
    label: 'Événements',
    description: 'Agenda : journées de dépistage, conférences, portes ouvertes.',
    icon: 'CalendarDays',
    href: '/admin/evenements',
    ready: true,
    group: 'Contenu',
  },
  {
    key: 'galerie',
    label: 'Galerie & Équipements',
    description: 'Photos des installations et équipements médicaux.',
    icon: 'Images',
    href: '/admin/galerie',
    ready: true,
    group: 'Contenu',
  },
  {
    key: 'videos',
    label: 'Vidéos',
    description: 'Vidéothèque promotionnelle de la clinique.',
    icon: 'Film',
    href: '/admin/videos',
    ready: true,
    group: 'Contenu',
  },
  {
    key: 'faq',
    label: 'FAQ',
    description: 'Questions fréquentes (FR/AR).',
    icon: 'HelpCircle',
    href: '/admin/faq',
    ready: true,
    group: 'Contenu',
  },
  {
    key: 'conventions',
    label: 'Conventions',
    description: 'Partenaires et prise en charge.',
    icon: 'Handshake',
    href: '/admin/conventions',
    ready: true,
    group: 'Contenu',
  },
  {
    key: 'beneficiaires',
    label: 'Bénéficiaires',
    description: 'Inscriptions des organismes conventionnés, liste par organisme.',
    icon: 'Users',
    href: '/admin/beneficiaires',
    ready: true,
    group: 'Contenu',
  },
  // --- Configuration ---
  {
    key: 'statistiques',
    label: 'Visites du site',
    description: 'Nombre de visites et pages les plus consultées.',
    icon: 'BarChart3',
    href: '/admin/statistiques',
    ready: true,
    group: 'Configuration',
  },
  {
    key: 'parametres',
    label: 'Paramètres du site',
    description: 'Nom, téléphone, WhatsApp, adresse, horaires, réseaux sociaux.',
    icon: 'Settings',
    href: '/admin/parametres',
    ready: true,
    group: 'Configuration',
  },
  {
    key: 'footer',
    label: 'Pied de page',
    description: 'Description et mentions du footer.',
    icon: 'PanelBottom',
    href: '/admin/footer',
    ready: true,
    group: 'Configuration',
  },
]

/** URL du Studio Sanity (secours pour les sections sans éditeur dédié). */
export const STUDIO_URL = '/admin/dashboard'
