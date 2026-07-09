// Galerie « Plateau technique & espaces » de la Clinique OKBA
// Photos réelles optimisées : public/images/equipements/eq-01.jpg … eq-43.jpg
// Chaque cliché a été analysé puis classé par pôle.

import {
  ScanLine,
  Activity,
  FlaskConical,
  BedDouble,
  Stethoscope,
  Building2,
  Radiation,
  type LucideIcon,
} from 'lucide-react'

export type EquipementCategoryId =
  | 'imagerie'
  | 'nucleaire'
  | 'bloc'
  | 'laboratoire'
  | 'hospitalisation'
  | 'consultation'
  | 'accueil'
  | 'dentaire'

export interface EquipementCategory {
  id: EquipementCategoryId
  label: string
  label_ar?: string
  /** Phrase courte décrivant le pôle */
  tagline: string
  tagline_ar?: string
  icon: LucideIcon
  /** Couleur d'accent (HEX) */
  accent: string
}

export interface EquipementItem {
  id: string
  src: string
  category: EquipementCategoryId
  title: string
  title_ar?: string
  description: string
  description_ar?: string
  /** Met l'image en avant (grande tuile dans la grille) */
  featured?: boolean
}

export const equipementCategories: EquipementCategory[] = [
  {
    id: 'imagerie',
    label: 'Imagerie médicale',
    label_ar: 'التصوير الطبي',
    tagline: 'Scanner, IRM, mammographie & radiologie numérique',
    tagline_ar: 'سكانير، رنين مغناطيسي، تصوير الثدي وأشعة رقمية',
    icon: ScanLine,
    accent: '#3B82F6',
  },
  {
    id: 'nucleaire',
    label: 'Médecine nucléaire',
    label_ar: 'الطب النووي',
    tagline: 'SPECT/CT Siemens Symbia Pro.specta & scintigraphie',
    tagline_ar: 'سكانير SPECT/CT Siemens وتصوير ومضاني',
    icon: Radiation,
    accent: '#0D9488',
  },
  {
    id: 'bloc',
    label: 'Bloc opératoire',
    label_ar: 'غرفة العمليات',
    tagline: 'Salles d’opération aux normes, équipées pour la chirurgie',
    tagline_ar: 'غرف عمليات مطابقة للمعايير ومجهزة للجراحة',
    icon: Activity,
    accent: '#10B981',
  },
  {
    id: 'laboratoire',
    label: 'Laboratoire d’analyses',
    label_ar: 'مخبر التحاليل',
    tagline: 'Automates de dernière génération & prélèvements',
    tagline_ar: 'أجهزة آلية حديثة وعينات دم',
    icon: FlaskConical,
    accent: '#8B5CF6',
  },
  {
    id: 'hospitalisation',
    label: 'Hospitalisation',
    label_ar: 'الاستشفاء',
    tagline: 'Chambres confortables & unités de soins',
    tagline_ar: 'غرف مريحة ووحدات علاج',
    icon: BedDouble,
    accent: '#F59E0B',
  },
  {
    id: 'consultation',
    label: 'Consultation & exploration',
    label_ar: 'الاستشارة والفحص',
    tagline: 'Cabinets, échographie & salles d’examen',
    tagline_ar: 'عيادات، تصوير بالصدى وغرف فحص',
    icon: Stethoscope,
    accent: '#EC4899',
  },
  {
    id: 'accueil',
    label: 'Espaces d’accueil',
    label_ar: 'مساحات الاستقبال',
    tagline: 'Réception, attente & circulation lumineuses',
    tagline_ar: 'استقبال، انتظار وممرات مضيئة',
    icon: Building2,
    accent: '#14B8A6',
  },
  {
    id: 'dentaire',
    label: 'Pôle Dentaire',
    label_ar: 'طب الأسنان',
    tagline: 'Consultation, chirurgie, orthodontie & prothèse',
    tagline_ar: 'استشارات، جراحة، تقويم وتركيبات الأسنان',
    icon: Building2, // Reusing Building2 since Smile isn't imported here
    accent: '#06B6D4',
  },
]

