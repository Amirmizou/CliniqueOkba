// Configuration de la galerie d'images
// Pour ajouter/supprimer des images, modifiez ce fichier et redéployez le site.

export const galleryImages = [
    {
        id: '1',
        image: '/uploads/gallery/1763815720550-images-(1).jpg',
        caption: 'Infrastructure de la clinique',
        category: 'infrastructure'
    },
    {
        id: '2',
        image: '/uploads/gallery/1763816789310-hero-dental-2.jpg',
        caption: 'Salle de soins dentaires',
        category: 'interior'
    },
    {
        id: '3',
        image: '/uploads/gallery/1763827420029-Gemini_Generated_Image_gzjk7ygzjk7ygzjk.png',
        caption: 'Vue extérieure',
        category: 'exterior'
    }
]

export type GalleryImage = typeof galleryImages[number]
