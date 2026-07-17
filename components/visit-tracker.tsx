'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Envoie une page vue à /api/track à chaque navigation.
 * « Visite » = une session de navigation (marqueur sessionStorage) ;
 * « page vue » = chaque page affichée pendant cette session.
 */
export function VisitTracker() {
  const pathname = usePathname()
  const lastSent = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    // StrictMode / re-render : une seule mesure par chemin.
    if (lastSent.current === pathname) return
    lastSent.current = pathname

    let newVisit = false
    try {
      if (!sessionStorage.getItem('okba_visit')) {
        sessionStorage.setItem('okba_visit', '1')
        newVisit = true
      }
    } catch {
      // Mode privé / stockage bloqué : on compte quand même la page vue.
    }

    const payload = JSON.stringify({ path: pathname, newVisit })
    const blob = new Blob([payload], { type: 'application/json' })

    if (!navigator.sendBeacon?.('/api/track', blob)) {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    }
  }, [pathname])

  return null
}
