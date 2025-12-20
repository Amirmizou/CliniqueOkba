'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to detect if user prefers reduced motion
 * Auto-reduces motion on mobile for better performance
 */
export function useReducedMotion(): boolean {
    const [shouldReduce, setShouldReduce] = useState(false)

    useEffect(() => {
        // Check if window is available (client-side only)
        if (typeof window === 'undefined') return

        // Auto-reduce motion on mobile for better performance
        const isMobile = window.innerWidth < 768

        // Create media query
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

        // Set initial value (mobile OR user preference)
        setShouldReduce(isMobile || mediaQuery.matches)

        // Listen for changes
        const handleChange = (event: MediaQueryListEvent) => {
            setShouldReduce(isMobile || event.matches)
        }

        // Add listener
        mediaQuery.addEventListener('change', handleChange)

        // Cleanup
        return () => {
            mediaQuery.removeEventListener('change', handleChange)
        }
    }, [])

    return shouldReduce
}
