import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'faq',
    title: 'FAQ',
    type: 'document',
    fields: [
        defineField({
            name: 'question',
            title: 'Question',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'answer',
            title: 'Réponse',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Catégorie',
            type: 'string',
            options: {
                list: [
                    { title: 'Rendez-vous', value: 'appointment' },
                    { title: 'Examens', value: 'exams' },
                    { title: 'Paiement', value: 'payment' },
                    { title: 'Urgences', value: 'emergency' },
                    { title: 'Général', value: 'general' },
                ],
            },
            initialValue: 'general',
        }),
        defineField({
            name: 'order',
            title: 'Ordre d\'affichage',
            type: 'number',
            initialValue: 0,
        }),
        defineField({
            name: 'active',
            title: 'Actif',
            type: 'boolean',
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: 'question',
            subtitle: 'category',
            active: 'active',
        },
        prepare({ title, subtitle, active }) {
            const categoryLabels: Record<string, string> = {
                appointment: '📅 Rendez-vous',
                exams: '🔬 Examens',
                payment: '💳 Paiement',
                emergency: '🚨 Urgences',
                general: '❓ Général',
            }
            return {
                title: `${active ? '' : '🔴 '}${title}`,
                subtitle: categoryLabels[subtitle] || subtitle,
            }
        },
    },
    orderings: [
        {
            title: 'Ordre d\'affichage',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
        {
            title: 'Par catégorie',
            name: 'categoryAsc',
            by: [{ field: 'category', direction: 'asc' }],
        },
    ],
})
