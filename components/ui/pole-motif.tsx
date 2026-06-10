'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export type MotifVariant =
  | 'scan'
  | 'molecule'
  | 'pulse'
  | 'urgent'
  | 'dental'
  | 'surgery'
  | 'cardio'
  | 'maternity'
  | 'iris'
  | 'kine'
  | 'pharma'

/** Associe l'icône d'un pôle à son animation de domaine */
export function motifVariantForIcon(iconName?: string): MotifVariant {
  switch (iconName) {
    case 'ScanLine':
      return 'scan' // Imagerie
    case 'FlaskConical':
      return 'molecule' // Laboratoire
    case 'Stethoscope':
      return 'pulse' // Consultations
    case 'Siren':
      return 'urgent' // Urgences
    case 'Smile':
      return 'dental' // Dentaire
    case 'Eye':
      return 'surgery' // Bloc opératoire / Chirurgie
    case 'Heart':
      return 'cardio' // Cardiologie
    case 'Baby':
      return 'maternity' // Maternité
    case 'ScanEye':
      return 'iris' // Ophtalmologie
    case 'Activity':
      return 'kine' // Kinésithérapie
    case 'Pill':
      return 'pharma' // Pharmacie
    default:
      return 'pulse'
  }
}

export function PoleMotif({
  variant,
  color,
}: {
  variant: MotifVariant
  color: string
}) {
  const reduce = !!useReducedMotion()

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden opacity-[0.16]"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 100 120"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {variant === 'scan' && <ScanMotif color={color} reduce={reduce} />}
        {variant === 'molecule' && <MoleculeMotif color={color} reduce={reduce} />}
        {variant === 'pulse' && <PulseMotif color={color} reduce={reduce} />}
        {variant === 'urgent' && <UrgentMotif color={color} reduce={reduce} />}
        {variant === 'dental' && <DentalMotif color={color} reduce={reduce} />}
        {variant === 'surgery' && <SurgeryMotif color={color} reduce={reduce} />}
        {variant === 'cardio' && <CardioMotif color={color} reduce={reduce} />}
        {variant === 'maternity' && <MaternityMotif color={color} reduce={reduce} />}
        {variant === 'iris' && <IrisMotif color={color} reduce={reduce} />}
        {variant === 'kine' && <KineMotif color={color} reduce={reduce} />}
        {variant === 'pharma' && <PharmaMotif color={color} reduce={reduce} />}
      </svg>
    </div>
  )
}

type MotifProps = { color: string; reduce: boolean }

/* --------------------------- Imagerie : balayage --------------------------- */
function ScanMotif({ color, reduce }: MotifProps) {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={`v${i}`} x1={i * 24 + 6} y1={0} x2={i * 24 + 6} y2={120} stroke={color} strokeWidth={0.5} strokeOpacity={0.5} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <line key={`h${i}`} x1={0} y1={i * 34 + 16} x2={100} y2={i * 34 + 16} stroke={color} strokeWidth={0.5} strokeOpacity={0.35} />
      ))}
      {!reduce && (
        <motion.rect
          y={0}
          width={22}
          height={120}
          fill={color}
          style={{ filter: 'blur(6px)' }}
          initial={{ x: -24 }}
          animate={{ x: [-24, 104] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
        />
      )}
    </>
  )
}

/* ----------------- Laboratoire : molécules + liaisons (biologie) ----------------- */
function MoleculeMotif({ color, reduce }: MotifProps) {
  const nodes = [
    { x: 22, y: 34 }, { x: 48, y: 22 }, { x: 72, y: 38 },
    { x: 36, y: 64 }, { x: 62, y: 78 }, { x: 84, y: 62 },
  ]
  const bonds: [number, number, number][] = [
    [0, 1, 0], [1, 2, 0.6], [0, 3, 1.2], [3, 4, 0.4], [2, 5, 0.9], [4, 5, 1.5], [1, 3, 2],
  ]
  return (
    <>
      {bonds.map(([a, b, delay], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke={color} strokeWidth={1}
          animate={reduce ? { opacity: 0.3 } : { opacity: [0.08, 0.5, 0.08] }}
          transition={reduce ? {} : { duration: 3.4, repeat: Infinity, delay, ease: 'easeInOut' }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r={3} fill={color}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={reduce ? {} : { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={reduce ? {} : { duration: 3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        />
      ))}
    </>
  )
}

/* --------------------- Consultations : ondes cardiaques ---------------------- */
function PulseMotif({ color, reduce, fast = false }: MotifProps & { fast?: boolean }) {
  const cx = 76, cy = 28
  const dur = fast ? 1.9 : 3.2
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy} r={6} fill="none" stroke={color} strokeWidth={1.5}
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 0.35 } : { r: [6, 52], opacity: [0.55, 0] }}
          transition={reduce ? {} : { duration: dur, repeat: Infinity, delay: i * (dur / 3), ease: 'easeOut' }}
        />
      ))}
      <circle cx={cx} cy={cy} r={2.5} fill={color} />
    </>
  )
}

