import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Sequence,
} from 'remotion'

// ─── Brand ────────────────────────────────────────────────────────────────────
const GREEN_BRIGHT = '#35a94a' // « CLINIQUE »
const GREEN_DARK = '#14612f' // « OKBA »
const RING = '#a9d4b2'
const TAGLINE = '#6b7280'

// ─── Easing ───────────────────────────────────────────────────────────────────
const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1)
const CIRC_OUT = Easing.bezier(0, 0.55, 0.45, 1)
const SMOOTH = Easing.bezier(0.4, 0, 0.2, 1)

// ─── Géométrie de l'emblème (viewBox 0 0 440 460) ──────────────────────────────
const VB_W = 440
const VB_H = 460
const RING_CX = 220
const RING_CY = 205
const RING_R = 176

type Leaf = {
  ax: number // point d'attache sur la tige
  ay: number
  deg: number
  len: number
  w: number
  grad: string
  start: number // frame de début de croissance
}

// Feuilles fines rattachées à des hauteurs différentes de la tige
// (sprig d'olivier élégant — pas un éventail symétrique)
const LEAVES: Leaf[] = [
  { ax: 214, ay: 208, deg: 0, len: 158, w: 23, grad: 'gLight', start: 12 },
  { ax: 216, ay: 240, deg: 34, len: 112, w: 18, grad: 'gMid', start: 20 },
  { ax: 211, ay: 254, deg: -37, len: 118, w: 19, grad: 'gMid', start: 26 },
  { ax: 219, ay: 288, deg: 52, len: 94, w: 16, grad: 'gDark', start: 32 },
  { ax: 209, ay: 300, deg: -52, len: 100, w: 16, grad: 'gDark', start: 36 },
]

// Forme d'une feuille en local : base en (0,0), pointe vers le haut (0,-len)
function leafPath(len: number, w: number) {
  return `M0 0 C ${-w} ${-len * 0.34}, ${-w * 0.5} ${-len * 0.82}, 0 ${-len} C ${w * 0.5} ${-len * 0.82}, ${w} ${-len * 0.34}, 0 0 Z`
}
function veinPath(len: number) {
  return `M0 -4 C 2 ${-len * 0.4}, 2 ${-len * 0.7}, 0 ${-len * 0.9}`
}

