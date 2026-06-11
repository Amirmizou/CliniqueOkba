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

                {/* Center Blob — statique (profondeur sans mouvement perpétuel) */}
                <div
                    className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-secondary/40 rounded-full blur-[80px] mix-blend-multiply filter opacity-20"
                />

                {/* Grain SVG inline (aucune requête réseau) — brise la platitude numérique */}
                <div
                    className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                        backgroundSize: '160px 160px',
                    }}
                ></div>
            </div>

            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
