import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'event',
    title: 'Événement',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: "Nom de l'événement",
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title_ar',
            title: "Nom de l'événement (AR)",
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
            name: 'eventType',
            title: "Type d'événement",
            type: 'string',
            options: {
                list: [
                    { title: 'Journée de dépistage', value: 'depistage' },
                    { title: 'Campagne de sensibilisation', value: 'sensibilisation' },
                    { title: 'Conférence médicale', value: 'conference' },
                    { title: 'Formation du personnel', value: 'formation' },
                    { title: 'Journée portes ouvertes', value: 'portes-ouvertes' },
                    { title: 'Action de prévention', value: 'prevention' },
                ],
            },
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
            description: 'Résumé affiché dans les listes',
        }),
        defineField({
            name: 'description_ar',
            title: 'Description (AR)',
            type: 'text',
            rows: 4,
            description: 'Résumé affiché dans les listes',
        }),
        defineField({
            name: 'content',
            title: 'Contenu détaillé (facultatif)',
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
            title: 'Contenu détaillé (facultatif) (AR)',
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
            name: 'startDate',
            title: 'Date et heure',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'endDate',
            title: 'Date et heure de fin (facultatif)',
            type: 'datetime',
        }),
        defineField({
            name: 'location',
            title: 'Lieu',
            type: 'string',
            initialValue: 'Clinique OKBA, Ali Mendjeli, Constantine',
        }),
        defineField({
            name: 'location_ar',
            title: 'Lieu (AR)',
            type: 'string',
            initialValue: 'Clinique OKBA, Ali Mendjeli, Constantine',
        }),
        defineField({
            name: 'image',
            title: 'Affiche / Photo',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'registrationDeadline',
            title: "Date limite d'inscription (si nécessaire)",
            type: 'datetime',
        }),
        defineField({
            name: 'contact',
            title: 'Contact',
            type: 'string',
            description: 'Téléphone, e-mail ou personne à contacter pour s’inscrire',
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
            date: 'startDate',
            media: 'image',
            published: 'published',
        },
        prepare({ title, date, media, published }) {
            return {
                title,
                subtitle: `${published ? '✅' : '📝'} ${date ? new Date(date).toLocaleString('fr-FR') : 'Date non définie'}`,
                media,
            }
        },
    },
    orderings: [
        {
            title: 'Date (prochains en premier)',
            name: 'startDateAsc',
            by: [{ field: 'startDate', direction: 'asc' }],
        },
        {
            title: 'Date (récents en premier)',
            name: 'startDateDesc',
            by: [{ field: 'startDate', direction: 'desc' }],
        },
    ],
})
