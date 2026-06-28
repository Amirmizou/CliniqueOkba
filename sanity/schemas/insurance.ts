import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'insuranceSection',
    title: '🛡️ Conventions & Prise en charge',
    type: 'document',
    fields: [
        defineField({
            name: 'badge',
            title: 'Badge / Label',
            type: 'string',
            description: 'Petit texte au-dessus du titre (ex : « Prise en charge »)',
            initialValue: 'Prise en charge',
        }),
        defineField({
            name: 'badge_ar',
            title: 'Badge / Label (AR)',
            type: 'string',
        }),
        defineField({
            name: 'title',
            title: 'Titre',
            type: 'string',
            initialValue: 'Conventions & Remboursement',
        }),
        defineField({
            name: 'title_ar',
            title: 'Titre (AR)',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: 'Sous-titre',
            type: 'text',
            rows: 2,
            initialValue:
                'La Clinique OKBA vous accompagne dans vos démarches de prise en charge et de remboursement.',
        }),
        defineField({
            name: 'subtitle_ar',
            title: 'Sous-titre (AR)',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'providers',
            title: 'Organismes & dispositifs',
            type: 'array',
            description: 'CNAS, CASNOS, mutuelles, tiers payant, etc.',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'name',
                            title: 'Nom',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'name_ar',
                            title: 'Nom (AR)',
                            type: 'string',
                        }),
                        defineField({
                            name: 'description',
                            title: 'Description',
                            type: 'text',
                            rows: 2,
                        }),
                        defineField({
                            name: 'description_ar',
                            title: 'Description (AR)',
                            type: 'text',
                            rows: 2,
                        }),
                        defineField({
                            name: 'logo',
                            title: 'Logo (optionnel)',
                            type: 'image',
                            options: { hotspot: true },
                        }),
                        defineField({
                            name: 'signaturePhotos',
                            title: 'Photos de signature de la convention',
                            type: 'array',
                            description: 'Photos de l\\'événement de signature (s\\'il y en a)',
                            of: [{ type: 'image', options: { hotspot: true } }],
                        }),
                    ],
                    preview: {
                        select: { title: 'name', subtitle: 'description', media: 'logo' },
                    },
                },
            ],
        }),
        defineField({
            name: 'note',
            title: 'Note de bas de section',
            type: 'text',
            rows: 2,
            description:
                'Ex : « Présentez votre carte CHIFA à l’accueil. Pour toute question sur votre prise en charge, contactez-nous. »',
        }),
        defineField({
            name: 'note_ar',
            title: 'Note de bas de section (AR)',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'ctaText',
            title: 'Texte du bouton',
            type: 'string',
            initialValue: 'Vérifier ma prise en charge',
        }),
        defineField({
            name: 'ctaText_ar',
            title: 'Texte du bouton (AR)',
            type: 'string',
        }),
        defineField({
            name: 'active',
            title: 'Afficher la section',
            type: 'boolean',
            initialValue: true,
        }),
    ],
    preview: {
        select: { title: 'title', active: 'active' },
        prepare({ title, active }) {
            return {
                title: `${active ? '' : '🔴 '}${title || 'Conventions & Prise en charge'}`,
                subtitle: '🛡️ Section prise en charge',
            }
        },
    },
})
