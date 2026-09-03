'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'

/**
 * Rideau d'ouverture — chorégraphie en quatre temps :
 *
 *   1. l'anneau se trace (rappel du portique du scanner, vert → or) ;
 *   2. l'emblème éclot depuis la base de la tige, en révélation circulaire ;
 *   3. le nom se compose lettre par lettre ;
 *   4. « Clinique » se dissout sous une ligne de balayage et se reforme en
 *      « Hôpital » — la transformation de l'établissement, racontée dès la
 *      première seconde.
 *
 * Le wordmark est du VRAI TEXTE, pas `logo-main.png` : le nom y était cuit
 * dans l'image, ce qui rendait la métamorphose impossible et le lockup flou
 * en montée d'échelle. On utilise donc `logo-mark.png` (emblème seul) et on
 * compose le nom en Lemon Milk, la police d'affichage du site.
 *
 * Le rideau dure ~3,1 s. C'est assumé : le splash
 * est déjà réservé au desktop non contraint et ne joue qu'une fois par session
 * (voir `shouldPlayIntro`), et c'est la seule surface où l'annonce touche le
 * visiteur avant qu'il ne scrolle.
 */

// ── Chronologie (ms) ────────────────────────────────────────────────────────
const T_RING_END = 460 // l'anneau a fini de se tracer
const T_MARK_START = 140 // l'emblème commence à éclore (chevauchement voulu)
const T_MARK_END = 720
const T_WORD_START = 620 // les lettres du nom montent
const T_WORD_END = 980
const T_SLOGAN = 1020 // le slogan complète le lockup avant la métamorphose
const T_MORPH_START = 1100 // « Clinique » se dissout
// Fin RÉELLE de la métamorphose : la dernière lettre démarre à
// T_MORPH_START + 6 × 35 ms de cascade et dure 550 ms (voir `Wordmark`).
// La constante valait 1660, soit 200 ms avant que le mot ne soit posé — le
// palier de lecture était donc amputé d'autant.
const T_MORPH_END = 1880
const T_HOLD_END = 2700 // palier de lecture : ~820 ms sur le nom formé
const T_EXIT_END = 3160 // fondu sortant terminé → démontage

const EASE_EXPO = [0.16, 1, 0.3, 1] as const
const EASE_BRAND = [0.22, 1, 0.36, 1] as const
// Sortie en ease-IN : le lockup tient sa pose puis s'échappe, au lieu de
// perdre la moitié de son opacité dès les premières frames.
const EASE_EXIT = [0.55, 0, 0.85, 0.25] as const

const GREEN_DARK = '#00532a'
const GREEN = '#006633'
const GREEN_LIGHT = '#4caf6e'
const GOLD = '#FDE68A'

/* ── Mots de la métamorphose, par langue ─────────────────────────────────── */
const BRAND_WORDS: Record<string, { from: string; to: string; rest: string }> = {
  fr: { from: 'CLINIQUE', to: 'HÔPITAL', rest: 'OKBA' },
  ar: { from: 'عيادة', to: 'مستشفى', rest: 'عقبة' },
}

/* ─── Anneau tracé : vert de marque puis touche d'or ──────────────────────── */
function Ring() {
  return (
    <svg
      viewBox="0 0 100 100"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden
    >
      <g transform="rotate(-90 50 50)">
        {/* Anneau principal */}
        <motion.circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke={GREEN}
          strokeWidth="0.9"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{
            pathLength: { duration: T_RING_END / 1000, ease: EASE_EXPO },
            opacity: { duration: 0.2 },
          }}
        />
        {/* Arc doré — la seconde couleur de la marque, en pointe */}
        <motion.circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke={GOLD}
          strokeWidth="1.4"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.16 0.84"
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: 300, opacity: [0, 0.95, 0.95, 0] }}
          transition={{
            rotate: { duration: 1.1, ease: EASE_EXPO, delay: T_RING_END / 1000 - 0.22 },
            opacity: { duration: 1.1, times: [0, 0.18, 0.7, 1], delay: T_RING_END / 1000 - 0.22 },
          }}
          style={{ transformOrigin: '50px 50px' }}
        />
      </g>
    </svg>
  )
}

