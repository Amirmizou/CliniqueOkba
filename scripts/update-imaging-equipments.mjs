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

const updates = [
    {
        model: 'Somatom go.Top',
        patch: {
            description: "Scanner 128 coupes ultra-rapide offrant une imagerie de très haute résolution avec une dose de rayons X minimisée. Sa technologie intégrée permet des acquisitions cardiaques et vasculaires avancées, idéales pour les diagnostics d'urgence et la routine.",
            description_ar: "جهاز أشعة مقطعية بـ 128 شريحة فائق السرعة يوفر تصويراً عالي الدقة مع تقليل جرعة الأشعة. تتيح تقنيته المدمجة إجراء فحوصات متقدمة للقلب والأوعية الدموية، مما يجعله مثالياً لتشخيص الحالات الطارئة والروتينية.",
            features: ["Acquisition ultra-rapide (128 coupes)", "Imagerie cardiaque et spectrale", "Réduction de dose par IA", "Confort patient optimisé"],
            features_ar: ["تصوير فائق السرعة (128 شريحة)", "تصوير القلب والأطياف", "تقليل ملحوظ لجرعة الأشعة بالذكاء الاصطناعي", "راحة مثالية للمريض"]
        }
    },
    {
        model: 'MAGNETOM', // IRM
        patch: {
            description: "IRM de dernière génération offrant une qualité d'image exceptionnelle pour les examens neurologiques, orthopédiques, abdominaux et cardiovasculaires. Son tunnel large et ses séquences silencieuses réduisent l'anxiété et assurent un confort optimal.",
            description_ar: "جهاز رنين مغناطيسي من الجيل الأحدث يقدم جودة صورة استثنائية لفحوصات الأعصاب والعظام والبطن والقلب. تصميمه الواسع والتقنيات الهادئة تقلل من التوتر وتضمن راحة تامة للمريض.",
            features: ["Antennes haute densité", "Séquences d'imagerie silencieuse (Quiet Suite)", "Tunnel large (réduit la claustrophobie)", "Imagerie fonctionnelle et de diffusion"],
            features_ar: ["لفائف عالية الكثافة", "تسلسلات تصوير هادئة", "نفق واسع يقلل من رهاب الأماكن المغلقة", "التصوير الوظيفي والانتشاري"]
        }
    },
    {
        model: 'Multix Impact C',
        patch: {
            description: "Système de radiographie numérique à suspension plafonnière ou au sol, conçu pour une utilisation ergonomique et rapide. Il fournit des images radiographiques nettes tout en optimisant la dose d'exposition pour le patient.",
            description_ar: "نظام تصوير إشعاعي رقمي مصمم للاستخدام السريع والمريح. يوفر صوراً شعاعية دقيقة وواضحة مع تحسين وضبط جرعة التعرض للأشعة لضمان سلامة المريض.",
            features: ["Radiographie numérique directe", "Positionnement ergonomique", "Faible dose d'irradiation", "Qualité d'image optimisée par algorithme"],
            features_ar: ["تصوير إشعاعي رقمي مباشر", "تعديل وضعية مريح للمريض", "جرعة إشعاعية منخفضة", "جودة صورة محسنة برمجياً"]
        }
    },
    {
        model: 'MAMMOMAT',
        patch: {
            description: "Appareil de mammographie numérique avec fonction de tomosynthèse 3D. Conçu spécifiquement pour le dépistage précoce du cancer du sein, il offre une précision diagnostique inégalée tout en réduisant la compression pour un examen plus doux.",
            description_ar: "جهاز تصوير الثدي الرقمي (ماموجرام) مزود بتقنية التصوير المقطعي ثلاثي الأبعاد 3D. صُمم خصيصاً للكشف المبكر عن سرطان الثدي، حيث يوفر دقة تشخيصية لا مثيل لها مع تقليل الضغط لضمان فحص أكثر راحة.",
            features: ["Tomosynthèse 3D", "Dépistage haute résolution", "Compression douce et personnalisée", "Exposition minimale aux rayons"],
            features_ar: ["تصوير مقطعي للثدي 3D", "فحص عالي الدقة", "ضغط لطيف ومخصص", "تعرض طفيف للأشعة"]
        }
    },
    {
        model: 'SIEMENS JUNIPER',
        patch: {
            description: "Système d'échographie haut de gamme offrant une imagerie polyvalente pour l'obstétrique, la cardiologie et l'imagerie générale. Ses sondes ultra-sensibles permettent une visualisation claire et détaillée des flux sanguins et de l'élasticité tissulaire.",
            description_ar: "نظام تصوير بالموجات فوق الصوتية (إيكو) متطور يوفر تصويراً شاملاً لأمراض النساء والتوليد والقلب والتصوير العام. مجساته عالية الحساسية تتيح رؤية واضحة ودقيقة لتدفق الدم ومرونة الأنسجة.",
            features: ["Imagerie Doppler couleur sensible", "Élastographie tissulaire", "Images 3D/4D en temps réel", "Sondes multi-spécialités"],
            features_ar: ["تصوير دوبلر ملون عالي الحساسية", "تصوير مرونة الأنسجة", "صور ثلاثية ورباعية الأبعاد 3D/4D في الوقت الفعلي", "مجسات متعددة التخصصات"]
        }
    },
    {
        model: 'Symbia Pro.specta',
        patch: {
            description: "Système hybride combinant la médecine nucléaire (SPECT) et le scanner (CT). Il permet d'obtenir des images fonctionnelles et anatomiques parfaitement superposées, essentiel pour l'oncologie, la cardiologie et la neurologie.",
            description_ar: "نظام هجين يجمع بين الطب النووي (SPECT) والأشعة المقطعية (CT). يتيح الحصول على صور وظيفية وتشريحية متطابقة تماماً، وهو أساسي في تشخيص الأورام وأمراض القلب والأعصاب.",
            features: ["Imagerie hybride SPECT/CT", "Localisation anatomique précise", "Imagerie fonctionnelle quantitative", "Temps d'examen réduit"],
            features_ar: ["تصوير هجين SPECT/CT", "تحديد تشريحي دقيق", "تصوير وظيفي كمي", "وقت فحص أقصر"]
        }
    },
    {
        model: 'ProMax',
        patch: {
            description: "Unité d'imagerie maxillo-faciale de pointe capable de réaliser des panoramiques dentaires, des téléradiographies et des images 3D (Cone Beam). Indispensable pour la chirurgie implantaire et l'orthodontie.",
            description_ar: "وحدة تصوير متطورة للوجه والفكين قادرة على إجراء تصوير بانورامي للأسنان وصور ثلاثية الأبعاد (Cone Beam). ضرورية لجراحات زراعة الأسنان وتقويم الأسنان.",
            features: ["Panoramique numérique 2D", "Imagerie 3D (Cone Beam CBCT)", "Céphalométrie", "Ultra faible dose pour les enfants"],
            features_ar: ["تصوير بانورامي رقمي 2D", "تصوير ثلاثي الأبعاد CBCT", "تصوير سيفالومتري", "جرعة إشعاعية منخفضة جداً للأطفال"]
        }
    }
]

async function run() {
    console.log('Fetching equipments...')
    const equipments = await client.fetch('*[_type == "equipment"]')
    
    for (const eq of equipments) {
        const match = updates.find(u => eq.model && eq.model.includes(u.model))
        if (match) {
            console.log(`Updating ${eq.name}...`)
            await client.patch(eq._id).set(match.patch).commit()
            console.log(`Updated ${eq.name} successfully.`)
        }
    }
    console.log('Done.')
}

run().catch(console.error)
