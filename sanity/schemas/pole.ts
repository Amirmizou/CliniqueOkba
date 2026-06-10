import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'pole',
    title: '⭐ Pôles d’excellence',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre du pôle',
            type: 'string',
            validation: (Rule) => Rule.required(),
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
            title: 'Description',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'items',
            title: 'Sous-spécialités / prestations',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Ex pôle dentaire : Consultation, Chirurgie, Orthodontie (ODF), Prothèse',
        }),
        defineField({
            name: 'iconName',
            title: 'Icône',
            type: 'string',
            options: {
                list: [
                    { title: 'Imagerie — balayage (scanner)', value: 'ScanLine' },
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
            name: 'badge',
            title: 'Badge (optionnel)',
            type: 'string',
            description: 'Ex : 24h/24 · 7j/7',
        }),
        defineField({
            name: 'urgent',
            title: 'Pôle urgences (style distinct + bouton d’appel)',
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
