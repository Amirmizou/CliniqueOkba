import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'labResults',
    title: '🔬 Résultats Laboratoire',
    type: 'document',
    fields: [
        defineField({
            name: 'badge',
            title: 'Badge (FR)',
            type: 'string',
            initialValue: 'Laboratoire d\'analyses',
        }),
        defineField({
            name: 'badge_ar',
            title: 'Badge (AR)',
            type: 'string',
            initialValue: 'مختبر التحاليل الطبية',
        }),
        defineField({
            name: 'title',
            title: 'Titre Principal (FR)',
            type: 'string',
            validation: (Rule) => Rule.required(),
            initialValue: 'Précision des résultats, simplicité d\'accès',
        }),
        defineField({
            name: 'title_ar',
            title: 'Titre Principal (AR)',
            type: 'string',
            initialValue: 'دقة النتائج، سهولة الوصول',
        }),
        defineField({
            name: 'subtitle',
            title: 'Sous-titre (FR)',
            type: 'text',
            rows: 2,
            initialValue: 'Des résultats d\'analyses d\'une précision certifiée grâce à nos automates de pointe, récupérables instantanément via QR Code',
        }),
        defineField({
            name: 'subtitle_ar',
            title: 'Sous-titre (AR)',
            type: 'text',
            rows: 2,
            initialValue: 'نتائج تحاليل دقيقة وموثوقة بفضل أجهزتنا الحديثة، مع إمكانية استرجاع النتائج فوراً عبر مسح رمز QR',
        }),
        
        // Block 1 : Precision
        defineField({
            name: 'precisionTitle',
            title: 'Titre Précision (FR)',
            type: 'string',
            initialValue: 'Une précision inégalée',
            group: 'precision',
        }),
        defineField({
            name: 'precisionTitle_ar',
            title: 'Titre Précision (AR)',
            type: 'string',
            initialValue: 'دقة لا مثيل لها',
            group: 'precision',
        }),
        defineField({
            name: 'precisionDesc',
            title: 'Description Précision (FR)',
            type: 'text',
            rows: 2,
            initialValue: 'Des automates de pointe pour garantir des résultats d\'analyses fiables et reproductibles',
            group: 'precision',
        }),
        defineField({
            name: 'precisionDesc_ar',
            title: 'Description Précision (AR)',
            type: 'text',
            rows: 2,
            initialValue: 'أحدث الأجهزة الأوتوماتيكية لضمان نتائج تحاليل موثوقة وقابلة للتكرار',
            group: 'precision',
        }),
        defineField({
            name: 'precisionImage',
            title: 'Image Précision',
            type: 'image',
            options: { hotspot: true },
            group: 'precision',
        }),
        defineField({
            name: 'precisionStatBadge',
            title: 'Texte du Badge Statistique (Ex: 99.7%)',
            type: 'string',
            initialValue: '99.7%',
            group: 'precision',
        }),
        defineField({
            name: 'precisionFeatures',
            title: 'Caractéristiques de précision',
            type: 'array',
            group: 'precision',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', title: 'Titre (FR)', type: 'string' },
                        { name: 'title_ar', title: 'Titre (AR)', type: 'string' },
                        { name: 'desc', title: 'Description (FR)', type: 'string' },
                        { name: 'desc_ar', title: 'Description (AR)', type: 'string' },
                        { name: 'icon', title: 'Icône (nom Lucide, ex: Microscope)', type: 'string' },
                    ],
                },
            ],
        }),

        // Block 2 : QR Code
        defineField({
            name: 'qrTitle',
            title: 'Titre QR Code (FR)',
            type: 'string',
            initialValue: 'Vos résultats via QR Code',
            group: 'qr',
        }),
        defineField({
            name: 'qrTitle_ar',
            title: 'Titre QR Code (AR)',
            type: 'string',
            initialValue: 'نتائجك عبر رمز QR',
            group: 'qr',
        }),
        defineField({
            name: 'qrDesc',
            title: 'Description QR Code (FR)',
            type: 'text',
            rows: 2,
            initialValue: 'Plus besoin d\'attendre ou de revenir — scannez et récupérez vos résultats instantanément sur votre téléphone',
            group: 'qr',
        }),
        defineField({
            name: 'qrDesc_ar',
            title: 'Description QR Code (AR)',
            type: 'text',
            rows: 2,
            initialValue: 'لا حاجة للانتظار أو العودة مجدداً — امسح رمز QR واحصل على نتائجك فوراً على هاتفك',
            group: 'qr',
        }),
        defineField({
            name: 'qrImage',
            title: 'Image QR Code',
            type: 'image',
            options: { hotspot: true },
            group: 'qr',
        }),
        defineField({
            name: 'qrSteps',
            title: 'Étapes QR',
            type: 'array',
            group: 'qr',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'step', title: 'Numéro (ex: 01)', type: 'string' },
                        { name: 'title', title: 'Titre (FR)', type: 'string' },
                        { name: 'title_ar', title: 'Titre (AR)', type: 'string' },
                        { name: 'desc', title: 'Description (FR)', type: 'text', rows: 2 },
                        { name: 'desc_ar', title: 'Description (AR)', type: 'text', rows: 2 },
                    ],
                },
            ],
        }),
        defineField({
            name: 'ctaText',
            title: 'Texte Bouton CTA (FR)',
            type: 'string',
            initialValue: 'Contacter le laboratoire',
            group: 'qr',
        }),
        defineField({
            name: 'ctaText_ar',
            title: 'Texte Bouton CTA (AR)',
            type: 'string',
            initialValue: 'اتصل بالمختبر',
            group: 'qr',
        }),
    ],
    groups: [
        { name: 'precision', title: 'Bloc Précision' },
        { name: 'qr', title: 'Bloc QR Code' },
    ],
    preview: {
        select: { title: 'title' },
        prepare({ title }) {
            return { title: title || 'Résultats Laboratoire' }
        },
    },
})
