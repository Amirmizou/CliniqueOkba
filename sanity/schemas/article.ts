import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'article',
    title: 'Article / Actualité',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'URL (slug)',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Extrait',
            type: 'text',
            rows: 3,
            description: 'Court résumé affiché dans les listes',
        }),
        defineField({
            name: 'content',
            title: 'Contenu',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'Titre 2', value: 'h2' },
                        { title: 'Titre 3', value: 'h3' },
                        { title: 'Citation', value: 'blockquote' },
                    ],
                },
                {
                    type: 'image',
                    options: { hotspot: true },
                },
            ],
        }),
        defineField({
            name: 'image',
            title: 'Image principale',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'publishedAt',
            title: 'Date de publication',
            type: 'datetime',
        }),
        defineField({
            name: 'published',
            title: 'Publié',
            type: 'boolean',
            initialValue: false,
        }),
    ],
    preview: {
        select: {
            title: 'title',
            date: 'publishedAt',
            media: 'image',
            published: 'published',
        },
        prepare({ title, date, media, published }) {
            return {
                title,
                subtitle: `${published ? '✅' : '📝'} ${date ? new Date(date).toLocaleDateString('fr-FR') : 'Non daté'}`,
                media,
            }
        },
    },
    orderings: [
        {
            title: 'Date de publication',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
    ],
})
