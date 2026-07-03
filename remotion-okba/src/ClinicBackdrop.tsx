import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion'

/**
 * Fond cinématique « Clinique OKBA » — 2.5D à partir des VRAIES photos.
 * Aucun élément inventé : mouvements de caméra lents (Ken Burns) sur les
 * photos réelles + fondus enchaînés + étalonnage premium. Pensé comme fond
 * de la section « À propos » (effet au scroll).
 */

const easeInOut = Easing.inOut(Easing.ease)

type SceneProps = {
  src: string
  fadeIn: [number, number]
  fadeOut: [number, number]
  fromScale: number
  toScale: number
  panX: number // % de déplacement horizontal sur la durée
  panY: number
  objectPosition?: string
  span: [number, number] // début/fin du mouvement Ken Burns
}

const Scene: React.FC<SceneProps> = ({
  src,
  fadeIn,
  fadeOut,
  fromScale,
  toScale,
  panX,
  panY,
  objectPosition = 'center center',
  span,
}) => {
  const frame = useCurrentFrame()

  const p = interpolate(frame, span, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  })
  const scale = fromScale + (toScale - fromScale) * p
  const tx = panX * p
  const ty = panY * p

  const opacity =
    interpolate(frame, fadeIn, [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easeInOut,
    }) *
    interpolate(frame, fadeOut, [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easeInOut,
    })

  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition,
          transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      />
    </AbsoluteFill>
  )
}

export const ClinicBackdrop: React.FC = () => {
  const frame = useCurrentFrame()

  // Balayage lumineux diagonal lent (reflet « verre » premium) — subtil
  const sweep = interpolate(frame, [0, 360], [-30, 130], {
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ backgroundColor: '#04140c' }}>
      {/* Scène 1 — vue aérienne (paysage, tout le détail) */}
      <Scene
        src="clinic-3.png"
        span={[0, 170]}
        fromScale={1.06}
        toScale={1.15}
        panX={-2.2}
        panY={1.4}
        objectPosition="60% 55%"
        fadeIn={[0, 1]}
        fadeOut={[150, 176]}
      />

      {/* Scène 2 — angle rue + enseigne toit (façade en verre incurvée) */}
      <Scene
        src="clinic-street.jpg"
        span={[150, 300]}
        fromScale={1.16}
        toScale={1.06}
        panX={1.6}
        panY={-2.4}
        objectPosition="center 42%"
        fadeIn={[150, 176]}
        fadeOut={[268, 294]}
      />

      {/* Scène 3 — entrée + enseigne « CLINIQUE OKBA » */}
      <Scene
        src="clinic-entrance.jpg"
        span={[268, 360]}
        fromScale={1.05}
        toScale={1.16}
        panX={0}
        panY={-2}
        objectPosition="center 46%"
        fadeIn={[268, 294]}
        fadeOut={[400, 401]}
      />

      {/* ── Étalonnage premium (n'invente rien, met en valeur) ── */}
      {/* Balayage lumineux diagonal */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(115deg, transparent ${sweep - 14}%, rgba(255,255,255,0.10) ${sweep}%, transparent ${sweep + 14}%)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      {/* Teinte de marque + contraste doux */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(120% 90% at 50% 30%, rgba(0,0,0,0) 45%, rgba(0,32,18,0.42) 100%)',
          pointerEvents: 'none',
        }}
      />
      {/* Vignette cinématique */}
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 220px 60px rgba(2,10,6,0.55)',
          pointerEvents: 'none',
        }}
      />
      {/* Fine ligne signature verte (bas) */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 3,
            background:
              'linear-gradient(90deg, transparent, #006633 20%, #00a651 50%, #FDE68A 68%, #006633 85%, transparent)',
            opacity: 0.9,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
