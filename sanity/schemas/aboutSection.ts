import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'aboutSection',
    title: '📖 Section À Propos',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre Principal (FR)',
            type: 'string',
            validation: (Rule) => Rule.required(),
            initialValue: 'À Propos de la Clinique OKBA',
        }),
        defineField({
            name: 'title_ar',
            title: 'Titre Principal (AR)',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: 'Sous-titre (FR)',
            type: 'string',
            initialValue: 'Excellence médicale depuis plus de 20 ans',
        }),
        defineField({
            name: 'subtitle_ar',
            title: 'Sous-titre (AR)',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: 'Description Principale (FR)',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description_ar',
            title: 'Description Principale (AR)',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'mission',
            title: 'Notre Mission (FR)',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'mission_ar',
            title: 'Notre Mission (AR)',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'vision',
            title: 'Notre Vision (FR)',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'vision_ar',
            title: 'Notre Vision (AR)',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'values',
            title: 'Nos Valeurs (FR)',
            type: 'array',
            of: [
                {
                    name: 'valueItem',
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
            name: 'values_ar',
            title: 'Nos Valeurs (AR)',
            type: 'array',
            of: [
                {
                    name: 'valueItem',
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
            title: 'Statistiques (FR)',
            type: 'array',
            of: [
                {
                    name: 'statItem',
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
            name: 'stats_ar',
            title: 'Statistiques (AR)',
            type: 'array',
            of: [
                {
                    name: 'statItem',
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
            title: 'Certifications (FR)',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'certifications_ar',
            title: 'Certifications (AR)',
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
