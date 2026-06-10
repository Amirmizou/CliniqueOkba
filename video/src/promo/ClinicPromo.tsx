import React from 'react'
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion'
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'

import { Background } from './Background'
import { COLORS, BRAND_GRADIENT, CLINIC, SCENE, TRANSITION } from './constants'
import { FONT_BODY, FONT_HEADING } from './fonts'
import {
  PhoneIcon,
  MapPinIcon,
  ShieldPlusIcon,
  StethoscopeIcon,
  HeartIcon,
} from './icons'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const ENTER = Easing.bezier(0.16, 1, 0.3, 1)

const enterAt = (frame: number, delay: number, duration = 22) =>
  interpolate(frame, [delay, delay + duration], [0, 1], {
    easing: ENTER,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

const heading: React.CSSProperties = {
  fontFamily: FONT_HEADING,
  color: COLORS.white,
  fontWeight: 700,
  letterSpacing: '-0.01em',
  margin: 0,
  lineHeight: 1.02,
}

const gradientText: React.CSSProperties = {
  background: BRAND_GRADIENT,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
}

// Dégradé de texte qui « coule »
const flowGradient = (frame: number): React.CSSProperties => ({
  background: BRAND_GRADIENT,
  backgroundSize: '220% 100%',
  backgroundPositionX: `${interpolate(frame, [0, 120], [0, 220])}%`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
})

const center: React.CSSProperties = {
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: 80,
}

const Badge: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 28px',
      borderRadius: 999,
      border: `1px solid rgba(253,230,138,0.4)`,
      background: 'rgba(255,255,255,0.08)',
      color: COLORS.white,
      fontFamily: FONT_BODY,
      fontSize: 30,
      fontWeight: 500,
      ...style,
    }}
  >
    {children}
  </div>
)

/* Logo animé (médaillon + anneaux en rotation) */
const AnimatedLogoMark: React.FC<{ frame: number; fps: number; size?: number }> = ({
  frame,
  fps,
  size = 240,
}) => {
  const s = spring({ frame, fps, config: { damping: 11, mass: 0.9 }, durationInFrames: 40 })
  const scale = interpolate(s, [0, 1], [0.2, 1])
  const pulse = 1 + 0.035 * Math.sin(frame / 6)
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        transform: `scale(${scale * pulse})`,
        opacity: Math.min(1, s * 1.4),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(253,230,138,0.5), rgba(0,102,51,0.3) 60%, transparent 72%)',
          filter: 'blur(18px)',
        }}
      />
      <svg
        viewBox="0 0 100 100"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: `rotate(${frame * 2.2}deg)` }}
      >
        <defs>
          <linearGradient id="okbaRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#006633" />
            <stop offset="55%" stopColor="#4caf6e" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke="url(#okbaRing)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="70 220" />
      </svg>
      <svg
        viewBox="0 0 100 100"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: `rotate(${-frame * 1.6}deg)` }}
      >
        <circle cx="50" cy="50" r="40" fill="none" stroke="#FDE68A" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.5 7" />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: '19%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.96)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Img src={staticFile('logo.png')} style={{ width: '82%', height: '82%', objectFit: 'contain' }} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Scène 1 — Intro                                                    */
/* ------------------------------------------------------------------ */

const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const nameS = spring({ frame: frame - 22, fps, config: { damping: 14 }, durationInFrames: 26 })
  const underline = enterAt(frame, 40, 28)
  const taglineP = enterAt(frame, 54)

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ ...center, flexDirection: 'column', gap: 30 }}>
        <AnimatedLogoMark frame={frame} fps={fps} size={250} />

        <h1
          style={{
            ...heading,
            fontSize: 158,
            opacity: nameS,
            transform: `translateY(${(1 - nameS) * 50}px)`,
          }}
        >
          {CLINIC.name}
        </h1>

        <div style={{ height: 8, width: 420 * underline, borderRadius: 999, background: BRAND_GRADIENT }} />

        <p
          style={{
            fontFamily: FONT_BODY,
            color: COLORS.mute,
            fontSize: 42,
            letterSpacing: '0.04em',
            margin: 0,
            opacity: taglineP,
          }}
        >
          {CLINIC.tagline}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/* ------------------------------------------------------------------ */
/*  Scène 2 — Promesse                                                 */
/* ------------------------------------------------------------------ */

