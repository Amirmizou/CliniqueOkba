'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * Séparateurs de section à motifs biologiques et de laboratoire.
 *
 * Chaque variante a une silhouette propre — hélice, liaisons, gel, mitose,
 * titrage, tomographie, spectre — pour que la transition annonce la section
 * qui suit au lieu de répéter sept fois le même tracé.
 *
 * Contrairement à l'ECG, le motif se dessine UNE FOIS en entrant dans le
 * champ puis se fige : pas de `repeat: Infinity` qui occupe le processeur en
 * continu, et pas de pouls permanent qui met le lecteur sous tension.
 */

export type BioVariant =
    | 'helix'      // double hélice ADN — le vivant, la génétique
    | 'molecule'   // chaîne moléculaire + noyau aromatique — biochimie
    | 'gel'        // gel d'électrophorèse — analyses, migration
    | 'mitosis'    // division cellulaire — cytologie
    | 'titration'  // goutte de pipette + onde — prélèvement, précision
    | 'tomography' // arcs du portique + coupe — imagerie
    | 'spectrum'   // spectre d'absorption — spectrométrie

const VB_W = 600
const VB_H = 48
const MID = VB_H / 2

const EASE = [0.22, 1, 0.36, 1] as const

/** Tracé qui se dessine, joué une seule fois. */
function drawProps(delay = 0, duration = 1.1) {
    return {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true },
        transition: {
            pathLength: { duration, delay, ease: EASE },
            opacity: { duration: 0.25, delay },
        },
    }
}

interface MotifProps {
    color: string
    animate: boolean
}

/* ── ADN ─────────────────────────────────────────────────────────────────
   Deux brins en opposition de phase, reliés par des barreaux dont la
   longueur suit l'écartement réel des brins : le motif se referme donc
   de lui-même aux points de croisement. */
function Helix({ color, animate }: MotifProps) {
    const amp = 11
    const period = 150
    const yA = (x: number) => MID - amp * Math.sin((2 * Math.PI * x) / period)
    const yB = (x: number) => MID + amp * Math.sin((2 * Math.PI * x) / period)

    const strand = (invert: boolean) => {
        const pts: string[] = []
        for (let x = 0; x <= VB_W; x += 6) {
            const y = (invert ? yB : yA)(x)
            pts.push(`${pts.length ? 'L' : 'M'}${x},${y.toFixed(2)}`)
        }
        return pts.join(' ')
    }

    const rungs: number[] = []
    for (let x = 0; x <= VB_W; x += 20) rungs.push(x)

    return (
        <>
            {rungs.map((x, i) => {
                const a = yA(x)
                const b = yB(x)
                // Aux croisements les brins se confondent : pas de barreau.
                if (Math.abs(a - b) < 3) return null
                return (
                    <motion.line
                        key={x}
                        x1={x}
                        y1={a}
                        x2={x}
                        y2={b}
                        stroke={color}
                        strokeOpacity={0.28}
                        strokeWidth={1.4}
                        strokeLinecap="round"
                        initial={animate ? { opacity: 0, scaleY: 0.2 } : undefined}
                        whileInView={animate ? { opacity: 1, scaleY: 1 } : undefined}
                        viewport={{ once: true }}
                        transition={{ delay: 0.35 + i * 0.018, duration: 0.4 }}
                        style={{ transformOrigin: `${x}px ${MID}px` }}
                    />
                )
            })}
            <motion.path
                d={strand(false)}
                stroke={color}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                {...(animate ? drawProps(0) : {})}
            />
            <motion.path
                d={strand(true)}
                stroke={color}
                strokeOpacity={0.55}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                {...(animate ? drawProps(0.12) : {})}
            />
        </>
    )
}

/* ── Chaîne moléculaire ──────────────────────────────────────────────────
   Noyau aromatique au centre, chaînes en zigzag de part et d'autre avec un
   atome à chaque coude. */
