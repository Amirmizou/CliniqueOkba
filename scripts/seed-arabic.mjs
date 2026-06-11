import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
    console.error('Missing required environment variables. Please check your .env or .env.local file.')
    console.error(`Project ID: ${projectId}`)
    console.error(`Dataset: ${dataset}`)
    console.error(`Token: ${token ? '✅ Present' : '❌ Missing'}`)
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    useCdn: false,
    token,
    apiVersion: '2024-03-20',
})

const translations = {
    pole: {
        'Urgences': { title_ar: 'طوارئ', description_ar: 'رعاية طبية وجراحية للحالات الطارئة 24/7' },
        'Imagerie Médicale': { title_ar: 'التصوير الطبي', description_ar: 'تشخيص دقيق باستخدام أحدث أجهزة الأشعة المقطعية والرنين المغناطيسي' },
        'Médecine Nucléaire': { title_ar: 'الطب النووي', description_ar: 'فحوصات وظيفية متقدمة باستخدام النظائر المشعة' },
        'Laboratoire': { title_ar: 'مختبر التحاليل', description_ar: 'تحاليل طبية دقيقة وسريعة بمختلف التخصصات' },
        'Cardiologie': { title_ar: 'أمراض القلب', description_ar: 'رعاية شاملة لأمراض القلب والأوعية الدموية' },
        'Maternité': { title_ar: 'الأمومة والتوليد', description_ar: 'رعاية متكاملة للأم والجنين وتوليد آمن' },
        'Chirurgie': { title_ar: 'الجراحة', description_ar: 'عمليات جراحية في مختلف التخصصات بأحدث التقنيات' },
        'Dentaire': { title_ar: 'طب الأسنان', description_ar: 'رعاية شاملة للأسنان وجراحة الفم' },
        'Consultations': { title_ar: 'الاستشارات الطبية', description_ar: 'استشارات متخصصة في مختلف التخصصات' },
        'Ophtalmologie': { title_ar: 'طب العيون', description_ar: 'تشخيص وعلاج أمراض العيون وجراحتها' },
        'Pharmacie': { title_ar: 'الصيدلية', description_ar: 'توفير جميع الأدوية والمستلزمات الطبية' },
        'Kinésithérapie': { title_ar: 'العلاج الطبيعي', description_ar: 'إعادة التأهيل الحركي والفيزيائي' }
    },
    aboutSection: {
        'À Propos de la Clinique OKBA': {
            title_ar: 'من نحن - المصحة الطبية عقبة',
            subtitle_ar: 'التميز الطبي لأكثر من 20 عاماً',
            description_ar: 'المصحة الطبية عقبة هي مؤسسة طبية رائدة تقدم رعاية صحية شاملة وعالية الجودة في قسنطينة. نجمع بين الخبرة الطبية المتقدمة والتكنولوجيا الحديثة لضمان أفضل مسار علاجي لمرضانا.',
            mission_ar: 'مهمتنا هي توفير رعاية طبية استثنائية تركز على المريض في بيئة آمنة ومتعاطفة.',
            vision_ar: 'رؤيتنا هي أن نكون المركز الطبي المرجعي للتميز والابتكار في الرعاية الصحية بالمنطقة.'
        }
    },
    siteSettings: {
        'Clinique OKBA': {
            clinicName_ar: 'المصحة الطبية عقبة',
            description_ar: 'مؤسسة طبية متعددة التخصصات تقدم خدمات صحية عالية الجودة في قسنطينة.',
            address_ar: 'قسنطينة، الجزائر',
        }
    },
    homeCare: {
        'Soins à Domicile': {
            title_ar: 'الرعاية المنزلية',
            subtitle_ar: 'رعاية طبية متميزة في راحة منزلك',
            description_ar: 'نوفر خدمات طبية وتمريضية احترافية في منزلك لضمان راحتك وتعافيك المستمر.',
        }
    }
}

async function updateDocuments(type, fieldMap) {
    const docs = await client.fetch(`*[_type == "${type}"]`)
    console.log(`Found ${docs.length} documents of type ${type}`)

    for (const doc of docs) {
        let match = null;
        if (fieldMap) {
            // Find translation by matching the title or name
            const key = doc.title || doc.clinicName || doc.name;
            match = Object.keys(fieldMap).find(k => key && key.includes(k)) ? fieldMap[Object.keys(fieldMap).find(k => key && key.includes(k))] : null;
        }

        let patches = {}
        
        if (match) {
            patches = { ...match }
        } else if (!doc.title_ar && doc.title) {
            patches.title_ar = `${doc.title} (AR)`
        } else if (!doc.name_ar && doc.name) {
            patches.name_ar = `${doc.name} (AR)`
        }

        if (Object.keys(patches).length > 0) {
            console.log(`Updating ${type} ID ${doc._id} with ${JSON.stringify(patches)}`)
            await client.patch(doc._id).set(patches).commit()
        }
    }
}

async function main() {
    try {
        console.log('Starting translation seeding...')
        await updateDocuments('pole', translations.pole)
        await updateDocuments('aboutSection', translations.aboutSection)
        await updateDocuments('siteSettings', translations.siteSettings)
        await updateDocuments('homeCare', translations.homeCare)
        
        console.log('✅ Arabic translations seeded successfully!')
    } catch (error) {
        console.error('❌ Error during seeding:', error)
    }
}

main()
