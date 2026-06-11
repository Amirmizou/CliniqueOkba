import fs from 'fs';

const facilityAr = {
  'eq-01': ['قاعة الفحص النسائي', 'طاولة فحص وجهاز صدى مخصصان لمتابعة صحة المرأة.'],
  'eq-02': ['غاما كاميرا – التصوير الومضاني', 'الطب النووي: استكشاف وظيفي للأعضاء بالتصوير النظائري.'],
  'eq-03': ['سكانير Siemens SOMATOM go.Top', 'سكانير عالي الدقة لصور مقطعية فائقة الدقة في ثوانٍ معدودة.'],
  'eq-04': ['السكانير – منظر القاعة', 'قاعة سكانير واسعة ومطابقة تماماً لمعايير الحماية من الإشعاع.'],
  'eq-05': ['غرفة الاستشفاء', 'أسرّة طبية وفضاء مفعم بالضوء الطبيعي.'],
  'eq-06': ['غرفة مريحة', 'تجهيزات طبية كاملة لإقامة هادئة.'],
  'eq-07': ['قاعة المراقبة', 'أسرّة علاجية ونقطة متابعة لصيقة للمرضى.'],
  'eq-08': ['الطب النووي', 'كاشفات مزدوجة الرأس لغاما كاميرا للتصوير الومضاني.'],
  'eq-09': ['غرفة العمليات', 'طاولة جراحية وأذرع سقفية وإضاءة جراحية عالية الدقة.'],
  'eq-10': ['غرفة العمليات', 'إضاءة جراحية LED وأسطح سهلة التعقيم.'],
  'eq-11': ['قاعة العمليات', 'قاعة مطابقة لمعايير التعقيم، مجهزة للجراحة المتخصصة.'],
  'eq-12': ['غرفة العمليات – المنصة التقنية', 'أذرع توزيع السوائل الطبية والأعمدة الجراحية.'],
  'eq-13': ['قاعة جراحية', 'فضاء مخصص للعمليات، بتهوية ونظافة محكمتين.'],
  'eq-14': ['غرفة الاستشفاء', 'راحة ونظافة وإضاءة في خدمة استراحة المريض.'],
  'eq-15': ['غرفة المريض', 'أسرّة طبية حديثة في إطار مريح.'],
  'eq-16': ['غرفة مزدوجة', 'تهيئة متوازنة لراحة مريضين.'],
  'eq-17': ['قاعة الاستشارة', 'فضاء للحوار مع الطبيب وطاولة فحص.'],
  'eq-18': ['البهو والمصعد', 'تنقل سلس وميسّر بين المصالح.'],
  'eq-19': ['غرفة جماعية', 'أسرّة قابلة للتعديل وطاولات جانبية لكل مريض.'],
  'eq-20': ['قاعة الاستشفاء', 'فضاء نظيف وواسع وسهل الوصول للطاقم.'],
  'eq-21': ['العيادة الطبية', 'عيادة استشارة حديثة ومرحّبة.'],
  'eq-22': ['غرفة مضيئة', 'فتحات كبيرة وتشطيبات متقنة.'],
  'eq-23': ['جهاز Alegria الآلي', 'محلّل مناعي بشاشة لمسية للتحاليل الدموية.'],
  'eq-24': ['استقبال المخبر', 'استقبال مخصص للتحاليل، واضح وسهل الوصول.'],
  'eq-25': ['طاولات العمل التقنية', 'مناصب عمل مريحة ومضيئة لأخصائيي البيولوجيا.'],
  'eq-26': ['جهاز الكيمياء الحيوية الآلي', 'معالجة العينات تحت مراقبة معلوماتية دائمة.'],
  'eq-27': ['مخبر التحاليل', 'منصة تحاليل طبية مؤتمتة لنتائج موثوقة وسريعة.'],
  'eq-28': ['قاعة أخذ العينات', 'استقبال مريح للمرضى لسحب الدم.'],
  'eq-29': ['قاعة التصوير بالصدى', 'جهاز صدى عالي الأداء للتصوير الفوري.'],
  'eq-30': ['القاعة التقنية', 'فضاء تحليل منظم لتدفق أمثل للعينات.'],
  'eq-31': ['السكانير – قاعة الفحص', 'محيط مضيء مصمم لراحة المريض.'],
  'eq-32': ['الرنين المغناطيسي – قاعة التحكم', 'منصة قيادة وإعادة بناء صور الرنين المغناطيسي.'],
  'eq-33': ['الرنين المغناطيسي Siemens', 'تصوير بالرنين المغناطيسي في محيط مريح (سقف بانورامي).'],
  'eq-34': ['الاستقبال الرئيسي', 'بهو واسع ومضيء لتوجيهكم فور الوصول.'],
  'eq-35': ['جهاز تصوير الثدي الرقمي', 'كشف وتشخيص أمراض الثدي بمستوى إشعاع منخفض.'],
  'eq-36': ['عيادة الاستشارة', 'محيط واضح مصمم لراحة الحوار.'],
  'eq-37': ['الرنين المغناطيسي – نقطة المراقبة', 'الإشراف على الفحص من القاعة التقنية الزجاجية.'],
  'eq-38': ['استقبال طب الأطفال', 'فضاء ملوّن ومطمئن مصمم للأطفال.'],
  'eq-39': ['فضاء الانتظار', 'قاعات انتظار مريحة موزعة على كل طابق.'],
  'eq-40': ['قاعة الأشعة', 'تصوير شعاعي رقمي للعظام والصدر والفحوصات الشائعة.'],
  'eq-41': ['وحدة العلاج', 'قاعة مراقبة مع عربة طوارئ ومنصب تمريض.'],
  'eq-42': ['قاعة الفحص', 'فضاء فحص مجهز يحفظ خصوصية المريض.'],
  'eq-43': ['لاقط الأشعة الرقمية', 'أنبوب ولاقط مسطح ديناميكي لصور واضحة وفورية.'],
};

