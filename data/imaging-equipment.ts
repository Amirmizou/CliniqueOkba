// Fiches équipements du pôle Imagerie & Médecine nucléaire — Clinique OKBA.
// Repli local (Sanity-first : si le schéma `equipment` est renseigné dans le
// Studio, il a la priorité ; sinon ces fiches documentées s'affichent).
// Toutes les machines sont des plateformes Siemens Healthineers, dotées
// d'assistances par IA (positionnement, reconstruction, aide à la lecture)
// pour des résultats plus précis et reproductibles.

export interface ImagingDevice {
  _id: string
  name: string
  name_ar?: string
  brand: string
  model?: string
  /** Catégorie de matériel (alignée sur le mapping de la page pôle) */
  category: 'imaging' | 'nuclear'
  description: string
  description_ar?: string
  features: string[]
  features_ar?: string[]
}

export const imagingEquipment: Record<string, ImagingDevice[]> = {
  // ── Pôle Imagerie médicale ──────────────────────────────────────────────
  imagerie: [
    {
      _id: 'somatom-go-top',
      name: 'Scanner (TDM) — SOMATOM go.Top',
      name_ar: 'جهاز التصوير المقطعي — SOMATOM go.Top',
      brand: 'Siemens Healthineers',
      model: 'SOMATOM go.Top',
      category: 'imaging',
      description:
        "Scanner (tomodensitométrie) de dernière génération à acquisition rapide. Le positionnement du patient est automatisé par une caméra 3D et l'IA (FAST 3D Camera), et la technologie Tin Filter réduit fortement la dose de rayons X. Idéal pour l'imagerie cardiaque, thoracique faible dose, oncologique et vasculaire.",
      description_ar:
        'جهاز تصوير مقطعي من الجيل الأحدث بسرعة اكتساب عالية. يتم وضع المريض آليًا بواسطة كاميرا ثلاثية الأبعاد والذكاء الاصطناعي، وتقلّل تقنية Tin Filter جرعة الأشعة بشكل كبير. مثالي لتصوير القلب والصدر بجرعة منخفضة والأورام والأوعية الدموية.',
      features: [
        'Acquisition multi-coupes rapide',
        'Positionnement automatique par IA (caméra FAST 3D)',
        'Faible dose (technologie Tin Filter)',
        'Workflow guidé myExam Companion',
        'Reconstruction itérative haute résolution',
      ],
      features_ar: [
        'اكتساب سريع متعدد المقاطع',
        'وضع آلي بالذكاء الاصطناعي (كاميرا FAST 3D)',
        'جرعة منخفضة (تقنية Tin Filter)',
        'سير عمل موجَّه myExam Companion',
        'إعادة بناء تكرارية عالية الدقة',
      ],
    },
    {
      _id: 'magnetom-altea',
      name: 'IRM — MAGNETOM Altea 1.5T',
      name_ar: 'التصوير بالرنين المغناطيسي — MAGNETOM Altea 1.5T',
      brand: 'Siemens Healthineers',
      model: 'MAGNETOM Altea',
      category: 'imaging',
      description:
        "IRM 1.5 Tesla à tunnel large (70 cm) pour un examen confortable. La technologie BioMatrix s'adapte à chaque patient et l'IA Deep Resonance accélère l'acquisition tout en débruitant les images : des examens plus courts et plus nets (neurologie, ostéo-articulaire, abdomen, etc.).",
      description_ar:
        'جهاز رنين مغناطيسي 1.5 تسلا بفتحة واسعة (70 سم) لفحص مريح. تتكيّف تقنية BioMatrix مع كل مريض، ويسرّع الذكاء الاصطناعي Deep Resonance الاكتساب مع تقليل التشويش: فحوصات أقصر وأوضح (الأعصاب، العظام والمفاصل، البطن…).',
      features: [
        'Champ 1.5 Tesla',
        'Tunnel large 70 cm (confort patient)',
        'IA Deep Resonance (images plus nettes & rapides)',
        'BioMatrix (adaptation au patient)',
        'Examens raccourcis',
      ],
      features_ar: [
        'حقل 1.5 تسلا',
        'فتحة واسعة 70 سم (راحة المريض)',
        'ذكاء اصطناعي Deep Resonance (صور أوضح وأسرع)',
        'BioMatrix (تكيّف مع المريض)',
        'فحوصات أقصر',
      ],
    },
    {
      _id: 'mammomat',
      name: 'Mammographie — MAMMOMAT (tomosynthèse 3D)',
      name_ar: 'تصوير الثدي — MAMMOMAT (تصوير مقطعي ثلاثي الأبعاد)',
      brand: 'Siemens Healthineers',
      model: 'MAMMOMAT',
      category: 'imaging',
      description:
        "Mammographe numérique avec tomosynthèse 3D pour le dépistage et le diagnostic du cancer du sein. La reconstruction 3D et l'aide à la détection par IA améliorent la lecture des lésions, à dose maîtrisée et avec une compression douce pour le confort de la patiente.",
      description_ar:
        'جهاز تصوير ثدي رقمي مع تصوير مقطعي ثلاثي الأبعاد (Tomosynthesis) للكشف عن سرطان الثدي وتشخيصه. تُحسّن إعادة البناء ثلاثية الأبعاد والمساعدة بالذكاء الاصطناعي قراءة الآفات، بجرعة محكومة وضغط لطيف لراحة المريضة.',
      features: [
        'Mammographie numérique 2D & 3D (tomosynthèse)',
        'Aide à la détection par IA',
        'Faible dose',
        'Compression douce (confort)',
      ],
      features_ar: [
        'تصوير رقمي ثنائي وثلاثي الأبعاد (Tomosynthesis)',
        'مساعدة على الكشف بالذكاء الاصطناعي',
        'جرعة منخفضة',
        'ضغط لطيف (راحة)',
      ],
    },
    {
      _id: 'acuson-juniper',
      name: 'Échographie — ACUSON Juniper',
      name_ar: 'الموجات فوق الصوتية — ACUSON Juniper',
      brand: 'Siemens Healthineers',
      model: 'ACUSON Juniper',
      category: 'imaging',
      description:
        "Échographe polyvalent à haute qualité d'image, équipé de sondes large bande et d'une optimisation d'image assistée par IA. Couvre l'abdominal, la gynéco-obstétrique, le vasculaire, le musculo-squelettique et le Doppler couleur, en temps réel et sans irradiation.",
      description_ar:
        'جهاز موجات فوق صوتية متعدد الاستخدامات بجودة صورة عالية، مزوّد بمسبارات عريضة النطاق وتحسين للصورة بالذكاء الاصطناعي. يغطي البطن وأمراض النساء والتوليد والأوعية والجهاز العضلي الهيكلي ودوبلر الملوّن، في الوقت الحقيقي ودون إشعاع.',
      features: [
        'Imagerie temps réel haute définition',
        'Sondes multifréquences large bande',
        "Optimisation d'image par IA",
        'Polyvalent (abdo, gynéco, vasculaire, MSK)',
        'Doppler couleur',
      ],
      features_ar: [
        'تصوير لحظي عالي الوضوح',
        'مسبارات متعددة الترددات عريضة النطاق',
        'تحسين الصورة بالذكاء الاصطناعي',
        'متعدد الاستخدامات (بطن، نساء، أوعية، عضلي هيكلي)',
        'دوبلر ملوّن',
      ],
    },
    {
      _id: 'multix-impact',
      name: 'Radiologie numérique — MULTIX Impact',
      name_ar: 'الأشعة الرقمية — MULTIX Impact',
      brand: 'Siemens Healthineers',
      model: 'MULTIX Impact',
      category: 'imaging',
      description:
        "Système de radiographie numérique (DR) à capteur plan, pour des clichés osseux et thoraciques nets à dose maîtrisée. Le workflow est guidé par IA (myExam Companion) afin de standardiser les acquisitions et accélérer la prise en charge.",
      description_ar:
        'نظام تصوير شعاعي رقمي (DR) بكاشف مسطّح، لصور عظمية وصدرية واضحة بجرعة محكومة. يُوجَّه سير العمل بالذكاء الاصطناعي (myExam Companion) لتوحيد عمليات الاكتساب وتسريع الرعاية.',
      features: [
        'Radiographie numérique (capteur plan)',
        'Workflow assisté par IA',
        'Dose maîtrisée',
        'Haute résolution',
      ],
      features_ar: [
        'تصوير شعاعي رقمي (كاشف مسطّح)',
        'سير عمل مدعوم بالذكاء الاصطناعي',
        'جرعة محكومة',
        'دقة عالية',
      ],
    },
  ],

  // ── Pôle Médecine nucléaire ─────────────────────────────────────────────
  'medecine-nucleaire': [
    {
      _id: 'symbia-pro-specta',
      name: 'SPECT/CT — Symbia Pro.specta',
      name_ar: 'SPECT/CT — Symbia Pro.specta',
      brand: 'Siemens Healthineers',
      model: 'Symbia Pro.specta',
      category: 'nuclear',
      description:
        "Caméra hybride SPECT/CT qui fusionne l'imagerie fonctionnelle (scintigraphie) et anatomique (scanner) en un seul examen. La technologie xSPECT et la reconstruction assistée par IA offrent une quantification précise et une localisation fiable : os, cœur, thyroïde, reins et oncologie, avec un scanner faible dose intégré.",
      description_ar:
        'كاميرا هجينة SPECT/CT تدمج التصوير الوظيفي (الومضاني) والتشريحي (المقطعي) في فحص واحد. توفّر تقنية xSPECT وإعادة البناء المدعومة بالذكاء الاصطناعي قياسًا دقيقًا وتحديدًا موثوقًا: العظام، القلب، الغدة الدرقية، الكلى والأورام، مع جهاز مقطعي منخفض الجرعة مدمج.',
      features: [
        'SPECT/CT hybride (fonction + anatomie)',
        'Technologie xSPECT (quantification)',
        'Scanner faible dose intégré',
        'Reconstruction optimisée par IA',
      ],
      features_ar: [
        'SPECT/CT هجين (وظيفة + تشريح)',
        'تقنية xSPECT (قياس كمّي)',
        'جهاز مقطعي منخفض الجرعة مدمج',
        'إعادة بناء محسّنة بالذكاء الاصطناعي',
      ],
    },
  ],
}
