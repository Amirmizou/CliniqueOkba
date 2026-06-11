import fs from 'fs';

let content = fs.readFileSync('data/poles.ts', 'utf-8');

const translations = {
  'Imagerie médicale de pointe': 'التصوير الطبي المتقدم',
  'Un plateau d’imagerie complet pour des diagnostics rapides et précis.': 'منصة تصوير طبي متكاملة لتشخيص سريع ودقيق.',
  'Notre service d’imagerie réunit scanner, IRM, mammographie, radiologie numérique et échographie. Des équipements de dernière génération, au service d’un diagnostic fiable et rapide.': 'يضم قسم التصوير لدينا أجهزة المسح المقطعي، الرنين المغناطيسي، الماموجرام، والأشعة الرقمية والموجات الصوتية. أجهزة من الجيل الأحدث لضمان تشخيص دقيق وسريع.',

  'Médecine nucléaire': 'الطب النووي',
  'Un pôle d’excellence équipé du SPECT/CT Siemens Symbia Pro.specta pour une imagerie fonctionnelle de haute précision.': 'مركز تميز مجهز بجهاز SPECT/CT Siemens Symbia Pro.specta لتصوير وظيفي عالي الدقة.',
  'Notre pôle de médecine nucléaire s’appuie sur le SPECT/CT Siemens Symbia Pro.specta, une caméra hybride de dernière génération qui associe la scintigraphie (SPECT) au scanner (CT). En un seul examen, elle conjugue imagerie fonctionnelle et anatomique pour localiser et caractériser les anomalies avec une précision exceptionnelle : os, cœur, thyroïde, reins et bien plus encore.': 'يعتمد قسم الطب النووي لدينا على جهاز SPECT/CT Siemens Symbia Pro.specta، وهو كاميرا هجينة من الجيل الأحدث تجمع بين التصوير الومضاني والمسح المقطعي. في فحص واحد، يجمع بين التصوير الوظيفي والتشريحي لتحديد وتوصيف التشوهات بدقة استثنائية.',

  'Pôle dentaire': 'طب الأسنان',
  'Toutes les spécialités dentaires réunies sous un même toit.': 'جميع تخصصات طب الأسنان مجتمعة تحت سقف واحد.',
  'Un pôle dentaire complet : consultation, chirurgie, orthodontie dento-faciale (ODF) et prothèse dentaire, pour prendre en charge tous vos besoins bucco-dentaires.': 'مركز شامل لطب الأسنان: استشارات، جراحة، تقويم الأسنان والوجه والفكين، وتركيبات الأسنان، لتلبية جميع احتياجاتك لصحة الفم.',

  'Consultations spécialisées': 'الاستشارات المتخصصة',
  'Des médecins spécialistes à votre écoute pour un suivi personnalisé.': 'أطباء أخصائيون في الاستماع إليك لمتابعة شخصية.',
  'Nos médecins spécialistes vous reçoivent dans des cabinets modernes et équipés : gynécologie-obstétrique, endocrinologie, pédiatrie, médecine interne et ORL.': 'يستقبلك أطباؤنا الأخصائيون في عيادات حديثة ومجهزة: أمراض النساء والتوليد، الغدد الصماء، طب الأطفال، الطب الباطني، وأمراض الأنف والأذن والحنجرة.',

  'Urgences 24h/24': 'طوارئ 24/24',
  'Une équipe médicale de garde, disponible jour et nuit, 7j/7.': 'فريق طبي مناوب متاح ليلاً ونهاراً طوال أيام الأسبوع.',
  'Un service d’urgences ouvert 24h/24 et 7j/7. Une équipe de garde vous accueille et vous prend en charge sans délai, à toute heure.': 'خدمة طوارئ مفتوحة 24/24 و 7/7. يستقبلك فريق طبي مناوب ويعتني بك دون تأخير في أي وقت.',

  'Laboratoire d’analyses médicales': 'مختبر التحاليل الطبية',
  'Analyses biologiques fiables grâce à des automates de dernière génération.': 'تحاليل بيولوجية موثوقة بفضل أجهزة أوتوماتيكية حديثة.',
  'Notre laboratoire d’analyses médicales réalise vos bilans sanguins et prélèvements sur des automates de dernière génération, pour des résultats fiables et rapides.': 'يقوم مختبرنا الطبي بإجراء فحوصات الدم والعينات باستخدام أجهزة أوتوماتيكية من الجيل الأحدث للحصول على نتائج دقيقة وسريعة.',

  'Chirurgie spécialisée': 'الجراحة المتخصصة',
  'Bloc opératoire aux normes pour la chirurgie ophtalmologique et ORL.': 'غرفة عمليات مطابقة للمعايير لجراحة العيون والأنف والأذن والحنجرة.',
  'Nos blocs opératoires aux normes accueillent la chirurgie ophtalmologique et ORL, dans des conditions d’asepsie et de sécurité optimales.': 'تستقبل غرف العمليات لدينا جراحة العيون والأنف والأذن والحنجرة في ظروف تعقيم وسلامة مثالية.'
};

for (const [fr, ar] of Object.entries(translations)) {
  const safeFr = fr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  content = content.replace(new RegExp('title:\\s*([\'"`])' + safeFr + '\\1', 'g'), \`title: '\${fr}',\\n    title_ar: '\${ar}'\`);
  content = content.replace(new RegExp('description:\\s*([\'"`])' + safeFr + '\\1', 'g'), \`description: '\${fr}',\\n    description_ar: '\${ar}'\`);
  content = content.replace(new RegExp('intro:\\s*([\'"`])' + safeFr + '\\1', 'g'), \`intro: '\${fr}',\\n    intro_ar: '\${ar}'\`);
}

fs.writeFileSync('data/poles.ts', content);
console.log('Updated poles.ts with Arabic translations');
