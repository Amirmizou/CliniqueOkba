'use client'

import {
  Activity,
  Ambulance,
  Award,
  Baby,
  Bandage,
  Bell,
  BicepsFlexed,
  Bone,
  Brain,
  Briefcase,
  Building2,
  CalendarCheck,
  CalendarDays,
  CalendarHeart,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Cross,
  Droplet,
  Ear,
  Eye,
  Facebook,
  FileText,
  FlaskConical,
  Gauge,
  Globe,
  GraduationCap,
  Handshake,
  HeartPulse,
  Heart,
  Home,
  Hospital,
  Info,
  Instagram,
  Languages,
  Layers,
  Leaf,
  LifeBuoy,
  Lightbulb,
  Lock,
  Mail,
  MapPin,
  Microscope,
  Monitor,
  Moon,
  Newspaper,
  Phone,
  Pill,
  Radio,
  Ribbon,
  Scan,
  ScanEye,
  ScanLine,
  Scissors,
  Shield,
  ShieldCheck,
  Siren,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  Sun,
  Syringe,
  Target,
  Thermometer,
  Timer,
  TrendingUp,
  Truck,
  User,
  UserCheck,
  Users,
  Video,
  Wallet,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/**
 * Registre d'icônes Lucide.
 *
 * POURQUOI CE FICHIER — un `import * as LucideIcons from 'lucide-react'` rend
 * l'accès aux icônes dynamique : le bundler ne peut plus savoir lesquelles sont
 * réellement utilisées et embarque la bibliothèque ENTIÈRE (~500 Ko dans le
 * chunk d'entrée de la page d'accueil). Les imports nommés ci-dessous sont, eux,
 * parfaitement élagués : seules les icônes listées pèsent dans le bundle.
 *
 * POUR AJOUTER UNE ICÔNE — l'ajouter à l'import nommé ci-dessus ET à la table
 * `ICONS`. Les noms suivent la convention Lucide en PascalCase, tels qu'ils sont
 * saisis dans les champs « Icône (nom Lucide) » de Sanity.
 */
const ICONS: Record<string, LucideIcon> = {
  Activity,
  Ambulance,
  Award,
  Baby,
  Bandage,
  Bell,
  BicepsFlexed,
  Bone,
  Brain,
  Briefcase,
  Building2,
  CalendarCheck,
  CalendarDays,
  CalendarHeart,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Cross,
  Droplet,
  Ear,
  Eye,
  Facebook,
  FileText,
  FlaskConical,
  Gauge,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  HeartPulse,
  Home,
  Hospital,
  Info,
  Instagram,
  Languages,
  Layers,
  Leaf,
  LifeBuoy,
  Lightbulb,
  Lock,
  Mail,
  MapPin,
  Microscope,
  Monitor,
  Moon,
  Newspaper,
  Phone,
  Pill,
  Radio,
  Ribbon,
  Scan,
  ScanEye,
  ScanLine,
  Scissors,
  Shield,
  ShieldCheck,
  Siren,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  Sun,
  Syringe,
  Target,
  Thermometer,
  Timer,
  TrendingUp,
  Truck,
  User,
  UserCheck,
  Users,
  Video,
  Wallet,
  Wind,
  Zap,
}

/**
 * Résout un nom d'icône Lucide saisi dans Sanity.
 * Accepte le PascalCase (`ScanLine`), le kebab-case (`scan-line`) et le
 * camelCase (`scanLine`). Retourne `fallback` si le nom est inconnu.
 */
export function resolveLucideIcon(name?: string, fallback: LucideIcon = Check): LucideIcon {
  if (!name) return fallback

  const direct = ICONS[name]
  if (direct) return direct

  // kebab-case / snake_case / camelCase → PascalCase
  const pascal = name
    .replace(/[-_\s]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (_, c: string) => c.toUpperCase())

  return ICONS[pascal] ?? fallback
}

export { ICONS as LUCIDE_ICONS }
export type { LucideIcon }
