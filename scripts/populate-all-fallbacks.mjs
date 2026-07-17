import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-03-20',
})

async function run() {
  console.log('Populating aboutSection...')
  const about = await client.fetch(`*[_type == "aboutSection"][0]`)
  if (about) {
    const statsFallback = [
      { _key: 'stat1', value: '24/7', label: 'Urgences disponibles' },
      { _key: 'stat2', value: '30+', label: 'Médecins spécialistes' },
      { _key: 'stat3', value: '11', label: 'Spécialités médicales' },
    ]
    const statsArFallback = [
      { _key: 'stat1', value: '24/7', label: 'طوارئ متاحة' },
      { _key: 'stat2', value: '30+', label: 'أطباء أخصائيون' },
      { _key: 'stat3', value: '11', label: 'تخصصات طبية' },
    ]
    const valuesFallback = [
      { _key: 'val1', title: 'Équipement de pointe', description: 'Technologie médicale dernière génération pour des diagnostics précis.', icon: 'Check' },
      { _key: 'val2', title: 'Équipe experte', description: 'Des spécialistes reconnus et dévoués à votre santé.', icon: 'Check' },
      { _key: 'val3', title: 'Soins personnalisés', description: 'Une approche humaine et sur-mesure pour chaque patient.', icon: 'Check' }
    ]
    const valuesArFallback = [
      { _key: 'val1', title: 'معدات متطورة', description: 'أحدث التقنيات الطبية لتشخيص دقيق.', icon: 'Check' },
      { _key: 'val2', title: 'فريق خبير', description: 'أخصائيون معترف بهم ومكرسون لصحتك.', icon: 'Check' },
      { _key: 'val3', title: 'رعاية مخصصة', description: 'نهج إنساني ومخصص لكل مريض.', icon: 'Check' }
    ]

    await client.patch(about._id).setIfMissing({
      stats: statsFallback,
      stats_ar: statsArFallback,
      values: valuesFallback,
      values_ar: valuesArFallback,
    }).commit()
    console.log('aboutSection populated')
  }

  console.log('Populating homeCare...')
  const homeCare = await client.fetch(`*[_type == "homeCare"][0]`)
  if (homeCare) {
    await client.patch(homeCare._id).setIfMissing({
      badge: 'Service dédié',
      badge_ar: 'خدمة مخصصة',
      title: 'Soins à domicile',
      title_ar: 'الرعاية المنزلية',
      subtitle: 'Une équipe mobile pour des soins médicaux de qualité, chez vous, en toute sécurité.',
      subtitle_ar: 'فريق متنقل لرعاية طبية عالية الجودة في منزلك بكل أمان.',
      services: [
        { _key: 'serv1', name: 'Consultations générales et de suivi' },
        { _key: 'serv2', name: 'Pansements, injections, perfusions' },
        { _key: 'serv3', name: 'Prélèvements et examens à domicile' },
        { _key: 'serv4', name: 'Surveillance de patients chroniques' }
      ],
      services_ar: [
        { _key: 'serv1', name: 'استشارات طبية عامة ومتابعة' },
        { _key: 'serv2', name: 'تغيير الضمادات، الحقن، المحاليل' },
        { _key: 'serv3', name: 'سحب الدم وفحوصات منزلية' },
        { _key: 'serv4', name: 'مراقبة الأمراض المزمنة' }
      ],
      availability: 'Interventions sur rendez-vous et urgences selon disponibilité',
      availability_ar: 'تدخلات بمواعيد مسبقة وحالات طارئة حسب التوفر',
      availabilityTitle: 'Disponibilité',
      availabilityTitle_ar: 'التوفر',
      contactPrompt: 'Contactez-nous pour planifier une visite',
      contactPrompt_ar: 'اتصل بنا لتحديد موعد زيارة',
      callToAction: { text: 'Demander une intervention à domicile' },
      callToAction_ar: { text: 'طلب تدخل منزلي' }
    }).commit()
    console.log('homeCare populated')
  }

  console.log('Populating siteSettings...')
  const siteSettings = await client.fetch(`*[_type == "siteSettings"][0]`)
  if (siteSettings) {
    await client.patch(siteSettings._id).setIfMissing({
      address: 'Hai Khemisti (Ex Cumo) USTO, Bir El Djir 31011, Oran',
      address_ar: 'حي خميستي (إكس كومو) إيسطو، بئر الجير 31011، وهران',
      phone: '+213 41 82 85 85',
      email: 'contact@cliniqueokba.dz',
      coordinates: { lat: 35.700010, lng: -0.569500 },
      hours: { emergency: '24h/24 et 7j/7', weekdays: '08:00 - 20:00', saturday: '08:00 - 18:00' },
      hours_ar: { emergency: '24/7 طوال أيام الأسبوع', weekdays: '08:00 - 20:00', saturday: '08:00 - 18:00' },
      social: { facebook: 'https://facebook.com/cliniqueokba', instagram: 'https://instagram.com/cliniqueokba' },
      heroStats: [
        { _key: 's1', value: '24/7', label: 'Urgences' },
        { _key: 's2', value: '+30', label: 'Spécialistes' },
        { _key: 's3', value: '100%', label: 'Dévouement' }
      ],
      heroStats_ar: [
        { _key: 's1', value: '24/7', label: 'طوارئ' },
        { _key: 's2', value: '+30', label: 'أخصائيون' },
        { _key: 's3', value: '100%', label: 'تفاني' }
      ]
    }).commit()
    console.log('siteSettings populated')
  }

  console.log('Populating insuranceSection...')
  const insuranceSection = await client.fetch(`*[_type == "insuranceSection"][0]`)
  if (insuranceSection) {
    const defaultProviders = [
      { _key: 'prov1', name: 'SEACO', name_ar: 'سياكو', description: "Société de l'Eau et de l'Assainissement de Constantine.", description_ar: 'شركة المياه والتطهير بقسنطينة.' },
      { _key: 'prov2', name: 'ENSB', name_ar: 'المدرسة الوطنية العليا للبيوتكنولوجيا', description: 'École Nationale Supérieure de Biotechnologie.', description_ar: 'المدرسة الوطنية العليا للبيوتكنولوجيا.' },
      { _key: 'prov3', name: 'Promotion Dambri Saddek', name_ar: 'ترقية دمبري صادق', description: 'Acquéreurs de la promotion Dambri Saddek.', description_ar: 'المستفيدون من ترقية دمبري صادق.' },
      { _key: 'prov4', name: 'Association Oncologica', name_ar: 'جمعية أونكولوجيكا', description: "Association Oncologica Constantine pour l'aide des cancéreux.", description_ar: 'جمعية أونكولوجيكا قسنطينة لمساعدة مرضى السرطان.' }
    ]
    await client.patch(insuranceSection._id).setIfMissing({
      badge: 'Prise en charge',
      badge_ar: 'التكفل الطبي',
      title: 'Conventions & Partenaires',
      title_ar: 'الاتفاقيات والشركاء',
      subtitle: "La Clinique OKBA est fière de collaborer avec ses partenaires pour vous faciliter l'accès aux soins.",
      subtitle_ar: 'تفتخر المصحة الطبية عقبة بالتعاون مع شركائها لتسهيل حصولكم على الرعاية الطبية.',
      providers: defaultProviders,
      note: "Pour toute information supplémentaire concernant nos conventions, n'hésitez pas à nous contacter.",
      note_ar: 'لمزيد من المعلومات حول اتفاقياتنا، لا تترددوا في الاتصال بنا.',
      ctaText: 'Nous contacter',
      ctaText_ar: 'اتصل بنا'
    }).commit()
    console.log('insuranceSection populated')
  }

  console.log('Populating FAQs...')
  const faqs = await client.fetch(`*[_type == "faq"]`)
  if (faqs.length === 0) {
    const faqData = [
      { question: "Quels sont vos horaires d'ouverture ?", question_ar: "ما هي أوقات العمل لديكم؟", answer: "Notre service des urgences est ouvert 24h/24 et 7j/7. Les consultations spécialisées se font sur rendez-vous du dimanche au jeudi de 8h à 20h, et le samedi de 8h à 18h.", answer_ar: "قسم الطوارئ لدينا مفتوح على مدار 24 ساعة طوال أيام الأسبوع. الاستشارات المتخصصة تتم بموعد من الأحد إلى الخميس من الساعة 8 صباحًا حتى 8 مساءً، ويوم السبت من 8 صباحًا حتى 6 مساءً." },
      { question: "Comment puis-je prendre rendez-vous ?", question_ar: "كيف يمكنني حجز موعد؟", answer: "Vous pouvez prendre rendez-vous directement via notre site web, par téléphone, ou via WhatsApp pour une réponse rapide.", answer_ar: "يمكنك حجز موعد مباشرة عبر موقعنا الإلكتروني، عبر الهاتف، أو عبر تطبيق الواتساب للحصول على استجابة سريعة." },
      { question: "Quels sont les moyens de paiement acceptés ?", question_ar: "ما هي وسائل الدفع المقبولة؟", answer: "Le paiement s'effectue à l'accueil. Si vous relevez d'un organisme conventionné avec la clinique, une prise en charge peut s'appliquer. Renseignez-vous auprès de notre équipe administrative.", answer_ar: "يتم الدفع في الاستقبال. إذا كنتم تابعين لهيئة متعاقدة مع المصحة، يمكن تطبيق التكفل. استفسروا لدى فريقنا الإداري." },
      { question: "Où êtes-vous situés exactement ?", question_ar: "أين تقعون بالضبط؟", answer: "Nous sommes situés à Hai Khemisti (Ex Cumo) USTO, Bir El Djir 31011, Oran. Un parking est à la disposition de nos patients.", answer_ar: "نحن نقع في حي خميستي (إكس كومو) إيسطو، بئر الجير 31011، وهران. يوجد موقف سيارات متاح لمرضانا." }
    ]
    for (const [idx, item] of faqData.entries()) {
      await client.create({
        _type: 'faq',
        question: item.question,
        question_ar: item.question_ar,
        answer: item.answer,
        answer_ar: item.answer_ar,
        order: idx + 1
      })
    }
    console.log('FAQs populated')
  }

  console.log('Done.')
}

run().catch(console.error)
