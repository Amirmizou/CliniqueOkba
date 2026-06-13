'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * Badge logo Clinique OKBA animé — ROND, TRANSPARENT, sans boîte ni fond.
 * Le logo (vert sur transparent) s'intègre directement sur le fond clair du
 * site, entouré d'une lueur ronde de marque et d'un anneau d'onde pulsé.
 * Léger (framer-motion, pas de vidéo). Respecte prefers-reduced-motion.
 */
export function LogoBadge({
  size = 120,
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
      {/* Lueur ronde de marque (verte), pulsée */}
      <motion.div
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background:
            'radial-gradient(circle, rgba(76,175,110,0.35) 0%, rgba(0,102,51,0.12) 45%, transparent 70%)',
        }}
        animate={reduce ? undefined : { opacity: [0.45, 0.9, 0.45], scale: [0.9, 1.06, 0.9] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Anneau d'onde rond qui s'étend */}
      {withRing && !reduce && (
        <motion.span
          aria-hidden
          className="absolute rounded-full border border-[#006633]/30"
          style={{ width: size * 0.78, height: size * 0.78 }}
          animate={{ scale: [0.8, 1.45], opacity: [0.5, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      {/* Logo (transparent, vert), flottement doux */}
      <motion.div
        className="relative"
        style={{ width: size * 0.72, height: size * 0.72 }}
        animate={reduce ? undefined : { y: [0, -3, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/logo.png"
          alt="Clinique OKBA"
          fill
          sizes={`${Math.round(size)}px`}
          className="object-contain"
          priority
        />
      </motion.div>
    </div>
  )
}

/**
 * Indicateur de chargement de marque (à la place d'un spinner générique).
 * Transparent : se pose sur n'importe quel fond.
 */
export function LogoBadgeSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <LogoBadge size={104} />
      {label && <p className="text-sm font-medium text-muted-foreground">{label}</p>}
    </div>
  )
}
