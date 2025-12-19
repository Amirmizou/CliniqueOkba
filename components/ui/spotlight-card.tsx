"use client"

import React, { useRef, useState, useEffect } from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    spotlightColor?: string
}

export function SpotlightCard({ children, className, spotlightColor = "rgba(14, 165, 233, 0.15)", ...props }: SpotlightCardProps) {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - left)
        mouseY.set(clientY - top)
    }

    return (
        <div
            className={cn(
                "group relative border border-border bg-card overflow-hidden rounded-xl",
                className
            )}
            onMouseMove={handleMouseMove}
            {...props}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
                }}
            />
            <div className="relative h-full">
                {children}
            </div>
        </div>
    )
}