export const equipements: EquipementItem[] = [
  /* ----------------------------- Imagerie médicale ----------------------------- */
  {
    id: 'eq-03',
    src: '/images/equipements/eq-03.jpg',
    category: 'imagerie',
    title: 'Scanner Siemens SOMATOM go.Top',
    title_ar: 'سكانير Siemens SOMATOM go.Top',
    description: 'Scanner haute définition pour des images en coupes ultra-précises, en quelques secondes.',
    description_ar: 'سكانير عالي الدقة لصور مقطعية فائقة الدقة في ثوانٍ معدودة.',
    featured: true,
  },
  {
    id: 'eq-imagerie-salle-scanner',
    src: '/images/equipements/scanner-room-imagerie.jpg',
    category: 'imagerie',
    title: 'Salle de scanner — Service d’imagerie',
    title_ar: 'قاعة السكانير — قسم التصوير الطبي',
    description: 'Salle d’imagerie moderne et apaisante, équipée d’un scanner Siemens Healthineers de dernière génération, avec accompagnement personnalisé du patient.',
    description_ar: 'قاعة تصوير حديثة ومريحة، مجهزة بجهاز سكانير Siemens Healthineers من الجيل الأحدث، مع مرافقة شخصية للمريض.',
    featured: true,
  },
  {
    id: 'eq-33',
    src: '/images/equipements/eq-33.jpg',
    category: 'imagerie',
    title: 'IRM Siemens',
    title_ar: 'الرنين المغناطيسي Siemens',
    description: 'Imagerie par résonance magnétique dans un environnement apaisant (plafond panoramique).',
    description_ar: 'تصوير بالرنين المغناطيسي في محيط مريح (سقف بانورامي).',
    featured: true,
  },
  {
    id: 'eq-35',
    src: '/images/equipements/eq-35.jpg',
    category: 'imagerie',
    title: 'Mammographe numérique',
    title_ar: 'جهاز تصوير الثدي الرقمي',
    description: 'Dépistage et diagnostic du sein avec un faible niveau d’irradiation.',
    description_ar: 'كشف وتشخيص أمراض الثدي بمستوى إشعاع منخفض.',
  },
  {
    id: 'eq-40',
    src: '/images/equipements/eq-40.jpg',
    category: 'imagerie',
    title: 'Salle de radiologie',
    title_ar: 'قاعة الأشعة',
    description: 'Radiographie numérique pour os, thorax et explorations courantes.',
    description_ar: 'تصوير شعاعي رقمي للعظام والصدر والفحوصات الشائعة.',
  },
  {
    id: 'eq-43',
    src: '/images/equipements/eq-43.jpg',
    category: 'imagerie',
    title: 'Capteur de radiographie numérique',
    title_ar: 'لاقط الأشعة الرقمية',
    description: 'Tube et capteur plan dynamique pour des clichés nets et immédiats.',
    description_ar: 'أنبوب ولاقط مسطح ديناميكي لصور واضحة وفورية.',
  },
  {
    id: 'eq-32',
    src: '/images/equipements/eq-32.jpg',
    category: 'imagerie',
    title: 'IRM – salle de commande',
    title_ar: 'الرنين المغناطيسي – قاعة التحكم',
    description: 'Poste de pilotage et de reconstruction des images IRM.',
    description_ar: 'منصة قيادة وإعادة بناء صور الرنين المغناطيسي.',
  },
  {
    id: 'eq-37',
    src: '/images/equipements/eq-37.jpg',
    category: 'imagerie',
    title: 'IRM – poste de contrôle',
    title_ar: 'الرنين المغناطيسي – نقطة المراقبة',
    description: 'Supervision de l’examen depuis la salle technique vitrée.',
    description_ar: 'الإشراف على الفحص من القاعة التقنية الزجاجية.',
  },
  {
    id: 'eq-04',
    src: '/images/equipements/eq-04.jpg',
    category: 'imagerie',
    title: 'Scanner – vue de la salle',
    title_ar: 'السكانير – منظر القاعة',
    description: 'Salle de scanner spacieuse et entièrement aux normes radioprotection.',
    description_ar: 'قاعة سكانير واسعة ومطابقة تماماً لمعايير الحماية من الإشعاع.',
  },
  {
    id: 'eq-31',
    src: '/images/equipements/eq-31.jpg',
    category: 'imagerie',
    title: 'Scanner – salle d’examen',
    title_ar: 'السكانير – قاعة الفحص',
    description: 'Environnement lumineux pensé pour le confort du patient.',
    description_ar: 'محيط مضيء مصمم لراحة المريض.',
  },

  /* ----------------------------- Médecine nucléaire ---------------------------- */
  {
    id: 'eq-02',
    src: '/images/equipements/eq-02.jpg',
    category: 'nucleaire',
    title: 'SPECT/CT Siemens Symbia Pro.specta',
    title_ar: 'غاما كاميرا – التصوير الومضاني',
    description: 'Caméra hybride de médecine nucléaire couplant scintigraphie (SPECT) et scanner (CT) : imagerie fonctionnelle et anatomique en un seul examen, pour une localisation et un diagnostic d’une précision exceptionnelle.',
    description_ar: 'الطب النووي: استكشاف وظيفي للأعضاء بالتصوير النظائري.',
    featured: true,
  },
  {
    id: 'eq-08',
    src: '/images/equipements/eq-08.jpg',
    category: 'nucleaire',
    title: 'Détecteurs SPECT double tête',
    title_ar: 'الطب النووي',
    description: 'Têtes de détection double du Symbia Pro.specta pour l’exploration isotopique des organes (os, cœur, thyroïde, reins…).',
    description_ar: 'كاشفات مزدوجة الرأس لغاما كاميرا للتصوير الومضاني.',
  },

  /* ------------------------------- Bloc opératoire ----------------------------- */
  {
    id: 'eq-09',
    src: '/images/equipements/eq-09.jpg',
    category: 'bloc',
    title: 'Bloc opératoire',
    title_ar: 'غرفة العمليات',
    description: 'Table chirurgicale, bras plafonniers et éclairage scialytique de haute précision.',
    description_ar: 'طاولة جراحية وأذرع سقفية وإضاءة جراحية عالية الدقة.',
    featured: true,
  },
  {
    id: 'eq-11',
    src: '/images/equipements/eq-11.jpg',
    category: 'bloc',
    title: 'Salle d’opération',
    title_ar: 'قاعة العمليات',
    description: 'Salle aux normes d’asepsie, équipée pour la chirurgie spécialisée.',
    description_ar: 'قاعة مطابقة لمعايير التعقيم، مجهزة للجراحة المتخصصة.',
  },
  {
    id: 'eq-12',
    src: '/images/equipements/eq-12.jpg',
    category: 'bloc',
    title: 'Bloc – plateau technique',
    title_ar: 'غرفة العمليات – المنصة التقنية',
    description: 'Bras de distribution des fluides médicaux et colonnes opératoires.',
    description_ar: 'أذرع توزيع السوائل الطبية والأعمدة الجراحية.',
  },
  {
    id: 'eq-10',
    src: '/images/equipements/eq-10.jpg',
    category: 'bloc',
    title: 'Bloc opératoire',
    title_ar: 'غرفة العمليات',
    description: 'Éclairage opératoire LED et surfaces facilement décontaminables.',
    description_ar: 'إضاءة جراحية LED وأسطح سهلة التعقيم.',
  },
  {
    id: 'eq-13',
    src: '/images/equipements/eq-13.jpg',
    category: 'bloc',
    title: 'Salle chirurgicale',
    title_ar: 'قاعة جراحية',
    description: 'Espace dédié aux interventions, ventilation et hygiène maîtrisées.',
    description_ar: 'فضاء مخصص للعمليات، بتهوية ونظافة محكمتين.',
  },

  /* ----------------------------- Laboratoire ----------------------------------- */
  {
    id: 'eq-27',
    src: '/images/equipements/eq-27.jpg',
    category: 'laboratoire',
    title: 'Laboratoire d’analyses',
    title_ar: 'مخبر التحاليل',
    description: 'Plateau d’analyses médicales automatisé pour des résultats fiables et rapides.',
    description_ar: 'منصة تحاليل طبية مؤتمتة لنتائج موثوقة وسريعة.',
    featured: true,
  },
  {
    id: 'eq-23',
    src: '/images/equipements/eq-23.jpg',
    category: 'laboratoire',
    title: 'Automate ALEGRIA 2',
    title_ar: 'جهاز ALEGRIA 2 الآلي',
    description: 'Système d\'analyse pour l\'auto-immunité (maladie coeliaque, FAN...) et la sérologie (Hépatites, VIH).',
    description_ar: 'نظام تحليل للمناعة الذاتية (الداء الزلاقي، FAN...) والأمصال (التهاب الكبد، فيروس نقص المناعة).',
  },
  {
    id: 'eq-26',
    src: '/images/equipements/eq-26.jpg',
    category: 'laboratoire',
    title: 'BioSystems BA200',
    title_ar: 'جهاز BioSystems BA200',
    description: 'Analyseur de biochimie clinique entièrement automatisé pour un diagnostic rapide et fiable des paramètres biochimiques.',
    description_ar: 'محلل كيمياء حيوية سريرية آلي بالكامل لتشخيص سريع وموثوق للبارامترات الكيميائية الحيوية.',
  },
  {
    id: 'eq-25',
    src: '/images/equipements/eq-25.jpg',
    category: 'laboratoire',
    title: 'Paillasses techniques & PCR',
    title_ar: 'طاولات العمل التقنية و PCR',
    description: 'Postes de travail ergonomiques intégrant des technologies avancées comme le GeneXpert pour la biologie moléculaire.',
    description_ar: 'مناصب عمل مريحة تدمج تقنيات متقدمة مثل GeneXpert للبيولوجيا الجزيئية.',
  },
  {
    id: 'eq-30',
    src: '/images/equipements/eq-30.jpg',
    category: 'laboratoire',
    title: 'Salle technique (Hématologie & Immunoanalyse)',
    title_ar: 'القاعة التقنية (أمراض الدم والمناعة)',
    description: 'Équipée d\'automates de pointe comme le Beckman Coulter DxH 500 et le MAGLUMI X3 pour des résultats précis.',
    description_ar: 'مجهزة بأجهزة حديثة مثل Beckman Coulter DxH 500 و MAGLUMI X3 لنتائج دقيقة.',
  },
  {
    id: 'eq-28',
    src: '/images/equipements/eq-28.jpg',
    category: 'laboratoire',
    title: 'Salle de prélèvement',
    title_ar: 'قاعة أخذ العينات',
    description: 'Accueil confortable des patients pour les prises de sang.',
    description_ar: 'استقبال مريح للمرضى لسحب الدم.',
  },
  {
    id: 'eq-24',
    src: '/images/equipements/eq-24.jpg',
    category: 'laboratoire',
    title: 'Accueil du laboratoire',
    title_ar: 'استقبال المخبر',
    description: 'Réception dédiée aux analyses, claire et accessible.',
    description_ar: 'استقبال مخصص للتحاليل، واضح وسهل الوصول.',
  },

  /* --------------------------- Hospitalisation --------------------------------- */
  {
    id: 'eq-05',
    src: '/images/equipements/eq-05.jpg',
    category: 'hospitalisation',
    title: 'Chambre d’hospitalisation',
    title_ar: 'غرفة الاستشفاء',
    description: 'Lits médicalisés et espace baigné de lumière naturelle.',
    description_ar: 'أسرّة طبية وفضاء مفعم بالضوء الطبيعي.',
    featured: true,
  },
  {
    id: 'eq-41',
    src: '/images/equipements/eq-41.jpg',
    category: 'hospitalisation',
    title: 'Unité de soins',
    title_ar: 'وحدة العلاج',
    description: 'Salle de surveillance avec chariot d’urgence et poste infirmier.',
    description_ar: 'قاعة مراقبة مع عربة طوارئ ومنصب تمريض.',
  },
  {
    id: 'eq-06',
    src: '/images/equipements/eq-06.jpg',
    category: 'hospitalisation',
    title: 'Chambre confortable',
    title_ar: 'غرفة مريحة',
    description: 'Mobilier médical complet pour un séjour serein.',
    description_ar: 'تجهيزات طبية كاملة لإقامة هادئة.',
  },
  {
    id: 'eq-19',
    src: '/images/equipements/eq-19.jpg',
    category: 'hospitalisation',
    title: 'Chambre collective',
    title_ar: 'غرفة جماعية',
    description: 'Lits réglables et chevets dédiés à chaque patient.',
    description_ar: 'أسرّة قابلة للتعديل وطاولات جانبية لكل مريض.',
  },
  {
    id: 'eq-20',
    src: '/images/equipements/eq-20.jpg',
    category: 'hospitalisation',
    title: 'Salle d’hospitalisation',
    title_ar: 'قاعة الاستشفاء',
    description: 'Espace propre, spacieux et facile d’accès pour le personnel.',
    description_ar: 'فضاء نظيف وواسع وسهل الوصول للطاقم.',
  },
  {
    id: 'eq-07',
    src: '/images/equipements/eq-07.jpg',
    category: 'hospitalisation',
    title: 'Salle de surveillance',
    title_ar: 'قاعة المراقبة',
    description: 'Lits de soins et poste de suivi rapproché des patients.',
    description_ar: 'أسرّة علاجية ونقطة متابعة لصيقة للمرضى.',
  },
  {
    id: 'eq-14',
    src: '/images/equipements/eq-14.jpg',
    category: 'hospitalisation',
    title: 'Chambre d’hospitalisation',
    title_ar: 'غرفة الاستشفاء',
    description: 'Confort, hygiène et luminosité au service du repos.',
    description_ar: 'راحة ونظافة وإضاءة في خدمة استراحة المريض.',
  },
  {
    id: 'eq-15',
    src: '/images/equipements/eq-15.jpg',
    category: 'hospitalisation',
    title: 'Chambre patient',
    title_ar: 'غرفة المريض',
    description: 'Lits médicalisés modernes dans un cadre apaisant.',
    description_ar: 'أسرّة طبية حديثة في إطار مريح.',
  },
  {
    id: 'eq-16',
    src: '/images/equipements/eq-16.jpg',
    category: 'hospitalisation',
    title: 'Chambre double',
    title_ar: 'غرفة مزدوجة',
    description: 'Aménagement équilibré pour le confort de deux patients.',
    description_ar: 'تهيئة متوازنة لراحة مريضين.',
  },
  {
    id: 'eq-22',
    src: '/images/equipements/eq-22.jpg',
    category: 'hospitalisation',
    title: 'Chambre lumineuse',
    title_ar: 'غرفة مضيئة',
    description: 'Grandes ouvertures et finitions soignées.',
    description_ar: 'فتحات كبيرة وتشطيبات متقنة.',
  },

  /* ---------------------- Consultation & exploration --------------------------- */
  {
    id: 'eq-29',
    src: '/images/equipements/eq-29.jpg',
    category: 'consultation',
    title: 'Salle d’échographie',
    title_ar: 'قاعة التصوير بالصدى',
    description: 'Échographe performant pour l’imagerie en temps réel.',
    description_ar: 'جهاز صدى عالي الأداء للتصوير الفوري.',
    featured: true,
  },
  {
    id: 'eq-01',
    src: '/images/equipements/eq-01.jpg',
    category: 'consultation',
    title: 'Salle d’exploration gynécologique',
    title_ar: 'قاعة الفحص النسائي',
    description: 'Table d’examen et échographe dédiés au suivi de la femme.',
    description_ar: 'طاولة فحص وجهاز صدى مخصصان لمتابعة صحة المرأة.',
  },
  {
    id: 'eq-42',
    src: '/images/equipements/eq-42.jpg',
    category: 'consultation',
    title: 'Salle d’examen',
    title_ar: 'قاعة الفحص',
    description: 'Espace d’examen équipé et préservant l’intimité du patient.',
    description_ar: 'فضاء فحص مجهز يحفظ خصوصية المريض.',
  },
  {
    id: 'eq-21',
    src: '/images/equipements/eq-21.jpg',
    category: 'consultation',
    title: 'Cabinet médical',
    title_ar: 'العيادة الطبية',
    description: 'Cabinet de consultation moderne et accueillant.',
    description_ar: 'عيادة استشارة حديثة ومرحّبة.',
  },
  {
    id: 'eq-17',
    src: '/images/equipements/eq-17.jpg',
    category: 'consultation',
    title: 'Salle de consultation',
    title_ar: 'قاعة الاستشارة',
    description: 'Espace de dialogue avec le médecin et table d’examen.',
    description_ar: 'فضاء للحوار مع الطبيب وطاولة فحص.',
  },
  {
    id: 'eq-36',
    src: '/images/equipements/eq-36.jpg',
    category: 'consultation',
    title: 'Cabinet de consultation',
    title_ar: 'عيادة الاستشارة',
    description: 'Environnement clair, pensé pour le confort de l’échange.',
    description_ar: 'محيط واضح مصمم لراحة الحوار.',
  },

  /* ----------------------------- Espaces d'accueil ----------------------------- */
  {
    id: 'eq-34',
    src: '/images/equipements/eq-34.jpg',
    category: 'accueil',
    title: 'Réception principale',
    title_ar: 'الاستقبال الرئيسي',
    description: 'Un hall spacieux et lumineux pour vous orienter dès l’arrivée.',
    description_ar: 'بهو واسع ومضيء لتوجيهكم فور الوصول.',
    featured: true,
  },
  {
    id: 'eq-38',
    src: '/images/equipements/eq-38.jpg',
    category: 'accueil',
    title: 'Accueil pédiatrie',
    title_ar: 'استقبال طب الأطفال',
    description: 'Un espace coloré et rassurant, pensé pour les enfants.',
    description_ar: 'فضاء ملوّن ومطمئن مصمم للأطفال.',
  },
  {
    id: 'eq-39',
    src: '/images/equipements/eq-39.jpg',
    category: 'accueil',
    title: 'Espace d’attente',
    title_ar: 'فضاء الانتظار',
    description: 'Salles d’attente confortables réparties à chaque étage.',
    description_ar: 'قاعات انتظار مريحة موزعة على كل طابق.',
  },
  {
    id: 'eq-18',
    src: '/images/equipements/eq-18.jpg',
    category: 'accueil',
    title: 'Hall & ascenseur',
    title_ar: 'البهو والمصعد',
    description: 'Circulation fluide et accessible entre les services.',
    description_ar: 'تنقل سلس وميسّر بين المصالح.',
  },
]
