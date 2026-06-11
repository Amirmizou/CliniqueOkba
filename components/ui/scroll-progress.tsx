"use client"

import { motion, useScroll, useSpring } from "framer-motion"

/**
 * Barre de progression de lecture — dégradé de marque + pointe lumineuse.
 * Origine logique (gauche en LTR, droite en RTL) via `origin-[0%]` + dir.
 */
export default function ScrollProgress() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 z-50 h-[3px] origin-left rtl:origin-right bg-gradient-to-r from-[#006633] via-[#4caf6e] to-[#FDE68A] shadow-[0_0_12px_rgba(76,175,110,0.55)]"
            style={{ scaleX }}
        />
    )
}
