/**
 * Synchronise les traductions ARABES de tout le contenu Sanity.
 *
 * Couvre : doctors, testimonials, siteSettings, sectionContent, footerContent,
 * equipment, facilityPhoto, et crée les documents manquants (faq, insuranceSection).
 *
 * Idempotent : relançable sans créer de doublons (patch + createOrReplace).
 *
 * Lancement :  node scripts/sync-arabic.mjs
 */

import { createClient } from 'next-sanity'
import { readFileSync, existsSync, createReadStream } from 'node:fs'
import { dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// ---- .env minimal ----------------------------------------------------------
for (const line of readFileSync(join(root, '.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN manquant dans .env')
  process.exit(1)
}

/* ========================================================================== */
/*  1. MÉDECINS (par _id déterministe)                                        */
/* ========================================================================== */

const DOCTORS_AR = {
  'doctor-meskaldji-rima': {
    title_ar: 'د.',
    name_ar: 'مسكلجي ريما',
    specialty_ar: 'أمراض النساء والتوليد',
    subtitle_ar: 'أستاذة مساعدة سابقة',
    services_ar: [
      'متابعة الحمل', 'الولادة الطبيعية', 'الولادة القيصرية',
      'تصوير بالصدى ثلاثي ورباعي الأبعاد', 'دوبلر – تخطيط قلب الجنين',
      'تنظير عنق الرحم', 'تنظير الرحم', 'علاج العقم لدى الزوجين',
      'طب الثدي', 'الجراحة بالمنظار', 'جراحة النساء',
    ],
    consultationDays_ar: 'من السبت إلى الخميس',
    consultationHours_ar: 'من 08:00 إلى 16:00',
  },
  'doctor-ameziane-leila': {
    title_ar: 'د.',
    name_ar: 'عميزيان ليلى',
    specialty_ar: 'أخصائية الغدد الصماء',
    subtitle_ar: 'أخصائية السكري',
    experience_ar: 'أكثر من 25 سنة خبرة',
    services_ar: ['طب السكري', 'الأيض', 'أمراض التغذية'],
    consultationDays_ar: 'من السبت إلى الخميس',
    consultationHours_ar: 'من 08:00 إلى 16:00',
  },
  'doctor-boukredera-amira': {
    title_ar: 'د.',
    name_ar: 'بوكريدرة أميرة',
    specialty_ar: 'طبيبة أطفال',
    services_ar: ['استشارة', 'متابعة الأمراض المزمنة', 'متابعة نمو الطفل'],
    consultationDays_ar: 'من السبت إلى الخميس',
    consultationHours_ar: 'من 08:00 إلى 16:00',
  },
  'doctor-zerizer-loubna': {
    title_ar: 'د.',
    name_ar: 'زريزر لبنى',
    specialty_ar: 'الطب الباطني',
    services_ar: [
      'السكري والغدة الدرقية', 'أمراض الجهاز الهضمي والكبد',
      'أمراض المناعة الذاتية والروماتيزم', 'الأمراض النادرة',
      'ارتفاع الكوليسترول', 'فقر الدم',
    ],
    consultationDays_ar: 'من السبت إلى الخميس',
    consultationHours_ar: 'من 08:00 إلى 16:00',
  },
  'doctor-boughanout-seyfeddine': {
    title_ar: 'د.',
    name_ar: 'بوغانوت سيف الدين',
    specialty_ar: 'أنف وأذن وحنجرة',
    subtitle_ar: 'جراحة الأذن والأنف والحنجرة والوجه والرقبة',
    services_ar: [
      'علاج الحساسية والدوار', 'قياس السمع والطبلة', 'تنظير الأذن والأنف',
      'جراحة اللوزتين واللحمية',
      'جراحة الغدة الدرقية والغدد اللعابية واللمفاوية', 'الجراحة بالمنظار',
    ],
    consultationDays_ar: 'من السبت إلى الأربعاء',
    consultationHours_ar: 'من 08:00 إلى 16:00',
  },
  'doctor-aissaoui-laboratoire': {
    title_ar: 'أ.د.',
    name_ar: 'عيساوي',
    specialty_ar: 'مسؤول المخبر',
    subtitle_ar: 'البيولوجيا الطبية',
    services_ar: [
      'التحاليل البيولوجية', 'أمراض الدم', 'الكيمياء الحيوية',
      'المصليات والمناعة', 'علم الجراثيم',
    ],
    consultationDays_ar: 'من السبت إلى الخميس',
    consultationHours_ar: 'من 08:00 إلى 16:00',
  },
}

/* ========================================================================== */
/*  2. TÉMOIGNAGES                                                            */
/* ========================================================================== */

const TESTIMONIALS_AR = {
  'testimonial-0': {
    name_ar: 'أمل ب.',
    service_ar: 'التصوير الطبي',
    comment_ar:
      'استقبال حار وطاقم محترف جداً. تم إجراء فحص السكانير بسرعة وكانت النتائج واضحة.',
  },
  'testimonial-1': {
    name_ar: 'كريم م.',
    service_ar: 'الطوارئ',
    comment_ar:
      'تكفل ممتاز في قسم الطوارئ ليلاً ونهاراً. فريق متفهم وسريع الاستجابة.',
  },
  'testimonial-2': {
    name_ar: 'نادية س.',
    service_ar: 'أمراض النساء',
    comment_ar:
      'متابعة حمل لا تشوبها شائبة، أطباء مهتمون وتجهيزات تقنية حديثة. أنصح بها بشدة.',
  },
}

/* ========================================================================== */
/*  3. PARAMÈTRES DU SITE                                                     */
/* ========================================================================== */

const SITE_SETTINGS_AR = {
  address_ar: 'المدينة الجديدة علي منجلي، قسنطينة، الجزائر',
  hours_ar: {
    emergency: '24/24 - 7/7',
    weekdays: '08:00 - 16:00',
    saturday: '08:00 - 14:00',
  },
}

/* ========================================================================== */
/*  4. CONTENUS DE SECTION (par _id)                                          */
/* ========================================================================== */

const SECTION_CONTENT_AR = {
  'sectionContent-hero': {
    badge_ar: 'التميز الطبي · علي منجلي، قسنطينة',
  },
  'sectionContent-contact': {
    badge_ar: 'اتصل بنا',
    title_ar: 'الاتصال والموقع',
    subtitle_ar: 'نحن في خدمتكم لأي سؤال أو طلب موعد',
  },
  'sectionContent-homecare': {
    badge_ar: 'خدمة مخصصة',
    title_ar: 'الرعاية المنزلية',
    subtitle_ar: 'فريق متنقل لرعاية طبية عالية الجودة في منزلك بكل أمان.',
  },
  'sectionContent-testimonials': {
    badge_ar: 'آراء المرضى',
    title_ar: 'ماذا يقول مرضانا',
    subtitle_ar: 'رضاكم هو أولويتنا',
  },
  'sectionContent-video': {
    badge_ar: 'بالفيديو',
    title_ar: 'اكتشف المصحة الطبية عقبة',
    subtitle_ar:
      'عرض تقديمي لمؤسستنا: تخصصاتنا، طوارئنا على مدار الساعة، والتزامنا إلى جانبكم.',
  },
}

/* ========================================================================== */
/*  5. PIED DE PAGE                                                           */
/* ========================================================================== */

const FOOTER_AR = {
  description_ar:
    'مصحة خاصة متعددة التخصصات في علي منجلي، قسنطينة. تصوير طبي متطور، قطب طب الأسنان، مخبر، طوارئ على مدار الساعة واستشارات متخصصة في إطار عصري ومرحّب.',
}

/* ========================================================================== */
/*  6. ÉQUIPEMENTS (par nom français)                                         */
/* ========================================================================== */

const EQUIPMENT_AR = {
  'Scanner Somatom go.Top': {
    name_ar: 'سكانير Somatom go.Top',
    description_ar: 'سكانير من أحدث جيل يوفر سرعة وجودة صورة استثنائية لجميع المرضى.',
  },
  'IRM': {
    name_ar: 'الرنين المغناطيسي',
    description_ar: 'تصوير بالرنين المغناطيسي عالي الأداء.',
  },
  'Radiologie Numérique': {
    name_ar: 'الأشعة الرقمية',
    description_ar: 'نظام أشعة رقمية أرضي متعدد الاستخدامات وسهل الاستعمال.',
  },
  'Mammographie': {
    name_ar: 'تصوير الثدي الشعاعي',
    description_ar: 'تصوير الثدي الرقمي للكشف المبكر.',
  },
  'Échographie': {
    name_ar: 'التصوير بالصدى',
    description_ar: 'تصوير بالصدى عالي الدقة لجميع أنواع الفحوصات.',
  },
  "Salle d'Opération": {
    name_ar: 'غرفة العمليات',
    description_ar: 'غرفة عمليات حديثة مجهزة بأحدث المعدات الجراحية.',
  },
  'Scanner SPECT-CT': {
    name_ar: 'سكانير SPECT-CT',
    description_ar:
      'نظام هجين متقدم يجمع بين التصوير الومضاني والتصوير المقطعي لتصوير جزيئي دقيق.',
  },
  'Panoramique Dentaire': {
    name_ar: 'الأشعة البانورامية للأسنان',
    description_ar: 'تصوير بانورامي رقمي للأسنان.',
  },
  "Laboratoire d'Analyse": {
    name_ar: 'مخبر التحاليل',
    description_ar: 'مخبر تحاليل طبية حديث مجهز بأحدث التقنيات.',
  },
}

/* ========================================================================== */
/*  7. PHOTOS DES INSTALLATIONS (par _id)                                     */
/* ========================================================================== */

const FACILITY_AR = {
  'facility-eq-01': ['قاعة الفحص النسائي', 'طاولة فحص وجهاز صدى مخصصان لمتابعة صحة المرأة.'],
  'facility-eq-02': ['غاما كاميرا – التصوير الومضاني', 'الطب النووي: استكشاف وظيفي للأعضاء بالتصوير النظائري.'],
  'facility-eq-03': ['سكانير Siemens SOMATOM go.Top', 'سكانير عالي الدقة لصور مقطعية فائقة الدقة في ثوانٍ معدودة.'],
  'facility-eq-04': ['السكانير – منظر القاعة', 'قاعة سكانير واسعة ومطابقة تماماً لمعايير الحماية من الإشعاع.'],
  'facility-eq-05': ['غرفة الاستشفاء', 'أسرّة طبية وفضاء مفعم بالضوء الطبيعي.'],
  'facility-eq-06': ['غرفة مريحة', 'تجهيزات طبية كاملة لإقامة هادئة.'],
  'facility-eq-07': ['قاعة المراقبة', 'أسرّة علاجية ونقطة متابعة لصيقة للمرضى.'],
  'facility-eq-08': ['الطب النووي', 'كاشفات مزدوجة الرأس لغاما كاميرا للتصوير الومضاني.'],
  'facility-eq-09': ['غرفة العمليات', 'طاولة جراحية وأذرع سقفية وإضاءة جراحية عالية الدقة.'],
  'facility-eq-10': ['غرفة العمليات', 'إضاءة جراحية LED وأسطح سهلة التعقيم.'],
  'facility-eq-11': ['قاعة العمليات', 'قاعة مطابقة لمعايير التعقيم، مجهزة للجراحة المتخصصة.'],
  'facility-eq-12': ['غرفة العمليات – المنصة التقنية', 'أذرع توزيع السوائل الطبية والأعمدة الجراحية.'],
  'facility-eq-13': ['قاعة جراحية', 'فضاء مخصص للعمليات، بتهوية ونظافة محكمتين.'],
  'facility-eq-14': ['غرفة الاستشفاء', 'راحة ونظافة وإضاءة في خدمة استراحة المريض.'],
  'facility-eq-15': ['غرفة المريض', 'أسرّة طبية حديثة في إطار مريح.'],
  'facility-eq-16': ['غرفة مزدوجة', 'تهيئة متوازنة لراحة مريضين.'],
  'facility-eq-17': ['قاعة الاستشارة', 'فضاء للحوار مع الطبيب وطاولة فحص.'],
  'facility-eq-18': ['البهو والمصعد', 'تنقل سلس وميسّر بين المصالح.'],
  'facility-eq-19': ['غرفة جماعية', 'أسرّة قابلة للتعديل وطاولات جانبية لكل مريض.'],
  'facility-eq-20': ['قاعة الاستشفاء', 'فضاء نظيف وواسع وسهل الوصول للطاقم.'],
  'facility-eq-21': ['العيادة الطبية', 'عيادة استشارة حديثة ومرحّبة.'],
  'facility-eq-22': ['غرفة مضيئة', 'فتحات كبيرة وتشطيبات متقنة.'],
  'facility-eq-23': ['جهاز Alegria الآلي', 'محلّل مناعي بشاشة لمسية للتحاليل الدموية.'],
  'facility-eq-24': ['استقبال المخبر', 'استقبال مخصص للتحاليل، واضح وسهل الوصول.'],
  'facility-eq-25': ['طاولات العمل التقنية', 'مناصب عمل مريحة ومضيئة لأخصائيي البيولوجيا.'],
  'facility-eq-26': ['جهاز الكيمياء الحيوية الآلي', 'معالجة العينات تحت مراقبة معلوماتية دائمة.'],
  'facility-eq-27': ['مخبر التحاليل', 'منصة تحاليل طبية مؤتمتة لنتائج موثوقة وسريعة.'],
  'facility-eq-28': ['قاعة أخذ العينات', 'استقبال مريح للمرضى لسحب الدم.'],
  'facility-eq-29': ['قاعة التصوير بالصدى', 'جهاز صدى عالي الأداء للتصوير الفوري.'],
  'facility-eq-30': ['القاعة التقنية', 'فضاء تحليل منظم لتدفق أمثل للعينات.'],
  'facility-eq-31': ['السكانير – قاعة الفحص', 'محيط مضيء مصمم لراحة المريض.'],
  'facility-eq-32': ['الرنين المغناطيسي – قاعة التحكم', 'منصة قيادة وإعادة بناء صور الرنين المغناطيسي.'],
  'facility-eq-33': ['الرنين المغناطيسي Siemens', 'تصوير بالرنين المغناطيسي في محيط مريح (سقف بانورامي).'],
  'facility-eq-34': ['الاستقبال الرئيسي', 'بهو واسع ومضيء لتوجيهكم فور الوصول.'],
  'facility-eq-35': ['جهاز تصوير الثدي الرقمي', 'كشف وتشخيص أمراض الثدي بمستوى إشعاع منخفض.'],
  'facility-eq-36': ['عيادة الاستشارة', 'محيط واضح مصمم لراحة الحوار.'],
  'facility-eq-37': ['الرنين المغناطيسي – نقطة المراقبة', 'الإشراف على الفحص من القاعة التقنية الزجاجية.'],
  'facility-eq-38': ['استقبال طب الأطفال', 'فضاء ملوّن ومطمئن مصمم للأطفال.'],
  'facility-eq-39': ['فضاء الانتظار', 'قاعات انتظار مريحة موزعة على كل طابق.'],
  'facility-eq-40': ['قاعة الأشعة', 'تصوير شعاعي رقمي للعظام والصدر والفحوصات الشائعة.'],
  'facility-eq-41': ['وحدة العلاج', 'قاعة مراقبة مع عربة طوارئ ومنصب تمريض.'],
  'facility-eq-42': ['قاعة الفحص', 'فضاء فحص مجهز يحفظ خصوصية المريض.'],
  'facility-eq-43': ['لاقط الأشعة الرقمية', 'أنبوب ولاقط مسطح ديناميكي لصور واضحة وفورية.'],
}

/* ========================================================================== */
/*  8. FAQ (création — aucun document n'existe)                               */
/* ========================================================================== */

const FAQ_DOCS = [
  {
    _id: 'faq-rdv',
    question: 'Comment prendre rendez-vous à la Clinique OKBA ?',
    question_ar: 'كيف يمكن حجز موعد في المصحة الطبية عقبة؟',
    answer:
      'Vous pouvez prendre rendez-vous par téléphone, via WhatsApp ou directement à l’accueil de la clinique. Le bouton « Prendre rendez-vous » vous met en relation immédiate avec notre secrétariat.',
    answer_ar:
      'يمكنكم حجز موعد عبر الهاتف أو واتساب أو مباشرة في استقبال المصحة. زر « حجز موعد » يضعكم في اتصال فوري مع أمانتنا.',
    category: 'appointment',
    order: 1,
  },
  {
    _id: 'faq-urgences',
    question: 'Les urgences sont-elles ouvertes 24h/24 ?',
    question_ar: 'هل قسم الطوارئ مفتوح على مدار الساعة؟',
    answer:
      'Oui. Notre service d’urgences accueille les patients 24h/24 et 7j/7. En cas d’urgence vitale, appelez-nous directement ou présentez-vous sur place.',
    answer_ar:
      'نعم. يستقبل قسم الطوارئ المرضى على مدار الساعة طوال أيام الأسبوع. في الحالات الطارئة، اتصلوا بنا مباشرة أو توجهوا إلى المصحة.',
    category: 'emergency',
    order: 2,
  },
  {
    _id: 'faq-paiement',
    question: 'Quels sont les moyens de paiement acceptés ?',
    question_ar: 'ما هي وسائل الدفع المقبولة؟',
    answer:
      'Le paiement s’effectue à l’accueil. Si vous relevez d’un organisme conventionné avec la clinique, une prise en charge peut s’appliquer. Renseignez-vous auprès de notre équipe administrative.',
    answer_ar:
      'يتم الدفع في الاستقبال. إذا كنتم تابعين لهيئة متعاقدة مع المصحة، يمكن تطبيق التكفل. استفسروا لدى فريقنا الإداري.',
    category: 'payment',
    order: 3,
  },
  {
    _id: 'faq-examens',
    question: 'Dois-je être à jeun pour mes examens ?',
    question_ar: 'هل يجب أن أكون صائماً قبل الفحوصات؟',
    answer:
      'Cela dépend de l’examen prescrit (bilan sanguin, imagerie…). Les consignes de préparation vous sont communiquées lors de la prise de rendez-vous.',
    answer_ar:
      'يعتمد ذلك على الفحص الموصوف (تحاليل الدم، التصوير…). تُبلَّغون بتعليمات التحضير عند حجز الموعد.',
    category: 'exams',
    order: 4,
  },
  {
    _id: 'faq-horaires',
    question: 'Quels sont les horaires de consultation ?',
    question_ar: 'ما هي مواعيد الاستشارات؟',
    answer:
      'Les consultations ont lieu du samedi au jeudi, de 08h00 à 18h00. Le vendredi, seules les urgences sont assurées.',
    answer_ar:
      'تُجرى الاستشارات من السبت إلى الخميس، من الساعة 08:00 إلى 18:00. يوم الجمعة، تُؤمَّن خدمة الطوارئ فقط.',
    category: 'general',
    order: 5,
  },
]

/* ========================================================================== */
/*  9. SECTION CONVENTIONS / ASSURANCES (création — singleton)                */
/* ========================================================================== */

const INSURANCE_PROVIDERS = [
  {
    name: 'SEACO',
    name_ar: 'سياكو',
    description: "Société de l'Eau et de l'Assainissement de Constantine.",
    description_ar: 'شركة المياه والتطهير بقسنطينة.',
    logo: 'public/images/conventions/seaco.png',
  },
  {
    name: 'ENSB',
    name_ar: 'المدرسة الوطنية العليا للبيوتكنولوجيا',
    description: 'École Nationale Supérieure de Biotechnologie.',
    description_ar: 'المدرسة الوطنية العليا للبيوتكنولوجيا.',
    logo: 'public/images/conventions/ensb.png',
  },
  {
    name: 'Promotion Dambri Saddek',
    name_ar: 'ترقية دمبري صادق',
    description: 'Acquéreurs de la promotion Dambri Saddek.',
    description_ar: 'المستفيدون من ترقية دمبري صادق.',
    logo: 'public/images/conventions/dambri.png',
  },
  {
    name: 'Association Oncologica',
    name_ar: 'جمعية أونكولوجيكا',
    description: "Association Oncologica Constantine pour l'aide des cancéreux.",
    description_ar: 'جمعية أونكولوجيكا قسنطينة لمساعدة مرضى السرطان.',
    logo: 'public/images/conventions/oncologica.png',
  },
]

/* ========================================================================== */
/*  Exécution                                                                 */
/* ========================================================================== */

async function uploadImage(relPath) {
  const abs = join(root, relPath)
  if (!existsSync(abs)) {
    console.warn(`   ⚠ logo introuvable : ${relPath} (ignoré)`)
    return undefined
  }
  const asset = await client.assets.upload('image', createReadStream(abs), {
    filename: basename(abs),
  })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function main() {
  let tx = client.transaction()

  // 1. Médecins
  for (const [id, fields] of Object.entries(DOCTORS_AR)) tx = tx.patch(id, { set: fields })
  // 2. Témoignages
  for (const [id, fields] of Object.entries(TESTIMONIALS_AR)) tx = tx.patch(id, { set: fields })
  // 3. Paramètres du site
  tx = tx.patch('siteSettings', { set: SITE_SETTINGS_AR })
  // 4. Contenus de section
  for (const [id, fields] of Object.entries(SECTION_CONTENT_AR)) tx = tx.patch(id, { set: fields })
  // 5. Pied de page
  tx = tx.patch('footerContent', { set: FOOTER_AR })
  // 7. Photos installations
  for (const [id, [title_ar, description_ar]] of Object.entries(FACILITY_AR))
    tx = tx.patch(id, { set: { title_ar, description_ar } })

  console.log('⏳ Patch des documents existants (doctors, testimonials, settings, sections, footer, photos)…')
  await tx.commit()
  console.log('✅ Documents existants mis à jour.')

  // 6. Équipements (ids non déterministes → patch individuel par nom)
  console.log('⏳ Équipements…')
  const equipments = await client.fetch('*[_type == "equipment"]{_id, name}')
  for (const eq of equipments) {
    const tr = EQUIPMENT_AR[eq.name]
    if (tr) {
      await client.patch(eq._id).set(tr).commit()
      console.log(`   ✓ ${eq.name} → ${tr.name_ar}`)
    } else {
      console.warn(`   ⚠ pas de traduction pour « ${eq.name} »`)
    }
  }

  // 8. FAQ
  console.log('⏳ FAQ…')
  for (const faq of FAQ_DOCS) {
    await client.createOrReplace({ _type: 'faq', active: true, ...faq })
    console.log(`   ✓ ${faq._id}`)
  }

  // 9. Conventions / assurances
  console.log('⏳ Section conventions (upload des logos)…')
  const providers = []
  for (const p of INSURANCE_PROVIDERS) {
    const logo = await uploadImage(p.logo)
    providers.push({
      _key: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: p.name,
      name_ar: p.name_ar,
      description: p.description,
      description_ar: p.description_ar,
      ...(logo ? { logo } : {}),
    })
  }
  await client.createOrReplace({
    _id: 'insuranceSection',
    _type: 'insuranceSection',
    active: true,
    badge: 'Prise en charge',
    badge_ar: 'التكفل الطبي',
    title: 'Conventions & Partenaires',
    title_ar: 'الاتفاقيات والشركاء',
    subtitle:
      "La Clinique OKBA est fière de collaborer avec ses partenaires pour vous faciliter l'accès aux soins.",
    subtitle_ar:
      'تفتخر المصحة الطبية عقبة بالتعاون مع شركائها لتسهيل حصولكم على الرعاية الطبية.',
    providers,
    note: "Pour toute information supplémentaire concernant nos conventions, n'hésitez pas à nous contacter.",
    note_ar: 'لمزيد من المعلومات حول اتفاقياتنا، لا تترددوا في الاتصال بنا.',
    ctaText: 'Nous contacter',
    ctaText_ar: 'اتصل بنا',
  })
  console.log('   ✓ insuranceSection')

  console.log('\n🎉 Synchronisation arabe terminée.')
}

main().catch((e) => {
  console.error('❌', e.message)
  process.exit(1)
})
