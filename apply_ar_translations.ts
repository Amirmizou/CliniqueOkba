import { createClient } from '@sanity/client'
import fs from 'fs'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const translations: Record<string, string> = {
  "La Clinique OKBA est un établissement privé pluridisciplinaire situé à Ali Mendjeli, Constantine. Nous réunissons un plateau technique de pointe — imagerie, laboratoire, bloc opératoire — et une équipe de spécialistes dévoués, pour vous offrir des soins complets et de qualité, dans un cadre moderne et accueillant.": "المصحة الطبية عقبة هي مؤسسة استشفائية خاصة متعددة التخصصات تقع في علي منجلي، قسنطينة. نجمع بين منصة تقنية متطورة - تصوير طبي، مخبر، جناح عمليات - وفريق من الأطباء المتخصصين والمتفانين، لنقدم لكم رعاية صحية شاملة وعالية الجودة في بيئة عصرية ومرحبة.",
  "À propos de nous": "معلومات عنا",
  "Clinique OKBA": "المصحة الطبية عقبة",
  "Urgences disponibles": "طوارئ متوفرة",
  "Médecins spécialistes": "أطباء أخصائيون",
  "Spécialités médicales": "تخصصات طبية",
  "Dernières technologies médicales": "أحدث التقنيات الطبية",
  "Équipements modernes": "معدات حديثة",
  "Spécialistes qualifiés et dévoués": "أخصائيون مؤهلون ومتفانون",
  "Équipe expérimentée": "فريق ذو خبرة",
  "Approche centrée sur le patient": "مقاربة تركز على المريض",
  "Soins de qualité": "رعاية صحية عالية الجودة",
  "je suis entrain de tester": "أنا أقوم بالتجربة",
  "test blog": "تجربة المدونة",
  "Lancement du BLOG": "إطلاق المدونة",
  "Biologie médicale": "البيولوجيا الطبية",
  "Responsable laboratoire": "مسؤول المخبر",
  "Plus de 25 ans d’expérience": "أكثر من 25 عامًا من الخبرة",
  "Endocrinologue": "طبيب غدد صماء",
  "Diabétologue": "طبيب سكري",
  "Chirurgie de l’oreille, du nez, de la gorge, de la face & du cou": "جراحة الأذن والأنف والحنجرة والوجه والعنق",
  "ORL": "أنف وأذن وحنجرة",
  "Pédiatre": "طبيب أطفال",
  "Ancienne Maître Assistante": "أستاذة مساعدة سابقة",
  "Gynécologie Obstétrique": "أمراض النساء والتوليد",
  "Médecine interne": "الطب الباطني",
  "Ouverture Officiel": "الافتتاح الرسمي",
  "Clinique OKBA, Ali Mendjeli, Constantine": "المصحة الطبية عقبة، علي منجلي، قسنطينة",
  "Interventions sur rendez-vous et urgences selon disponibilité": "التدخلات بموعد مسبق وحالات الطوارئ حسب التوفر",
  "Demander une intervention à domicile": "طلب تدخل منزلي",
  "Une équipe mobile pour des soins médicaux de qualité, chez vous, en toute sécurité.": "فريق متنقل لتقديم رعاية طبية عالية الجودة في منزلكم بكل أمان.",
  "Consultations générales et de suivi": "استشارات عامة ومتابعة",
  "Pansements, injections, perfusions": "تضميد الجروح، حقن، وتسريب وريدي",
  "Prélèvements et examens à domicile": "أخذ عينات وفحوصات منزلية",
  "Surveillance de patients chroniques": "مراقبة المرضى المزمنين",
  "Service dédié": "خدمة مخصصة",
  "Soins à domicile": "الرعاية المنزلية",
  "Nous contacter": "اتصل بنا",
  "Nous sommes à votre écoute pour toute question ou demande de rendez-vous": "نحن في استماعكم لأي استفسار أو طلب موعد",
  "Contact & Localisation": "الاتصال والموقع",
  "Excellence Médicale · Ali Mendjeli, Constantine": "التميز الطبي · علي منجلي، قسنطينة",
  "Témoignages": "آراء المرضى",
  "Votre satisfaction est notre priorité": "رضاكم هو أولويتنا",
  "Ce que disent nos patients": "ماذا يقول مرضانا",
  "En vidéo": "بالفيديو",
  "Une présentation de notre établissement : nos spécialités, nos urgences 24h/24 et notre engagement à vos côtés.": "عرض تقديمي لمؤسستنا: تخصصاتنا، طوارئنا المتاحة على مدار الساعة، والتزامنا تجاهكم.",
  "Découvrez la Clinique OKBA": "اكتشفوا المصحة الطبية عقبة",
  "Nouvelle ville Ali Mendjeli, extension ouest, à proximité du grand rond-point en allant vers Aïn Smara, Constantine, Algérie": "المدينة الجديدة علي منجلي، التوسعة الغربية، بالقرب من الدوار الكبير باتجاه عين سمارة، قسنطينة، الجزائر",
  "Bonjour la Clinique OKBA, je souhaite prendre un rendez-vous.": "مرحباً المصحة الطبية عقبة، أرغب في حجز موعد.",
  "Clinique privée pluridisciplinaire moderne à Ali Mendjeli, Constantine.": "مصحة خاصة متعددة التخصصات وحديثة في علي منجلي، قسنطينة.",
  "Accueil chaleureux et personnel très professionnel. Le scanner a été réalisé rapidement et les résultats étaient clairs.": "استقبال حار وطاقم احترافي جداً. تم إجراء جهاز الأشعة المقطعية بسرعة وكانت النتائج واضحة.",
  "Imagerie": "التصوير الطبي",
  "Excellente prise en charge au service des urgences, de jour comme de nuit. Une équipe à l'écoute et réactive.": "رعاية ممتازة في قسم الطوارئ، ليلاً ونهاراً. فريق مستمع وسريع الاستجابة.",
  "Urgences": "الطوارئ",
  "Suivi de grossesse impeccable, médecins attentionnés et plateau technique moderne. Je recommande vivement.": "متابعة حمل لا تشوبها شائبة، أطباء مهتمون ومنصة تقنية حديثة. أوصي بشدة.",
  "Gynécologie": "طب النساء"
}

