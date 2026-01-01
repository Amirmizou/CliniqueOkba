import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'aboutSection',
    title: '📖 Section À Propos',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre Principal',
            type: 'string',
            validation: (Rule) => Rule.required(),
            initialValue: 'À Propos de la Clinique OKBA',
        }),
        defineField({
            name: 'subtitle',
            title: 'Sous-titre',
            type: 'string',
            initialValue: 'Excellence médicale depuis plus de 20 ans',
        }),
        defineField({
            name: 'description',
            title: 'Description Principale',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'mission',
            title: 'Notre Mission',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'vision',
            title: 'Notre Vision',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'values',
            title: 'Nos Valeurs',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', title: 'Titre', type: 'string' },
                        { name: 'description', title: 'Description', type: 'text', rows: 2 },
                        { name: 'icon', title: 'Icône (nom Lucide)', type: 'string' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'stats',
            title: 'Statistiques',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'value', title: 'Valeur', type: 'string' },
                        { name: 'label', title: 'Label', type: 'string' },
                        { name: 'icon', title: 'Icône (nom Lucide)', type: 'string' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'image',
            title: 'Image Principale',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'certifications',
            title: 'Certifications',
            type: 'array',
            of: [{ type: 'string' }],
        }),
    ],
    preview: {
        select: { title: 'title' },
        prepare({ title }) {
            return { title: title || 'Section À Propos' }
        },
    },
})