const ScenePromise: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const iconS = spring({ frame: frame - 4, fps, config: { damping: 10 }, durationInFrames: 30 })
  const l1 = enterAt(frame, 14)
  const l2 = enterAt(frame, 26)

  return (
    <AbsoluteFill>
      <Background showEkg={false} />
      <AbsoluteFill style={{ ...center, flexDirection: 'column', gap: 30 }}>
        <div
          style={{
            color: COLORS.yellow,
            opacity: Math.min(1, iconS),
            transform: `scale(${interpolate(iconS, [0, 1], [0.4, 1])}) rotate(${interpolate(iconS, [0, 1], [-30, 0])}deg)`,
          }}
        >
          <StethoscopeIcon size={96} color={COLORS.yellow} strokeWidth={1.6} />
        </div>

        <h2
          style={{
            ...heading,
            fontSize: 100,
            opacity: l1,
            transform: `translateX(${(1 - l1) * -80}px)`,
          }}
        >
          {CLINIC.promiseLine1}
        </h2>
        <h2
          style={{
            ...heading,
            ...flowGradient(frame),
            fontSize: 116,
            opacity: l2,
            transform: `translateX(${(1 - l2) * 80}px)`,
          }}
        >
          {CLINIC.promiseLine2}
        </h2>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/* ------------------------------------------------------------------ */
/*  Scène 3 — Spécialités                                              */
/* ------------------------------------------------------------------ */

const SceneSpecialties: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const titleP = enterAt(frame, 4)

  return (
    <AbsoluteFill>
      <Background showEkg={false} />
      <AbsoluteFill style={{ ...center, flexDirection: 'column', gap: 56 }}>
        <h2
          style={{
            ...heading,
            fontSize: 88,
            opacity: titleP,
            transform: `translateY(${(1 - titleP) * 30}px)`,
          }}
        >
          Nos <span style={flowGradient(frame)}>spécialités</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, maxWidth: 1450 }}>
          {CLINIC.specialties.map((name, i) => {
            const s = spring({ frame: frame - (18 + i * 5), fps, config: { damping: 12 }, durationInFrames: 24 })
            const float = Math.sin((frame + i * 20) / 18) * 5
            return (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  padding: '28px 34px',
                  borderRadius: 22,
                  border: '1px solid rgba(253,230,138,0.22)',
                  background: 'rgba(255,255,255,0.06)',
                  color: COLORS.white,
                  fontFamily: FONT_BODY,
                  fontSize: 36,
                  fontWeight: 600,
                  opacity: Math.min(1, s),
                  transform: `translateY(${(1 - s) * 40 + float}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`,
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'rgba(253,230,138,0.15)',
                    flexShrink: 0,
                  }}
                >
                  <HeartIcon size={28} color={COLORS.yellow} strokeWidth={2} />
                </span>
                {name}
              </div>
            )
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/* ------------------------------------------------------------------ */
/*  Scène 4 — Urgences 24/7                                            */
/* ------------------------------------------------------------------ */

const SceneEmergency: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const badgeS = spring({ frame: frame - 4, fps, config: { damping: 9 }, durationInFrames: 30 })
  const titleP = enterAt(frame, 16)
  const subP = enterAt(frame, 30)
  const phoneP = enterAt(frame, 42)

  return (
    <AbsoluteFill>
      <Background showEkg />
      <AbsoluteFill style={{ ...center, flexDirection: 'column', gap: 38 }}>
        <div
          style={{
            position: 'relative',
            width: 150,
            height: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: Math.min(1, badgeS),
            transform: `scale(${badgeS})`,
          }}
        >
          {/* Anneaux d'onde qui s'étendent */}
          {[0, 1, 2].map((i) => {
            const t = (((frame - i * 14) % 56) + 56) % 56 / 56
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  border: `3px solid ${COLORS.yellow}`,
                  transform: `scale(${interpolate(t, [0, 1], [0.85, 2.3])})`,
                  opacity: interpolate(t, [0, 1], [0.55, 0]),
                }}
              />
            )
          })}
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: '50%',
              background: BRAND_GRADIENT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 50px rgba(253,230,138,0.4)',
            }}
          >
            <ShieldPlusIcon size={70} color={COLORS.greenDark} strokeWidth={2.2} />
          </div>
        </div>

        <h2
          style={{
            ...heading,
            ...flowGradient(frame),
            fontSize: 168,
            opacity: titleP,
            transform: `translateY(${(1 - titleP) * 40}px) scale(${interpolate(titleP, [0, 1], [0.9, 1])})`,
          }}
        >
          {CLINIC.emergencyTitle}
        </h2>

        <p style={{ fontFamily: FONT_BODY, color: COLORS.white, fontSize: 46, margin: 0, opacity: subP }}>
          {CLINIC.emergencySub}
        </p>

        <div style={{ opacity: phoneP, transform: `translateY(${(1 - phoneP) * 20}px)` }}>
          <Badge style={{ fontSize: 42 }}>
            <PhoneIcon size={38} color={COLORS.yellow} />
            {CLINIC.phones[0]}
          </Badge>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/* ------------------------------------------------------------------ */
