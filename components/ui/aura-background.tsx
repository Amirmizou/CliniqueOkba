"use client"

import { cn } from "@/lib/utils"

interface AuraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
}

/**
 * Fond ambiant du site : halos de marque + grain fin.
 *
 * Les halos sont peints en `radial-gradient` plutôt qu'en `div` floutées.
 * Un `filter: blur(120px)` sur un élément `fixed` force le compositeur à
 * refiltrer la couche à chaque frame de scroll — c'est la première cause de
 * saccade sur mobile. Un dégradé radial donne le même rendu pour un coût de
 * peinture quasi nul, et sans couche GPU dédiée.
 */
export function AuraBackground({ className, children, ...props }: AuraBackgroundProps) {
    return (
        <div className={cn("relative w-full min-h-dvh overflow-hidden bg-background", className)} {...props}>
            <div
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: [
                        // Halo haut-gauche — vert de marque
                        'radial-gradient(60vw 60vw at 12% 8%, color-mix(in oklab, var(--primary) 12%, transparent) 0%, transparent 62%)',
                        // Halo bas-droite — accent chaud
                        'radial-gradient(48vw 48vw at 92% 74%, color-mix(in oklab, var(--accent) 14%, transparent) 0%, transparent 60%)',
                        // Halo central — respiration froide, très diffus
                        'radial-gradient(38vw 38vw at 42% 46%, color-mix(in oklab, var(--secondary) 16%, transparent) 0%, transparent 66%)',
                    ].join(', '),
                }}
            />

            {/* Grain SVG inline — 0 requête réseau, casse la platitude du numérique */}
            <div
                className="fixed inset-0 z-0 pointer-events-none opacity-[0.06] mix-blend-multiply dark:mix-blend-overlay dark:opacity-[0.05]"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    backgroundSize: '160px 160px',
                }}
            />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
