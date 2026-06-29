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
  /** Ligne directe du service (sinon numéro principal de la clinique) */
  phone?: string
  /** Pôle mis en avant (urgences) avec style distinct */
  urgent?: boolean
  /** Pôle vedette : carte mise en évidence (halo, ring, ruban « À la une ») */
  featured?: boolean
  /** Catégories de la galerie correspondant à ce pôle (photos de la page dédiée) */
  galleryCategories: EquipementCategoryId[]
  /** Introduction longue affichée sur la page dédiée */
  intro?: string
  intro_ar?: string
  /** Met en avant un bandeau « augmenté par l'IA » sur la page dédiée */
  aiBoosted?: boolean
  /** Vidéos de présentation */
  videos?: { title?: string; videoUrl?: string; poster?: any }[]
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
      'Scanner SOMATOM go.Top (TDM)',
      'IRM MAGNETOM Altea 1.5T',
      'Mammographie MAMMOMAT (tomosynthèse 3D)',
      'Échographie ACUSON Juniper',
      'Radiologie numérique MULTIX Impact',
    ],
    items_ar: [
      'سكانير SOMATOM go.Top (التصوير المقطعي)',
      'رنين مغناطيسي MAGNETOM Altea 1.5T',
      'تصوير الثدي MAMMOMAT (ثلاثي الأبعاد)',
      'الموجات فوق الصوتية ACUSON Juniper',
      'الأشعة الرقمية MULTIX Impact',
    ],
    iconName: 'ScanLine',
    accent: '#3B82F6',
    phone: '0560 78 27 67',
    galleryCategories: ['imagerie'],
    aiBoosted: true,
    intro:
      'Notre service d’imagerie réunit un plateau technique complet de dernière génération Siemens Healthineers : scanner SOMATOM go.Top, IRM MAGNETOM Altea 1.5T, mammographe MAMMOMAT (tomosynthèse 3D), échographe ACUSON Juniper et radiologie numérique MULTIX Impact. L’ensemble du plateau est augmenté par l’intelligence artificielle — positionnement du patient, reconstruction des images et aide à la lecture — pour des résultats plus précis, plus rapides et reproductibles, à dose maîtrisée.',
    intro_ar: 'يضم قسم التصوير لدينا منصة تقنية متكاملة من الجيل الأحدث من Siemens Healthineers: سكانير SOMATOM go.Top، رنين مغناطيسي MAGNETOM Altea 1.5T، جهاز تصوير ثدي MAMMOMAT (ثلاثي الأبعاد)، جهاز موجات فوق صوتية ACUSON Juniper، وأشعة رقمية MULTIX Impact. كامل المنصة معزّز بالذكاء الاصطناعي — وضع المريض، إعادة بناء الصور والمساعدة في القراءة — لنتائج أدقّ وأسرع وقابلة للتكرار، وبجرعة محكومة.',
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
    aiBoosted: true,
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
      'Hématologie (FNS, Groupage, TP, INR, HbA1c...)',
      'Bilan Diabète (Glycémie, Hémoglobine glyquée, HGPO...)',
      'Maladies Infectieuses (Hépatites, VIH, Sérologies...)',
      'Maladies respiratoires (PCR, Cultures bactériennes...)',
      'Pédiatrie (Dépistage néonatal, Hormone de croissance...)',
      'Bilan de fertilité (AMH, FSH, Spermogramme, TMS...)',
      'Gynécologie (Prélèvements, Maladies sexuellement transmissibles)',
      'Maladies auto-immunes (Anticorps spécifiques, FAN, ANCA...)',
      'Marqueurs tumoraux (PSA, AFP, CEA, Dépistage colorectal)',
      'Exploration (Fonctions hépatiques, rénales, lipidiques)',
      'Vitamines et minéraux (D, B12, Calcium)',
      'Dépistage Helicobacter pylori (PCR, Sérologie, Test respiratoire)',
    ],
    items_ar: [
      'أمراض الدم (FNS، فصيلة الدم، تخثر، HbA1c...)',
      'فحص السكري (سكر الدم، HbA1c، HGPO...)',
      'الأمراض المعدية (التهاب الكبد، فيروس نقص المناعة، الأمصال...)',
      'أمراض الجهاز التنفسي (PCR، مزارع بكتيرية...)',
      'طب الأطفال (فحص حديثي الولادة، هرمون النمو...)',
      'فحص الخصوبة (AMH، الهرمونات، فحص الحيوانات المنوية...)',
      'أمراض النساء (مسحات، أمراض منقولة جنسياً)',
      'أمراض المناعة الذاتية (أجسام مضادة، FAN، ANCA...)',
      'دلالات الأورام (PSA، AFP، CEA، فحص سرطان القولون)',
      'فحوصات (وظائف الكبد، الكلى، الدهون)',
      'الفيتامينات والمعادن (D، B12، الكالسيوم)',
      'فحص جرثومة المعدة (PCR، الأمصال، فحص التنفس)',
    ],
    iconName: 'FlaskConical',
    accent: '#8B5CF6',
    galleryCategories: ['laboratoire'],
    intro:
      'Notre laboratoire d’analyses médicales réalise vos bilans sanguins et prélèvements sur des automates de dernière génération, pour des résultats fiables et rapides.',
    intro_ar: 'يقوم مختبرنا الطبي بإجراء فحوصات الدم والعينات باستخدام أجهزة أوتوماتيكية من الجيل الأحدث للحصول على نتائج دقيقة وسريعة.',
    videos: [
      {
        title: 'Présentation du Pôle Laboratoire',
        videoUrl: '/videos/Présentation laboratoire OKBA.mp4',
      }
    ],
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
