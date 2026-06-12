"use client"

import { cn } from "@/lib/utils"

interface AuraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
}

export function AuraBackground({ className, children, ...props }: AuraBackgroundProps) {
    return (
        <div className={cn("relative w-full min-h-screen overflow-hidden bg-background", className)} {...props}>
            {/* Organic Blobs — CSS-only, pas de JS scroll tracking */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Top Left Blob */}
                <div
                    className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-primary/15 rounded-full blur-[120px] opacity-25 will-change-transform"
                />

                {/* Bottom Right Blob */}
                <div
                    className="absolute bottom-[20%] -right-[10%] w-[40vw] h-[40vw] bg-accent/20 rounded-full blur-[100px] opacity-25 will-change-transform"
                />

                {/* Center Blob */}
                <div
                    className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-secondary/30 rounded-full blur-[80px] opacity-15"
                />

                {/* Grain SVG inline */}
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
