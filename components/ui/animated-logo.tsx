'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

interface AnimatedLogoProps {
  className?: string
  size?: number
}

/**
 * Motion graphic du logo : médaillon avec arc dégradé en rotation,
 * anneau pointillé contre-rotatif et halo pulsé. Révélation à l'entrée.
 * Respecte prefers-reduced-motion (devient statique).
 */
export function AnimatedLogo({ className, size = 96 }: AnimatedLogoProps) {
  const reduced = useReducedMotion()
  const gradientId = 'okba-logo-ring'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
      className={cn('relative', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Halo pulsé */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background:
            'radial-gradient(circle, rgba(253,230,138,0.55), rgba(0,102,51,0.35) 60%, transparent 72%)',
        }}
        animate={reduced ? undefined : { opacity: [0.45, 0.8, 0.45], scale: [0.95, 1.08, 0.95] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Arc dégradé en rotation */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#006633" />
            <stop offset="55%" stopColor="#4caf6e" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="70 220"
        />
      </motion.svg>

      {/* Anneau pointillé contre-rotatif */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        animate={reduced ? undefined : { rotate: -360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#FDE68A"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="1.5 7"
        />
      </motion.svg>

      {/* Médaillon logo */}
      <motion.div
        className="absolute inset-[19%] overflow-hidden rounded-full bg-white/95 shadow-lg ring-1 ring-black/5"
        animate={reduced ? undefined : { y: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/logo.png"
          alt="Clinique OKBA"
          fill
          sizes="96px"
          className="object-contain p-2"
          priority
        />
      </motion.div>
    </motion.div>
  )
}
