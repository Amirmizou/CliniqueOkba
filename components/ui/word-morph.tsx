'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

/**
 * Métamorphose typographique « Clinique » → « Hôpital ».
 *
 * Le mot se dissout puis se reforme en boucle, sous une ligne de balayage
 * façon scanner. La largeur est figée sur le plus large des deux mots : le
 * reste du lockup (« Okba ») ne bouge jamais.
 *
 * - `variant="display"` : titres — animation lettre par lettre + ligne de scan.
 * - `variant="inline"`  : logo, footer, texte courant — fondu du mot entier.
 *
 * L'arabe étant une écriture liée, il est toujours animé d'un seul bloc :
 * le découper lettre par lettre casserait les ligatures.
 */

const CYCLE_MS = 3800

export interface WordMorphProps {
    from: string
    to: string
    variant?: 'display' | 'inline'
    /** Classe appliquée pendant l'affichage du mot d'origine */
    fromClassName?: string
    /** Classe appliquée pendant l'affichage du nouveau mot */
    toClassName?: string
    /** Rendu en mouvement réduit : le mot actuel seul, ou « ancien → nouveau ». */
    reducedFallback?: 'from' | 'both'
    /** Durée d'un palier, en ms */
    interval?: number
    className?: string
}

export function WordMorph({
    from,
    to,
    variant = 'inline',
    fromClassName = '',
    toClassName = '',
    reducedFallback = 'from',
    interval = CYCLE_MS,
    className = '',
}: WordMorphProps) {
    const reduce = useReducedMotion()
    const [showTo, setShowTo] = useState(false)

    useEffect(() => {
        if (reduce) return
        const id = setInterval(() => setShowTo((v) => !v), interval)
        return () => clearInterval(id)
    }, [reduce, interval])

    // Mouvement réduit : aucune animation
    if (reduce) {
        if (reducedFallback === 'from') {
            return <span className={`${className} ${fromClassName}`}>{from}</span>
        }
        return (
            <span className={`inline-flex items-center gap-2 ${className}`}>
                <span className={`line-through decoration-current/40 opacity-50 ${fromClassName}`}>
                    {from}
                </span>
                <ArrowRight className="h-[0.7em] w-[0.7em] shrink-0 rtl:rotate-180" aria-hidden />
                <span className={toClassName}>{to}</span>
            </span>
        )
    }

    const word = showTo ? to : from
    // Écriture liée (arabe) : on n'a pas le droit de séparer les lettres.
    const isCursive = /[؀-ۿ]/.test(word)
    const isDisplay = variant === 'display'
    const parts = isCursive || !isDisplay ? [word] : Array.from(word)
    const stateClass = showTo ? toClassName : fromClassName

    return (
        <span className={`relative inline-grid align-bottom ${className}`}>
            {/* Gabarit invisible de hauteur nulle : la colonne prend la largeur du
                plus large des deux mots, donc rien ne bouge autour. */}
            <span
                aria-hidden
                className="invisible col-start-1 row-start-2 block h-0 overflow-hidden whitespace-nowrap"
            >
                {showTo ? from : to}
            </span>

            <span className="col-start-1 row-start-1 flex justify-center whitespace-nowrap">
                {parts.map((part, i) => (
                    <motion.span
                        key={`${showTo ? 'to' : 'from'}-${i}`}
                        initial={{
                            opacity: 0,
                            y: isDisplay ? 18 : 8,
                            filter: isDisplay ? 'blur(8px)' : 'blur(4px)',
                        }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{
                            duration: isDisplay ? 0.55 : 0.4,
                            delay: isDisplay && !isCursive ? i * 0.035 : 0,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className={stateClass}
                    >
                        {part}
                    </motion.span>
                ))}
            </span>

            {/* Ligne de balayage : clin d'œil au scanner d'imagerie */}
            {isDisplay && (
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-[-6%] top-0 h-full overflow-hidden"
                >
                    <span className="okba-scan-line absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#4ade80] to-transparent" />
                </span>
            )}
        </span>
    )
}

/* ── Détection du mot « clinique » dans un texte libre (FR / AR) ── */
const CLINIC_WORDS: { from: string; to: string }[] = [
    { from: 'المصحة الطبية', to: 'مستشفى' },
    { from: 'CLINIQUE', to: 'HÔPITAL' },
    { from: 'Clinique', to: 'Hôpital' },
    { from: 'clinique', to: 'hôpital' },
    { from: 'عيادة', to: 'مستشفى' },
    { from: 'مصحة', to: 'مستشفى' },
]

/**
 * Enveloppe un texte libre (titre de section, nom du site venu de Sanity…) :
 * si le mot « Clinique » / « عيادة » s'y trouve, il est remplacé par la
 * métamorphose animée. Sinon le texte est rendu tel quel.
 */
export function BrandNameMorph({
    text,
    variant = 'inline',
    className = '',
    wordClassName = '',
}: {
    text?: string
    variant?: 'display' | 'inline'
    className?: string
    wordClassName?: string
}) {
    if (!text) return null

    const match = CLINIC_WORDS.find((w) => text.includes(w.from))
    if (!match) return <span className={className}>{text}</span>

    const index = text.indexOf(match.from)
    const before = text.slice(0, index)
    const after = text.slice(index + match.from.length)

    return (
        <span className={className}>
            {before}
            <WordMorph
                from={match.from}
                to={match.to}
                variant={variant}
                fromClassName={wordClassName}
                toClassName={wordClassName}
            />
            {after}
        </span>
    )
}

export default WordMorph
