import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'footerContent',
    title: '🦶 Contenu du Footer',
    type: 'document',
    fields: [
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'quickLinks',
            title: 'Liens Rapides',
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
            title: 'Liens Services',
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
            title: 'Liens Légaux',
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
            title: 'Copyright',
            type: 'string',
            description: 'Utilisez {year} pour l\'année dynamique',
            initialValue: '© {year} Clinique OKBA. Tous droits réservés.',
        }),
        defineField({
            name: 'newsletterTitle',
            title: 'Titre Newsletter',
            type: 'string',
        }),
        defineField({
            name: 'newsletterDescription',
            title: 'Description Newsletter',
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
