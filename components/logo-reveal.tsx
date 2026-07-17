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
 *  4. Option `lab` — motif « analyse » au trait (fiole, goutte, onde de lecture,
 *     étincelle de validation) qui rejoue périodiquement.
 *
 * Respecte prefers-reduced-motion (logo net, sans balayage ni motif).
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
  /** Motif « analyse » au trait (référence laboratoire), joué périodiquement. */
  lab?: boolean
}

// Fenêtre temporelle de l'intro.
const SWEEP_DELAY = 0.3
const SWEEP_DUR = 1.1
const BEAT_AT = SWEEP_DELAY + SWEEP_DUR // ~1.4s

/**
 * Cycle du motif « analyse » : LAB_VISIBLE secondes à l'écran, puis LAB_GAP de
 * repos. Chaque élément du motif se répète sur la même période LAB_PERIOD (via
 * `repeatDelay = LAB_PERIOD - duration`) : c'est ce qui les garde synchronisés
 * sans machine à états impérative.
 */
const LAB_VISIBLE = 4
const LAB_GAP = 7
const LAB_PERIOD = LAB_VISIBLE + LAB_GAP
/** Décalage de chaque étape à l'intérieur du cycle. */
const LAB_START = 0.4
const DROP_AT = LAB_START + 0.5
const RIPPLE_AT = LAB_START + 1.5
const SPARK_AT = LAB_START + 2.2

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

      {/* ═══ ANALYSE — motif laboratoire au trait, joué périodiquement ═══
          Remplace l'ancienne éprouvette remplie de liquide vert, qui se lisait
          comme du sang et n'évoquait qu'un seul pôle. Ici : une fiole dessinée au
          trait, une goutte déposée, l'onde de lecture, puis l'étincelle dorée de
          validation — le geste d'analyse, sans fluide corporel. */}
      {lab && !reduce && (
        <div
          className="pointer-events-none absolute z-20"
          style={{ right: '-6%', bottom: '2%', width: '26%', height: '58%' }}
        >
          <motion.div
            className="relative h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: LAB_VISIBLE,
              times: [0, 0.14, 0.82, 1],
              delay: LAB_START,
              repeat: Infinity,
              repeatDelay: LAB_GAP,
              ease: 'easeInOut',
            }}
          >
            {/* Fiole au trait — verre suggéré, jamais rempli */}
            <svg
              viewBox="0 0 24 32"
              className="absolute inset-0 h-full w-full"
              fill="none"
              aria-hidden="true"
            >
              {/* Col + corps conique, tracé d'un seul geste */}
              <path
                d="M10 3 L10 11 L4.6 25.6 Q3.9 29 7.4 29 L16.6 29 Q20.1 29 19.4 25.6 L14 11 L14 3"
                stroke="#006633"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.75"
              />
              {/* Lèvre du col */}
              <path d="M8.8 3 H15.2" stroke="#006633" strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
              {/* Trait de jauge — repère de mesure, pas un niveau de liquide */}
              <path d="M7.4 24.5 H16.6" stroke="#006633" strokeWidth="0.9" strokeLinecap="round" opacity="0.3" />
            </svg>

            {/* La goutte déposée — tombe du col vers le fond */}
            <motion.span
              className="absolute left-1/2 rounded-full"
              style={{
                width: '9%',
                height: '7%',
                marginLeft: '-4.5%',
                background: '#00a651',
                boxShadow: '0 0 5px rgba(0,166,81,0.7)',
              }}
              initial={{ top: '2%', opacity: 0 }}
              animate={{ top: ['2%', '74%'], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 1,
                times: [0, 0.15, 0.8, 1],
                delay: DROP_AT,
                repeat: Infinity,
                repeatDelay: LAB_PERIOD - 1,
                ease: 'easeIn',
              }}
            />

            {/* Onde de lecture — deux cercles concentriques après le dépôt */}
            {[0, 0.3].map((offset) => (
              <motion.span
                key={offset}
                className="absolute left-1/2 rounded-full"
                style={{
                  bottom: '10%',
                  width: '46%',
                  height: '26%',
                  marginLeft: '-23%',
                  border: '1px solid rgba(0,166,81,0.75)',
                }}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: [0, 0.7, 0], scale: [0.3, 1.5] }}
                transition={{
                  duration: 1.4,
                  delay: RIPPLE_AT + offset,
                  repeat: Infinity,
                  repeatDelay: LAB_PERIOD - 1.4,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* Étincelle dorée — la lecture est validée (2e couleur du logo) */}
            <motion.span
              className="absolute rounded-full"
              style={{
                right: '4%',
                top: '18%',
                width: '13%',
                height: '10%',
                background: '#FDE68A',
                boxShadow: '0 0 7px rgba(253,230,138,0.95)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.25, 0] }}
              transition={{
                duration: 0.9,
                delay: SPARK_AT,
                repeat: Infinity,
                repeatDelay: LAB_PERIOD - 0.9,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>
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