function Molecule({ color, animate }: MotifProps) {
    const cx = VB_W / 2
    const r = 13

    const hex = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2
        return [cx + r * Math.cos(a), MID + r * Math.sin(a)] as const
    })
    const hexPath =
        hex.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ' Z'

    const step = 34
    const side = (dir: 1 | -1) =>
        Array.from({ length: 4 }, (_, i) => {
            const x = cx + dir * (r + 10 + i * step)
            const y = MID + (i % 2 === 0 ? -8 : 8)
            return [x, y] as const
        })
    const left = side(-1)
    const right = side(1)

    const chain = (pts: readonly (readonly [number, number])[], fromX: number) =>
        `M${fromX},${MID} ` + pts.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

    return (
        <>
            <motion.path
                d={chain(left, cx - r)}
                stroke={color}
                strokeWidth={1.8}
                strokeOpacity={0.5}
                fill="none"
                strokeLinecap="round"
                {...(animate ? drawProps(0.1, 0.9) : {})}
            />
            <motion.path
                d={chain(right, cx + r)}
                stroke={color}
                strokeWidth={1.8}
                strokeOpacity={0.5}
                fill="none"
                strokeLinecap="round"
                {...(animate ? drawProps(0.1, 0.9) : {})}
            />
            <motion.path
                d={hexPath}
                stroke={color}
                strokeWidth={2.2}
                fill="none"
                strokeLinejoin="round"
                {...(animate ? drawProps(0, 0.8) : {})}
            />
            {/* Cercle interne : la marque conventionnelle de l'aromaticité */}
            <motion.circle
                cx={cx}
                cy={MID}
                r={r * 0.55}
                stroke={color}
                strokeOpacity={0.4}
                strokeWidth={1.4}
                fill="none"
                initial={animate ? { opacity: 0, scale: 0.4 } : undefined}
                whileInView={animate ? { opacity: 1, scale: 1 } : undefined}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                style={{ transformOrigin: `${cx}px ${MID}px` }}
            />
            {[...left, ...right].map(([x, y], i) => (
                <motion.circle
                    key={`${x}-${y}`}
                    cx={x}
                    cy={y}
                    r={3}
                    fill={color}
                    fillOpacity={0.65}
                    initial={animate ? { opacity: 0, scale: 0 } : undefined}
                    whileInView={animate ? { opacity: 1, scale: 1 } : undefined}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.35 }}
                    style={{ transformOrigin: `${x}px ${y}px` }}
                />
            ))}
        </>
    )
}

/* ── Gel d'électrophorèse ────────────────────────────────────────────────
   Pistes de migration verticales, bandes d'intensités inégales : la lecture
   d'un gel réel, où chaque piste est un échantillon. */
function Gel({ color, animate }: MotifProps) {
    // Densités volontairement irrégulières — un gel régulier ne ressemble à
    // aucune migration réelle.
    const lanes = [
        [0.55, 0.22, 0.9],
        [0.85, 0.4],
        [0.3, 0.62, 0.18, 0.75],
        [0.7, 0.95],
        [0.25, 0.5, 0.8],
        [0.9, 0.35, 0.6],
        [0.45, 0.7],
        [0.6, 0.28, 0.85, 0.4],
    ]
    const laneW = 46
    const gap = 14
    const total = lanes.length * laneW + (lanes.length - 1) * gap
    const x0 = (VB_W - total) / 2

    return (
        <>
            {lanes.map((bands, li) => {
                const x = x0 + li * (laneW + gap)
                return (
                    <g key={li}>
                        {/* Puits de dépôt en tête de piste */}
                        <rect x={x} y={4} width={laneW} height={2.5} rx={1} fill={color} fillOpacity={0.3} />
                        {bands.map((intensity, bi) => {
                            const y = 13 + bi * 8.5
                            return (
                                <motion.rect
                                    key={bi}
                                    x={x}
                                    y={animate ? undefined : y}
                                    width={laneW}
                                    height={4}
                                    rx={2}
                                    fill={color}
                                    fillOpacity={0.15 + intensity * 0.5}
                                    initial={animate ? { y: 6, opacity: 0 } : undefined}
                                    whileInView={animate ? { y, opacity: 1 } : undefined}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: 0.1 + li * 0.06 + bi * 0.09,
                                        duration: 0.7,
                                        ease: EASE,
                                    }}
                                />
                            )
                        })}
                    </g>
                )
            })}
        </>
    )
}

