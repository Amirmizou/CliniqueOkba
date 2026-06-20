'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Motion graphic du logo : médaillon qui se trace, scan laser, révélation par clip-path,
 * trois points orbitaux à des vitesses différentes, impulsions sonar et halo respirant.
 * Entrée jouée une fois au montage. Idle très subtil. Respecte prefers-reduced-motion.
 */
export function AnimatedLogo({ className, size = 96 }: { className?: string; size?: number }) {
  const reduced = useReducedMotion()
  const G1 = 'okba-anim-g1'
  const G2 = 'okba-anim-g2'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 190, damping: 20, delay: 0.05 }}
      className={cn('relative', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Halo ambiant — respire doucement après l'entrée */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(circle, rgba(76,175,110,0.5) 0%, rgba(0,102,51,0.2) 50%, transparent 70%)',
        }}
        initial={{ opacity: 0 }}
        animate={reduced ? { opacity: 0.55 } : { opacity: [0, 0.55, 1.0, 0.55] }}
        transition={
          reduced
            ? { duration: 0.4, delay: 0.7 }
            : { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.6, times: [0, 0.15, 0.5, 1] }
        }
      />

      {/* Anneaux SVG + points orbitaux */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={G1} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#006633" />
            <stop offset="55%" stopColor="#4caf6e" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
          <linearGradient id={G2} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4caf6e" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Impulsions sonar — démarrent à 2 s, se répètent */}
        {!reduced &&
          [0, 0.55, 1.1].map((d) => (
            <motion.circle
              key={d}
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#4caf6e"
              strokeWidth="0.7"
              initial={{ scale: 0.82, opacity: 0 }}
              animate={{ scale: [0.82, 1.75], opacity: [0, 0.5, 0] }}
              transition={{
                duration: 2.6,
                delay: 2.0 + d,
                repeat: Infinity,
                repeatDelay: 2.0,
                ease: 'easeOut',
              }}
              style={{ transformOrigin: '50px 50px' }}
            />
          ))}

        {/* Anneau extérieur — entrée : se trace ; idle : arc en rotation */}
        {!reduced && (
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={`url(#${G1})`}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: [1, 1, 0] }}
            transition={{
              pathLength: { duration: 1.0, delay: 0.15, ease: 'easeOut' },
              opacity: { duration: 1.8, delay: 0.15, times: [0, 0.55, 1] },
            }}
          />
        )}
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={`url(#${G1})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="72 217"
          initial={{ opacity: 0, rotate: 0 }}
          animate={reduced ? { opacity: 1 } : { opacity: [0, 1], rotate: [0, 360] }}
          transition={{
            opacity: { delay: reduced ? 0 : 1.3, duration: 0.4 },
            rotate: { duration: 20, repeat: Infinity, ease: 'linear', delay: reduced ? 0 : 1.3 },
          }}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Anneau intérieur pointillé — entrée : trace ; idle : contre-rotation */}
        {!reduced && (
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={`url(#${G2})`}
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.6 }}
            animate={{ pathLength: 1, opacity: [0.6, 0.6, 0] }}
            transition={{
              pathLength: { duration: 1.0, delay: 0.3, ease: 'easeOut' },
              opacity: { duration: 1.8, delay: 0.3, times: [0, 0.55, 1] },
            }}
          />
        )}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={`url(#${G2})`}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="1.5 6"
          initial={{ opacity: 0, rotate: 0 }}
          animate={reduced ? { opacity: 0.45 } : { opacity: [0, 0.5], rotate: [0, -360] }}
          transition={{
            opacity: { delay: reduced ? 0 : 1.3, duration: 0.4 },
            rotate: { duration: 28, repeat: Infinity, ease: 'linear', delay: reduced ? 0 : 1.3 },
          }}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Traits dorés à 0°, 120°, 240° — instrument de précision */}
        {[0, 120, 240].map((deg, i) => {
          const rad = ((deg - 90) * Math.PI) / 180
          return (
            <motion.line
              key={deg}
              x1={50 + 42 * Math.cos(rad)}
              y1={50 + 42 * Math.sin(rad)}
              x2={50 + 48 * Math.cos(rad)}
              y2={50 + 48 * Math.sin(rad)}
              stroke="#FDE68A"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 0.9, pathLength: 1 }}
              transition={{ delay: 0.9 + i * 0.1, duration: 0.3 }}
            />
          )
        })}

        {/* Points orbitaux — modèle atomique / satellite */}
        {!reduced && (
          <>
            {/* Vert, r=46, 10 s */}
            <motion.g
              style={{ transformOrigin: '50px 50px' }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 1.0 }}
            >
              <motion.circle
                cx="96"
                cy="50"
                r="2.2"
                fill="#4caf6e"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.3 }}
              />
              <circle cx="96" cy="50" r="4.5" fill="#4caf6e" opacity="0.15" />
            </motion.g>

            {/* Or, r=46, 14 s, décalé de 120° */}
            <motion.g
              style={{ transformOrigin: '50px 50px' }}
              animate={{ rotate: [120, 480] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 1.0 }}
            >
              <motion.circle
                cx="96"
                cy="50"
                r="1.8"
                fill="#FDE68A"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.3 }}
              />
              <circle cx="96" cy="50" r="3.8" fill="#FDE68A" opacity="0.15" />
            </motion.g>

            {/* Petit vert, r=40, 18 s, décalé de 240° */}
            <motion.g
              style={{ transformOrigin: '50px 50px' }}
              animate={{ rotate: [240, 600] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear', delay: 1.1 }}
            >
              <motion.circle
                cx="90"
                cy="50"
                r="1.5"
                fill="#4caf6e"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.2, duration: 0.3 }}
              />
            </motion.g>
          </>
        )}
      </svg>

      {/* Médaillon logo */}
      <div
        className="absolute overflow-hidden rounded-full bg-white/95 shadow-lg ring-1 ring-black/5"
        style={{ inset: '19%' }}
      >
        {/* Scan laser (one-shot) */}
        {!reduced && (
          <motion.div
            className="absolute inset-x-0 z-10 h-[2px]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(76,175,110,0.9) 40%, #4caf6e 50%, rgba(76,175,110,0.9) 60%, transparent)',
              boxShadow: '0 0 6px 3px rgba(76,175,110,0.3)',
            }}
            initial={{ top: '0%', opacity: 0 }}
            animate={{ top: ['0%', '105%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.7, delay: 0.7, ease: 'linear' }}
          />
        )}

        {/* Logo révélé par clip-path synchronisé avec le scan */}
        <motion.div
          className="relative h-full w-full"
          initial={reduced ? undefined : { clipPath: 'inset(100% 0 0 0)' }}
          animate={reduced ? undefined : { clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: 0.55, delay: 0.7, ease: EASE }}
        >
          <Image
            src="/logo.png"
            alt="Clinique OKBA"
            fill
            sizes={`${Math.round(size)}px`}
            className="object-contain p-2"
          />
        </motion.div>

        {/* Reflet lens-flare */}
        <motion.div
          className="pointer-events-none absolute left-[12%] top-[10%] h-[28%] w-[22%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 1.35, duration: 0.6 }}
        />
      </div>
    </motion.div>
  )
}