/*  Scène 5 — Contact / CTA                                            */
/* ------------------------------------------------------------------ */

const SceneContact: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const titleS = spring({ frame: frame - 4, fps, config: { damping: 12 }, durationInFrames: 26 })
  const p1 = enterAt(frame, 18, 20)
  const p2 = enterAt(frame, 26, 20)
  const infoP = enterAt(frame, 40)
  const logoS = spring({ frame: frame - 50, fps, config: { damping: 12 }, durationInFrames: 30 })
  const ctaPulse = 1 + 0.03 * Math.sin(frame / 7)

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ ...center, flexDirection: 'column', gap: 40 }}>
        <h2
          style={{
            ...heading,
            ...flowGradient(frame),
            fontSize: 104,
            opacity: Math.min(1, titleS),
            transform: `scale(${interpolate(titleS, [0, 1], [0.8, 1]) * ctaPulse})`,
          }}
        >
          {CLINIC.cta}
        </h2>

        <div style={{ display: 'flex', gap: 28 }}>
          {[CLINIC.phones[0], CLINIC.phones[1]].map((ph, i) => {
            const p = i === 0 ? p1 : p2
            return (
              <div key={ph} style={{ opacity: p, transform: `translateX(${(1 - p) * (i === 0 ? -60 : 60)}px)` }}>
                <Badge style={{ fontSize: 42, padding: '18px 34px' }}>
                  <PhoneIcon size={38} color={COLORS.yellow} />
                  {ph}
                </Badge>
              </div>
            )
          })}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 50,
            alignItems: 'center',
            color: COLORS.mute,
            fontFamily: FONT_BODY,
            fontSize: 34,
            opacity: infoP,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <MapPinIcon size={32} color={COLORS.yellow} />
            {CLINIC.address}
          </span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>{CLINIC.social}</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginTop: 24,
            opacity: Math.min(1, logoS),
            transform: `rotate(${interpolate(logoS, [0, 1], [-180, 0])}deg)`,
          }}
        >
          <Img src={staticFile('logo.png')} style={{ width: 92, height: 92, objectFit: 'contain' }} />
        </div>
        <span style={{ ...heading, fontSize: 60, opacity: Math.min(1, logoS) }}>{CLINIC.name}</span>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/* ------------------------------------------------------------------ */
/*  Overlay de marque persistant (bandeau + barre de progression)     */
/* ------------------------------------------------------------------ */

const PersistentOverlay: React.FC = () => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const appear = enterAt(frame, SCENE.intro, 20) // après l'intro
  const progress = Math.min(1, frame / durationInFrames)
  const blink = 0.5 + 0.5 * Math.sin(frame / 5)

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Marque haut-gauche */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          opacity: appear,
          transform: `translateX(${(1 - appear) * -20}px)`,
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          }}
        >
          <Img src={staticFile('logo.png')} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
        </div>
        <span style={{ ...heading, fontSize: 30 }}>{CLINIC.name}</span>
      </div>

      {/* Urgences haut-droite */}
      <div
        style={{
          position: 'absolute',
          top: 56,
          right: 56,
          opacity: appear,
          fontFamily: FONT_BODY,
          color: COLORS.white,
          fontSize: 26,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5a5a', opacity: blink, boxShadow: '0 0 12px #ff5a5a' }} />
        Urgences 24/7
      </div>

      {/* Barre de progression */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: '100%', width: `${progress * 100}%`, background: BRAND_GRADIENT }} />
      </div>
    </AbsoluteFill>
  )
}

/* ------------------------------------------------------------------ */
/*  Composition principale                                            */
/* ------------------------------------------------------------------ */

export const ClinicPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE.intro}>
          <SceneIntro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.promise}>
          <ScenePromise />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.specialties}>
          <SceneSpecialties />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.emergency}>
          <SceneEmergency />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.contact}>
          <SceneContact />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Couche de marque toujours visible */}
      <PersistentOverlay />
    </AbsoluteFill>
  )
}
