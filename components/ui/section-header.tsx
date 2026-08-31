import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * En-tête de section : badge → titre → filet → sous-titre.
 *
 * Ce bloc était recopié à l'identique dans une douzaine de sections, et les
 * copies avaient commencé à diverger (badge en `py-1.5` ici et `py-2` là,
 * marge `mb-3` ou `mb-4`, échelle de titre s'arrêtant à `text-4xl` dans
 * certaines sections). Le centraliser fige l'échelle typographique : changer
 * la taille des H2 du site se fait maintenant à un seul endroit.
 *
 * Le composant reste purement présentationnel — les sections gardent leur
 * propre enveloppe d'animation (AnimatedSection, ScrollAnimation, motion.div)
 * et passent leur titre déjà composé (LineReveal, text-gradient, etc.).
 */

interface SectionHeaderProps {
  /** Libellé de la pastille au-dessus du titre. */
  badge?: ReactNode
  /** Icône affichée dans la pastille (généralement une icône lucide en h-4 w-4). */
  badgeIcon?: ReactNode
  /**
   * Couleur d'accent de la pastille (hex). Par défaut : le vert `primary`
   * du thème. Utilisé par la section Médecins, dont la teinte suit le pôle
   * actuellement mis en avant.
   */
  accent?: string
  title: ReactNode
  subtitle?: ReactNode
  /** Élément décoratif inséré entre le titre et le sous-titre (ex. ECGLine). */
  divider?: ReactNode
  /** Action alignée en fin de ligne — bascule l'en-tête en disposition deux colonnes. */
  action?: ReactNode
  /**
   * `section` : en-tête de section de premier niveau (accueil) — `text-3xl sm:text-4xl md:text-5xl`.
   * `subsection` : en-tête interne à une page de contenu (pages pôles) — un cran en dessous.
   */
  size?: 'section' | 'subsection'
  /** Par défaut : `center` pour une section, `start` pour une sous-section. */
  align?: 'center' | 'start'
  className?: string
}

export default function SectionHeader({
  badge,
  badgeIcon,
  accent,
  title,
  subtitle,
  divider,
  action,
  size = 'section',
  align,
  className,
}: SectionHeaderProps) {
  const isSub = size === 'subsection'
  const centered = (align ?? (isSub ? 'start' : 'center')) === 'center'
  const badgeNode = badge ? (
    <span
      className={cn(
        'mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold leading-normal',
        !accent && 'border-primary/20 bg-primary/5 text-primary',
      )}
      style={
        accent
          ? {
              color: accent,
              backgroundColor: `${accent}0D`,
              borderColor: `${accent}33`,
            }
          : undefined
      }
    >
      {badgeIcon}
      {badge}
    </span>
  ) : null

  const heading = (
    <>
      {badgeNode}
      <h2
        className={cn(
          'mb-4 font-bold',
          isSub ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl md:text-5xl',
        )}
      >
        {title}
      </h2>
    </>
  )

  // Disposition deux colonnes : titre à gauche, action en fin de ligne.
  if (action) {
    return (
      <div
        className={cn(
          'mb-12 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start',
          className,
        )}
      >
        <div>
          {heading}
          {divider}
          {subtitle && (
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    )
  }

  return (
    <div className={cn(isSub ? 'mb-8' : 'mb-12', centered && 'text-center', className)}>
      {heading}
      {divider}
      {subtitle && (
        <p
          className={cn(
            'max-w-2xl text-base text-muted-foreground sm:text-lg',
            centered && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
