import type { SVGProps } from 'react'

// ─── Imagerie médicale : vue frontale anneau scanner CT ────────────────────
export function ImagerieIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Anneau gantry extérieur */}
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.25" />
      {/* Ouverture bore centrale */}
      <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.6" />
      {/* Point focal du scan */}
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      {/* Repères 12h / 3h / 6h / 9h */}
      <path
        d="M12 2.5v2M21.5 12h-2M12 19.5v2M2.5 12h2"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  )
}

// ─── Dentaire : couronne en émail céramique 3D ────────────────────────────
export function DentaireIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        {/* Émail — gradient radial haut-gauche (lumière sur céramique convexe) */}
        <radialGradient id="dentEnamel" cx="34%" cy="18%" r="72%">
          <stop offset="0%"   stopColor="currentColor" stopOpacity="0.98"/>
          <stop offset="42%"  stopColor="currentColor" stopOpacity="0.88"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.52"/>
        </radialGradient>
        {/* Racines — estompées vers le bas */}
        <linearGradient id="dentRoot" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%"   stopColor="currentColor" stopOpacity="0.70"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.36"/>
        </linearGradient>
      </defs>
      {/* Couronne + racines — forme anatomique avec fill 3D */}
      <path
        d="M17 4c-1.5 0-2.8.9-3.5 2.2C12.8 4.9 11.5 4 10 4 7.2 4 5 6.2 5 9c0 3.5 2.5 5.5 2.5 9.5v1c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5v-2c0-.6.4-1 1-1s1 .4 1 1v2c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5v-1c0-4 2.5-6 2.5-9.5 0-2.8-2.2-5-5-5z"
        fill="url(#dentEnamel)"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Zone gingivale — AO (occlusion ambiante au niveau du collet) */}
      <path d="M5.8 12.5Q11.5 14 18.2 12.5" stroke="currentColor" strokeOpacity="0.16" strokeWidth="3.2" strokeLinecap="round"/>
      {/* Sillon central anatomique (fossette occlusale) */}
      <path d="M11 7.5c0 0 .5 1.5 1 1.5s1-1.5 1-1.5" stroke="currentColor" strokeOpacity="0.20" strokeWidth="0.9" strokeLinecap="round"/>
      {/* Reflets émail — arc spéculaire haut-gauche */}
      <path d="M8.8 6L9.4 8.2"   stroke="currentColor" strokeOpacity="0.42" strokeWidth="1.15" strokeLinecap="round"/>
      <path d="M8.3 8.2L8.8 10"  stroke="currentColor" strokeOpacity="0.22" strokeWidth="0.75" strokeLinecap="round"/>
      {/* AO inter-racines */}
      <path d="M12 16.5v4.8" stroke="currentColor" strokeOpacity="0.10" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Consultations : stéthoscope avec membrane chrome 3D ─────────────────
export function ConsultationsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        {/* Membrane chrome — éclairage radial haut-gauche */}
        <radialGradient id="consMemb" cx="36%" cy="32%" r="62%">
          <stop offset="0%"   stopColor="currentColor" stopOpacity="0.98"/>
          <stop offset="52%"  stopColor="currentColor" stopOpacity="0.74"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.28"/>
        </radialGradient>
      </defs>
      {/* Embouts auriculaires (sphères 3D) */}
      <circle cx="6"  cy="4.5" r="1.5" fill="currentColor"/>
      <circle cx="5.55" cy="4.05" r="0.48" fill="currentColor" fillOpacity="0.32"/>
      <circle cx="18" cy="4.5" r="1.5" fill="currentColor"/>
      <circle cx="17.55" cy="4.05" r="0.48" fill="currentColor" fillOpacity="0.32"/>
      {/* Tubes en arc */}
      <path d="M6 4.5Q6 11 12 11Q18 11 18 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      {/* Reflet tube (arête supérieure éclairée) */}
      <path d="M6.8 5.4Q7.6 9.8 12 10.25" stroke="currentColor" strokeOpacity="0.36" strokeWidth="0.75" strokeLinecap="round" fill="none"/>
      {/* Tube vertical */}
      <path d="M12 11v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      {/* Membrane (disque chrome 3D avec biseau) */}
      <circle cx="12" cy="19" r="3"   fill="url(#consMemb)"/>
      <circle cx="12" cy="19" r="3"   stroke="currentColor" strokeOpacity="0.22" strokeWidth="0.6"/>
      {/* Anneau biseau intérieur */}
      <circle cx="12" cy="19" r="2.3" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.6"/>
      {/* Diaphragme central */}
      <circle cx="12" cy="19" r="1.1" fill="currentColor" fillOpacity="0.82"/>
      {/* Highlight spéculaire membrane */}
      <circle cx="10.85" cy="17.95" r="0.52" fill="currentColor" fillOpacity="0.32"/>
    </svg>
  )
}

// ─── Urgences : ECG dans anneau d'alerte ──────────────────────────────────
export function UrgencesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Anneau de fond atténué */}
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
      {/* Arc d'urgence (sens horaire depuis 10h) */}
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Tracé ECG */}
      <path
        d="M3 12h4l2-4.5 3 9.5 2-5.5 1 2h3"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Point d'alerte */}
      <circle cx="19.5" cy="8.5" r="2" fill="currentColor" />
    </svg>
  )
}