/* ── Mitose ──────────────────────────────────────────────────────────────
   Une cellule traverse les étapes de sa division de gauche à droite :
   ronde, allongée, étranglée, séparée. */
function Mitosis({ color, animate }: MotifProps) {
    const stages = [0, 1, 2, 3, 4]
    const gap = VB_W / (stages.length + 1)

    return (
        <>
            {/* Fuseau — le fil directeur de la lecture */}
            <line
                x1={20}
                y1={MID}
                x2={VB_W - 20}
                y2={MID}
                stroke={color}
                strokeOpacity={0.12}
                strokeWidth={1}
                strokeDasharray="3 5"
            />
            {stages.map((s, i) => {
                const cx = gap * (i + 1)
                const t = s / (stages.length - 1)
                const split = t * 9
                const rx = 11 - t * 2
                const ry = 11 - t * 3.2
                const common = {
                    initial: animate ? { opacity: 0, scale: 0.5 } : undefined,
                    whileInView: animate ? { opacity: 1, scale: 1 } : undefined,
                    viewport: { once: true },
                    transition: { delay: 0.1 + i * 0.13, duration: 0.5, ease: EASE },
                    style: { transformOrigin: `${cx}px ${MID}px` },
                }
                return (
                    <g key={s}>
                        <motion.ellipse
                            cx={cx - split}
                            cy={MID}
                            rx={rx}
                            ry={ry}
                            stroke={color}
                            strokeWidth={1.8}
                            fill={color}
                            fillOpacity={0.06}
                            {...common}
                        />
                        <motion.circle
                            cx={cx - split}
                            cy={MID}
                            r={2.4}
                            fill={color}
                            fillOpacity={0.55}
                            {...common}
                        />
                        {split > 0 && (
                            <>
                                <motion.ellipse
                                    cx={cx + split}
                                    cy={MID}
                                    rx={rx}
                                    ry={ry}
                                    stroke={color}
                                    strokeWidth={1.8}
                                    fill={color}
                                    fillOpacity={0.06}
                                    {...common}
                                />
                                <motion.circle
                                    cx={cx + split}
                                    cy={MID}
                                    r={2.4}
                                    fill={color}
                                    fillOpacity={0.55}
                                    {...common}
                                />
                            </>
                        )}
                    </g>
                )
            })}
        </>
    )
}

/* ── Titrage ─────────────────────────────────────────────────────────────
   Goutte de pipette et ondes concentriques vues en perspective à la surface
   du liquide — le geste de prélèvement. */
function Titration({ color, animate }: MotifProps) {
    const cx = VB_W / 2
    const surface = MID + 10
    // Ellipses aplaties : lues en perspective, elles se reconnaissent comme
    // des ondes de surface, là où des arcs simples restaient ambigus.
    const ripples = [
        [22, 4],
        [46, 7],
        [76, 9.5],
        [108, 12],
    ] as const
    const tipY = 23

    return (
        <>
            <line
                x1={40}
                y1={surface}
                x2={VB_W - 40}
                y2={surface}
                stroke={color}
                strokeOpacity={0.16}
                strokeWidth={1.2}
            />

            {ripples.map(([rx, ry], i) => (
                <motion.ellipse
                    key={rx}
                    cx={cx}
                    cy={surface}
                    rx={rx}
                    ry={ry}
                    stroke={color}
                    strokeOpacity={0.42 - i * 0.08}
                    strokeWidth={1.5 - i * 0.15}
                    fill="none"
                    initial={animate ? { opacity: 0, scale: 0.35 } : undefined}
                    whileInView={animate ? { opacity: 1, scale: 1 } : undefined}
                    viewport={{ once: true }}
                    transition={{ delay: 0.45 + i * 0.12, duration: 0.55, ease: EASE }}
                    style={{ transformOrigin: `${cx}px ${surface}px` }}
                />
            ))}

            {/* Pipette — corps gradué puis cône effilé jusqu'à la pointe */}
            <motion.g
                initial={animate ? { opacity: 0, y: -5 } : undefined}
                whileInView={animate ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: EASE }}
            >
                <path
                    d={`M${cx - 11},1 L${cx - 11},9 L${cx - 2.4},${tipY} L${cx + 2.4},${tipY} L${cx + 11},9 L${cx + 11},1 Z`}
                    fill={color}
                    fillOpacity={0.09}
                    stroke={color}
                    strokeWidth={1.9}
                    strokeLinejoin="round"
                />
                <line x1={cx - 8.5} y1={5} x2={cx + 8.5} y2={5} stroke={color} strokeOpacity={0.35} strokeWidth={1.1} />
            </motion.g>

            {/* Goutte en chute vers le point d'impact */}
            <motion.path
                d={`M${cx},${tipY + 1} c2.6,3 4,4.7 4,6.5 a4,4 0 0 1 -8,0 c0,-1.8 1.4,-3.5 4,-6.5 Z`}
                fill={color}
                fillOpacity={0.7}
                initial={animate ? { y: -6, opacity: 0 } : undefined}
                whileInView={animate ? { y: 2, opacity: 1 } : undefined}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.32, ease: 'easeIn' }}
            />
        </>
    )
}