// Simple name translations (if not exactly in the map)
const namesMap: Record<string, string> = {
  "Aissaoui": "عيساوي",
  "Ameziane Leila": "أمزيان ليلى",
  "Boughanout Seyfeddine": "بوغانوط سيف الدين",
  "Boukredera Amira": "بوقردرة أميرة",
  "Meskaldji Rima ep. Benabdi": "مسقالجي ريمة زوجة بن عبدي",
  "Zerizer Loubna": "زريزر لبنى",
  "Amel B.": "أمل ب.",
  "Karim M.": "كريم م.",
  "Nadia S.": "نادية س.",
  "Pr.": "بروفيسور",
  "Dr.": "د."
}

async function run() {
  const m = JSON.parse(fs.readFileSync('to_translate.json', 'utf8'))
  const patchesByDoc: Record<string, any> = {}

  for (const item of m) {
    let t = translations[item.value] || namesMap[item.value]
    if (!t) {
      if (item.value === "24/7" || item.value === "11" || item.value === "30+") {
        t = item.value
      } else if (item.value === "") {
        continue // skip empty
      } else if (item.field === 'text' && item.value === 'je suis entrain de tester') {
        t = "أنا أقوم بالتجربة"
      } else {
        console.warn('No translation found for:', item.value)
        t = item.value // fallback
      }
    }

    if (!patchesByDoc[item.docId]) patchesByDoc[item.docId] = {}
    
    // Construct the object path
    // path could be `.title` or `.stats[0].label`
    let p = item.path.startsWith('.') ? item.path.substring(1) : item.path
    // Replace the leaf field with field_ar
    // e.g. `stats[0].label` -> `stats[0].label_ar`
    // but the schema says `title_ar` on the object itself. 
    // If it's an array of objects `stats`, the object inside has `label` and `label_ar`.
    // So the path should end with `_ar`
    const arPath = p + '_ar'
    patchesByDoc[item.docId][arPath] = t
  }

  // Apply patches
  let count = 0
  for (const [docId, docPatches] of Object.entries(patchesByDoc)) {
    if (Object.keys(docPatches).length === 0) continue
    console.log(`Patching ${docId}...`)
    try {
      await client.patch(docId).set(docPatches).commit()
      count++
    } catch (err: any) {
      console.error(`Failed to patch ${docId}:`, err.message)
    }
  }
  console.log(`Done patching ${count} documents.`)
}

run().catch(console.error)
