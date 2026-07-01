'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

// Durées (ms) qui reproduisent la chorégraphie Remotion
const T_STEM_END      = 400   // la tige finit de monter
const T_PLANT_START   = 300   // début du wipe plante (chevauchement voulu)
const T_PLANT_END     = 1200  // wipe plante terminé
const T_CLINIQUE_START= 950   // début wipe CLINIQUE
const T_CLINIQUE_END  = 2050  // wipe CLINIQUE terminé
const T_SHINE_START   = 2000  // reflet démarre
const T_SHINE_END     = 2500  // reflet terminé
const T_HOLD_END      = 2900  // durée totale avant sortie
const T_EXIT_END      = 3400  // fondu sortant terminé → démontage

const EASE_EXPO  = [0.16, 1, 0.3, 1] as const
const EASE_SMOOTH= [0.4,  0, 0.2, 1] as const

// ─── Tige SVG — dessine une ligne verticale en montant ─────────────────────
function Stem({ onDone }: { onDone: () => void }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        overflow: 'visible', pointerEvents: 'none',
      }}
      aria-hidden
    >
      {/* Tige — position approximative du tronc dans le logo.png */}
      <motion.line
        x1="46.5" y1="54" x2="46.5" y2="38"
        stroke="#006633"
        strokeWidth="0.7"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
        transition={{
          pathLength: { duration: T_STEM_END / 1000, ease: [0, 0.55, 0.45, 1] },
          opacity:    { duration: (T_PLANT_END + 200) / 1000, times: [0, 0.05, 0.7, 1] },
        }}
        onAnimationComplete={onDone}
      />
      {/* Petite lueur apex */}
      <motion.circle
        cx="46.5" cy="38" r="1.2"
        fill="#4caf6e"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.6, 0], opacity: [0, 0.9, 0] }}
        transition={{ delay: T_STEM_END / 1000 - 0.05, duration: 0.4 }}
        style={{ transformOrigin: '46.5px 38px', filter: 'blur(0.5px)' }}
      />
    </motion.svg>
  )
}

