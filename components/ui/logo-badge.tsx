'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * Badge logo Clinique OKBA animé en boucle — version LÉGÈRE (framer-motion,
 * aucune vidéo) pour l'habillage : indicateur de chargement inline, footer,
 * séparateurs de section, etc. Reprend l'esthétique du splash (médaillon
 * blanc + lueur de marque pulsée + anneau d'onde). Respecte prefers-reduced-motion.
 */
export function LogoBadge({
  size = 96,
  className,
  withRing = true,
}: {
  size?: number
  className?: string
  withRing?: boolean
}) {
  const reduce = useReducedMotion()

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* Lueur de marque pulsée */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(76,175,110,0.45) 0%, rgba(0,102,51,0.18) 45%, transparent 70%)',
          }}
          animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.92, 1.08, 0.92] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Anneau d'onde qui s'étend */}
      {withRing && !reduce && (
        <motion.span
          aria-hidden
          className="absolute rounded-full border border-[#FDE68A]/60"
          style={{ width: size * 0.9, height: size * 0.9 }}
          animate={{ scale: [0.7, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      {/* Médaillon + logo, flottement doux */}
      <motion.div
        className="relative flex items-center justify-center rounded-[26%] bg-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.4)] ring-1 ring-[#FDE68A]/40"
        style={{ width: size * 0.82, height: size * 0.82, padding: size * 0.05 }}
        animate={reduce ? undefined : { y: [0, -3, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/logo.png"
          alt="Clinique OKBA"
          width={Math.round(size * 0.72)}
          height={Math.round(size * 0.72)}
          className="h-full w-full object-contain"
        />
      </motion.div>
    </div>
  )
}

/**
 * Indicateur de chargement inline basé sur le badge (à utiliser à la place
 * d'un spinner générique dans les sections lazy / fallbacks).
 */
export function LogoBadgeSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <LogoBadge size={88} />
      {label && <p className="text-sm font-medium text-muted-foreground">{label}</p>}
    </div>
  )
}
