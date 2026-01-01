import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'testimonial',
    title: '⭐ Témoignages',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nom du Patient',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'avatar',
            title: 'Photo',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'rating',
            title: 'Note (1-5)',
            type: 'number',
            validation: (Rule) => Rule.min(1).max(5),
            initialValue: 5,
        }),
        defineField({
            name: 'comment',
            title: 'Témoignage',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'service',
            title: 'Service Utilisé',
            type: 'string',
            description: 'Ex: Radiologie, Chirurgie, Consultation...',
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'date',
        }),
        defineField({
            name: 'verified',
            title: 'Vérifié',
            type: 'boolean',
            initialValue: true,
            description: 'Patient vérifié par la clinique',
        }),
        defineField({
            name: 'featured',
            title: 'Mise en avant',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'active',
            title: 'Actif',
            type: 'boolean',
            initialValue: true,
        }),
        defineField({
            name: 'order',
            title: 'Ordre d\'affichage',
            type: 'number',
            initialValue: 0,
        }),
    ],
    orderings: [
        { title: 'Note', name: 'rating', by: [{ field: 'rating', direction: 'desc' }] },
        { title: 'Date', name: 'date', by: [{ field: 'date', direction: 'desc' }] },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'service',
            media: 'avatar',
        },
    },
})
