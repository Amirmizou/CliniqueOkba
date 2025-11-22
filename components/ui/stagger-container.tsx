"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StaggerContainerProps {
    children: React.ReactNode
    className?: string
    delayChildren?: number
    staggerChildren?: number
    viewport?: {
        once?: boolean
        margin?: string
        amount?: number | "some" | "all"
    }
    as?: React.ElementType
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: (props: { delayChildren: number; staggerChildren: number }) => ({
        opacity: 1,
        transition: {
            delayChildren: props.delayChildren,
            staggerChildren: props.staggerChildren
        }
    })
}

export default function StaggerContainer({
    children,
    className,
    delayChildren = 0,
    staggerChildren = 0.1,
    viewport = { once: true, margin: "-50px" },
    as: Component = "div"
}: StaggerContainerProps) {
    const MotionComponent = motion(Component)

    return (
        <MotionComponent
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={containerVariants}
            custom={{ delayChildren, staggerChildren }}
            className={className}
        >
            {children}
        </MotionComponent>
    )
}
