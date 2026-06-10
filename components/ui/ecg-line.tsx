'use client'

import { motion } from 'framer-motion'

// Tracés ECG par « nature » de pôle (viewBox 0..300, ligne de base y=20)
const PATHS = {
  // Battement classique (QRS) — défaut
  heartbeat:
    'M0,20 H60 l5,0 4,-13 5,26 4,-13 H130 l5,0 4,-13 5,26 4,-13 H210 l5,0 4,-13 5,26 4,-13 H300',
  // Calme, amplitude douce — consultations
  pulse: 'M0,21 H70 q6,0 9,-7 t9,7 H150 q6,0 9,-7 t9,7 H230 q6,0 9,-7 t9,7 H300',
  // Urgent : pics rapprochés et hauts — urgences
  urgent:
    'M0,20 H24 l5,-15 4,28 5,-15 H64 l5,-15 4,28 5,-15 H104 l5,-15 4,28 5,-15 H144 l5,-15 4,28 5,-15 H184 l5,-15 4,28 5,-15 H224 l5,-15 4,28 5,-15 H264 l5,-15 4,28 5,-15 H300',
  // Onde sinusoïdale lisse (balayage) — imagerie
  scan: 'M0,20 Q37,3 75,20 T150,20 T225,20 T300,20',
  // Signal numérique / créneaux — laboratoire
  lab: 'M0,28 H34 V12 H68 V28 H102 V12 H136 V28 H170 V12 H204 V28 H238 V12 H272 V28 H300',
  // Précis : pics nets espacés — chirurgie
  surgery:
    'M0,20 H86 L93,20 97,4 101,36 105,20 H192 L199,20 203,4 207,36 211,20 H300',
  // Zigzag / dents — dentaire
  dental:
    'M0,28 L22,12 44,28 66,12 88,28 110,12 132,28 154,12 176,28 198,12 220,28 242,12 264,28 286,12 300,20',
} as const

export type ECGVariant = keyof typeof PATHS

// Vitesse de balayage par variante (s)
const DURATIONS: Record<ECGVariant, number> = {
  heartbeat: 3.2,
  pulse: 3.4,
  urgent: 1.8,
  scan: 4.2,
  lab: 3,
  surgery: 3.6,
  dental: 3,
}

/** Associe l'icône d'un pôle à son signal ECG caractéristique */
export function ecgVariantForIcon(iconName?: string): ECGVariant {
  switch (iconName) {
    case 'ScanLine':
      return 'scan'
    case 'Smile':
      return 'dental'
    case 'Stethoscope':
      return 'pulse'
    case 'Siren':
      return 'urgent'
    case 'FlaskConical':
      return 'lab'
    case 'Eye':
      return 'surgery'
    case 'Heart':
      return 'heartbeat' // Cardiologie
    case 'Baby':
      return 'pulse' // Maternité
    case 'ScanEye':
      return 'pulse' // Ophtalmologie
    case 'Activity':
      return 'pulse' // Kinésithérapie
    case 'Pill':
      return 'heartbeat' // Pharmacie
    default:
      return 'heartbeat'
  }
}

interface ECGLineProps {
  className?: string
  color?: string
  height?: number
  /** Type de tracé (signal propre au pôle) */
  variant?: ECGVariant
  /** Durée d'un balayage (s) — sinon valeur par défaut de la variante */
  duration?: number
}

/**
 * Ligne ECG animée (effet moniteur de signes vitaux).
 * Une ligne de fond discrète + un segment lumineux qui balaie le tracé.
 */
export function ECGLine({
  className = '',
  color = '#006633',
  height = 40,
  variant = 'heartbeat',
  duration,
}: ECGLineProps) {
  const d = PATHS[variant]
  const dur = duration ?? DURATIONS[variant]

  return (
    <svg
      className={className}
      width="100%"
      height={height}
      viewBox="0 0 300 40"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={d}
        stroke={color}
        strokeOpacity={0.15}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        strokeDasharray="0.16 0.84"
        style={{ filter: `drop-shadow(0 0 5px ${color})` }}
        animate={{ strokeDashoffset: [1, 0] }}
        transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  )
}