const LeafShape: React.FC<{ leaf: Leaf; frame: number }> = ({ leaf, frame }) => {
  const grow = interpolate(frame, [leaf.start, leaf.start + 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EXPO_OUT,
  })
  const sx = interpolate(grow, [0, 1], [0.55, 1])
  const opacity = interpolate(frame, [leaf.start, leaf.start + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const veinDraw = interpolate(
    frame,
    [leaf.start + 8, leaf.start + 26],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <g
      transform={`translate(${leaf.ax} ${leaf.ay}) rotate(${leaf.deg}) scale(${sx}, ${grow})`}
      opacity={opacity}
    >
      <path d={leafPath(leaf.len, leaf.w)} fill={`url(#${leaf.grad})`} />
      <path
        d={veinPath(leaf.len)}
        fill="none"
        stroke="#12572c"
        strokeOpacity={0.42}
        strokeWidth={2.6}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={veinDraw}
      />
    </g>
  )
}

export const LogoMotion: React.FC = () => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()

  // Cercle qui se dessine
  const ringDraw = interpolate(frame, [4, 34], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CIRC_OUT,
  })
  const ringOpacity = interpolate(frame, [4, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Tige qui monte
  const stemDraw = interpolate(frame, [8, 30], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CIRC_OUT,
  })

  // Halo derrière l'emblème
  const halo = interpolate(frame, [40, 74], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Wordmark « CLINIQUE OKBA » : révélation gauche → droite
  const wordRight = interpolate(frame, [58, 92], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EXPO_OUT,
  })
  const wordOpacity = interpolate(frame, [56, 68], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Tagline : fondu + légère montée
  const tagOpacity = interpolate(frame, [92, 112], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const tagY = interpolate(frame, [92, 112], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EXPO_OUT,
  })

  // Reflet diagonal
  const shineX = interpolate(frame, [100, 124], [-30, 130], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: SMOOTH,
  })
  const shineOpacity = interpolate(
    frame,
    [100, 106, 120, 124],
    [0, 0.7, 0.7, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Respiration douce
  const breath = Math.max(0, frame - 116)
  const breathY = Math.sin(breath / 30) * 3
  const breathScale = 1 + Math.sin(breath / 40) * 0.005

  const emblemSize = Math.min(width, height) * 0.5

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(120% 90% at 50% 32%, #ffffff 0%, #f3f9f4 55%, #e9f3ec 100%)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${breathY}px) scale(${breathScale})`,
        }}
      >
        {/* ── Emblème : halo + cercle + tige + feuilles ─────────────────── */}
        <div style={{ position: 'relative', width: emblemSize, height: emblemSize }}>
          {/* Halo vert diffus */}
          <div
            style={{
              position: 'absolute',
              inset: '-16%',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(74,168,94,0.18) 0%, rgba(20,97,47,0.05) 45%, transparent 70%)',
              opacity: halo,
              filter: 'blur(4px)',
            }}
          />
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            width={emblemSize}
            height={emblemSize}
            style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="gLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8ed08f" />
                <stop offset="55%" stopColor="#57b365" />
                <stop offset="100%" stopColor="#2f8446" />
              </linearGradient>
              <linearGradient id="gMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#63b56e" />
                <stop offset="55%" stopColor="#3f9a51" />
                <stop offset="100%" stopColor="#256e39" />
              </linearGradient>
              <linearGradient id="gDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f9d5c" />
                <stop offset="55%" stopColor="#317f43" />
                <stop offset="100%" stopColor="#1d5c32" />
              </linearGradient>
            </defs>

            {/* Cercle */}
            <circle
              cx={RING_CX}
              cy={RING_CY}
              r={RING_R}
              fill="none"
              stroke={RING}
              strokeWidth={2.6}
              strokeLinecap="round"
              opacity={ringOpacity}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={ringDraw}
              transform={`rotate(-90 ${RING_CX} ${RING_CY})`}
            />

            {/* Tige / épine centrale */}
            <path
              d="M212 372 C 214 320, 216 262, 214 206"
              fill="none"
              stroke="#2f8446"
              strokeWidth={3.4}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={stemDraw}
            />

            {/* Feuilles (ordre : arrière → avant) */}
            {[...LEAVES].reverse().map((leaf, i) => (
              <LeafShape key={i} leaf={leaf} frame={frame} />
            ))}
          </svg>

          {/* Reflet diagonal sur l'emblème */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              borderRadius: '50%',
              opacity: shineOpacity,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-20%',
                bottom: '-20%',
                left: `${shineX}%`,
                width: '24%',
                background:
                  'linear-gradient(108deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                transform: 'skewX(-14deg)',
              }}
            />
          </div>
        </div>

        {/* ── Wordmark ─────────────────────────────────────────────────── */}
        <div
          style={{
            marginTop: emblemSize * 0.04,
            clipPath: `inset(0 ${wordRight}% 0 0)`,
            opacity: wordOpacity,
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 700,
              fontSize: emblemSize * 0.17,
              letterSpacing: emblemSize * 0.006,
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: GREEN_BRIGHT }}>CLINIQUE</span>
            <span style={{ color: GREEN_DARK }}>&nbsp;OKBA</span>
          </div>
        </div>

        {/* ── Tagline ──────────────────────────────────────────────────── */}
        <Sequence from={92} layout="none">
          <div
            style={{
              marginTop: emblemSize * 0.03,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: 'italic',
              fontSize: emblemSize * 0.062,
              color: TAGLINE,
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              textAlign: 'center',
              lineHeight: 1.25,
            }}
          >
            L&rsquo;excellence médicale
            <br />à votre Service
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  )
}
