// Pôles d'excellence de la Clinique OKBA
// Vue d'ensemble des grands départements + page dédiée par pôle.

import type { EquipementCategoryId } from './equipements'
import { CLINIC_PHONE } from './doctors'

export { CLINIC_PHONE }

export interface Pole {
  id: string
  /** Identifiant d'URL : /poles/<slug> */
  slug: string
  title: string
  title_ar?: string
  description: string
  description_ar?: string
  /** Sous-spécialités / prestations clés du pôle */
  items: string[]
  items_ar?: string[]
  /** Nom de l'icône Lucide (résolu côté composant) */
  iconName: string
  /** Couleur d'accent (HEX) */
  accent: string
  /** Badge (ex : « 24h/24 ») */
  badge?: string
  badge_ar?: string
  /** Pôle mis en avant (urgences) avec style distinct */
  urgent?: boolean
  /** Pôle vedette : carte mise en évidence (halo, ring, ruban « À la une ») */
  featured?: boolean
  /** Catégories de la galerie correspondant à ce pôle (photos de la page dédiée) */
  galleryCategories: EquipementCategoryId[]
  /** Introduction longue affichée sur la page dédiée */
  intro?: string
  intro_ar?: string
}

export const poles: Pole[] = [
  {
    id: 'imagerie',
    slug: 'imagerie',
    title: 'Imagerie médicale de pointe',
    title_ar: 'التصوير الطبي المتقدم',
    description:
      'Un plateau d’imagerie complet pour des diagnostics rapides et précis.',
    description_ar: 'منصة تصوير طبي متكاملة لتشخيص سريع ودقيق.',
    items: [
      'Scanner (TDM)',
      'IRM',
      'Mammographie',
      'Radiologie numérique',
      'Échographie',
    ],
    items_ar: [
      'جهاز التصوير المقطعي (Scanner)',
      'التصوير بالرنين المغناطيسي (IRM)',
      'تصوير الثدي (Mammographie)',
      'الأشعة الرقمية',
      'الموجات فوق الصوتية (Échographie)',
    ],
    iconName: 'ScanLine',
    accent: '#3B82F6',
    galleryCategories: ['imagerie'],
    intro:
      'Notre service d’imagerie réunit scanner, IRM, mammographie, radiologie numérique et échographie. Des équipements de dernière génération, au service d’un diagnostic fiable et rapide.',
    intro_ar: 'يضم قسم التصوير لدينا أجهزة المسح المقطعي، الرنين المغناطيسي، الماموجرام، والأشعة الرقمية والموجات الصوتية. أجهزة من الجيل الأحدث لضمان تشخيص دقيق وسريع.',
  },
  {
    id: 'medecine-nucleaire',
    slug: 'medecine-nucleaire',
    title: 'Médecine nucléaire',
    title_ar: 'الطب النووي',
    description:
      'Un pôle d’excellence équipé du SPECT/CT Siemens Symbia Pro.specta pour une imagerie fonctionnelle de haute précision.',
    description_ar: 'مركز تميز مجهز بجهاز SPECT/CT Siemens Symbia Pro.specta لتصوير وظيفي عالي الدقة.',
    items: [
      'Scintigraphie osseuse',
      'Scintigraphie cardiaque',
      'Scintigraphie thyroïdienne',
      'Scintigraphie rénale',
      'Imagerie hybride SPECT/CT',
    ],
    items_ar: [
      'التصوير الومضاني للعظام',
      'التصوير الومضاني للقلب',
      'التصوير الومضاني للغدة الدرقية',
      'التصوير الومضاني للكلى',
      'التصوير الهجين SPECT/CT',
    ],
    iconName: 'Radiation',
    accent: '#0D9488',
    badge: 'SPECT/CT · Nouveau',
    badge_ar: 'SPECT/CT · جديد',
    featured: true,
    galleryCategories: ['nucleaire'],
    intro:
      'Notre pôle de médecine nucléaire s’appuie sur le SPECT/CT Siemens Symbia Pro.specta, une caméra hybride de dernière génération qui associe la scintigraphie (SPECT) au scanner (CT). En un seul examen, elle conjugue imagerie fonctionnelle et anatomique pour localiser et caractériser les anomalies avec une précision exceptionnelle : os, cœur, thyroïde, reins et bien plus encore.',
    intro_ar: 'يعتمد قسم الطب النووي لدينا على جهاز SPECT/CT Siemens Symbia Pro.specta، وهو كاميرا هجينة من الجيل الأحدث تجمع بين التصوير الومضاني والمسح المقطعي. في فحص واحد، يجمع بين التصوير الوظيفي والتشريحي لتحديد وتوصيف التشوهات بدقة استثنائية.',
  },
  {
    id: 'dentaire',
    slug: 'dentaire',
    title: 'Pôle dentaire',
    title_ar: 'طب الأسنان',
    description: 'Toutes les spécialités dentaires réunies sous un même toit.',
    description_ar: 'جميع تخصصات طب الأسنان مجتمعة تحت سقف واحد.',
    items: [
      'Consultation dentaire',
      'Chirurgie dentaire',
      'Orthodontie (ODF)',
      'Prothèse dentaire',
    ],
    items_ar: [
      'استشارة طب الأسنان',
      'جراحة الأسنان',
      'تقويم الأسنان (ODF)',
      'تركيبات الأسنان (Prothèse)',
    ],
    iconName: 'Smile',
    accent: '#06B6D4',
    galleryCategories: ['dentaire'],
    intro:
      'Un pôle dentaire complet : consultation, chirurgie, orthodontie dento-faciale (ODF) et prothèse dentaire, pour prendre en charge tous vos besoins bucco-dentaires.',
    intro_ar: 'مركز شامل لطب الأسنان: استشارات، جراحة، تقويم الأسنان والوجه والفكين، وتركيبات الأسنان، لتلبية جميع احتياجاتك لصحة الفم.',
  },
  {
    id: 'consultations',
    slug: 'consultations',
    title: 'Consultations spécialisées',
    title_ar: 'الاستشارات المتخصصة',
    description:
      'Des médecins spécialistes à votre écoute pour un suivi personnalisé.',
    description_ar: 'أطباء أخصائيون في الاستماع إليك لمتابعة شخصية.',
    items: [
      'Gynécologie-obstétrique',
      'Endocrinologie',
      'Pédiatrie',
      'Médecine interne',
      'ORL',
    ],
    items_ar: [
      'أمراض النساء والتوليد',
      'الغدد الصماء',
      'طب الأطفال',
      'الطب الباطني',
      'أنف وأذن وحنجرة',
    ],
    iconName: 'Stethoscope',
    accent: '#A855F7',
    galleryCategories: ['consultation'],
    intro:
      'Nos médecins spécialistes vous reçoivent dans des cabinets modernes et équipés : gynécologie-obstétrique, endocrinologie, pédiatrie, médecine interne et ORL.',
    intro_ar: 'يستقبلك أطباؤنا الأخصائيون في عيادات حديثة ومجهزة: أمراض النساء والتوليد، الغدد الصماء، طب الأطفال، الطب الباطني، وأمراض الأنف والأذن والحنجرة.',
  },
  {
    id: 'urgences',
    slug: 'urgences',
    title: 'Urgences 24h/24',
    title_ar: 'طوارئ 24/24',
    description: 'Une équipe médicale de garde, disponible jour et nuit, 7j/7.',
    description_ar: 'فريق طبي مناوب متاح ليلاً ونهاراً طوال أيام الأسبوع.',
    items: ['Accueil permanent', 'Équipe de garde', 'Prise en charge immédiate'],
    items_ar: ['استقبال دائم', 'فريق مناوب', 'تكفل فوري'],
    iconName: 'Siren',
    accent: '#EF4444',
    badge: '24h/24 · 7j/7',
    badge_ar: '24/24 · 7/7',
    urgent: true,
    galleryCategories: ['accueil'],
    intro:
      'Un service d’urgences ouvert 24h/24 et 7j/7. Une équipe de garde vous accueille et vous prend en charge sans délai, à toute heure.',
    intro_ar: 'خدمة طوارئ مفتوحة 24/24 و 7/7. يستقبلك فريق طبي مناوب ويعتني بك دون تأخير في أي وقت.',
  },
  {
    id: 'laboratoire',
    slug: 'laboratoire',
    title: 'Laboratoire d’analyses médicales',
    title_ar: 'مختبر التحاليل الطبية',
    description:
      'Analyses biologiques fiables grâce à des automates de dernière génération.',
    description_ar: 'تحاليل بيولوجية موثوقة بفضل أجهزة أوتوماتيكية حديثة.',
    items: [
      'Hématologie',
      'Biochimie',
      'Immunologie',
      'Microbiologie',
      'Hormonologie',
    ],
    items_ar: [
      'أمراض الدم',
      'الكيمياء الحيوية',
      'علم المناعة',
      'علم الأحياء الدقيقة',
      'الهرمونات',
    ],
    iconName: 'FlaskConical',
    accent: '#8B5CF6',
    galleryCategories: ['laboratoire'],
    intro:
      'Notre laboratoire d’analyses médicales réalise vos bilans sanguins et prélèvements sur des automates de dernière génération, pour des résultats fiables et rapides.',
    intro_ar: 'يقوم مختبرنا الطبي بإجراء فحوصات الدم والعينات باستخدام أجهزة أوتوماتيكية من الجيل الأحدث للحصول على نتائج دقيقة وسريعة.',
  },
  {
    id: 'chirurgie',
    slug: 'chirurgie',
    title: 'Chirurgie spécialisée',
    title_ar: 'الجراحة المتخصصة',
    description:
      'Bloc opératoire aux normes pour la chirurgie ophtalmologique et ORL.',
    description_ar: 'غرفة عمليات مطابقة للمعايير لجراحة العيون والأنف والأذن والحنجرة.',
    items: ['Chirurgie ophtalmologique', 'Chirurgie ORL'],
    iconName: 'Eye',
    accent: '#10B981',
    galleryCategories: ['bloc'],
    intro:
      'Nos blocs opératoires aux normes accueillent la chirurgie ophtalmologique et ORL, dans des conditions d’asepsie et de sécurité optimales.',
    intro_ar: 'تستقبل غرف العمليات لدينا جراحة العيون والأنف والأذن والحنجرة في ظروف تعقيم وسلامة مثالية.',
  },
]

export function getPoleBySlug(slug: string): Pole | undefined {
  return poles.find((p) => p.slug === slug)
}
