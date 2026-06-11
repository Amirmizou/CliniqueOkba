import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'service',
    title: '🏥 Services',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nom du Service',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'name_ar',
            title: 'Nom du Service (AR)',
            type: 'string',
            }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'name', maxLength: 96 },
        }),
        defineField({
            name: 'description',
            title: 'Description Courte',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'description_ar',
            title: 'Description Courte (AR)',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'fullDescription',
            title: 'Description Complète',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'fullDescription_ar',
            title: 'Description Complète (AR)',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'icon',
            title: 'Icône (nom Lucide)',
            type: 'string',
            description: 'Exemple: Heart, Stethoscope, Brain, etc.',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'features',
            title: 'Caractéristiques',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'price',
            title: 'Prix (optionnel)',
            type: 'string',
            description: 'Exemple: À partir de 5000 DA',
        }),
        defineField({
            name: 'duration',
            title: 'Durée (optionnel)',
            type: 'string',
            description: 'Exemple: 30 min - 1h',
        }),
        defineField({
            name: 'category',
            title: 'Catégorie',
            type: 'string',
            options: {
                list: [
                    { title: 'Consultation', value: 'consultation' },
                    { title: 'Imagerie', value: 'imaging' },
                    { title: 'Chirurgie', value: 'surgery' },
                    { title: 'Laboratoire', value: 'laboratory' },
                    { title: 'Soins à domicile', value: 'homecare' },
                    { title: 'Urgences', value: 'emergency' },
                ],
            },
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
        defineField({
            name: 'featured',
            title: 'Mise en avant',
            type: 'boolean',
            initialValue: false,
            description: 'Afficher en premier sur la page d\'accueil',
        }),
    ],
    orderings: [
        { title: 'Ordre', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'category',
            media: 'image',
        },
    },
})
