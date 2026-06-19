'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedLogo } from '@/components/ui/animated-logo'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const CLINIC_NAME = 'Clinique OKBA'
const TAGLINE_WORDS = ['Excellence', 'Médicale']

/**
 * Intro plein écran jouée une fois par session :
 * le logo se trace, le nom se révèle lettre par lettre, puis l'écran se dissout.
 * Respecte prefers-reduced-motion.
 */
export default function LogoIntro() {
  const [visible, setVisible] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem('okbaIntroSeen') === '1'
    } catch {}

    if (seen) {
      setVisible(false)
      return
    }

    try {
      sessionStorage.setItem('okbaIntroSeen', '1')
    } catch {}

    document.body.style.overflow = 'hidden'
    const duration = prefersReducedMotion ? 400 : 1600
    const timer = setTimeout(() => setVisible(false), duration)
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (!visible) document.body.style.overflow = ''
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="logo-intro"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.05, filter: 'blur(10px)' }
          }
          transition={{ duration: prefersReducedMotion ? 0.4 : 0.85, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, #00351b 0%, #02140b 55%, #010a06 100%)',
          }}
        >
          {/* Texture grille de points */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              maskImage:
                'radial-gradient(ellipse 60% 50% at 50% 45%, black, transparent 75%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 60% 50% at 50% 45%, black, transparent 75%)',
            }}
          />

          {/* Balayage lumineux (one-shot) */}
          {!prefersReducedMotion && (
            <motion.div
              className="pointer-events-none absolute inset-x-0 h-[35%]"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, rgba(76,175,110,0.07) 50%, transparent 100%)',
              }}
              initial={{ top: '-35%' }}
              animate={{ top: '115%' }}
              transition={{ duration: 1.3, delay: 0.1, ease: 'easeInOut' }}
            />
          )}

          {/* Logo animé */}
          <AnimatedLogo size={180} />

          {/* Nom de la clinique — lettre par lettre */}
          <div
            className="font-display mt-8"
            style={{ perspective: prefersReducedMotion ? undefined : '600px' }}
          >
            <div className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {CLINIC_NAME.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 18, rotateX: -55 }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0, rotateX: 0 }
                  }
                  transition={{
                    delay: 0.45 + i * 0.038,
                    duration: 0.42,
                    ease: EASE,
                  }}
                  style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
                >
                  {char === ' ' ? ' ' : char}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Filet dégradé signature */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.85, duration: 0.9, ease: 'easeOut' }}
            className="mt-5 h-[2px] w-44 origin-center rounded-full"
            style={{
              background:
                'linear-gradient(90deg, #006633, #4caf6e 45%, #FDE68A 75%, rgba(253,230,138,0.3))',
            }}
          />

          {/* Slogan — mot par mot */}
          <div className="mt-5 flex gap-2 text-sm uppercase tracking-[0.25em] text-gray-300 sm:text-base">
            {TAGLINE_WORDS.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05 + i * 0.12, duration: 0.4, ease: EASE }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