/* ── Tomographie ─────────────────────────────────────────────────────────
   Géométrie en faisceau conique : source, rayons divergents, section
   traversée et barrette de détecteurs. C'est la signature d'un scanner —
   des arcs concentriques se confondaient avec les ondes du titrage. */
function Tomography({ color, animate }: MotifProps) {
    const cx = VB_W / 2
    const srcY = 5
    const R = 36
    const SPREAD = (55 * Math.PI) / 180
    const RAYS = 9

    const detector = Array.from({ length: RAYS }, (_, i) => {
        const a = -SPREAD + (2 * SPREAD * i) / (RAYS - 1)
        return {
            a,
            x: cx + R * Math.sin(a),
            y: srcY + R * Math.cos(a),
        }
    })
    const half = detector[detector.length - 1].x - cx

    const detectorPath = detector
        .map((d, i) => `${i ? 'L' : 'M'}${d.x.toFixed(1)},${d.y.toFixed(1)}`)
        .join(' ')

    return (
        <>
            <line x1={0} y1={MID} x2={cx - half - 14} y2={MID} stroke={color} strokeOpacity={0.16} strokeWidth={1.4} />
            <line x1={cx + half + 14} y1={MID} x2={VB_W} y2={MID} stroke={color} strokeOpacity={0.16} strokeWidth={1.4} />

            {/* Faisceau */}
            {detector.map((d, i) => (
                <motion.line
                    key={i}
                    x1={cx}
                    y1={srcY}
                    x2={d.x}
                    y2={d.y}
                    stroke={color}
                    strokeOpacity={i === Math.floor(RAYS / 2) ? 0.4 : 0.16}
                    strokeWidth={1}
                    initial={animate ? { opacity: 0 } : undefined}
                    whileInView={animate ? { opacity: 1 } : undefined}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 + i * 0.04, duration: 0.3 }}
                />
            ))}

            {/* Section traversée */}
            <motion.ellipse
                cx={cx}
                cy={srcY + 19}
                rx={9}
                ry={7}
                stroke={color}
                strokeWidth={1.8}
                fill={color}
                fillOpacity={0.07}
                initial={animate ? { opacity: 0, scale: 0.5 } : undefined}
                whileInView={animate ? { opacity: 1, scale: 1 } : undefined}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.45, ease: EASE }}
                style={{ transformOrigin: `${cx}px ${srcY + 19}px` }}
            />

            {/* Barrette de détecteurs */}
            <motion.path
                d={detectorPath}
                stroke={color}
                strokeWidth={2.2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                {...(animate ? drawProps(0.15, 0.6) : {})}
            />
            {detector.map((d, i) => (
                <line
                    key={`t${i}`}
                    x1={d.x}
                    y1={d.y}
                    x2={cx + (R + 4.5) * Math.sin(d.a)}
                    y2={srcY + (R + 4.5) * Math.cos(d.a)}
                    stroke={color}
                    strokeOpacity={0.45}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                />
            ))}

            {/* Source */}
            <circle cx={cx} cy={srcY} r={3.2} fill={color} fillOpacity={0.8} />
        </>
    )
}

