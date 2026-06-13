import React from 'react'
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion'

/* Couleurs de marque Clinique OKBA */
const GREEN = '#006633'
const GREEN_LIGHT = '#4caf6e'
const AMBER = '#FDE68A'

/* Tracé ECG (battement cardiaque) — signature médicale sous le logo */
const ECG_PATH =
  'M0,40 H120 l8,0 6,-26 8,52 6,-26 H300 l8,0 6,-26 8,52 6,-26 H520 l8,0 6,-26 8,52 6,-26 H720'

/* Particules ambre (positions déterministes, pas de Math.random au rendu) */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 73) % 100,
  delay: (i * 7) % 60,
  size: 3 + (i % 4),
  drift: ((i % 5) - 2) * 14,
  dur: 70 + (i % 5) * 14,
}))

export const OkbaLogo: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps, width, height, durationInFrames } = useVideoConfig()

  /* --- Apparition du logo (ressort) --- */
  const enter = spring({ frame, fps, config: { damping: 16, mass: 0.8, stiffness: 110 } })
  const logoScale = interpolate(enter, [0, 1], [0.72, 1])
  const logoOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: 'clamp',
  })
  /* Flottement doux continu */
  const floatY = Math.sin(frame / 18) * 6

  /* --- Lueur radiale pulsée (vert -> ambre) --- */
  const glowPulse = 0.55 + Math.sin(frame / 12) * 0.18
  const glowScale = 0.9 + Math.sin(frame / 16) * 0.08

  /* --- Reflet (shine) qui balaie le logo une fois --- */
  const shineX = interpolate(frame, [18, 55], [-60, 160], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  })

  /* --- Tracé ECG : se dessine puis tête lumineuse qui file --- */
  const ecgDraw = interpolate(frame, [26, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  })
  const ecgOpacity = interpolate(frame, [24, 34], [0, 1], { extrapolateRight: 'clamp' })

  /* --- Halo d'anneau qui s'étend (onde) --- */
  const ringScale = interpolate(frame, [10, 60], [0.6, 1.6], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const ringOpacity = interpolate(frame, [10, 60], [0.5, 0], { extrapolateRight: 'clamp' })

  /* --- Fondu de sortie (pour boucle/transition propre) --- */
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: 'clamp' },
  )

  const logoSize = Math.min(width, height) * 0.46

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, #00351f 0%, #00231595 45%, #000d08 100%)`,
        opacity: exitOpacity,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Texture de points subtile */}
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          opacity: 0.5,
        }}
      />

      {/* Lueur radiale pulsée derrière le logo */}
      <div
        style={{
          position: 'absolute',
          width: logoSize * 2.1,
          height: logoSize * 2.1,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${GREEN_LIGHT}55 0%, ${GREEN}22 40%, transparent 70%)`,
          transform: `scale(${glowScale})`,
          opacity: glowPulse,
          filter: 'blur(8px)',
        }}
      />

      {/* Anneau d'onde qui s'étend */}
      <div
        style={{
          position: 'absolute',
          width: logoSize * 1.5,
          height: logoSize * 1.5,
          borderRadius: '50%',
          border: `2px solid ${AMBER}`,
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />

      {/* Particules ambre montantes */}
      {PARTICLES.map((p, i) => {
        const local = (frame - p.delay + p.dur) % p.dur
        const prog = local / p.dur
        const y = interpolate(prog, [0, 1], [height * 0.62, height * 0.28])
        const o = Math.sin(prog * Math.PI) * 0.7
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: AMBER,
              opacity: o,
              transform: `translateX(${p.drift * prog}px)`,
              boxShadow: `0 0 8px ${AMBER}`,
            }}
          />
        )
      })}

      {/* Logo (branche d'olivier + wordmark) dans un médaillon blanc */}
      <div
        style={{
          position: 'relative',
          width: logoSize,
          height: logoSize,
          transform: `translateY(${floatY}px) scale(${logoScale})`,
          opacity: logoOpacity,
          background: '#ffffff',
          borderRadius: '26%',
          boxShadow: `0 30px 80px -20px rgba(0,0,0,0.55), 0 0 0 1px ${AMBER}55, inset 0 0 0 6px #ffffff`,
          padding: logoSize * 0.06,
          boxSizing: 'border-box',
        }}
      >
        <Img
          src={staticFile('logo.png')}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        {/* Reflet qui balaie le médaillon */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            borderRadius: '26%',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${shineX}%`,
              width: '30%',
              background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.65), transparent)',
              transform: 'skewX(-18deg)',
            }}
          />
        </div>
      </div>

      {/* Signature ECG sous le logo */}
      <svg
        width={logoSize * 1.25}
        height={80}
        viewBox="0 0 720 80"
        style={{ position: 'absolute', top: `calc(50% + ${logoSize * 0.62}px)`, opacity: ecgOpacity }}
        fill="none"
      >
        {/* trace de fond discret */}
        <path d={ECG_PATH} stroke={`${AMBER}33`} strokeWidth={2} />
        {/* tracé lumineux qui se dessine */}
        <path
          d={ECG_PATH}
          stroke={AMBER}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - ecgDraw}
          style={{ filter: `drop-shadow(0 0 5px ${AMBER})` }}
        />
      </svg>
    </AbsoluteFill>
  )
}
