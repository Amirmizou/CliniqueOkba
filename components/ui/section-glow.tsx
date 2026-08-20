/**
 * Halos ambiants d'une section, peints en `radial-gradient`.
 *
 * Remplace le motif « div ronde + blur-[130px] » : un filtre de flou de cette
 * ampleur crée une couche composite que le GPU refiltre à chaque repaint,
 * ce qui hache le scroll sur mobile milieu de gamme. Un dégradé radial rend
 * la même nappe de lumière en peinture simple, sans couche dédiée.
 *
 * Composant serveur : aucun JS envoyé au navigateur.
 */

export interface Glow {
    /** Position du centre, syntaxe CSS `background-position` (ex. '0% 100%'). */
    at: string
    /** Rayon en pixels. */
    size: number
    /** Couleur CSS ou variable de thème (ex. 'var(--color-brand-green)'). */
    color: string
    /** Opacité au centre, 0–1. */
    opacity: number
}

export default function SectionGlow({
    glows,
    className = '',
}: {
    glows: Glow[]
    className?: string
}) {
    return (
        <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 ${className}`}
            style={{
                backgroundImage: glows
                    .map(
                        ({ at, size, color, opacity }) =>
                            `radial-gradient(${size}px ${size}px at ${at}, color-mix(in oklab, ${color} ${Math.round(
                                opacity * 100,
                            )}%, transparent) 0%, transparent 62%)`,
                    )
                    .join(', '),
            }}
        />
    )
}
