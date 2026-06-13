// Configuration des slides du carousel - Modifier ce fichier et pusher pour mettre à jour
export const heroSlides = [
    {
        id: '1',
        image: '/uploads/hero/1763826628906-Gemini_Generated_Image_ubdtr0ubdtr0ubdt.png',
        title: 'Technologie de Pointe',
        title_ar: 'تكنولوجيا متقدمة',
        subtitle: 'Des équipements modernes pour des diagnostics précis',
        subtitle_ar: 'معدات حديثة لتشخيص دقيق',
        order: 1,
        active: true
    },
    {
        id: '2',
        image: '/uploads/hero/1763826628906-Gemini_Generated_Image_ubdtr0ubdtr0ubdt.png',
        title: 'Soins Personnalisés',
        title_ar: 'رعاية شخصية',
        subtitle: 'Une équipe médicale à votre écoute pour votre bien-être',
        subtitle_ar: 'فريق طبي في استماعك لرفاهيتك',
        order: 2,
        active: true
    },
    {
        id: '3',
        image: '/uploads/hero/1763826249107-logo.png',
        title: 'Clinique OKBA',
        title_ar: 'المصحة الطبية عقبة',
        subtitle: 'Votre partenaire santé de confiance',
        subtitle_ar: 'شريكك الموثوق في الصحة',
        order: 3,
        active: true
    }
]

export type HeroSlide = typeof heroSlides[number]
