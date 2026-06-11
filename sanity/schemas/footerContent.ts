import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'footerContent',
    title: '🦶 Contenu du Footer',
    type: 'document',
    fields: [
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
            name: 'quickLinks',
            title: 'Liens Rapides (FR)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', title: 'Label', type: 'string' },
                        { name: 'href', title: 'Lien', type: 'string' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'quickLinks_ar',
            title: 'Liens Rapides (AR)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', title: 'Label', type: 'string' },
                        { name: 'href', title: 'Lien', type: 'string' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'servicesLinks',
            title: 'Liens Services (FR)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', title: 'Label', type: 'string' },
                        { name: 'href', title: 'Lien', type: 'string' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'servicesLinks_ar',
            title: 'Liens Services (AR)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', title: 'Label', type: 'string' },
                        { name: 'href', title: 'Lien', type: 'string' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'legalLinks',
            title: 'Liens Légaux (FR)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', title: 'Label', type: 'string' },
                        { name: 'href', title: 'Lien', type: 'string' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'legalLinks_ar',
            title: 'Liens Légaux (AR)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', title: 'Label', type: 'string' },
                        { name: 'href', title: 'Lien', type: 'string' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'copyright',
            title: 'Copyright (FR)',
            type: 'string',
            description: 'Utilisez {year} pour l\'année dynamique',
            initialValue: '© {year} Clinique OKBA. Tous droits réservés.',
        }),
        defineField({
            name: 'copyright_ar',
            title: 'Copyright (AR)',
            type: 'string',
        }),
        defineField({
            name: 'newsletterTitle',
            title: 'Titre Newsletter (FR)',
            type: 'string',
        }),
        defineField({
            name: 'newsletterTitle_ar',
            title: 'Titre Newsletter (AR)',
            type: 'string',
        }),
        defineField({
            name: 'newsletterDescription',
            title: 'Description Newsletter (FR)',
            type: 'string',
        }),
        defineField({
            name: 'newsletterDescription_ar',
            title: 'Description Newsletter (AR)',
            type: 'string',
        }),
        defineField({
            name: 'showNewsletter',
            title: 'Afficher Newsletter',
            type: 'boolean',
            initialValue: false,
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Contenu du Footer' }
        },
    },
})
