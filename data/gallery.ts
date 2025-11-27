// Configuration de la galerie d'images
// Pour ajouter/supprimer des images, modifiez ce fichier et redéployez le site.

export const galleryImages = [
    {
        id: '1',
        image: '/images/gallery/exterior1.jpg',
        caption: 'Façade de la clinique',
        category: 'exterior'
    },
    {
        id: '2',
        image: '/images/gallery/reception.jpg',
        caption: 'Réception principale',
        category: 'interior'
    },
    {
        id: '3',
        image: '/images/gallery/waiting-room.jpg',
        caption: 'Salle d\'attente',
        category: 'interior'
    },
    {
        id: '4',
        image: '/images/gallery/scanner.jpg',
        caption: 'Salle de Scanner',
        category: 'equipment'
    },
    {
        id: '5',
        image: '/images/gallery/irm.jpg',
        caption: 'IRM de dernière génération',
        category: 'equipment'
    },
    {
        id: '6',
        image: '/images/gallery/team1.jpg',
        caption: 'Notre équipe médicale',
        category: 'team'
    }
]

export type GalleryImage = typeof galleryImages[number]
