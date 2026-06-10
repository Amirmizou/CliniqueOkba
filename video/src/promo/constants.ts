// ---------------------------------------------------------------------------
//  Identité de marque + données clinique (éditables ici)
// ---------------------------------------------------------------------------

export const FPS = 30

export const COLORS = {
  bg: '#02140b', // fond très sombre vert
  greenDark: '#00351b',
  greenDeep: '#006633', // couleur de marque principale
  green: '#0a8a45',
  greenLight: '#4caf6e',
  yellow: '#FDE68A', // jaune clair (accent dégradé)
  white: '#ffffff',
  mute: 'rgba(255,255,255,0.72)',
}

// Dégradé de marque vert profond -> jaune clair
export const BRAND_GRADIENT = `linear-gradient(90deg, ${COLORS.greenDeep} 0%, ${COLORS.greenLight} 55%, ${COLORS.yellow} 100%)`

export const CLINIC = {
  name: 'CLINIQUE OKBA',
  tagline: 'Excellence Médicale · Constantine',
  promiseLine1: 'Une prise en charge',
  promiseLine2: 'globale & personnalisée',
  specialties: [
    'Cardiologie',
    'Pneumologie',
    'Médecine interne',
    'Gynécologie',
    'Pédiatrie',
    'Neurologie',
    'Dermatologie',
    'ORL',
    'Endocrinologie',
  ],
  emergencyTitle: 'URGENCES 24/7',
  emergencySub: 'Disponible jour & nuit, toute l’année',
  phones: ['+213 770 88 42 42', '+213 770 88 43 43'],
  address: 'Ali Mendjeli, Constantine',
  social: '@clinique_okba',
  cta: 'Prenez rendez-vous',
}

// Durées de scènes (en frames @30fps)
export const SCENE = {
  intro: 125,
  promise: 90,
  specialties: 150,
  emergency: 110,
  contact: 145,
}

export const TRANSITION = 18

export const TOTAL_DURATION =
  SCENE.intro +
  SCENE.promise +
  SCENE.specialties +
  SCENE.emergency +
  SCENE.contact -
  4 * TRANSITION
