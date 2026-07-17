'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanLine, FlaskConical, Siren, Stethoscope, Eye, Smile, Radiation } from 'lucide-react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * Évoque les pôles de la clinique dans la bande du header — un seul à la fois.
 *
 * La navbar ne racontait qu'un scanner (gantry, éprouvette) alors que la clinique
 * couvre 7 pôles. Plutôt que d'animer les 7 en permanence (surcharge), on affiche
 * une vignette qui change toutes les DWELL_MS : chaque pôle a son micro-mouvement,
 * mais il n'y a jamais qu'une animation à l'écran.
 *
 * Purement décoratif → aria-hidden, jamais annoncé aux lecteurs d'écran.
 */

const DWELL_MS = 5000

interface Motif {
  id: string
  icon: typeof ScanLine
  label: string
  label_ar: string
  /** Rouge urgence plutôt que le vert de marque, pour ce seul pôle. */
  urgent?: boolean
}

const MOTIFS: Motif[] = [
  { id: 'imagerie', icon: ScanLine, label: 'Imagerie', label_ar: 'التصوير الطبي' },
  { id: 'laboratoire', icon: FlaskConical, label: 'Laboratoire', label_ar: 'المخبر' },
  { id: 'urgences', icon: Siren, label: 'Urgences 24h/24', label_ar: 'الاستعجالات', urgent: true },
  { id: 'consultations', icon: Stethoscope, label: 'Consultations', label_ar: 'الاستشارات' },
  { id: 'chirurgie', icon: Eye, label: 'Bloc opératoire', label_ar: 'قاعة العمليات' },
  { id: 'dentaire', icon: Smile, label: 'Dentaire', label_ar: 'طب الأسنان' },
  { id: 'nucleaire', icon: Radiation, label: 'Médecine nucléaire', label_ar: 'الطب النووي' },
]

/** Le mouvement propre à chaque pôle, joué derrière l'icône. */
function MotifDecor({ id, reduce, tint }: { id: string; reduce: boolean; tint: string }) {
  if (reduce) return null

  switch (id) {
    // Imagerie — l'anneau du scanner qui tourne
    case 'imagerie':
      return (
        <motion.span
          className="absolute inset-[-6px] rounded-full"
          style={{ border: `1px dashed ${tint}`, opacity: 0.5 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        />
      )
    // Laboratoire — la goutte qui tombe dans l'éprouvette
    case 'laboratoire':
      return (
        <motion.span
          className="absolute left-1/2 top-[-7px] h-[5px] w-[5px] -translate-x-1/2 rounded-full"
          style={{ background: tint }}
          animate={{ y: [0, 16], opacity: [0, 1, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeIn' }}
        />
      )
    // Urgences — le pouls qui bat
    case 'urgences':
      return (
        <motion.span
          className="absolute inset-[-8px] rounded-full"
          style={{ border: `1.5px solid ${tint}` }}
          animate={{ scale: [0.85, 1.25], opacity: [0.55, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeOut' }}
        />
      )
    // Consultations — l'onde d'auscultation
    case 'consultations':
      return (
        <motion.span
          className="absolute inset-[-7px] rounded-full"
          style={{ border: `1px solid ${tint}` }}
          animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
        />
      )
    // Bloc opératoire — le balayage du scialytique
    case 'chirurgie':
      return (
        <motion.span
          className="absolute inset-[-10px] rounded-full"
          style={{ background: `radial-gradient(circle at 50% 50%, ${tint}, transparent 65%)` }}
          animate={{ opacity: [0.12, 0.4, 0.12], scale: [0.95, 1.1, 0.95] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
        />
      )
    // Dentaire — l'éclat sur l'émail
    case 'dentaire':
      return (
        <motion.span
          className="absolute right-[-6px] top-[-4px] h-[4px] w-[4px] rounded-full"
          style={{ background: '#FDE68A', boxShadow: '0 0 6px rgba(253,230,138,0.9)' }}
          animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        />
      )
    // Médecine nucléaire — l'isotope sur son orbite
    case 'nucleaire':
      return (
        <motion.span
          className="absolute inset-[-9px]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3.6, ease: 'linear' }}
        >
          <span
            className="absolute left-1/2 top-0 h-[4px] w-[4px] -translate-x-1/2 rounded-full"
            style={{ background: tint, boxShadow: `0 0 5px ${tint}` }}
          />
        </motion.span>
      )
    default:
      return null
  }
}

export default function PoleMotifRotator({ locale = 'fr' }: { locale?: string }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    // Mouvement réduit : on fige sur le premier pôle plutôt que de faire défiler.
    if (reduce) return
    const id = setInterval(() => setI((v) => (v + 1) % MOTIFS.length), DWELL_MS)
    return () => clearInterval(id)
  }, [reduce])

  const m = MOTIFS[i]
  const Icon = m.icon
  const isAr = locale === 'ar'
  const tint = m.urgent ? '#dc2626' : '#006633'

  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={m.id}
          className="flex items-center gap-2.5"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
            <MotifDecor id={m.id} reduce={reduce} tint={tint} />
            <Icon className="h-5 w-5" style={{ color: tint, opacity: m.urgent ? 0.55 : 0.42 }} strokeWidth={1.8} />
          </span>
          <span
            className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: tint, opacity: m.urgent ? 0.5 : 0.38 }}
          >
            {isAr ? m.label_ar : m.label}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
