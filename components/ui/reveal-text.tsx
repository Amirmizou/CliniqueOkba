'use client'

/**
 * Primitives de révélation typographique (motion design).
 *
 * - <WordReveal>  : chaque mot monte depuis un masque avec un léger décalé.
 *                   Découpe au mot uniquement (sans casser les ligatures arabes).
 * - <LineReveal>  : la ligne entière se dévoile par un balayage clip-path.
 *                   Compatible avec `text-gradient` (background-clip: text),
 *                   car aucun transform n'est appliqué aux glyphes eux-mêmes.
 *
 * Les deux respectent prefers-reduced-motion (affichage direct, sans animation).
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const EASE = [0.22, 1, 0.36, 1] as const

interface WordRevealProps {
  text: string
  className?: string
  /** Délai initial (s) avant le premier mot */
  delay?: number
  /** Décalage (s) entre chaque mot */
  stagger?: number
  /** 'mount' : anime au montage (hero, contenus à clé) — 'inView' : au scroll */
  mode?: 'mount' | 'inView'
}

export function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 0.055,
  mode = 'inView',
}: WordRevealProps) {
  const reduce = useReducedMotion()
  const words = text.split(' ').filter(Boolean)

  // Detect if text contains Arabic/RTL characters
  const isRtl = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)

  if (reduce) return <span className={className} dir={isRtl ? 'rtl' : undefined}>{text}</span>

  // RTL text: animate the whole block at once to avoid bidi reordering issues
  // Uses a smooth upward slide + fade (no word splitting = no reordering)
  if (isRtl) {
    const rtlAnimProps =
      mode === 'mount'
        ? {
            initial: { y: 32, opacity: 0 },
            animate: { y: 0, opacity: 1 },
          }
        : {
            initial: { y: 32, opacity: 0 },
            whileInView: { y: 0, opacity: 1 },
            viewport: { once: true, margin: '-60px' },
          }

    return (
      <motion.span
        className={className}
        dir="rtl"
        style={{ display: 'block' }}
        {...rtlAnimProps}
        transition={{ duration: 0.8, ease: EASE, delay }}
      >
        {text}
      </motion.span>
    )
  }

  const animProps =
    mode === 'mount'
      ? { initial: 'hidden' as const, animate: 'visible' as const }
      : {
          initial: 'hidden' as const,
          whileInView: 'visible' as const,
          viewport: { once: true, margin: '-60px' },
        }

  return (
    <motion.span
      className={className}
      {...animProps}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.15em] pt-[0.15em]">
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: '110%', opacity: 0 },
                visible: {
                  y: '0%',
                  opacity: 1,
                  transition: { duration: 0.65, ease: EASE },
                },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </motion.span>
  )
}

interface LineRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

/** Balayage clip-path : sûr pour les dégradés de texte et le RTL. */
export function LineReveal({ children, className, delay = 0 }: LineRevealProps) {
  const reduce = useReducedMotion()

  if (reduce) return <span className={className}>{children}</span>

  return (
    <span className="inline-block overflow-hidden align-bottom pb-[0.15em] pt-[0.15em]">
      <motion.span
        className={`inline-block ${className ?? ''}`}
        initial={{ clipPath: 'inset(0 0 100% 0)', y: 14, opacity: 0 }}
        whileInView={{ clipPath: 'inset(0 0 -10% 0)', y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}
