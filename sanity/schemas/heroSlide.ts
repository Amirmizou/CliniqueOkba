import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'heroSlide',
    title: 'Slide Hero',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'subtitle',
            title: 'Sous-titre',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'order',
            title: 'Ordre d\'affichage',
            type: 'number',
            initialValue: 1,
        }),
        defineField({
            name: 'active',
            title: 'Actif',
            type: 'boolean',
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image',
            active: 'active',
        },
        prepare({ title, media, active }) {
            return {
                title: title,
                subtitle: active ? '✅ Actif' : '❌ Inactif',
                media,
            }
        },
    },
    orderings: [
        {
            title: 'Ordre',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
})
