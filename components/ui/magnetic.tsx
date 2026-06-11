'use client'

/**
 * Effet « aimant » : l'élément glisse doucement vers le curseur (ressort),
 * puis revient à sa place au départ du pointeur.
 * Desktop uniquement (pointer fin) — inerte au tactile et en motion réduit.
 */

import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface MagneticProps {
  children: ReactNode
  /** Intensité de l'attraction (0–1) */
  strength?: number
  className?: string
}

export function Magnetic({ children, strength = 0.25, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 16, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 200, damping: 16, mass: 0.5 })

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduce ? undefined : { x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  )
}
