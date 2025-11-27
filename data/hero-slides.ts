// Configuration des slides du carousel - Modifier ce fichier et pusher pour mettre à jour
export const heroSlides = [
    {
        id: '1',
        image: '/images/hero/slide1.jpg',
        title: 'Bienvenue à la Clinique OKBA',
        subtitle: 'Votre santé, notre priorité',
        order: 1,
        active: true
    },
    {
        id: '2',
        image: '/images/hero/slide2.jpg',
        title: 'Excellence Médicale',
        subtitle: 'Des équipements de pointe pour votre bien-être',
        order: 2,
        active: true
    },
    {
        id: '3',
        image: '/images/hero/slide3.jpg',
        title: 'Équipe Dévouée',
        subtitle: 'Des professionnels à votre écoute 24/7',
        order: 3,
        active: true
    }
]

export type HeroSlide = typeof heroSlides[number]