// ─── Laboratoire : Erlenmeyer verre 3D + liquide lumineux ───────────────
export function LaboratoireIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        {/* Gradient latéral simulant la courbure cylindrique du verre */}
        <linearGradient id="laboGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="currentColor" stopOpacity="0.18"/>
          <stop offset="26%"  stopColor="currentColor" stopOpacity="0.92"/>
          <stop offset="68%"  stopColor="currentColor" stopOpacity="0.76"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.15"/>
        </linearGradient>
        {/* Gradient vertical pour le liquide (profondeur + réflexion fond) */}
        <linearGradient id="laboLiquid" x1="0.4" y1="0" x2="0.55" y2="1">
          <stop offset="0%"   stopColor="currentColor" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.90"/>
        </linearGradient>
      </defs>
      {/* Goulot */}
      <path d="M10 2h4M10 2v5.5M14 2v5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Reflet arête gauche du goulot */}
      <path d="M10.7 2.5v4.8" stroke="currentColor" strokeOpacity="0.40" strokeWidth="0.65" strokeLinecap="round"/>
      {/* Corps conique — verre (gradient lat = révolution cylindrique) */}
      <path d="M10 7.5L5.2 17A2 2 0 0 0 7 20h10a2 2 0 0 0 1.8-2.9L14 7.5z"
        fill="url(#laboGlass)" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      {/* Volume de liquide */}
      <path d="M7.9 15.5Q10 18.8 12 18.8Q14 18.8 16.1 15.5L14 7.5h-4z"
        fill="url(#laboLiquid)"/>
      {/* Interface liquide / air */}
      <path d="M7.8 15.5h8.4" stroke="currentColor" strokeOpacity="0.36" strokeWidth="1" strokeLinecap="round"/>
      {/* Arête spéculaire gauche du verre (lumière directionnelle) */}
      <path d="M8.7 9.5L6.2 15.5" stroke="currentColor" strokeOpacity="0.48" strokeWidth="1.1" strokeLinecap="round"/>
      {/* Bulle 1 — sphère avec highlight */}
      <circle cx="10.5" cy="17.5" r="0.95" fill="currentColor"/>
      <circle cx="10.15" cy="17.15" r="0.30" fill="currentColor" fillOpacity="0.28"/>
      {/* Bulle 2 */}
      <circle cx="14" cy="17" r="1.25" fill="currentColor" fillOpacity="0.58"/>
      <circle cx="13.62" cy="16.62" r="0.40" fill="currentColor" fillOpacity="0.26"/>
    </svg>
  )
}

// ─── Chirurgie ambulatoire : lampe scialytique de bloc opératoire 3D ──────
export function ChirurgieIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        {/* Dôme réflecteur — éclairage radial haut-gauche */}
        <radialGradient id="chirDome" cx="37%" cy="30%" r="66%">
          <stop offset="0%"   stopColor="currentColor" stopOpacity="0.96"/>
          <stop offset="52%"  stopColor="currentColor" stopOpacity="0.70"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.24"/>
        </radialGradient>
        {/* Zone focale lumineuse (centre) */}
        <radialGradient id="chirFocus" cx="35%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="currentColor" stopOpacity="1.00"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.48"/>
        </radialGradient>
      </defs>
      {/* Tige de fixation plafond */}
      <path d="M12 1.5v3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Articulation rotule */}
      <circle cx="12" cy="5.4" r="1.15" fill="currentColor" fillOpacity="0.68"/>
      <circle cx="11.58" cy="4.98" r="0.38" fill="currentColor" fillOpacity="0.28"/>
      {/* Bras orientable */}
      <path d="M12 5.4l2.2 2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      {/* Dôme réflecteur principal */}
      <circle cx="12" cy="14.5" r="7.2" fill="url(#chirDome)"/>
      {/* Biseau externe — bord du réflecteur */}
      <circle cx="12" cy="14.5" r="7.2"  stroke="currentColor" strokeOpacity="0.20" strokeWidth="1.1"/>
      {/* Anneau réflecteur médian */}
      <circle cx="12" cy="14.5" r="5.1"  stroke="currentColor" strokeOpacity="0.28" strokeWidth="0.7"/>
      {/* Anneau réflecteur interne */}
      <circle cx="12" cy="14.5" r="3.1"  stroke="currentColor" strokeOpacity="0.36" strokeWidth="0.7"/>
      {/* Zone focale illuminée */}
      <circle cx="12" cy="14.5" r="2.0"  fill="url(#chirFocus)"/>
      {/* Ampoule centrale */}
      <circle cx="12" cy="14.5" r="0.85" fill="currentColor"/>
      {/* Highlight spéculaire dôme (haut-gauche) */}
      <circle cx="9.4" cy="12.0" r="0.58" fill="currentColor" fillOpacity="0.34"/>
      {/* Rayons lumineux diffus sortants */}
      <path d="M5.2 20.2L3.8 22M18.8 20.2L20.2 22M12 22v1.5"
        stroke="currentColor" strokeOpacity="0.22" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Médecine nucléaire : atome ──────────────────────────────────────────
export function NucleaireIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Noyau */}
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      {/* Orbite horizontale */}
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.9" />
      {/* Orbite à 60° */}
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.55" transform="rotate(60 12 12)" />
      {/* Orbite à 120° */}
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.55" transform="rotate(120 12 12)" />
      {/* Électrons (un par orbite) */}
      <circle cx="22" cy="12" r="1.4" fill="currentColor" fillOpacity="0.85" />
      <circle cx="6.5" cy="6.6" r="1.4" fill="currentColor" fillOpacity="0.7" />
      <circle cx="6.5" cy="17.4" r="1.4" fill="currentColor" fillOpacity="0.7" />
    </svg>
  )
}
