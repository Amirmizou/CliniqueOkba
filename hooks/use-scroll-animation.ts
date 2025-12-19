'use client'

import { useEffect, useRef, RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './use-reduced-motion'

// Register plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

export interface ScrollAnimationConfig {
    // Animation properties
    from?: gsap.TweenVars
    to?: gsap.TweenVars

    // ScrollTrigger configuration
    trigger?: string | Element
    start?: string
    end?: string
    scrub?: boolean | number
    pin?: boolean
    markers?: boolean
    toggleActions?: string

    // Stagger for multiple elements
    stagger?: number

    // Custom callbacks
    onEnter?: () => void
    onLeave?: () => void
    onEnterBack?: () => void
    onLeaveBack?: () => void
}

/**
 * Custom hook for scroll-triggered animations using GSAP
 * Automatically respects prefers-reduced-motion
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
    config: ScrollAnimationConfig
): React.RefObject<T> {
    const elementRef = useRef<T | null>(null)
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        if (!elementRef.current) return
        if (prefersReducedMotion) return // Skip animations if user prefers reduced motion

        const element = elementRef.current
        const {
            from = {},
            to = {},
            trigger,
            start = 'top 80%',
            end = 'bottom 20%',
            scrub = false,
            pin = false,
            markers = false,
            toggleActions = 'play none none reverse',
            stagger,
            onEnter,
            onLeave,
            onEnterBack,
            onLeaveBack,
        } = config

        // Set initial state
        if (from && Object.keys(from).length > 0) {
            gsap.set(element, from)
        }

        // Create animation
        const animation = gsap.to(element, {
            ...to,
            scrollTrigger: {
                trigger: trigger || element,
                start,
                end,
                scrub,
                pin,
                markers,
                toggleActions,
                onEnter,
                onLeave,
                onEnterBack,
                onLeaveBack,
            },
            stagger,
        })

        // Cleanup
        return () => {
            animation.kill()
            ScrollTrigger.getById(animation.scrollTrigger?.vars.id as string)?.kill()
        }
    }, [config, prefersReducedMotion])

    return elementRef as React.RefObject<T>
}

/**
 * Hook for batch scroll animations (multiple elements)
 */
export function useBatchScrollAnimation<T extends HTMLElement = HTMLDivElement>(
    config: ScrollAnimationConfig
): RefObject<T> {
    const containerRef = useRef<T | null>(null)
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        if (!containerRef.current) return
        if (prefersReducedMotion) return

        const container = containerRef.current
        const children = gsap.utils.toArray(container.children)

        const {
            from = {},
            to = {},
            start = 'top 80%',
            end = 'bottom 20%',
            scrub = false,
            stagger = 0.1,
            toggleActions = 'play none none reverse',
        } = config

        // Set initial state for all children
        if (from && Object.keys(from).length > 0) {
            gsap.set(children, from)
        }

        // Create staggered animation
        const animation = gsap.to(children, {
            ...to,
            stagger,
            scrollTrigger: {
                trigger: container,
                start,
                end,
                scrub,
                toggleActions,
            },
        })

        // Cleanup
        return () => {
            animation.kill()
        }
    }, [config, prefersReducedMotion])

    return containerRef as RefObject<T>
}

/**
 * Hook for parallax scroll effect
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
    speed: number = 0.5
): RefObject<T> {
    const elementRef = useRef<T | null>(null)
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        if (!elementRef.current) return
        if (prefersReducedMotion) return

        const element = elementRef.current

        const animation = gsap.to(element, {
            y: () => window.innerHeight * speed,
            ease: 'none',
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
        })

        return () => {
            animation.kill()
        }
    }, [speed, prefersReducedMotion])

    return elementRef as RefObject<T>
}
