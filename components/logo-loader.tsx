'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * Écran de chargement / splash animé du logo Clinique OKBA.
 * L'animation (branche d'olivier + lueur de marque + signature ECG) est un
 * motion graphic généré avec Remotion (projet /remotion-okba) et rendu en MP4
 * (public/videos/okba-logo-loader.mp4).
 *
 * - Joué une seule fois par session (sessionStorage).
 * - Se retire à la fin de la vidéo (ou après un délai de sécurité).
 * - prefers-reduced-motion : affiche l'image fixe brièvement, sans vidéo.
 */
export default function LogoLoader() {
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setMounted(true)
    let seen = false
    try {
      seen = sessionStorage.getItem('okbaLoaderSeen') === '1'
    } catch {}

    if (seen) {
      setVisible(false)
      return
    }
    try {
      sessionStorage.setItem('okbaLoaderSeen', '1')
    } catch {}

    document.body.style.overflow = 'hidden'

    // Filet de sécurité : on retire le loader même si l'événement `ended`
    // ne se déclenche pas (vidéo bloquée, autoplay refusé…).
    const maxMs = prefersReducedMotion ? 900 : 4200
    const timer = setTimeout(() => setVisible(false), maxMs)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (!visible) document.body.style.overflow = ''
  }, [visible])

  // Évite le flash côté serveur / première peinture
  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{
            background:
              'radial-gradient(circle at 50% 42%, #00351f 0%, #002315 45%, #000d08 100%)',
          }}
        >
          {prefersReducedMotion ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/okba-logo-loader-poster.png"
              alt="Clinique OKBA"
              className="h-auto w-[min(70vw,360px)]"
            />
          ) : (
            <video
              ref={videoRef}
              src="/videos/okba-logo-loader.mp4"
              poster="/images/okba-logo-loader-poster.png"
              autoPlay
              muted
              playsInline
              onEnded={() => setVisible(false)}
              className="h-auto w-[min(82vw,460px)]"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
