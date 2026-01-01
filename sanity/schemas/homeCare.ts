import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'homeCare',
    title: '🏠 Soins à Domicile',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre Principal',
            type: 'string',
            validation: (Rule) => Rule.required(),
            initialValue: 'Soins à Domicile',
        }),
        defineField({
            name: 'subtitle',
            title: 'Sous-titre',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'image',
            title: 'Image Principale',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'services',
            title: 'Services Proposés',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Nom du Service', type: 'string' },
                        { name: 'description', title: 'Description', type: 'text', rows: 2 },
                        { name: 'icon', title: 'Icône (nom Lucide)', type: 'string' },
                        { name: 'price', title: 'Prix', type: 'string' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'benefits',
            title: 'Avantages',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Liste des avantages des soins à domicile',
        }),
        defineField({
            name: 'callToAction',
            title: 'Bouton d\'action',
            type: 'object',
            fields: [
                { name: 'text', title: 'Texte', type: 'string' },
                { name: 'phone', title: 'Numéro de téléphone', type: 'string' },
            ],
        }),
        defineField({
            name: 'availability',
            title: 'Disponibilité',
            type: 'string',
            description: 'Ex: 24h/24 - 7j/7',
        }),
        defineField({
            name: 'active',
            title: 'Activer cette section',
            type: 'boolean',
            initialValue: true,
        }),
    ],
    preview: {
        select: { title: 'title' },
        prepare({ title }) {
            return { title: title || 'Soins à Domicile' }
        },
    },
})
