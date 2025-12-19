'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

/**
 * Initialize GSAP with global configuration
 */
export function initGSAP() {
    if (typeof window === 'undefined') return

    // Configure ScrollTrigger defaults
    ScrollTrigger.config({
        // Limit the number of times per second ScrollTrigger recalculates positions
        limitCallbacks: true,
        // Sync ScrollTrigger with CSS scroll-behavior: smooth
        syncInterval: 150,
    })

    // Set default easing for medical theme (gentle, smooth)
    gsap.defaults({
        ease: 'power2.out',
        duration: 1,
    })

    // Refresh ScrollTrigger on window resize
    ScrollTrigger.addEventListener('refreshInit', () => {
        gsap.set('body', { clearProps: 'all' })
    })
}

/**
 * Cleanup GSAP animations and ScrollTriggers
 */
export function cleanupGSAP() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    gsap.globalTimeline.clear()
}

/**
 * Hook to initialize GSAP on component mount
 */
export function useGSAPInit() {
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            initGSAP()
            initialized.current = true
        }

        return () => {
            cleanupGSAP()
        }
    }, [])
}

/**
 * Medical-themed easing functions
 */
export const medicalEasing = {
    // Gentle, smooth easing for professional feel
    gentle: 'power1.inOut',
    // Heartbeat-like easing
    heartbeat: 'power2.inOut',
    // Surgical precision - sharp but smooth
    precise: 'power3.out',
    // Comfort - very soft and slow
    comfort: 'sine.inOut',
    // Tech - snappy and modern
    tech: 'expo.out',
}

/**
 * Animation presets for common patterns
 */
export const animationPresets = {
    fadeIn: {
        from: { opacity: 0, y: 30 },
        to: { opacity: 1, y: 0, duration: 0.8, ease: medicalEasing.gentle },
    },
    slideInLeft: {
        from: { opacity: 0, x: -50 },
        to: { opacity: 1, x: 0, duration: 0.8, ease: medicalEasing.gentle },
    },
    slideInRight: {
        from: { opacity: 0, x: 50 },
        to: { opacity: 1, x: 0, duration: 0.8, ease: medicalEasing.gentle },
    },
    scaleIn: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1, duration: 0.8, ease: medicalEasing.precise },
    },
    revealUp: {
        from: { opacity: 0, y: 50, clipPath: 'inset(100% 0 0 0)' },
        to: { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: medicalEasing.tech },
    },
}

export { gsap, ScrollTrigger }
