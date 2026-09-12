'use client'

import { useEffect, useMemo, useState } from 'react'
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
    /** Mot d'arrivée, ou suite de mots parcourus en boucle après `from`. */
    to: string | string[]
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
    const [index, setIndex] = useState(0)

    // « Clinique » puis chacun des mots d'arrivée, en boucle.
    const cycle = useMemo(() => {
        const targets = (Array.isArray(to) ? to : [to]).filter(Boolean)
        return [from, ...(targets.length > 0 ? targets : [from])]
    }, [from, to])

    useEffect(() => {
        if (reduce || cycle.length < 2) return
        const id = setInterval(() => setIndex((i) => (i + 1) % cycle.length), interval)
        return () => clearInterval(id)
    }, [reduce, interval, cycle.length])

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
                <span className={toClassName}>{Array.isArray(to) ? to[0] : to}</span>
            </span>
        )
    }

    const safeIndex = index % cycle.length
    const word = cycle[safeIndex]
    // Écriture liée (arabe) : on n'a pas le droit de séparer les lettres.
    const isCursive = /[؀-ۿ]/.test(word)
    const isDisplay = variant === 'display'
    // Libellé de plusieurs mots (« Établissement Hospitalier Privé ») : on anime
    // mot par mot et on autorise le retour à la ligne. Découpé en lettres, chaque
    // espace deviendrait un item flex de largeur nulle — les mots se colleraient.
    const isPhrase = cycle.some((w) => /\s/.test(w.trim()))
    // Gabarit de largeur : le libellé le plus long du cycle. Réservé aux mots
    // courts — pour un libellé de plusieurs mots il figerait une largeur
    // énorme dans les lockups étroits (logo, menu mobile), donc on laisse
    // alors la largeur suivre le contenu.
    const widest = cycle.reduce((a, b) => (b.length > a.length ? b : a), '')
    const parts =
        isCursive || !isDisplay
            ? [word]
            : isPhrase
              ? word.trim().split(/\s+/)
              : Array.from(word)
    const stateClass = safeIndex === 0 ? fromClassName : toClassName

    return (
        <span className={`relative inline-grid align-bottom ${className}`}>
            {/* Gabarit invisible de hauteur nulle : la colonne prend la largeur du
                plus large des mots du cycle, donc rien ne bouge autour. */}
            {!isPhrase && (
                <span
                    aria-hidden
                    className="invisible col-start-1 row-start-2 block h-0 overflow-hidden whitespace-nowrap"
                >
                    {widest}
                </span>
            )}

            <span
                className={`col-start-1 row-start-1 flex justify-center ${
                    isPhrase ? 'flex-wrap gap-x-[0.28em]' : 'whitespace-nowrap'
                }`}
            >
                {parts.map((part, i) => (
                    <motion.span
                        key={`${safeIndex}-${i}`}
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

/* ── Détection du mot « clinique » dans un texte libre (FR / AR) ──
   La clinique devient un « Établissement Hospitalier Privé » — jamais un
   « hôpital ». Le cycle affiche le libellé complet puis son abréviation :
   EHP n'est qu'un raccourci, il ne remplace pas la dénomination. L'arabe n'a
   pas d'abréviation d'usage : il s'en tient au libellé complet. */
const CLINIC_WORDS: { from: string; to: string[]; short: string[] }[] = [
    { from: 'المصحة الطبية', to: ['مؤسسة استشفائية خاصة'], short: ['EHP'] },
    { from: 'CLINIQUE', to: ['ÉTABLISSEMENT HOSPITALIER PRIVÉ', 'EHP'], short: ['EHP'] },
    { from: 'Clinique', to: ['Établissement Hospitalier Privé', 'EHP'], short: ['EHP'] },
    { from: 'clinique', to: ['établissement hospitalier privé', 'EHP'], short: ['EHP'] },
    { from: 'عيادة', to: ['مؤسسة استشفائية خاصة'], short: ['EHP'] },
    { from: 'مصحة', to: ['مؤسسة استشفائية خاصة'], short: ['EHP'] },
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
    compact = false,
}: {
    text?: string
    variant?: 'display' | 'inline'
    className?: string
    wordClassName?: string
    /** Lockup étroit (logo du header, ligne du menu mobile) : seule
     *  l'abréviation y tient. Le libellé complet, posé sur 124px, passe sur
     *  quatre lignes et pousse la signature hors du header. */
    compact?: boolean
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
                to={compact ? match.short : match.to}
                variant={variant}
                fromClassName={wordClassName}
                toClassName={wordClassName}
            />
            {after}
        </span>
    )
}

export default WordMorph
