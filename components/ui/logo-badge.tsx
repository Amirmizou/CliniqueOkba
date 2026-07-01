'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Badge logo Clinique OKBA — version splash screen.
 * Scan laser + révélation clip-path + anneaux en rotation + 3 impulsions sonar + point orbital.
 * Transparent : s'intègre sur n'importe quel fond. Respecte prefers-reduced-motion.
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
      {/* Halo pulsé */}
      <motion.div
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background:
            'radial-gradient(circle, rgba(76,175,110,0.38) 0%, rgba(0,102,51,0.14) 45%, transparent 70%)',
        }}
        animate={reduce ? undefined : { opacity: [0.45, 0.9, 0.45], scale: [0.88, 1.08, 0.88] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Anneaux SVG + point orbital */}
      {withRing && !reduce && (
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0"
          style={{ width: size, height: size, overflow: 'visible' }}
          aria-hidden
        >
          {/* 3 impulsions sonar décalées */}
          {[0, 0.5, 1.0].map((d) => (
            <motion.circle
              key={d}
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="#4caf6e"
              strokeWidth="0.8"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: [0.85, 1.72], opacity: [0, 0.5, 0] }}
              transition={{
                duration: 2.4,
                delay: 0.5 + d,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: 'easeOut',
              }}
              style={{ transformOrigin: '50px 50px' }}
            />
          ))}

          {/* Arc en rotation */}
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="rgba(76,175,110,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="72 217"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* Anneau pointillé contre-rotatif */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(253,230,138,0.4)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="1.5 6"
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* Point orbital vert */}
          <motion.g
            style={{ transformOrigin: '50px 50px' }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <circle cx="96" cy="50" r="2.2" fill="#4caf6e" />
            <circle cx="96" cy="50" r="4.5" fill="#4caf6e" opacity="0.15" />
          </motion.g>

          {/* Point orbital doré, décalé 180° */}
          <motion.g
            style={{ transformOrigin: '50px 50px' }}
            animate={{ rotate: [180, 540] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          >
            <circle cx="96" cy="50" r="1.6" fill="#FDE68A" opacity="0.85" />
          </motion.g>
        </svg>
      )}

      {/* Logo avec scan laser + révélation */}
      <div
        className="relative overflow-hidden"
        style={{ width: size * 0.72, height: size * 0.72 }}
      >
        {/* Scan laser one-shot */}
        {!reduce && (
          <motion.div
            className="absolute inset-x-0 z-10 h-[2px]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(76,175,110,0.9) 40%, #4caf6e 50%, rgba(76,175,110,0.9) 60%, transparent)',
              boxShadow: '0 0 5px 2px rgba(76,175,110,0.3)',
            }}
            initial={{ top: '0%', opacity: 0 }}
            animate={{ top: ['0%', '105%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'linear' }}
          />
        )}

        {/* Révélation clip-path top→bas */}
        <motion.div
          className="relative h-full w-full"
          initial={reduce ? undefined : { clipPath: 'inset(100% 0 0 0)' }}
          animate={reduce ? undefined : { clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
        >
          {/* Logo flottant */}
          <motion.div
            className="relative h-full w-full"
            animate={reduce ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }}
          >
            <Image
              src="/logo-main.png"
              alt="Clinique OKBA"
              fill
              sizes={`${Math.round(size)}px`}
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

/** Indicateur de chargement de marque (remplace un spinner générique). */
export function LogoBadgeSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <LogoBadge size={104} />
      {label && <p className="text-sm font-medium text-muted-foreground">{label}</p>}
    </div>
  )
}
