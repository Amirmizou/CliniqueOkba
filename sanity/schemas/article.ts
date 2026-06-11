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
            name: 'title_ar',
            title: 'Titre (AR)',
            type: 'string',
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
            name: 'excerpt_ar',
            title: 'Extrait (AR)',
            type: 'text',
            rows: 3,
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
            name: 'content_ar',
            title: 'Contenu (AR)',
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
            title: 'Image de couverture',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'category',
            title: 'Catégorie',
            type: 'string',
            options: {
                list: [
                    { title: 'Nouveau médecin', value: 'nouveau-medecin' },
                    { title: 'Nouvel équipement', value: 'nouvel-equipement' },
                    { title: 'Nouvelle convention', value: 'convention' },
                    { title: "Changement d'horaires", value: 'horaires' },
                    { title: 'Ouverture de service', value: 'nouveau-service' },
                    { title: 'Certification / Accréditation', value: 'certification' },
                    { title: 'Communiqué officiel', value: 'communique' },
                ],
            },
        }),
        defineField({
            name: 'author',
            title: 'Auteur',
            type: 'string',
            description: 'Nom de l’auteur ou du service émetteur',
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