/* ------------------ Urgences : flash + ondes rapides + clignotant ------------------ */
function UrgentMotif({ color, reduce }: MotifProps) {
  return (
    <>
      {!reduce && (
        <motion.rect
          x={0} y={0} width={100} height={120} fill={color}
          animate={{ opacity: [0, 0.18, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', times: [0, 0.08, 1] }}
        />
      )}
      <PulseMotif color={color} reduce={reduce} fast />
    </>
  )
}

/* --------------------- Dentaire : dent + reflets cristallins --------------------- */
function DentalMotif({ color, reduce }: MotifProps) {
  const tooth =
    'M50,24 c-9,0 -15,6 -15,16 c0,8 2,14 4,22 c1,5 2,11 4,11 c2,0 2,-7 3,-11 c1,-4 2,-6 4,-6 c2,0 3,2 4,6 c1,4 1,11 3,11 c2,0 3,-6 4,-11 c2,-8 4,-14 4,-22 c0,-10 -6,-16 -15,-16 z'
  const sparkles = [{ x: 44, y: 42, d: 0 }, { x: 58, y: 36, d: 0.9 }, { x: 54, y: 60, d: 1.7 }]
  return (
    <>
      <motion.path
        d={tooth} fill={color}
        animate={reduce ? { fillOpacity: 0.4 } : { fillOpacity: [0.25, 0.5, 0.25] }}
        transition={reduce ? {} : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {sparkles.map((sp, i) => (
        <g key={i} transform={`translate(${sp.x} ${sp.y})`}>
          <motion.path
            d="M0,-5 L1.2,-1.2 5,0 1.2,1.2 0,5 -1.2,1.2 -5,0 -1.2,-1.2 Z"
            fill="#ffffff"
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={reduce ? { opacity: 0.5, scale: 1 } : { scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={reduce ? {} : { duration: 2.2, repeat: Infinity, delay: sp.d, ease: 'easeInOut' }}
          />
        </g>
      ))}
    </>
  )
}

/* --------------------------- Chirurgie : réticule --------------------------- */
function SurgeryMotif({ color, reduce }: MotifProps) {
  const cx = 74, cy = 30
  return (
    <>
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={reduce ? {} : { duration: 26, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx={cx} cy={cy} r={20} fill="none" stroke={color} strokeWidth={1} strokeDasharray="3 5" />
      </motion.g>
      <circle cx={cx} cy={cy} r={11} fill="none" stroke={color} strokeWidth={1} />
      <line x1={cx} y1={cy - 26} x2={cx} y2={cy - 14} stroke={color} strokeWidth={1} />
      <line x1={cx} y1={cy + 14} x2={cx} y2={cy + 26} stroke={color} strokeWidth={1} />
      <line x1={cx - 26} y1={cy} x2={cx - 14} y2={cy} stroke={color} strokeWidth={1} />
      <line x1={cx + 14} y1={cy} x2={cx + 26} y2={cy} stroke={color} strokeWidth={1} />
      {/* Verrouillage de cible */}
      <motion.rect
        x={cx - 7} y={cy - 7} width={14} height={14} fill="none" stroke={color} strokeWidth={1.2}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={reduce ? { opacity: 0.5 } : { scale: [1.6, 1], opacity: [0, 1, 0] }}
        transition={reduce ? {} : { duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.circle
        cx={cx} cy={cy} r={3} fill={color}
        animate={reduce ? {} : { opacity: [0.4, 1, 0.4] }}
        transition={reduce ? {} : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  )
}

/* ---------------------------- Cardiologie : ECG vivant ---------------------------- */
function CardioMotif({ color, reduce }: MotifProps) {
  const d = 'M0,60 H34 l5,-22 5,40 5,-30 4,12 H100'
  return (
    <>
      <path d={d} stroke={color} strokeWidth={1} strokeOpacity={0.25} fill="none" />
      {!reduce && (
        <motion.path
          d={d} stroke={color} strokeWidth={2} strokeLinecap="round" fill="none"
          pathLength={1} strokeDasharray="0.18 0.82"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          animate={{ strokeDashoffset: [1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <motion.circle
        cx={49} cy={40} r={3} fill={color}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={reduce ? {} : { scale: [1, 1.8, 1], opacity: [0.7, 1, 0.7] }}
        transition={reduce ? {} : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  )
}

/* --------------------- Maternité : halo protecteur + particules --------------------- */
function MaternityMotif({ color, reduce }: MotifProps) {
  const cx = 70, cy = 34
  const dots = [{ x: 26, d: 0 }, { x: 44, d: 1.3 }, { x: 60, d: 0.7 }, { x: 82, d: 2 }]
  return (
    <>
      {[0, 1].map((i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy} r={14 + i * 8} fill="none" stroke={color} strokeWidth={1.2}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={reduce ? { opacity: 0.4 } : { scale: [1, 1.12, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={reduce ? {} : { duration: 4, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
        />
      ))}
      {dots.map((p, i) => (
        <motion.circle
          key={i} cx={p.x} r={1.8} fill={color}
          initial={{ cy: 120, opacity: 0 }}
          animate={reduce ? { cy: 60, opacity: 0.4 } : { cy: [120, -8], opacity: [0, 0.7, 0] }}
          transition={reduce ? {} : { duration: 6, repeat: Infinity, delay: p.d, ease: 'easeIn' }}
        />
      ))}
    </>
  )
}

/* ----------------------------- Ophtalmologie : iris ----------------------------- */
function IrisMotif({ color, reduce }: MotifProps) {
  const cx = 72, cy = 32
  return (
    <>
      <circle cx={cx} cy={cy} r={22} fill="none" stroke={color} strokeWidth={1} strokeOpacity={0.4} />
      <circle cx={cx} cy={cy} r={15} fill="none" stroke={color} strokeWidth={1} strokeDasharray="2 3" />
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={reduce ? {} : { duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx={cx} cy={cy} r={15} fill="none" stroke={color} strokeWidth={2} strokeDasharray="1 7" />
      </motion.g>
      <motion.circle
        cx={cx} cy={cy} r={6} fill={color}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={reduce ? {} : { scale: [1, 0.55, 1] }}
        transition={reduce ? {} : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  )
}

/* ---------------------- Kinésithérapie : articulation en mouvement ---------------------- */
function KineMotif({ color, reduce }: MotifProps) {
  const hip = { x: 40, y: 34 }
  return (
    <>
      <path d="M16,30 Q50,70 84,40" fill="none" stroke={color} strokeWidth={1} strokeDasharray="2 4" strokeOpacity={0.4} />
      {/* Segment qui pivote autour de l'articulation (hip) */}
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: `${hip.x}px ${hip.y}px` }}
        animate={reduce ? {} : { rotate: [-22, 22, -22] }}
        transition={reduce ? {} : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <line x1={hip.x} y1={hip.y} x2={hip.x + 30} y2={hip.y + 30} stroke={color} strokeWidth={2} strokeLinecap="round" />
        <circle cx={hip.x + 30} cy={hip.y + 30} r={3.5} fill={color} />
      </motion.g>
      <circle cx={hip.x} cy={hip.y} r={4} fill={color} />
    </>
  )
}

/* ----------------------- Pharmacie : flux vers la croix ----------------------- */
function PharmaMotif({ color, reduce }: MotifProps) {
  const cx = 50, cy = 46
  const starts = [
    { x: 14, y: 18 }, { x: 86, y: 20 }, { x: 18, y: 78 }, { x: 84, y: 74 }, { x: 50, y: 12 },
  ]
  return (
    <>
      {starts.map((s, i) => (
        <motion.circle
          key={i} r={2} fill={color}
          initial={{ cx: s.x, cy: s.y, opacity: 0 }}
          animate={reduce ? { cx: s.x, cy: s.y, opacity: 0.4 } : { cx: [s.x, cx], cy: [s.y, cy], opacity: [0, 0.8, 0] }}
          transition={reduce ? {} : { duration: 3, repeat: Infinity, delay: i * 0.5, ease: 'easeIn' }}
        />
      ))}
      {/* Croix médicale */}
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={reduce ? {} : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={reduce ? {} : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x={cx - 3} y={cy - 9} width={6} height={18} rx={1.5} fill={color} />
        <rect x={cx - 9} y={cy - 3} width={18} height={6} rx={1.5} fill={color} />
      </motion.g>
    </>
  )
}
