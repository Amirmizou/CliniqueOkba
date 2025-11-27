// Configuration des slides du carousel - Modifier ce fichier et pusher pour mettre à jour
export const heroSlides = [
    {
        id: '1',
        image: '/uploads/hero/1763825620251-Gemini_Generated_Image_gzjk7ygzjk7ygzjk.png',
        title: 'Technologie de Pointe',
        subtitle: 'Des équipements modernes pour des diagnostics précis',
        order: 1,
        active: true
    },
    {
        id: '2',
        image: '/uploads/hero/1763826628906-Gemini_Generated_Image_ubdtr0ubdtr0ubdt.png',
        title: 'Soins Personnalisés',
        subtitle: 'Une équipe médicale à votre écoute pour votre bien-être',
        order: 2,
        active: true
    },
    {
        id: '3',
        image: '/uploads/hero/1763826249107-logo.png',
        title: 'Clinique OKBA',
        subtitle: 'Votre partenaire santé de confiance',
        order: 3,
        active: true
    }
]

export type HeroSlide = typeof heroSlides[number]
