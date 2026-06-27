import React from 'react'
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion'

// ─── Brand ────────────────────────────────────────────────────────────────────
const GREEN  = '#006633'
const GREEN2 = '#3d8b4e'

// ─── Easing ───────────────────────────────────────────────────────────────────
const EXPO_OUT   = Easing.bezier(0.16, 1,    0.3,  1)
const CIRC_OUT   = Easing.bezier(0,    0.55, 0.45, 1)
const SMOOTH     = Easing.bezier(0.4,  0,    0.2,  1)

export const OkbaLogo: React.FC = () => {
  const frame = useCurrentFrame()
  const { width, height, durationInFrames } = useVideoConfig()

  // ── Logo dimensions ──────────────────────────────────────────────────────────
  const logoW = width  * 0.62
  const logoH = height * 0.62

  // ─────────────────────────────────────────────────────────────────────────────
  // PHASE 1 — Tige SVG qui monte (0→22f)
  // ─────────────────────────────────────────────────────────────────────────────
  const stemProgress = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CIRC_OUT,
  })
  const stemOpacity = interpolate(frame, [16, 32], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ─────────────────────────────────────────────────────────────────────────────
  // PHASE 2 — Plante + OKBA : wipe du bas vers le haut (12→52f)
  //   clip-path inset(top right bottom left)
  //   "bottom" inset : 100% → 40%  révèle le haut du logo
  // ─────────────────────────────────────────────────────────────────────────────
  const plantBottom = interpolate(frame, [12, 52], [100, 40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EXPO_OUT,
  })
  const plantOpacity = interpolate(frame, [10, 22], [0, 1], {
    extrapolateRight: 'clamp',
  })
  // Légère montée initiale (sensation de pousse)
  const plantY = interpolate(frame, [12, 52], [14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EXPO_OUT,
  })

  // ─────────────────────────────────────────────────────────────────────────────
  // PHASE 3 — CLINIQUE : wipe de gauche à droite (40→74f)
  //   "right" inset : 100% → 0%  révèle de gauche à droite
  // ─────────────────────────────────────────────────────────────────────────────
  const cliniqueRight = interpolate(frame, [40, 74], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EXPO_OUT,
  })
  const cliniqueOpacity = interpolate(frame, [38, 50], [0, 1], {
    extrapolateRight: 'clamp',
  })

  // ─────────────────────────────────────────────────────────────────────────────
  // PHASE 4 — Reflet diagonal (72→92f)
  // ─────────────────────────────────────────────────────────────────────────────
  const shineX = interpolate(frame, [72, 92], [-30, 130], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: SMOOTH,
  })
  const shineOpacity = interpolate(frame, [70, 75, 88, 92], [0, 0.85, 0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ─────────────────────────────────────────────────────────────────────────────
  // PHASE 5 — Respiration douce (après 88f)
  // ─────────────────────────────────────────────────────────────────────────────
  const breathPhase = Math.max(0, frame - 88)
  const breathY     = Math.sin(breathPhase / 30) * 4
  const breathScale = 1 + Math.sin(breathPhase / 38) * 0.006

  // ─────────────────────────────────────────────────────────────────────────────
  // EXIT — fondu sortant (propre pour boucle / transition)
  // ─────────────────────────────────────────────────────────────────────────────
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: 'clamp' },
  )

  // Tige SVG — position centrée sur la branche (≈ 46% x, de 38% à 54% y du logo)
  const stemX   = logoW * 0.46
  const stemY1  = logoH * 0.535
  const stemY0  = logoH * 0.535 - logoH * 0.165 * stemProgress // monte

  return (
    <AbsoluteFill
      style={{
        background: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: exitOpacity,
      }}
    >
      {/* ── Halo vert très discret derrière le logo ─────────────────────── */}
      <div
        style={{
          position: 'absolute',
          width:  logoW * 1.4,
          height: logoH * 1.4,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${GREEN2}28 0%, ${GREEN}0b 48%, transparent 72%)`,
          opacity: Math.min(1, (frame - 50) / 30),
          filter: 'blur(2px)',
        }}
      />

      {/* ── Conteneur logo ──────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          width: logoW,
          height: logoH,
          transform: `translateY(${breathY}px) scale(${breathScale})`,
        }}
      >

        {/* ─ Tige SVG (disparaît quand le logo arrive) ──────────────────── */}
        <svg
          viewBox={`0 0 ${logoW} ${logoH}`}
          width={logoW}
          height={logoH}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: stemOpacity,
            overflow: 'visible',
          }}
        >
          {/* Ombre portée de la tige */}
          <line
            x1={stemX + 1.5}  y1={stemY1}
            x2={stemX + 1.5}  y2={stemY0}
            stroke="rgba(0,0,0,0.12)"
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Tige principale — se dessine avec strokeDashoffset */}
          <line
            x1={stemX}  y1={stemY1}
            x2={stemX}  y2={stemY0}
            stroke={GREEN}
            strokeWidth={2.2}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - stemProgress}
            style={{ filter: `drop-shadow(0 0 3px ${GREEN2}88)` }}
          />
          {/* Petite lueur à l'apex de la tige */}
          {stemProgress > 0.5 && (
            <circle
              cx={stemX}
              cy={stemY0}
              r={3}
              fill={GREEN2}
              opacity={Math.min(1, (stemProgress - 0.5) * 2)}
              style={{ filter: `blur(2px)` }}
            />
          )}
        </svg>

        {/* ─ Couche 1 : Illustration botanique + OKBA ─────────────────────
            clip-path révèle de bas en haut (bottom inset 100% → 40%)        */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: `inset(0 0 ${plantBottom}% 0 round 4px)`,
            opacity: plantOpacity,
            transform: `translateY(${plantY}px)`,
          }}
        >
          <Img
            src={staticFile('logo.png')}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* ─ Couche 2 : CLINIQUE ───────────────────────────────────────────
            clip-path révèle de gauche à droite (right inset 100% → 0%)      */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: `inset(58% ${cliniqueRight}% 0 0 round 2px)`,
            opacity: cliniqueOpacity,
          }}
        >
          <Img
            src={staticFile('logo.png')}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* ─ Reflet diagonal ───────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            opacity: shineOpacity,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${shineX}%`,
              width: '22%',
              background:
                'linear-gradient(108deg, transparent 0%, rgba(255,255,255,0.72) 50%, transparent 100%)',
              transform: 'skewX(-14deg)',
            }}
          />
        </div>

        {/* ─ Liseré vert très subtil après révélation ────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 4,
            boxShadow: `0 0 0 1px ${GREEN}18`,
            opacity: Math.min(1, Math.max(0, (frame - 74) / 14)),
            pointerEvents: 'none',
          }}
        />
      </div>
    </AbsoluteFill>
  )
}
