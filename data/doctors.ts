// Données des médecins de la Clinique OKBA
// Extraites des affiches officielles (public/images/spec)

import {
  Baby,
  Activity,
  Stethoscope,
  Ear,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react'

export interface Doctor {
  id: string
  /** Civilité + nom complet tel qu'affiché */
  name: string
  name_ar?: string
  /** Spécialité principale */
  specialty: string
  specialty_ar?: string
  /** Sous-titre / mention (ex : "Ancienne Maître Assistante") */
  subtitle?: string
  subtitle_ar?: string
  /** Liste des actes / prestations */
  services: string[]
  services_ar?: string[]
  /** Mention d'expérience facultative (ex : "+25 ans d'expérience") */
  experience?: string
  experience_ar?: string
  /** Jours de consultation */
  days: string
  days_ar?: string
  /** Plage horaire */
  hours: string
  hours_ar?: string
  /** Affiche officielle (chemin public) */
  poster: string
  /** Icône lucide représentant la spécialité */
  icon: LucideIcon
  /** Couleur d'accent (HEX) pour les dégradés et halos */
  accent: string
  /** Dégradé Tailwind d'accompagnement */
  gradient: string
}

export const doctors: Doctor[] = [
  {
    id: 'meskaldji-rima',
    name: 'Dr. Meskaldji Rima ep. Benabdi',
    name_ar: 'د. مسكلجي ريما',
    specialty: 'Gynécologie Obstétrique',
    specialty_ar: 'أمراض النساء والتوليد',
    subtitle: 'Ancienne Maître Assistante',
    subtitle_ar: 'أستاذة مساعدة سابقة',
    services: [
      'Suivi de grossesse',
      'Accouchement normal',
      'Césarienne',
      'Échographie 3D / 4D',
      'Doppler – ERCF',
      'Colposcopie',
      'Hystéroscopie',
      'Infertilité du couple',
      'Sénologie',
      'Cœlioscopie',
      'Chirurgie gynécologique',
    ],
    services_ar: [
      'متابعة الحمل',
      'الولادة الطبيعية',
      'الولادة القيصرية',
      'تصوير بالصدى ثلاثي ورباعي الأبعاد',
      'دوبلر – تخطيط قلب الجنين',
      'تنظير عنق الرحم',
      'تنظير الرحم',
      'علاج العقم لدى الزوجين',
      'طب الثدي',
      'الجراحة بالمنظار',
      'جراحة النساء',
    ],
    days: 'Du samedi au jeudi',
    days_ar: 'من السبت إلى الخميس',
    hours: '08h00 – 16h00',
    hours_ar: 'من 08:00 إلى 16:00',
    poster: '/images/spec/portrait-meskaldji-rima.jpeg',
    icon: Baby,
    accent: '#A855F7',
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
  },
  {
    id: 'ameziane-leila',
    name: 'Dr. Ameziane Leila',
    name_ar: 'د. عميزيان ليلى',
    specialty: 'Endocrinologue',
    specialty_ar: 'أخصائية الغدد الصماء',
    subtitle: 'Diabétologue',
    subtitle_ar: 'أخصائية السكري',
    services: [
      'Diabétologie',
      'Métabolisme',
      'Maladies nutritionnelles',
    ],
    services_ar: [
      'طب السكري',
      'الأيض',
      'أمراض التغذية',
    ],
    experience: 'Plus de 25 ans d’expérience',
    experience_ar: 'أكثر من 25 سنة خبرة',
    days: 'Du samedi au jeudi',
    days_ar: 'من السبت إلى الخميس',
    hours: '08h00 – 16h00',
    hours_ar: 'من 08:00 إلى 16:00',
    poster: '/images/spec/portrait-ameziane-leila.jpeg',
    icon: Activity,
    accent: '#10B981',
    gradient: 'from-emerald-500 via-emerald-400 to-teal-500',
  },
  {
    id: 'boukredera-amira',
    name: 'Dr. Boukredera Amira',
    name_ar: 'د. بوكريدرة أميرة',
    specialty: 'Pédiatre',
    specialty_ar: 'طبيبة أطفال',
    services: [
      'Consultation',
      'Suivi des maladies chroniques',
      'Suivi du développement de l’enfant',
    ],
    services_ar: [
      'استشارة',
      'متابعة الأمراض المزمنة',
      'متابعة نمو الطفل',
    ],
    days: 'Du samedi au jeudi',
    days_ar: 'من السبت إلى الخميس',
    hours: '08h00 – 16h00',
    hours_ar: 'من 08:00 إلى 16:00',
    poster: '/images/spec/portrait-boukredera-amira.jpeg',
    icon: Baby,
    accent: '#F59E0B',
    gradient: 'from-amber-400 via-yellow-400 to-orange-400',
  },
  {
    id: 'zerizer-loubna',
    name: 'Dr. Zerizer Loubna',
    name_ar: 'د. زريزر لبنى',
    specialty: 'Médecine interne',
    specialty_ar: 'الطب الباطني',
    services: [
      'Diabète & glande thyroïde',
      'Maladies de l’appareil digestif & du foie',
      'Maladies auto-immunes & rhumatismes',
      'Maladies rares',
      'Cholestérol élevé',
      'Anémie',
    ],
    services_ar: [
      'السكري والغدة الدرقية',
      'أمراض الجهاز الهضمي والكبد',
      'أمراض المناعة الذاتية والروماتيزم',
      'الأمراض النادرة',
      'ارتفاع الكوليسترول',
      'فقر الدم',
    ],
    days: 'Du samedi au jeudi',
    days_ar: 'من السبت إلى الخميس',
    hours: '08h00 – 16h00',
    hours_ar: 'من 08:00 إلى 16:00',
    poster: '/images/spec/portrait-zerizer-loubna.jpeg',
    icon: Stethoscope,
    accent: '#3B82F6',
    gradient: 'from-blue-600 via-blue-500 to-indigo-500',
  },
  {
    id: 'boughanout-seyfeddine',
    name: 'Dr. Boughanout Seyfeddine',
    name_ar: 'د. بوغانوت سيف الدين',
    specialty: 'ORL',
    specialty_ar: 'أنف وأذن وحنجرة',
    subtitle: 'Chirurgie de l’oreille, du nez, de la gorge, de la face & du cou',
    subtitle_ar: 'جراحة الأذن والأنف والحنجرة والوجه والرقبة',
    services: [
      'Traitement des allergies & vertiges',
      'Audiométrie & tympanométrie',
      'Endoscopie de l’oreille & du nez',
      'Chirurgie des amygdales & végétations',
      'Chirurgie de la thyroïde, glandes salivaires & lymphatiques',
      'Chirurgie endoscopique',
    ],
    services_ar: [
      'علاج الحساسية والدوار',
      'قياس السمع والطبلة',
      'تنظير الأذن والأنف',
      'جراحة اللوزتين واللحمية',
      'جراحة الغدة الدرقية والغدد اللعابية واللمفاوية',
      'الجراحة بالمنظار',
    ],
    days: 'Du samedi au mercredi',
    days_ar: 'من السبت إلى الأربعاء',
    hours: '08h00 – 16h00',
    hours_ar: 'من 08:00 إلى 16:00',
    poster: '/images/spec/portrait-boughanout-seyfeddine.jpeg',
    icon: Ear,
    accent: '#F97316',
    gradient: 'from-orange-500 via-orange-400 to-yellow-500',
  },
  {
    id: 'aissaoui-laboratoire',
    name: 'Pr. Aissaoui',
    name_ar: 'أ.د. عيساوي',
    specialty: 'Responsable laboratoire',
    specialty_ar: 'مسؤول المخبر',
    subtitle: 'Biologie médicale',
    subtitle_ar: 'البيولوجيا الطبية',
    services: [
      'Analyses biologiques',
      'Hématologie',
      'Biochimie',
      'Sérologie & immunologie',
      'Bactériologie',
    ],
    services_ar: [
      'التحاليل البيولوجية',
      'أمراض الدم',
      'الكيمياء الحيوية',
      'المصليات والمناعة',
      'علم الجراثيم',
    ],
    days: 'Du samedi au jeudi',
    days_ar: 'من السبت إلى الخميس',
    hours: '08h00 – 16h00',
    hours_ar: 'من 08:00 إلى 16:00',
    poster: '/images/spec/portrait-aissaoui.png',
    icon: FlaskConical,
    accent: '#0EA5E9',
    gradient: 'from-sky-500 via-cyan-500 to-teal-500',
  },
]

/** Numéro WhatsApp principal de la clinique (format international, sans +) */
export const CLINIC_WHATSAPP = '213770884242'
/** Numéro d'appel principal */
export const CLINIC_PHONE = '+213770884242'
