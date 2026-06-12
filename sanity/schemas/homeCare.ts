import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'homeCare',
    title: '🏠 Soins à Domicile',
    type: 'document',
    fields: [
        defineField({
            name: 'badge',
            title: 'Badge (FR)',
            type: 'string',
        }),
        defineField({
            name: 'badge_ar',
            title: 'Badge (AR)',
            type: 'string',
        }),
        defineField({
            name: 'title',
            title: 'Titre Principal (FR)',
            type: 'string',
            validation: (Rule) => Rule.required(),
            initialValue: 'Soins à Domicile',
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
        }),
        defineField({
            name: 'subtitle_ar',
            title: 'Sous-titre (AR)',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: 'Description (FR)',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'description_ar',
            title: 'Description (AR)',
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
            title: 'Services Proposés (FR)',
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
            name: 'services_ar',
            title: 'Services Proposés (AR)',
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
            title: 'Avantages (FR)',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Liste des avantages des soins à domicile',
        }),
        defineField({
            name: 'benefits_ar',
            title: 'Avantages (AR)',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'availability',
            title: 'Texte Disponibilité (FR)',
            type: 'string',
        }),
        defineField({
            name: 'availability_ar',
            title: 'Texte Disponibilité (AR)',
            type: 'string',
        }),
        defineField({
            name: 'availabilityTitle',
            title: 'Titre Disponibilité (FR)',
            type: 'string',
        }),
        defineField({
            name: 'availabilityTitle_ar',
            title: 'Titre Disponibilité (AR)',
            type: 'string',
        }),
        defineField({
            name: 'contactPrompt',
            title: 'Texte d\'incitation au contact (FR)',
            type: 'string',
        }),
        defineField({
            name: 'contactPrompt_ar',
            title: 'Texte d\'incitation au contact (AR)',
            type: 'string',
        }),
        defineField({
            name: 'callToAction',
            title: 'Bouton d\'action (FR)',
            type: 'object',
            fields: [
                { name: 'text', title: 'Texte', type: 'string' },
                { name: 'phone', title: 'Numéro de téléphone', type: 'string' },
            ],
        }),
        defineField({
            name: 'callToAction_ar',
            title: 'Bouton d\'action (AR)',
            type: 'object',
            fields: [
                { name: 'text', title: 'Texte', type: 'string' },
                { name: 'phone', title: 'Numéro de téléphone', type: 'string' },
            ],
        }),
        defineField({
            name: 'availability',
            title: 'Disponibilité (FR)',
            type: 'string',
            description: 'Ex: 24h/24 - 7j/7',
        }),
        defineField({
            name: 'availability_ar',
            title: 'Disponibilité (AR)',
            type: 'string',
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
