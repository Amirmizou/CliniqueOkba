// Source unique des lignes téléphoniques de la clinique.
// Utilisée par le menu d'appel (CallMenu) et affichable ailleurs.
// NB : garder en cohérence avec les numéros du footer.

export type ClinicContactKind = 'urgent' | 'service' | 'fix'

export interface ClinicContact {
  /** Libellé FR */
  label: string
  /** Libellé AR */
  label_ar: string
  /** Numéro affiché (avec espaces) — le href tel: est nettoyé automatiquement */
  number: string
  /** Type de ligne (style/priorité) */
  kind: ClinicContactKind
  /** Nom d'icône Lucide (résolu côté composant) */
  icon: string
}

export const clinicContacts: ClinicContact[] = [
  { label: 'Urgences · Standard', label_ar: 'الاستعجالات · المقسم', number: '+213 770 88 42 42', kind: 'urgent', icon: 'Siren' },
  { label: 'Urgences · 2ᵉ ligne', label_ar: 'الاستعجالات · الخط الثاني', number: '+213 770 88 43 43', kind: 'urgent', icon: 'Siren' },
  { label: 'Réception', label_ar: 'الاستقبال', number: '0550 25 00 54', kind: 'service', icon: 'Bell' },
  { label: 'Imagerie médicale', label_ar: 'التصوير الطبي', number: '0560 78 27 67', kind: 'service', icon: 'ScanLine' },
  { label: "Laboratoire d'analyses", label_ar: 'مخبر التحاليل', number: '0550 25 00 58', kind: 'service', icon: 'FlaskConical' },
  { label: 'Ligne fixe', label_ar: 'الهاتف الثابت', number: '039 33 88 71', kind: 'fix', icon: 'Phone' },
  { label: 'Ligne fixe · 2', label_ar: 'الهاتف الثابت · 2', number: '039 33 81 27', kind: 'fix', icon: 'Phone' },
]

/** href tel: propre (chiffres et + uniquement) */
export function telHref(number: string): string {
  return `tel:${number.replace(/[^+\d]/g, '')}`
}
