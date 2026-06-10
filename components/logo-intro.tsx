'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedLogo } from '@/components/ui/animated-logo'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * Intro plein écran (splash) jouée une fois par session :
 * le logo animé apparaît au centre, le nom se révèle, puis l'écran
 * s'efface pour dévoiler le hero. Respecte prefers-reduced-motion.
 */
export default function LogoIntro() {
  const [visible, setVisible] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // Déjà vue dans cette session → ne pas rejouer
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

    // Verrouille le scroll pendant l'intro
    document.body.style.overflow = 'hidden'
    const duration = prefersReducedMotion ? 800 : 2400
    const timer = setTimeout(() => setVisible(false), duration)
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [prefersReducedMotion])

  // Déverrouille le scroll quand l'intro disparaît
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
              : { opacity: 0, scale: 1.08, filter: 'blur(8px)' }
          }
          transition={{ duration: prefersReducedMotion ? 0.4 : 0.8, ease: 'easeInOut' }}
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
              maskImage: 'radial-gradient(ellipse 60% 50% at 50% 45%, black, transparent 75%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 60% 50% at 50% 45%, black, transparent 75%)',
            }}
          />

          {/* Logo animé */}
          <AnimatedLogo size={180} />

          {/* Nom de la clinique */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: 'easeOut' }}
            className="font-display mt-8 text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Clinique OKBA
          </motion.div>

          {/* Filet dégradé signature */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.9, ease: 'easeOut' }}
            className="mt-5 h-1 w-40 origin-center rounded-full bg-gradient-to-r from-[#006633] via-[#4caf6e] to-[#FDE68A]"
          />

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-5 text-sm uppercase tracking-[0.25em] text-gray-300 sm:text-base"
          >
            Excellence Médicale
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
