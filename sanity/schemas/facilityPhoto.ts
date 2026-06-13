import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'facilityPhoto',
    title: '🏥 Galerie – Plateau technique & espaces',
    type: 'document',
    fields: [
        defineField({
            name: 'image',
            title: 'Photo',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title',
            title: 'Titre (FR)',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title_ar',
            title: 'Titre (AR)',
            type: 'string',
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
            name: 'category',
            title: 'Pôle / Catégorie',
            type: 'string',
            options: {
                list: [
                    { title: 'Imagerie médicale', value: 'imagerie' },
                    { title: 'Médecine nucléaire', value: 'nucleaire' },
                    { title: 'Bloc opératoire', value: 'bloc' },
                    { title: 'Dentaire', value: 'dentaire' },
                    { title: 'Laboratoire d’analyses', value: 'laboratoire' },
                    { title: 'Hospitalisation', value: 'hospitalisation' },
                    { title: 'Consultation & exploration', value: 'consultation' },
                    { title: 'Espaces d’accueil', value: 'accueil' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'featured',
            title: 'Mise en avant (grande tuile)',
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
        {
            title: 'Ordre',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'category',
            media: 'image',
            active: 'active',
        },
        prepare({ title, subtitle, media, active }) {
            return {
                title: `${active ? '' : '🔴 '}${title}`,
                subtitle,
                media,
            }
        },
    },
})
