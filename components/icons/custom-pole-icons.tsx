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

// ─── Dentaire : dent avec racines ─────────────────────────────────────────
export function DentaireIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Couronne + racines — forme anatomique */}
      <path
        d="M17 4c-1.5 0-2.8.9-3.5 2.2C12.8 4.9 11.5 4 10 4 7.2 4 5 6.2 5 9c0 3.5 2.5 5.5 2.5 9.5v1c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5v-2c0-.6.4-1 1-1s1 .4 1 1v2c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5v-1c0-4 2.5-6 2.5-9.5 0-2.8-2.2-5-5-5z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Reflet émail */}
      <path d="M9.5 6.5l.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.35" />
    </svg>
  )
}

// ─── Consultations : stéthoscope ─────────────────────────────────────────
export function ConsultationsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Embouts auriculaires */}
      <circle cx="6" cy="4.5" r="1.5" fill="currentColor" />
      <circle cx="18" cy="4.5" r="1.5" fill="currentColor" />
      {/* Tubes en arc (oreillettes → jonction) */}
      <path
        d="M6 4.5Q6 11 12 11Q18 11 18 4.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"
      />
      {/* Tube vertical vers la membrane */}
      <path d="M12 11v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Membrane (diaphragme) */}
      <circle cx="12" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" />
      {/* Membrane intérieure */}
      <circle cx="12" cy="19" r="1.2" fill="currentColor" />
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

// ─── Laboratoire : flacon Erlenmeyer ────────────────────────────────────
export function LaboratoireIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Col du flacon */}
      <path d="M10 2h4M10 2v5.5M14 2v5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Corps conique + fond arrondi */}
      <path
        d="M10 7.5L5.2 17A2 2 0 0 0 7 20h10a2 2 0 0 0 1.8-2.9L14 7.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Niveau de liquide */}
      <path d="M7.2 15.5h9.6" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" />
      {/* Bulles */}
      <circle cx="10.5" cy="17.5" r="1" fill="currentColor" />
      <circle cx="14" cy="17" r="1.4" fill="currentColor" fillOpacity="0.65" />
    </svg>
  )
}

// ─── Chirurgie : scalpel ─────────────────────────────────────────────────
export function ChirurgieIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Manche */}
      <path d="M5 21L14 9.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Lame (biseau rempli) */}
      <path
        d="M14 9.5l4-5.5c.6-.7 1.6-.4 1.5.5L17 9l-3 .5z"
        fill="currentColor" strokeLinejoin="round"
      />
      {/* Tranchant — reflet */}
      <path d="M14 9.5l2.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.3" />
      {/* Croix chirurgicale */}
      <path d="M15.5 15v5M13 17.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.55" />
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
