// Données de repli pour la FAQ (teaser accueil + page /faq).
// Le contenu réel est géré dans Sanity Studio (schéma faq) ; ces entrées
// ne s'affichent que tant qu'aucune FAQ n'a été publiée.

export interface FaqItem {
  _id: string
  question: string
  answer: string
  category: string
}

export const faqFallback: FaqItem[] = [
  {
    _id: 'fallback-rdv',
    question: 'Comment prendre rendez-vous à la Clinique OKBA ?',
    answer:
      'Vous pouvez prendre rendez-vous par téléphone, via WhatsApp ou directement à l’accueil de la clinique. Le bouton « Prendre rendez-vous » vous met en relation immédiate avec notre secrétariat.',
    category: 'appointment',
  },
  {
    _id: 'fallback-urgences',
    question: 'Les urgences sont-elles ouvertes 24h/24 ?',
    answer:
      'Oui. Notre service d’urgences accueille les patients 24h/24 et 7j/7. En cas d’urgence vitale, appelez-nous directement ou présentez-vous sur place.',
    category: 'emergency',
  },
  {
    _id: 'fallback-paiement',
    question: 'Quels sont les moyens de paiement acceptés ?',
    answer:
      'Le paiement s’effectue à l’accueil. Selon votre situation, une prise en charge CNAS / CASNOS peut s’appliquer. Renseignez-vous auprès de notre équipe administrative.',
    category: 'payment',
  },
  {
    _id: 'fallback-examens',
    question: 'Dois-je être à jeun pour mes examens ?',
    answer:
      'Cela dépend de l’examen prescrit (bilan sanguin, imagerie…). Les consignes de préparation vous sont communiquées lors de la prise de rendez-vous.',
    category: 'exams',
  },
  {
    _id: 'fallback-horaires',
    question: 'Quels sont les horaires de consultation ?',
    answer:
      'Les consultations ont lieu du samedi au jeudi, de 08h00 à 18h00. Le vendredi, seules les urgences sont assurées.',
    category: 'general',
  },
]