/* ─── Emblème : éclosion circulaire depuis la base de la tige ─────────────── */
function Emblem() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Halo vert doux — donne de la profondeur au blanc */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-26%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${GREEN_LIGHT}33 0%, ${GREEN}0F 48%, transparent 72%)`,
        }}
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE_EXPO, delay: T_MARK_START / 1000 }}
      />

      <Ring />

      {/* La branche éclot depuis le pied de la tige (50% / 74%) — révélation
          circulaire plutôt qu'un balayage rectangulaire, qui coupait
          l'emblème sur une arête nette. */}
      <motion.div
        style={{ position: 'absolute', inset: '11%' }}
        initial={{ clipPath: 'circle(0% at 50% 74%)', opacity: 0 }}
        animate={{ clipPath: 'circle(78% at 50% 74%)', opacity: 1 }}
        transition={{
          clipPath: {
            delay: T_MARK_START / 1000,
            duration: (T_MARK_END - T_MARK_START) / 1000,
            ease: EASE_EXPO,
          },
          opacity: { delay: T_MARK_START / 1000, duration: 0.24 },
        }}
      >
        <motion.div
          style={{ position: 'relative', width: '100%', height: '100%' }}
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          transition={{
            delay: T_MARK_START / 1000,
            duration: (T_MARK_END - T_MARK_START) / 1000,
            ease: EASE_EXPO,
          }}
        >
          <Image
            src="/logo-mark.png"
            alt=""
            fill
            sizes="200px"
            className="object-contain"
            priority
            aria-hidden
          />
        </motion.div>
      </motion.div>

      {/* Éclat à l'apex de la feuille haute, à l'instant où l'éclosion l'atteint */}
      <motion.span
        style={{
          position: 'absolute',
          left: '50%',
          top: '10%',
          width: 10,
          height: 10,
          marginLeft: -5,
          borderRadius: '50%',
          background: `radial-gradient(circle, #ffffff 0%, ${GREEN_LIGHT} 45%, transparent 70%)`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 0], opacity: [0, 0.9, 0] }}
        transition={{ delay: (T_MARK_END - 180) / 1000, duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  )
}

/* ─── Nom de la marque + métamorphose « Clinique » → « Hôpital » ──────────── */
function Wordmark({ locale }: { locale: string }) {
  const [morphed, setMorphed] = useState(false)
  const words = BRAND_WORDS[locale] ?? BRAND_WORDS.fr
  const isCursive = locale === 'ar'

  useEffect(() => {
    const id = setTimeout(() => setMorphed(true), T_MORPH_START)
    return () => clearTimeout(id)
  }, [])

  const word = morphed ? words.to : words.from
  // L'arabe est une écriture liée : le découper lettre par lettre casserait
  // les ligatures. Il est donc toujours animé d'un seul bloc.
  const parts = isCursive ? [word] : Array.from(word)

  // Avant la métamorphose, les lettres montent en cascade avec le reste du
  // lockup ; après, elles se reforment immédiatement sous la ligne de scan.
  const baseDelay = morphed ? 0 : T_WORD_START / 1000

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        gap: '0.32em',
        fontFamily: 'var(--font-heading), Montserrat, system-ui, sans-serif',
        fontWeight: 700,
        fontSize: 'clamp(22px, 3.2vw, 34px)',
        letterSpacing: isCursive ? 0 : '0.045em',
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
      }}
    >
      {/* Le mot qui se métamorphose. */}
      <span style={{ position: 'relative', display: 'inline-grid' }}>
        <span style={{ gridColumn: 1, gridRow: 1, display: 'flex', justifyContent: 'center' }}>
          {parts.map((part, i) => (
            <motion.span
              key={`${morphed ? 'to' : 'from'}-${i}`}
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.55,
                delay: baseDelay + (isCursive ? 0 : i * 0.035),
                ease: EASE_BRAND,
              }}
              style={{ color: GREEN_LIGHT, display: 'inline-block' }}
            >
              {part === ' ' ? ' ' : part}
            </motion.span>
          ))}
        </span>

        {/* Gabarit de largeur, en rangée 2 (hauteur nulle) : la colonne prend
            la largeur du plus long des deux mots, donc « Okba » ne bouge pas
            d'un pixel pendant la métamorphose. En rangée 1 il aurait imposé sa
            ligne de base — la seconde rangée laisse celle du texte visible. */}
        <span
          aria-hidden
          style={{
            gridColumn: 1,
            gridRow: 2,
            visibility: 'hidden',
            height: 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {words.from.length >= words.to.length ? words.from : words.to}
        </span>

        {/* Ligne de balayage — le geste du scanner, signature du site. Elle
            traverse le mot au moment exact où il se dissout. */}
        <motion.span
          aria-hidden
          style={{
            position: 'absolute',
            left: '-12%',
            right: '-12%',
            height: 2,
            borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${GREEN_LIGHT}, transparent)`,
            boxShadow: `0 0 10px 1px ${GREEN_LIGHT}99`,
          }}
          initial={{ top: '-20%', opacity: 0 }}
          animate={{ top: ['-20%', '120%'], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: (T_MORPH_END - T_MORPH_START) / 1000,
            delay: (T_MORPH_START - 120) / 1000,
            times: [0, 0.15, 0.8, 1],
            ease: 'easeInOut',
          }}
        />
      </span>

      {/* « Okba » — fixe, en vert profond, comme dans le logo */}
      <motion.span
        initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{
          duration: 0.55,
          delay: (T_WORD_START + 120) / 1000,
          ease: EASE_BRAND,
        }}
        style={{ color: GREEN_DARK }}
      >
        {words.rest}
      </motion.span>
    </div>
  )
}

/* ─── Chorégraphie complète ──────────────────────────────────────────────── */
function LogoAnimation({ onComplete, locale }: { onComplete: () => void; locale: string }) {
  const t = useTranslations('nav')
  const [exiting, setExiting] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const list = timers.current
    list.push(setTimeout(() => setExiting(true), T_HOLD_END))
    list.push(setTimeout(onComplete, T_EXIT_END))
    return () => list.forEach(clearTimeout)
  }, [onComplete])

  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(18px, 3vw, 26px)',
      }}
      /* Le lockup entier s'élève d'un cheveu en sortant : le rideau se lève,
         il ne s'éteint pas.

         La sortie est pilotée par un état, pas par des keyframes `times` : avec
         un ease exponentiel, framer applique la courbe à l'ensemble de la
         timeline, si bien que le palier de lecture était avalé en un quart du
         temps réel et le fondu démarrait à 1,4 s au lieu de 1,9 s. */
      animate={
        exiting ? { y: -22, scale: 1.03, opacity: 0 } : { y: 0, scale: 1, opacity: 1 }
      }
      transition={{
        duration: (T_EXIT_END - T_HOLD_END) / 1000,
        ease: EASE_EXPO,
        /* L'opacité suit sa propre courbe : avec EASE_EXPO (un ease-OUT) elle
           chutait dès la première frame et mangeait le palier de lecture par
           l'autre bout. En ease-IN, le nom reste plein puis cède d'un coup. */
        opacity: { duration: (T_EXIT_END - T_HOLD_END) / 1000, ease: EASE_EXIT },
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 'min(212px, 46vw)',
          height: 'min(212px, 46vw)',
        }}
      >
        <Emblem />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <Wordmark locale={locale} />

        {/* Filet vert → or : la signature qui court sous tout le site */}
        <motion.span
          aria-hidden
          style={{
            height: 2,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${GREEN}, ${GREEN_LIGHT} 45%, ${GOLD})`,
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 'clamp(84px, 13vw, 124px)', opacity: 1 }}
          transition={{ delay: (T_WORD_END - 120) / 1000, duration: 0.6, ease: EASE_EXPO }}
        />

        <motion.p
          style={{
            margin: 0,
            fontFamily: 'var(--font-base), Montserrat, system-ui, sans-serif',
            fontSize: 'clamp(10px, 1.5vw, 13px)',
            letterSpacing: locale === 'ar' ? 0 : '0.2em',
            textTransform: locale === 'ar' ? 'none' : 'uppercase',
            color: `${GREEN}A6`,
            whiteSpace: 'nowrap',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: T_SLOGAN / 1000, duration: 0.5 }}
        >
          {t('slogan')}
        </motion.p>
      </div>
    </motion.div>
  )
}

