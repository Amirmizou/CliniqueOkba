"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface AuraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
}

export function AuraBackground({ className, children, ...props }: AuraBackgroundProps) {
    const { scrollY } = useScroll()

    // Parallax effect for the blobs
    const y1 = useTransform(scrollY, [0, 1000], [0, 200])
    const y2 = useTransform(scrollY, [0, 1000], [0, -150])

    return (
        <div className={cn("relative w-full min-h-screen overflow-hidden bg-background", className)} {...props}>
            {/* Organic Blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Top Left Blob (Blue/Teal) */}
                <motion.div
                    style={{ y: y1 }}
                    className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply filter opacity-30 animate-blob"
                />

                {/* Bottom Right Blob (Accent) */}
                <motion.div
                    style={{ y: y2 }}
                    className="absolute bottom-[20%] -right-[10%] w-[40vw] h-[40vw] bg-accent/30 rounded-full blur-[100px] mix-blend-multiply filter opacity-30 animate-blob animation-delay-2000"
                />

                {/* Center Floating Blob */}
                <motion.div
                    animate={{
                        x: [0, 30, -20, 0],
                        y: [0, -50, 20, 0],
                        scale: [1, 1.1, 0.9, 1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-secondary/40 rounded-full blur-[80px] mix-blend-multiply filter opacity-20"
                />

                {/* Subtle Noise Texture Overlay */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
