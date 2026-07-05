'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'

/**
 * LogoReveal — intro « scanner » du logo (une fois au chargement).
 *
 * Narratif médical qui PRÉSERVE le logo intact (image telle quelle) :
 *  1. Reconstruction imagerie — un faisceau laser vert balaie le logo de haut en
 *     bas ; le logo se matérialise au passage (clip-path synchronisé + voile qui
 *     se dissipe).
 *  2. Signal vital — une fois reconstruit, le logo donne un battement (pulse).
 *  3. Option scanner — disque + anneau en pointillés qui tourne + onde qui se
 *     propage (utile pour un logo circulaire).
 *
 * Respecte prefers-reduced-motion (logo net, sans balayage).
 */

interface Props {
  src?: string
  alt?: string
  /** Le parent DOIT fixer la taille (h/w) ; le composant se met en position relative. */
  className?: string
  sizes?: string
  imageClassName?: string
  /** Disque blanc circulaire derrière le logo. */
  disc?: boolean
  /** Anneau de scanner en pointillés + onde qui se propage (logo circulaire). */
  ring?: boolean
  /** Éprouvette d'analyse qui se remplit (référence labo), puis s'estompe. */
  lab?: boolean
}

// Fenêtre temporelle de l'intro.
const SWEEP_DELAY = 0.3
const SWEEP_DUR = 1.1
const BEAT_AT = SWEEP_DELAY + SWEEP_DUR // ~1.4s

export default function LogoReveal({
  src = '/logo-main.png',
  alt = 'Clinique OKBA',
  className,
  sizes = '140px',
  imageClassName = 'object-contain',
  disc = false,
  ring = false,
  lab = false,
}: Props) {
  const reduce = useReducedMotion()

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* Anneau de scanner en pointillés — rotation lente continue */}
      {ring && (
        <svg
          className="pointer-events-none absolute inset-[-8%] animate-[spin_9s_linear_infinite]"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="47" stroke="rgba(0,102,51,0.32)" strokeWidth="2" strokeDasharray="30 100" strokeLinecap="round" />
          <circle cx="50" cy="50" r="47" stroke="rgba(0,166,81,0.18)" strokeWidth="2" strokeDasharray="4 22" strokeLinecap="round" />
        </svg>
      )}

      {/* Battement après reconstruction */}
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: 'center' }}
        initial={{ scale: 1 }}
        animate={reduce ? { scale: 1 } : { scale: [1, 1.09, 0.98, 1] }}
        transition={reduce ? undefined : { duration: 0.5, delay: BEAT_AT, ease: 'easeOut' }}
      >
        <div className={`relative h-full w-full ${disc ? 'overflow-hidden rounded-full bg-white shadow-md ring-1 ring-gray-100 dark:ring-white/10' : ''}`}>
          {/* Logo — se matérialise de haut en bas au passage du faisceau */}
          <motion.div
            className="absolute inset-0"
            initial={reduce ? { clipPath: 'inset(0 0 0% 0)' } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            transition={reduce ? undefined : { duration: SWEEP_DUR, delay: SWEEP_DELAY, ease: 'linear' }}
          >
            <Image src={src} alt={alt} fill sizes={sizes} className={imageClassName} priority />
          </motion.div>

          {/* Faisceau laser vert + halo — balayent le logo de haut en bas */}
          {!reduce && (
            <>
              <motion.div
                className="pointer-events-none absolute left-0 right-0"
                style={{
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, #00a651, transparent)',
                  boxShadow: '0 0 12px 2px rgba(0,166,81,0.8)',
                }}
                initial={{ top: '-8%', opacity: 0 }}
                animate={{ top: ['-8%', '108%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: SWEEP_DUR, delay: SWEEP_DELAY, times: [0, 0.08, 0.92, 1], ease: 'linear' }}
              />
              <motion.div
                className="pointer-events-none absolute left-0 right-0"
                style={{
                  height: '22%',
                  marginTop: '-11%',
                  background: 'radial-gradient(ellipse at center, rgba(0,166,81,0.28), transparent 70%)',
                }}
                initial={{ top: '-8%', opacity: 0 }}
                animate={{ top: ['-8%', '108%'], opacity: [0, 0.9, 0.9, 0] }}
                transition={{ duration: SWEEP_DUR, delay: SWEEP_DELAY, times: [0, 0.08, 0.92, 1], ease: 'linear' }}
              />
            </>
          )}
        </div>
      </motion.div>

      {/* Éprouvette d'analyse — apparaît, se remplit de liquide vert, puis s'estompe */}
      {lab && !reduce && (
        <motion.div
          className="pointer-events-none absolute z-10"
          style={{ right: '1%', bottom: '3%', width: '15%', height: '55%' }}
          initial={{ opacity: 0, y: 6, rotate: -4 }}
          animate={{ opacity: [0, 1, 1, 0], y: [6, 0, 0, 0], rotate: [-4, 0, 0, 0] }}
          transition={{ duration: 3.1, delay: 0.35, times: [0, 0.18, 0.72, 1], ease: 'easeInOut' }}
        >
          {/* Lèvre / ouverture du tube */}
          <div
            className="absolute -top-[3px] left-1/2 h-[3px] -translate-x-1/2 rounded-full"
            style={{ width: '150%', background: 'rgba(0,102,51,0.55)' }}
          />
          {/* Verre */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              borderRadius: '2px 2px 999px 999px',
              border: '1.5px solid rgba(0,102,51,0.45)',
              borderTop: 'none',
              background: 'rgba(255,255,255,0.5)',
              boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.7)',
            }}
          >
            {/* Liquide vert qui monte */}
            <motion.div
              className="absolute inset-x-0 bottom-0"
              style={{
                background: 'linear-gradient(180deg,#00c766,#008a41)',
                boxShadow: '0 0 8px rgba(0,166,81,0.5)',
              }}
              initial={{ height: '6%' }}
              animate={{ height: ['6%', '68%', '68%'] }}
              transition={{ duration: 1.3, delay: 0.55, times: [0, 0.7, 1], ease: 'easeOut' }}
            >
              {/* Ménisque (surface du liquide) */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-white/55" />
            </motion.div>
            {/* Bulles qui remontent */}
            <motion.span
              className="absolute bottom-[10%] left-[34%] rounded-full bg-white/60"
              style={{ width: '24%', height: '11%' }}
              animate={{ y: ['0%', '-320%'], opacity: [0, 0.85, 0] }}
              transition={{ duration: 1.4, delay: 0.85, repeat: Infinity, repeatDelay: 0.35, ease: 'easeOut' }}
            />
            <motion.span
              className="absolute bottom-[6%] left-[58%] rounded-full bg-white/50"
              style={{ width: '17%', height: '8%' }}
              animate={{ y: ['0%', '-380%'], opacity: [0, 0.75, 0] }}
              transition={{ duration: 1.7, delay: 1.15, repeat: Infinity, repeatDelay: 0.5, ease: 'easeOut' }}
            />
            {/* Reflet vertical du verre */}
            <div className="absolute left-[16%] top-[8%] bottom-[14%] w-[8%] rounded-full bg-white/40" />
          </div>
        </motion.div>
      )}

      {/* Onde verte qui se propage (signal vital) — variante circulaire */}
      {ring && !reduce && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ border: '2px solid rgba(0,166,81,0.6)' }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.85, 1.6] }}
          transition={{ duration: 0.95, delay: BEAT_AT, ease: 'easeOut' }}
        />
      )}
    </div>
  )
}
