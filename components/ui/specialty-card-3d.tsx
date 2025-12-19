'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SpecialtyCard3DProps {
    title: string
    icon: LucideIcon
    image: string
    description?: string
    color: string
    gradient: string
    size?: 'small' | 'medium' | 'large'
    index: number
    animationType?: 'heartbeat' | 'breathing' | 'synapse' | 'scan' | 'pulse' | 'playful' | 'shine'
}

export function SpecialtyCard3D({
    title,
    icon: Icon,
    image,
    description,
    color,
    gradient,
    size = 'medium',
    index,
    animationType = 'pulse'
}: SpecialtyCard3DProps) {
    const [isFlipped, setIsFlipped] = useState(false)

    // Size classes for Bento Grid
    const sizeClasses = {
        small: 'col-span-1 row-span-1 h-64',
        medium: 'col-span-1 row-span-1 h-80',
        large: 'col-span-2 row-span-2 h-[40rem]'
    }

    // Animation classes based on specialty type
    const iconAnimationClass = {
        heartbeat: 'animate-heartbeat-strong',
        breathing: 'animate-breathing',
        synapse: 'animate-synapse-pulse',
        scan: 'animate-scan',
        pulse: 'animate-medical-pulse',
        playful: 'animate-bounce',
        shine: 'animate-pulse'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={cn(
                'relative group perspective-1000',
                sizeClasses[size]
            )}
        >
            {/* 3D Card Container */}
            <motion.div
                className="relative w-full h-full preserve-3d cursor-pointer"
                whileHover={{
                    rotateY: isFlipped ? 180 : 5,
                    rotateX: isFlipped ? 0 : -5,
                    scale: 1.02,
                    z: 50
                }}
                onClick={() => setIsFlipped(!isFlipped)}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                style={{
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Front Face */}
                <div
                    className={cn(
                        'absolute inset-0 backface-hidden rounded-3xl overflow-hidden',
                        'bg-gradient-to-br from-background via-card to-background',
                        'border border-border/50 shadow-2xl',
                        isFlipped && 'invisible'
                    )}
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                            style={{ backgroundImage: `url(${image})` }}
                        />
                        <div className={cn(
                            'absolute inset-0 bg-gradient-to-br opacity-10',
                            gradient
                        )} />
                    </div>

                    {/* Scan Line Effect */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none overflow-hidden"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                    >
                        <motion.div
                            className={cn(
                                'absolute left-0 right-0 h-1 blur-sm',
                                `bg-gradient-to-r ${gradient}`
                            )}
                            style={{
                                boxShadow: `0 0 20px ${color}`
                            }}
                            animate={{
                                y: ['-10%', '110%']
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear',
                                repeatDelay: 1
                            }}
                        />
                    </motion.div>

                    {/* Gradient Border Pulse */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className={cn(
                            'absolute inset-0 rounded-3xl p-[2px]',
                            `bg-gradient-to-r ${gradient} bg-[length:200%_auto] animate-gradient`
                        )}>
                            <div className="absolute inset-[2px] rounded-3xl bg-background/80 backdrop-blur-sm" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-6 md:p-8 z-10">
                        {/* Icon with Animation */}
                        <div className="flex justify-start">
                            <motion.div
                                className={cn(
                                    'p-4 rounded-2xl backdrop-blur-md shadow-lg',
                                    `bg-gradient-to-br ${gradient}`,
                                    iconAnimationClass[animationType]
                                )}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <Icon className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" />
                            </motion.div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                                {title}
                            </h3>
                            {size === 'large' && description && (
                                <p className="text-muted-foreground text-sm md:text-base line-clamp-2">
                                    {description}
                                </p>
                            )}
                        </div>

                        {/* Hover Indicator */}
                        <motion.div
                            className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1 }}
                        >
                            <div className={cn(
                                'px-4 py-2 rounded-full backdrop-blur-md text-xs font-semibold text-white',
                                `bg-gradient-to-r ${gradient}`
                            )}>
                                Cliquer pour détails
                            </div>
                        </motion.div>
                    </div>

                    {/* Glassmorphism Overlay on Hover */}
                    <div className="absolute inset-0 bg-white/5 dark:bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                </div>

                {/* Back Face (Flipped) */}
                <div
                    className={cn(
                        'absolute inset-0 backface-hidden rounded-3xl overflow-hidden',
                        'bg-gradient-to-br from-card via-background to-card',
                        'border border-border/50 shadow-2xl',
                        'rotate-y-180',
                        !isFlipped && 'invisible'
                    )}
                >
                    <div className="relative h-full flex flex-col justify-center items-center p-8 text-center space-y-6">
                        <div className={cn(
                            'p-6 rounded-full',
                            `bg-gradient-to-br ${gradient}`
                        )}>
                            <Icon className="w-12 h-12 text-white" />
                        </div>

                        <h3 className="text-3xl font-bold text-foreground">
                            {title}
                        </h3>

                        {description && (
                            <p className="text-muted-foreground text-lg max-w-md">
                                {description}
                            </p>
                        )}

                        <motion.button
                            className={cn(
                                'px-6 py-3 rounded-full font-semibold text-white shadow-lg',
                                `bg-gradient-to-r ${gradient}`
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            En savoir plus
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
