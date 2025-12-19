"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Scan, Activity, Heart, Stethoscope } from "lucide-react"

interface ServiceShowcaseProps {
    imageSrc: string
    className?: string
}

export function ServiceShowcase({ imageSrc, className }: ServiceShowcaseProps) {
    const ref = useRef<HTMLDivElement>(null)

    // Mouse interaction state
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return

        const width = rect.width
        const height = rect.height

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5

        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={cn("relative perspective-1000 w-full max-w-md mx-auto aspect-[4/5]", className)}
            style={{
                transformStyle: "preserve-3d",
            }}
        >
            {/* Animated Floating Elements behind */}
            <div className="absolute top-10 -left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-700" />

            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative w-full h-full rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-visible group"
            >
                {/* Main Image Container */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden bg-slate-900">
                    <Image
                        src={imageSrc}
                        alt="Services Clinique Okba"
                        fill
                        className="object-contain p-1 group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 500px"
                        priority
                    />

                    {/* Holographic Scan Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />

                    {/* Scanning Line */}
                    <motion.div
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-[2px] bg-primary/50 shadow-[0_0_20px_rgba(44,133,222,0.8)] z-20 pointer-events-none opacity-50"
                    >
                        <div className="absolute right-0 -top-1 px-1 bg-primary text-[8px] text-white font-mono">SCANNING</div>
                    </motion.div>
                </div>

                {/* Floating 3D Elements (Badges that pop out) */}

                {/* Badge 1: Top Right */}
                <motion.div
                    style={{ translateZ: 50 }}
                    className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-lg flex items-center gap-2 group-hover:bg-white/20 transition-colors"
                >
                    <div className="bg-green-500/20 p-1.5 rounded-lg">
                        <Activity className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-white font-semibold">Urgence 24/7</span>
                        <span className="text-[10px] text-green-300">Disponible</span>
                    </div>
                </motion.div>

                {/* Badge 2: Bottom Left */}
                <motion.div
                    style={{ translateZ: 40 }}
                    className="absolute -bottom-6 -left-4 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-lg flex items-center gap-2 group-hover:bg-white/20 transition-colors"
                >
                    <div className="bg-blue-500/20 p-1.5 rounded-lg">
                        <Scan className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-white font-semibold">Haute Technologie</span>
                        <span className="text-[10px] text-blue-300">Plateau complet</span>
                    </div>
                </motion.div>

                {/* Glass reflection overlay */}
                <div
                    className="absolute inset-0 rounded-2xl ring-1 ring-white/10 z-30 pointer-events-none bg-gradient-to-br from-white/10 to-transparent opacity-50"
                    style={{ transform: "translateZ(1px)" }}
                />

            </motion.div>
        </motion.div>
    )
}
