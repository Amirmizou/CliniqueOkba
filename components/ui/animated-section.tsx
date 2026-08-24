'use client'

import { useEffect, useRef, ReactNode } from 'react'
import type { gsap as GsapType } from 'gsap'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * PERF — GSAP + ScrollTrigger (~112 Ko) est chargé à la demande, pas au bundle
 * initial. Ce composant n'anime qu'au scroll : rien ne justifie de payer le
 * téléchargement et le parsing de la librairie avant le premier rendu.
 * Un import statique la plaçait dans le chunk d'entrée de la page d'accueil.
 */
let gsapPromise: Promise<typeof GsapType> | null = null

function loadGsap(): Promise<typeof GsapType> {
    if (!gsapPromise) {
        gsapPromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
            ([{ gsap }, { ScrollTrigger }]) => {
                gsap.registerPlugin(ScrollTrigger)
                return gsap
            },
        )
    }
    return gsapPromise
}

interface AnimatedSectionProps {
    children: ReactNode
    className?: string
    animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | 'wave' | '3d-flip' | 'none'
    stagger?: number
    delay?: number
    duration?: number
}

/**
 * Reusable animated section component with GSAP
 * Automatically animates children elements on scroll
 */
export function AnimatedSection({
    children,
    className,
    animation = 'fade',
    stagger = 0.1,
    delay = 0,
    duration = 0.8,
}: AnimatedSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null)
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        if (prefersReducedMotion || !sectionRef.current || animation === 'none') return

        let ctx: gsap.Context | undefined
        let cancelled = false

        loadGsap().then((gsap) => {
            // Le composant a pu être démonté pendant le chargement du module.
            if (cancelled || !sectionRef.current) return

            ctx = gsap.context(() => {
            const elements = sectionRef.current!.querySelectorAll('.animate-item')

            let fromVars: gsap.TweenVars = {}
            let toVars: gsap.TweenVars = {
                duration,
                stagger,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }

            switch (animation) {
                case 'fade':
                    fromVars = { opacity: 0, y: 30 }
                    toVars = { ...toVars, opacity: 1, y: 0 }
                    break
                case 'slide-up':
                    fromVars = { opacity: 0, y: 60 }
                    toVars = { ...toVars, opacity: 1, y: 0 }
                    break
                case 'slide-left':
                    fromVars = { opacity: 0, x: 60 }
                    toVars = { ...toVars, opacity: 1, x: 0 }
                    break
                case 'slide-right':
                    fromVars = { opacity: 0, x: -60 }
                    toVars = { ...toVars, opacity: 1, x: 0 }
                    break
                case 'scale':
                    fromVars = { opacity: 0, scale: 0.8 }
                    toVars = { ...toVars, opacity: 1, scale: 1 }
                    break
                case 'wave':
                    fromVars = { opacity: 0, y: 50, rotationX: -15 }
                    toVars = { ...toVars, opacity: 1, y: 0, rotationX: 0, stagger: 0.15 }
                    break
                case '3d-flip':
                    fromVars = { opacity: 0, rotationY: -90, transformPerspective: 1000 }
                    toVars = { ...toVars, opacity: 1, rotationY: 0, ease: 'back.out(1.2)' }
                    break
            }

            if (delay > 0) {
                toVars.delay = delay
            }

            gsap.fromTo(elements, fromVars, toVars)
            }, sectionRef)
        })

        return () => {
            cancelled = true
            ctx?.revert()
        }
    }, [prefersReducedMotion, animation, stagger, delay, duration])

    return (
        <div ref={sectionRef} className={cn('relative', className)}>
            {children}
        </div>
    )
}

/**
 * Wrapper for individual animated items
 */
export function AnimatedItem({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return <div className={cn('animate-item', className)}>{children}</div>
}