let code = fs.readFileSync('data/equipements.ts', 'utf8');

for (const [id, [title_ar, description_ar]] of Object.entries(facilityAr)) {
  const regexTitle = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?title_ar:\\s*').*?(')`);
  code = code.replace(regexTitle, `$1${title_ar}$2`);
  const regexDesc = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?description_ar:\\s*').*?(')`);
  code = code.replace(regexDesc, `$1${description_ar}$2`);
}

const catAr = {
  'imagerie': ['التصوير الطبي', 'سكانير، رنين مغناطيسي، تصوير الثدي وأشعة رقمية'],
  'nucleaire': ['الطب النووي', 'سكانير SPECT/CT Siemens وتصوير ومضاني'],
  'bloc': ['غرفة العمليات', 'غرف عمليات مطابقة للمعايير ومجهزة للجراحة'],
  'laboratoire': ['مخبر التحاليل', 'أجهزة آلية حديثة وعينات دم'],
  'hospitalisation': ['الاستشفاء', 'غرف مريحة ووحدات علاج'],
  'consultation': ['الاستشارة والفحص', 'عيادات، تصوير بالصدى وغرف فحص'],
  'accueil': ['مساحات الاستقبال', 'استقبال، انتظار وممرات مضيئة'],
};

for (const [id, [label_ar, tagline_ar]] of Object.entries(catAr)) {
  const regexLabel = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?label_ar:\\s*').*?(')`);
  code = code.replace(regexLabel, `$1${label_ar}$2`);
  const regexTagline = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?tagline_ar:\\s*').*?(')`);
  code = code.replace(regexTagline, `$1${tagline_ar}$2`);
}

fs.writeFileSync('data/equipements.ts', code);
console.log('Fixed equipements.ts');

const insuranceCode = `// Données de repli pour la section « Conventions & Prise en charge ».
// Le contenu réel doit être édité dans Sanity Studio (schéma insuranceSection) ;
// ces valeurs ne s'affichent que tant que la section n'est pas renseignée.

export interface InsuranceProvider {
  name: string
  name_ar?: string
  description: string
  description_ar?: string
  logo?: string | any
}

export interface InsuranceContent {
  badge: string
  badge_ar?: string
  title: string
  title_ar?: string
  subtitle: string
  subtitle_ar?: string
  providers: InsuranceProvider[]
  note: string
  note_ar?: string
  ctaText: string
  ctaText_ar?: string
}

export const insuranceFallback: InsuranceContent = {
  badge: 'Prise en charge',
  badge_ar: 'التكفل الطبي',
  title: 'Conventions & Partenaires',
  title_ar: 'الاتفاقيات والشركاء',
  subtitle:
    'La Clinique OKBA est fière de collaborer avec ses partenaires pour vous faciliter l\\'accès aux soins.',
  subtitle_ar: 'تفتخر المصحة الطبية عقبة بالتعاون مع شركائها لتسهيل حصولكم على الرعاية الطبية.',
  providers: [
    {
      name: 'SEACO',
      name_ar: 'سياكو',
      description: 'Société de l\\'Eau et de l\\'Assainissement de Constantine.',
      description_ar: 'شركة المياه والتطهير بقسنطينة.',
      logo: '/images/conventions/seaco.png'
    },
    {
      name: 'ENSB',
      name_ar: 'المدرسة الوطنية العليا للبيوتكنولوجيا',
      description: 'École Nationale Supérieure de Biotechnologie.',
      description_ar: 'المدرسة الوطنية العليا للبيوتكنولوجيا.',
      logo: '/images/conventions/ensb.png'
    },
    {
      name: 'Promotion Dambri Saddek',
      name_ar: 'ترقية دمبري صادق',
      description: 'Acquéreurs de la promotion Dambri Saddek.',
      description_ar: 'المستفيدون من ترقية دمبري صادق.',
      logo: '/images/conventions/dambri.png'
    },
    {
      name: 'Association Oncologica',
      name_ar: 'جمعية أونكولوجيكا',
      description: 'Association Oncologica Constantine pour l\\'aide des cancéreux.',
      description_ar: 'جمعية أونكولوجيكا قسنطينة لمساعدة مرضى السرطان.',
      logo: '/images/conventions/oncologica.png'
    },
  ],
  note: 'Pour toute information supplémentaire concernant nos conventions, n\\'hésitez pas à nous contacter.',
  note_ar: 'لمزيد من المعلومات حول اتفاقياتنا، لا تترددوا في الاتصال بنا.',
  ctaText: 'Nous contacter',
  ctaText_ar: 'اتصل بنا',
}
`;
fs.writeFileSync('data/insurance.ts', insuranceCode);
console.log('Fixed insurance.ts');
