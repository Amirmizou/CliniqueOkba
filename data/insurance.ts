// Données de repli pour la section « Conventions & Prise en charge ».
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
    'La Clinique OKBA est fière de collaborer avec ses partenaires pour vous faciliter l\'accès aux soins.',
  subtitle_ar: 'تفتخر المصحة الطبية عقبة بالتعاون مع شركائها لتسهيل حصولكم على الرعاية الطبية.',
  providers: [
    {
      name: 'SEACO',
      name_ar: 'سياكو',
      description: 'Société de l\'Eau et de l\'Assainissement de Constantine.',
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
      description: 'Association Oncologica Constantine pour l\'aide des cancéreux.',
      description_ar: 'جمعية أونكولوجيكا قسنطينة لمساعدة مرضى السرطان.',
      logo: '/images/conventions/oncologica.png'
    },
  ],
  note: 'Pour toute information supplémentaire concernant nos conventions, n\'hésitez pas à nous contacter.',
  note_ar: 'لمزيد من المعلومات حول اتفاقياتنا، لا تترددوا في الاتصال بنا.',
  ctaText: 'Nous contacter',
  ctaText_ar: 'اتصل بنا',
}
