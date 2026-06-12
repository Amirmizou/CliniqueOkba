import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'pole',
    title: '⭐ Pôles d’excellence',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre du pôle (FR)',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title_ar',
            title: 'Titre du pôle (AR)',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'URL (slug)',
            type: 'slug',
            description: 'Adresse de la page dédiée : /poles/<slug>',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description (FR)',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'description_ar',
            title: 'Description (AR)',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'items',
            title: 'Sous-spécialités / prestations (FR)',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Ex pôle dentaire : Consultation, Chirurgie, Orthodontie (ODF), Prothèse',
        }),
        defineField({
            name: 'items_ar',
            title: 'Sous-spécialités / prestations (AR)',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'iconName',
            title: 'Icône',
            type: 'string',
            options: {
                list: [
                    { title: 'Imagerie — balayage (scanner)', value: 'ScanLine' },
                    { title: 'Médecine nucléaire — atome (radiation)', value: 'Radiation' },
                    { title: 'Dentaire — dent cristalline (sourire)', value: 'Smile' },
                    { title: 'Consultations — ondes cardiaques (stéthoscope)', value: 'Stethoscope' },
                    { title: 'Urgences — flash + ECG rapide (sirène)', value: 'Siren' },
                    { title: 'Laboratoire — molécules (fiole)', value: 'FlaskConical' },
                    { title: 'Chirurgie — réticule (œil)', value: 'Eye' },
                    { title: 'Cardiologie — ECG vivant (cœur)', value: 'Heart' },
                    { title: 'Maternité — halo protecteur (bébé)', value: 'Baby' },
                    { title: 'Ophtalmologie — iris (œil scan)', value: 'ScanEye' },
                    { title: 'Kinésithérapie — articulation (activité)', value: 'Activity' },
                    { title: 'Pharmacie — flux vers la croix (pilule)', value: 'Pill' },
                ],
            },
            initialValue: 'Stethoscope',
        }),
        defineField({
            name: 'accentColor',
            title: 'Couleur d’accent (HEX)',
            type: 'string',
            initialValue: '#006633',
        }),
        defineField({
            name: 'galleryCategories',
            title: 'Catégories de photos (page dédiée)',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Imagerie médicale', value: 'imagerie' },
                    { title: 'Médecine nucléaire', value: 'nucleaire' },
                    { title: 'Bloc opératoire', value: 'bloc' },
                    { title: 'Laboratoire d’analyses', value: 'laboratoire' },
                    { title: 'Hospitalisation', value: 'hospitalisation' },
                    { title: 'Consultation & exploration', value: 'consultation' },
                    { title: 'Espaces d’accueil', value: 'accueil' },
                ],
            },
            description: 'Quelles photos de la galerie afficher sur la page de ce pôle',
        }),
        defineField({
            name: 'videos',
            title: 'Vidéos de présentation (optionnel)',
            type: 'array',
            description: 'Une ou plusieurs vidéos affichées sur la page de ce pôle.',
            of: [
                {
                    type: 'object',
                    name: 'poleVideo',
                    title: 'Vidéo',
                    fields: [
                        {
                            name: 'title',
                            title: 'Titre (FR)',
                            type: 'string',
                        },
                        {
                            name: 'title_ar',
                            title: 'Titre (AR)',
                            type: 'string',
                        },
                        {
                            name: 'videoFile',
                            title: 'Fichier vidéo',
                            type: 'file',
                            options: { accept: 'video/mp4,video/webm' },
                            validation: (Rule) => Rule.required(),
                            description: 'MP4 recommandé, compressé (max ~100 Mo).',
                        },
                        {
                            name: 'poster',
                            title: 'Affiche (image de couverture)',
                            type: 'image',
                            options: { hotspot: true },
                            description: 'Image affichée avant la lecture.',
                        },
                    ],
                    preview: {
                        select: { title: 'title', media: 'poster' },
                        prepare({ title, media }) {
                            return { title: title || 'Vidéo', media }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'badge',
            title: 'Badge (FR) (optionnel)',
            type: 'string',
            description: 'Ex : 24h/24 · 7j/7',
        }),
        defineField({
            name: 'badge_ar',
            title: 'Badge (AR) (optionnel)',
            type: 'string',
        }),
        defineField({
            name: 'urgent',
            title: 'Pôle urgences (style distinct + bouton d’appel)',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'featured',
            title: 'Pôle vedette (carte mise en évidence + ruban « À la une »)',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'order',
            title: 'Ordre d’affichage',
            type: 'number',
            initialValue: 0,
        }),
        defineField({
            name: 'active',
            title: 'Affiché',
            type: 'boolean',
            initialValue: true,
        }),
    ],
    orderings: [
        { title: 'Ordre', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    ],
    preview: {
        select: { title: 'title', subtitle: 'badge', active: 'active' },
        prepare({ title, subtitle, active }) {
            return { title: `${active ? '' : '🔴 '}${title}`, subtitle }
        },
    },
})
