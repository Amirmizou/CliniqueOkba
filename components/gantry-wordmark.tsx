'use client'

import { motion } from 'framer-motion'

/**
 * GantryWordmark — animation d'intro « OKBA » (une fois au chargement).
 *
 * Concept : le « O » n'est PAS une lettre typographique mais un anneau vert calé
 * exactement sur le bore (le cercle central du gantry) — il en épouse la forme et
 * les dimensions, avec un glow qui prolonge le tunnel lumineux. Au chargement,
 * l'anneau pulse pour « allumer » le O, puis K, B, A jaillissent du centre du
 * bore vers la DROITE pour composer « OKBA » (lu de gauche à droite). Le mot
 * tient ~1,5 s, puis se rétracte dans le bore et s'estompe.
 *
 * `pointer-events-none` : ne bloque jamais le bouton RDV ni la nav.
 * Coordonnées mesurées depuis le bord droit du conteneur (même repère que les
 * autres pièces du gantry).
 */

type Variant = 'desktop' | 'mobile'

interface LetterCfg {
  char: string
  right: number // bord droit de la lettre, en px depuis le bord droit du conteneur
}

interface VariantCfg {
  anchor: 'bottom' | 'middle' // repère vertical : bas du conteneur (desktop) / centre (mobile)
  boreCenter: number // centre vertical (px depuis le bas) — desktop uniquement
  // Anneau « O » — dimensions/position calées sur le bore réel du gantry.
  hero: { w: number; h: number; right: number; bottom?: number; borderWidth: number }
  restSize: number // taille de K/B/A
  emergeRight: number // point d'émergence (≈ centre du bore) pour K/B/A
  letters: LetterCfg[]
  z: number
}

const CONFIG: Record<Variant, VariantCfg> = {
  desktop: {
    anchor: 'bottom',
    boreCenter: 73, // bore desktop : centre bottom 48 + h/2 25 = 73
    hero: { w: 50, h: 50, right: 65, bottom: 48, borderWidth: 3 }, // = paroi/lèvre du bore
    restSize: 28,
    emergeRight: 84,
    letters: [
      { char: 'K', right: 48 },
      { char: 'B', right: 26 },
      { char: 'A', right: 4 },
    ],
    z: 47,
  },
  mobile: {
    // Le mini-bore est collé au bord droit de la carte (overflow-hidden) : aucune
    // place pour K/B/A à droite. On n'affiche donc que l'anneau « O » qui pulse
    // sur le bore — le concept (O = cercle central) reste lisible sans rognage.
    anchor: 'middle',
    boreCenter: 0,
    hero: { w: 24, h: 24, right: 15, borderWidth: 2 }, // = bore illuminé du mini-gantry
    restSize: 12,
    emergeRight: 24,
    letters: [],
    z: 30,
  },
}

// Séquence : allumer/jaillir → tenir → se rétracter + s'estomper.
const HOLD_TIMES = [0, 0.2, 0.78, 1]
const DURATION: Record<Variant, number> = { desktop: 3.8, mobile: 3.2 }

export default function GantryWordmark({ variant }: { variant: Variant }) {
  const cfg = CONFIG[variant]
  const { hero } = cfg

  // Position verticale d'un élément de taille `size`, centré sur le bore.
  const vpos = (size: number) =>
    cfg.anchor === 'bottom'
      ? { bottom: cfg.boreCenter - size / 2 }
      : { top: '50%' as const, marginTop: -size / 2 }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-visible"
      style={{ zIndex: cfg.z }}
    >
      {/* Anneau « O » — épouse le cercle central du gantry, pulse à l'allumage. */}
      <motion.span
        className="absolute rounded-full"
        style={{
          right: hero.right,
          width: hero.w,
          height: hero.h,
          ...(cfg.anchor === 'bottom'
            ? { bottom: hero.bottom }
            : { top: '50%', marginTop: -hero.h / 2 }),
          border: `${hero.borderWidth}px solid #00a651`,
          boxShadow:
            '0 0 12px rgba(0,166,81,0.75), 0 0 26px rgba(0,166,81,0.45), inset 0 0 10px rgba(0,166,81,0.35)',
          willChange: 'transform, opacity',
        }}
        initial={{ opacity: 0 }}
        animate={{
          scale: [0.4, 1.08, 1, 1, 0.6],
          opacity: [0, 1, 1, 1, 0],
        }}
        transition={{
          duration: DURATION[variant],
          times: [0, 0.14, 0.24, 0.78, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* K, B, A — jaillissent du bore vers la droite. */}
      {cfg.letters.map((letter, i) => {
        const size = cfg.restSize
        const x0 = letter.right - cfg.emergeRight // décalage initial : au centre du bore
        const delay = 0.18 + i * 0.1 // après l'allumage du O

        return (
          <motion.span
            key={letter.char}
            className="absolute font-black leading-none"
            style={{
              right: letter.right,
              ...vpos(size),
              fontSize: size,
              letterSpacing: '-0.03em',
              color: '#006633',
              // Halo blanc pour rester lisible sur le corps clair du scanner et
              // le badge RDV.
              textShadow:
                '0 0 3px #fff, 0 0 3px #fff, 0 0 6px #fff, 0 1px 2px rgba(0,0,0,0.25)',
              willChange: 'transform, opacity, filter',
            }}
            initial={{ opacity: 0 }}
            animate={{
              x: [x0, 0, 0, x0 * 0.6],
              scale: [0.15, 1, 1, 0.4],
              opacity: [0, 1, 1, 0],
              filter: ['blur(6px)', 'blur(0px)', 'blur(0px)', 'blur(4px)'],
            }}
            transition={{
              duration: DURATION[variant],
              times: HOLD_TIMES,
              delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {letter.char}
          </motion.span>
        )
      })}
    </div>
  )
}
