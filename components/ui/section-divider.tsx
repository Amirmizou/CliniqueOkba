'use client'

interface SectionDividerProps {
    variant?: 'default' | 'gradient' | 'wave'
    className?: string
}

export default function SectionDivider({ variant = 'default', className = '' }: SectionDividerProps) {
    if (variant === 'wave') {
        return (
            <div className={`relative h-16 sm:h-24 overflow-hidden ${className}`}>
                <svg
                    className="absolute bottom-0 w-full h-full text-card"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        fill="currentColor"
                    />
                </svg>
            </div>
        )
    }

    if (variant === 'gradient') {
        return (
            <div className={`relative h-20 sm:h-32 ${className}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-card" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <div className="w-2 h-2 rounded-full bg-primary/30" />
                    <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>
            </div>
        )
    }

    // Default variant
    return (
        <div className={`relative h-12 sm:h-20 ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent rounded-full" />
            </div>
        </div>
    )
}