// ─── Composant principal ────────────────────────────────────────────────────
function LogoAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'stem' | 'plant' | 'clinique' | 'shine' | 'done'>('stem')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const schedule = (fn: () => void, delay: number) => {
      timerRef.current = setTimeout(fn, delay)
    }

    schedule(() => setPhase('plant'),    T_PLANT_START)
    schedule(() => setPhase('clinique'), T_CLINIQUE_START)
    schedule(() => setPhase('shine'),    T_SHINE_START)
    schedule(() => setPhase('done'),     T_HOLD_END)
    schedule(onComplete,                 T_EXIT_END)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [onComplete])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {/* ── Tige montante ─────────────────────────────────────────────── */}
      <Stem onDone={() => {}} />

      {/* ── Halo vert (apparaît avec la plante) ──────────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-20%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(76,175,110,0.22) 0%, rgba(0,102,51,0.06) 50%, transparent 72%)',
          filter: 'blur(1px)',
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={phase !== 'stem'
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
      />

      {/* ── Couche plante + OKBA (wipe bas→haut) ─────────────────────── */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          clipPath: 'inset(0 0 100% 0)',
        }}
        animate={
          phase === 'stem'
            ? { clipPath: 'inset(0 0 100% 0)', opacity: 1 }
            : { clipPath: 'inset(0 0 40% 0)',  opacity: 1 }
        }
        initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
        transition={{
          clipPath: {
            delay: T_PLANT_START / 1000,
            duration: (T_PLANT_END - T_PLANT_START) / 1000,
            ease: EASE_EXPO,
          },
          opacity: { duration: 0.28 },
        }}
      >
        <motion.div
          style={{ position: 'relative', width: '100%', height: '100%' }}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          transition={{
            delay: T_PLANT_START / 1000,
            duration: (T_PLANT_END - T_PLANT_START) / 1000,
            ease: EASE_EXPO,
          }}
        >
          <Image
            src="/logo-main.png"
            alt="Clinique OKBA"
            fill
            sizes="280px"
            className="object-contain"
            priority
          />
        </motion.div>
      </motion.div>

      {/* ── Couche CLINIQUE (wipe gauche→droite) ─────────────────────── */}
      <motion.div
        style={{ position: 'absolute', inset: 0 }}
        initial={{ clipPath: 'inset(58% 100% 0 0)', opacity: 0 }}
        animate={
          phase === 'stem' || phase === 'plant'
            ? { clipPath: 'inset(58% 100% 0 0)', opacity: 0 }
            : { clipPath: 'inset(58% 0% 0 0)',   opacity: 1 }
        }
        transition={{
          clipPath: {
            delay:    phase === 'clinique' ? 0 : (T_CLINIQUE_START / 1000),
            duration: (T_CLINIQUE_END - T_CLINIQUE_START) / 1000,
            ease: EASE_EXPO,
          },
          opacity: { duration: 0.2 },
        }}
      >
        <Image
          src="/logo-main.png"
          alt=""
          fill
          sizes="280px"
          className="object-contain"
          aria-hidden
        />
      </motion.div>

      {/* ── Reflet diagonal ───────────────────────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
        initial={{ opacity: 0 }}
        animate={phase === 'shine'
          ? { opacity: [0, 1, 1, 0] }
          : { opacity: 0 }}
        transition={{ duration: (T_SHINE_END - T_SHINE_START) / 1000, ease: EASE_SMOOTH }}
      >
        <motion.div
          style={{
            position: 'absolute',
            top: 0, bottom: 0,
            width: '22%',
            background:
              'linear-gradient(108deg, transparent 0%, rgba(255,255,255,0.68) 50%, transparent 100%)',
            transform: 'skewX(-12deg)',
          }}
          initial={{ left: '-10%' }}
          animate={phase === 'shine' ? { left: '130%' } : { left: '-10%' }}
          transition={{
            duration: (T_SHINE_END - T_SHINE_START) / 1000,
            ease: EASE_SMOOTH,
          }}
        />
      </motion.div>

      {/* ── Respiration douce quand tout est visible ───────────────────── */}
      {(phase === 'shine' || phase === 'done') && (
        <motion.div
          style={{ position: 'absolute', inset: 0 }}
          animate={{ y: [0, -3, 0], scale: [1, 1.004, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* invisible — applique le mouvement aux enfants via transform hérité */}
        </motion.div>
      )}
    </div>
  )
}

// ─── Écran de démarrage (splash) ────────────────────────────────────────────
export function LogoIntro() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Ne s'affiche qu'une seule fois par session
    if (typeof sessionStorage !== 'undefined') {
      if (sessionStorage.getItem('okba-intro')) return
      sessionStorage.setItem('okba-intro', '1')
    }
    setVisible(true)
  }, [])

  const handleComplete = () => {
    setLeaving(true)
    setTimeout(() => setVisible(false), 600)
  }

  if (!mounted || !visible) return null

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="okba-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 1, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Chargement Clinique OKBA"
          role="status"
        >
          {/* Conteneur logo — taille fixe adaptative */}
          <div style={{ width: 'min(280px, 52vw)', height: 'min(280px, 52vw)', position: 'relative' }}>
            <LogoAnimation onComplete={handleComplete} />
          </div>

          {/* Tagline discrète en bas */}
          <motion.p
            style={{
              position: 'absolute',
              bottom: '7%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 'clamp(9px, 1.8vw, 12px)',
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#006633',
              opacity: 0,
              whiteSpace: 'nowrap',
            }}
            animate={{ opacity: [0, 0, 0.55, 0.55, 0] }}
            transition={{
              duration: T_EXIT_END / 1000,
              times: [0, 0.4, 0.52, 0.85, 1],
              ease: 'linear',
            }}
          >
            Soins · Excellence · Confiance
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
