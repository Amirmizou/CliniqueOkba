"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface OrganicCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    delay?: number
}

export function OrganicCard({ children, className, delay = 0, ...props }: OrganicCardProps) {
    // Random organic shapes logic
    const shapes = [
        ["60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 60% 40% / 50% 60% 30% 60%"],
        ["30% 70% 70% 30% / 30% 30% 70% 70%", "60% 40% 30% 70% / 70% 40% 60% 30%"],
        ["50% 50% 30% 70% / 50% 70% 30% 60%", "70% 30% 50% 50% / 50% 40% 60% 50%"]
    ]
    const randomShapeSet = shapes[Math.floor(Math.random() * shapes.length)]

    return (
        <motion.div
            className={cn(
                "relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg group hover:z-10 transition-all duration-500",
                className
            )}
            // Organic Morphing Animation
            initial={{ borderRadius: randomShapeSet[0] }}
            animate={{
                borderRadius: [randomShapeSet[0], randomShapeSet[1], randomShapeSet[0]],
            }}
            whileHover={{
                borderRadius: "1rem", // Stabilize to standard rounded rectangle on hover
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.1)"
            }}
            transition={{
                borderRadius: { duration: 8, repeat: Infinity, ease: "easeInOut", delay },
                scale: { duration: 0.3 }
            }}
            {...props as any}
        >
            {/* Internal shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {children}
        </motion.div>
    )
}
