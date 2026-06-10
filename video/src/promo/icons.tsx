import React from 'react'

// Icônes SVG inline (style Lucide, MIT) — pas d'emoji, pas de dépendance externe.

type IconProps = {
  size?: number
  color?: string
  strokeWidth?: number
}

const base = (size: number, strokeWidth: number, color: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export const PhoneIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <svg {...base(size, strokeWidth, color)}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

export const MapPinIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <svg {...base(size, strokeWidth, color)}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const ClockIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <svg {...base(size, strokeWidth, color)}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

export const HeartIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <svg {...base(size, strokeWidth, color)}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

export const ShieldPlusIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <svg {...base(size, strokeWidth, color)}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v6" />
    <path d="M9 11h6" />
  </svg>
)

export const StethoscopeIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
  <svg {...base(size, strokeWidth, color)}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
)
