"use client"

import { motion, useInView, Variant } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

type AnimationVariant =
    | "fadeUp"
    | "fadeDown"
    | "fadeLeft"
    | "fadeRight"
    | "scaleUp"
    | "blurIn"
    | "none"

interface ScrollAnimationProps {
    children: React.ReactNode
    className?: string
    variant?: AnimationVariant
    delay?: number
    duration?: number
    viewport?: {
        once?: boolean
        margin?: string
        amount?: number | "some" | "all"
    }
    as?: React.ElementType
}

const variants: Record<string, Record<string, Variant>> = {
    fadeUp: {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
    },
    fadeDown: {
        hidden: { opacity: 0, y: -40 },
        visible: { opacity: 1, y: 0 }
    },
    fadeLeft: {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0 }
    },
    fadeRight: {
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0 }
    },
    scaleUp: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
    },
    blurIn: {
        hidden: { opacity: 0, filter: "blur(10px)" },
        visible: { opacity: 1, filter: "blur(0px)" }
    },
    none: {
        hidden: {},
        visible: {}
    }
}

export default function ScrollAnimation({
    children,
    className,
    variant = "fadeUp",
    delay = 0,
    duration = 0.5,
    viewport = { once: true, margin: "-50px" },
    as: Component = "div"
}: ScrollAnimationProps) {
    const MotionComponent = motion(Component)

    return (
        <MotionComponent
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98] // Custom spring-like ease
            }}
            variants={variants[variant]}
            className={className}
        >
            {children}
        </MotionComponent>
    )
}