/**
 * Conditions de lecture du rideau d'ouverture.
 *
 * Le splash est un aplat plein écran posé APRÈS l'hydratation. Il recouvre
 * donc l'élément LCP au pire moment possible : sur mobile, où le budget CPU
 * est déjà saturé, il coûtait à lui seul plusieurs points. On le réserve aux
 * contextes où il ne pénalise personne — grand écran, appareil correct,
 * connexion non économique.
 */
function shouldPlayIntro(): boolean {
  if (typeof window === 'undefined') return false

  // Mouvement réduit demandé (vestibulaire, épilepsie) : pas de rideau du tout.
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false

  // Mobile et tablette : jamais. C'est là que le budget de rendu est le plus serré.
  if (window.matchMedia?.('(max-width: 1023px)').matches) return false
  if (window.matchMedia?.('(pointer: coarse)').matches) return false

  // Appareil très peu puissant : l'animation saccaderait de toute façon.
  // Seuil bas volontairement : le filtre grand écran + pointeur fin ci-dessus
  // a déjà écarté le mobile, il ne reste ici que des postes de travail.
  const cores = navigator.hardwareConcurrency
  if (typeof cores === 'number' && cores > 0 && cores <= 2) return false

  // Mode économie de données / réseau lent.
  const conn = (
    navigator as unknown as {
      connection?: { saveData?: boolean; effectiveType?: string }
    }
  ).connection
  if (conn?.saveData) return false
  if (conn?.effectiveType && ['slow-2g', '2g', '3g'].includes(conn.effectiveType)) return false

  return true
}

// ─── Écran de démarrage (splash) ────────────────────────────────────────────
export function LogoIntro() {
  const locale = useLocale()
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (!shouldPlayIntro()) return

    // Ne s'affiche qu'une seule fois par session
    if (typeof sessionStorage !== 'undefined') {
      if (sessionStorage.getItem('okba-intro')) return
      sessionStorage.setItem('okba-intro', '1')
    }
    setVisible(true)
  }, [])

  const handleComplete = () => {
    setLeaving(true)
    setTimeout(() => setVisible(false), 420)
  }

  if (!mounted || !visible) return null

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="okba-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.4, 0, 1, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            /* Blanc chaud plutôt qu'un #fff plat : le fond respire et le fondu
               sortant ne claque pas comme une lightbox qui se ferme. */
            background: `radial-gradient(ellipse 70% 60% at 50% 44%, #ffffff 0%, #f4faf6 58%, #eaf5ee 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Chargement"
          role="status"
        >
          <LogoAnimation onComplete={handleComplete} locale={locale} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