/* ── Spectre d'absorption ────────────────────────────────────────────────
   Raies verticales d'intensités inégales, comme la sortie d'un
   spectrophotomètre : un signal mesuré, pas une frise régulière. */
function Spectrum({ color, animate }: MotifProps) {
    const peaks = [
        0.18, 0.3, 0.22, 0.65, 0.41, 0.28, 0.9, 0.52, 0.34, 0.2,
        0.26, 0.78, 0.44, 0.31, 0.19, 0.58, 0.86, 0.37, 0.24, 0.29,
        0.47, 0.21, 0.33, 0.7, 0.39, 0.25, 0.6, 0.31, 0.23, 0.17,
    ]
    const barW = 3.4
    const gap = (VB_W - peaks.length * barW) / (peaks.length + 1)
    const base = VB_H - 7

    return (
        <>
            <line x1={12} y1={base} x2={VB_W - 12} y2={base} stroke={color} strokeOpacity={0.2} strokeWidth={1.2} />
            {peaks.map((p, i) => {
                const x = gap + i * (barW + gap)
                const h = 4 + p * (VB_H - 16)
                const y = base - h
                return (
                    <motion.rect
                        key={i}
                        x={x}
                        y={animate ? undefined : y}
                        width={barW}
                        height={animate ? undefined : h}
                        rx={1.7}
                        fill={color}
                        fillOpacity={0.2 + p * 0.55}
                        initial={animate ? { height: 0, y: base } : undefined}
                        whileInView={animate ? { height: h, y } : undefined}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 + i * 0.022, duration: 0.5, ease: EASE }}
                    />
                )
            })}
        </>
    )
}

const MOTIFS: Record<BioVariant, (props: MotifProps) => React.ReactElement> = {
    helix: Helix,
    molecule: Molecule,
    gel: Gel,
    mitosis: Mitosis,
    titration: Titration,
    tomography: Tomography,
    spectrum: Spectrum,
}

/**
 * Largeur de la fenêtre de vue, par motif.
 *
 * Tous les motifs sont dessinés dans le même repère de 600 unités, mais on
 * n'en montre qu'une fenêtre centrée. À hauteur fixe, l'échelle d'un SVG en
 * `meet` vaut min(largeurRendue / largeurViewBox, 1) : une fenêtre de 600
 * imposait donc 57 % sur un écran de 390 px, et les motifs centrés
 * devenaient illisibles. Une fenêtre resserrée les ramène à l'échelle 1 sur
 * mobile, et rogne au passage les lignes de base pile aux bords de la bande.
 */
const VIEW_WIDTH: Record<BioVariant, number> = {
    helix: 600,      // trame répétée : occupe déjà toute la largeur
    gel: 500,
    spectrum: 600,   // trame répétée
    mitosis: 470,   // les cellules des extremites debordaient d'une fenetre plus etroite
    molecule: 350,
    titration: 350,
    tomography: 320,
}

interface BioDividerProps {
    variant: BioVariant
    /** Couleur du tracé. Par défaut, le vert de marque. */
    color?: string
    className?: string
}

export default function BioDivider({
    variant,
    color = '#006633',
    className = '',
}: BioDividerProps) {
    const ref = useRef<HTMLDivElement>(null)
    // Le motif n'est monté qu'à l'approche du champ : les séparateurs de bas
    // de page ne coûtent rien tant qu'on ne les a pas atteints.
    const inView = useInView(ref, { once: true, margin: '200px 0px' })
    const reduce = useReducedMotion()
    const Motif = MOTIFS[variant]
    const vw = VIEW_WIDTH[variant]

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className={`relative flex h-16 items-center sm:h-20 ${className}`}
        >
            <div className="mx-auto w-full max-w-3xl px-6">
                <svg
                    width="100%"
                    height={VB_H}
                    viewBox={`${(VB_W - vw) / 2} 0 ${vw} ${VB_H}`}
                    preserveAspectRatio="xMidYMid meet"
                    fill="none"
                >
                    {inView && <Motif color={color} animate={!reduce} />}
                </svg>
            </div>
        </div>
    )
}
