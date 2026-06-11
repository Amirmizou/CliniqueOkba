// Données de repli pour la FAQ (teaser accueil + page /faq).
// Le contenu réel est géré dans Sanity Studio (schéma faq) ; ces entrées
// ne s'affichent que tant qu'aucune FAQ n'a été publiée.

export interface FaqItem {
  _id: string
  question: string
  question_ar?: string
  answer: string
  answer_ar?: string
  category: string
}

export const faqFallback: FaqItem[] = [
  {
    _id: 'fallback-rdv',
    question: 'Comment prendre rendez-vous à la Clinique OKBA ?',
    question_ar: 'كيف يمكن حجز موعد في المصحة الطبية عقبة؟',
    answer: 'Vous pouvez prendre rendez-vous par téléphone, via WhatsApp ou directement à l’accueil de la clinique. Le bouton « Prendre rendez-vous » vous met en relation immédiate avec notre secrétariat.',
    answer_ar: 'يمكنكم حجز موعد عبر الهاتف أو واتساب أو مباشرة في استقبال المصحة. زر « حجز موعد » يضعكم في اتصال فوري مع أمانتنا.',
    category: 'appointment',
  },
  {
    _id: 'fallback-urgences',
    question: 'Les urgences sont-elles ouvertes 24h/24 ?',
    question_ar: 'هل قسم الطوارئ مفتوح على مدار الساعة؟',
    answer: 'Oui. Notre service d’urgences accueille les patients 24h/24 et 7j/7. En cas d’urgence vitale, appelez-nous directement ou présentez-vous sur place.',
    answer_ar: 'نعم. يستقبل قسم الطوارئ المرضى على مدار الساعة طوال أيام الأسبوع. في الحالات الطارئة، اتصلوا بنا مباشرة أو توجهوا إلى المصحة.',
    category: 'emergency',
  },
  {
    _id: 'fallback-paiement',
    question: 'Quels sont les moyens de paiement acceptés ?',
    question_ar: 'ما هي وسائل الدفع المقبولة؟',
    answer: 'Le paiement s’effectue à l’accueil. Selon votre situation, une prise en charge CNAS / CASNOS peut s’appliquer. Renseignez-vous auprès de notre équipe administrative.',
    answer_ar: 'يتم الدفع في الاستقبال. حسب وضعيتكم، يمكن تطبيق التكفل عبر CNAS / CASNOS. استفسروا لدى فريقنا الإداري.',
    category: 'payment',
  },
  {
    _id: 'fallback-examens',
    question: 'Dois-je être à jeun pour mes examens ?',
    question_ar: 'هل يجب أن أكون صائماً قبل الفحوصات؟',
    answer: 'Cela dépend de l’examen prescrit (bilan sanguin, imagerie…). Les consignes de préparation vous sont communiquées lors de la prise de rendez-vous.',
    answer_ar: 'يعتمد ذلك على الفحص الموصوف (تحاليل الدم، التصوير…). تُبلَّغون بتعليمات التحضير عند حجز الموعد.',
    category: 'exams',
  },
  {
    _id: 'fallback-horaires',
    question: 'Quels sont les horaires de consultation ?',
    question_ar: 'ما هي مواعيد الاستشارات؟',
    answer: 'Les consultations ont lieu du samedi au jeudi, de 08h00 à 18h00. Le vendredi, seules les urgences sont assurées.',
    answer_ar: 'تُجرى الاستشارات من السبت إلى الخميس، من الساعة 08:00 إلى 18:00. يوم الجمعة، تُؤمَّن خدمة الطوارئ فقط.',
    category: 'general',
  },
]
