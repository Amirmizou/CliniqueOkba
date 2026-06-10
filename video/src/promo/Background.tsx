import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { COLORS } from './constants'

// Pseudo-aléatoire déterministe (stable par index)
const rand = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

// Fond de marque ANIMÉ : dégradé, halos dérivants, particules, EKG en boucle.
export const Background: React.FC<{ showEkg?: boolean }> = ({ showEkg = true }) => {
  const frame = useCurrentFrame()

  // Halos qui dérivent en continu
  const driftX = Math.sin(frame / 45) * 60
  const driftY = Math.cos(frame / 60) * 50

  // EKG qui défile en boucle
  const dash = 1600
  const ekgOffset = -((frame * 16) % dash)

  // Particules montantes
  const particles = Array.from({ length: 16 }).map((_, i) => {
    const speed = 0.6 + rand(i) * 1.1
    const x = rand(i + 1) * 100
    const y = (90 - ((frame * speed) % 110)) // remonte puis boucle
    const size = 3 + rand(i + 2) * 6
    const op = 0.12 + rand(i + 3) * 0.18
    const color = rand(i + 4) > 0.5 ? COLORS.yellow : COLORS.greenLight
    return { x, y, size, op, color, key: i }
  })

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      {/* Dégradé de base */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${COLORS.greenDark} 0%, ${COLORS.bg} 55%, #010a06 100%)`,
        }}
      />

      {/* Halos de marque dérivants */}
      <div
        style={{
          position: 'absolute',
          top: -200 + driftY,
          left: -150 + driftX,
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: COLORS.greenDeep,
          opacity: 0.4,
          filter: 'blur(180px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -250 - driftY,
          right: -150 - driftX,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: COLORS.yellow,
          opacity: 0.1,
          filter: 'blur(170px)',
        }}
      />

      {/* Particules */}
      {particles.map((p) => (
        <div
          key={p.key}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: p.op,
            filter: 'blur(0.5px)',
          }}
        />
      ))}

      {/* Grille de points */}
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.05,
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent 75%)',
        }}
      />

      {/* Faisceau diagonal animé (sheen) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(115deg, transparent 40%, rgba(253,230,138,0.06) 50%, transparent 60%)`,
          transform: `translateX(${interpolate(frame % 150, [0, 150], [-60, 60])}%)`,
        }}
      />

      {/* Ligne EKG signature en boucle */}
      {showEkg && (
        <svg
          viewBox="0 0 1920 200"
          style={{ position: 'absolute', bottom: 70, left: 0, width: '100%', height: 200, opacity: 0.5 }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 L640,100 L670,40 L700,160 L730,100 L820,100 L850,60 L880,140 L910,100 L1200,100 L1230,40 L1260,160 L1290,100 L1920,100"
            fill="none"
            stroke={COLORS.yellow}
            strokeWidth={3}
            strokeDasharray={dash}
            strokeDashoffset={ekgOffset}
          />
        </svg>
      )}
    </AbsoluteFill>
  )
}
