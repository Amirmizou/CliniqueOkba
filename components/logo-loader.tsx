'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogoBadge } from '@/components/ui/logo-badge'

/**
 * Écran de chargement / splash du logo Clinique OKBA.
 * Logo ROND, TRANSPARENT, animé (lueur + anneau + flottement), posé sur le
 * fond clair du site (var(--background)) — aucun fond sombre, aucune boîte :
 * il s'intègre comme si la page se révélait. Joué une fois par session.
 */
export default function LogoLoader() {
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

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
    const timer = setTimeout(() => setVisible(false), 2200)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (!visible) document.body.style.overflow = ''
  }, [visible])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <LogoBadge size={220} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
