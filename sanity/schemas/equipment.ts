import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'equipment',
    title: 'Équipement Médical',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nom',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'brand',
            title: 'Marque',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'model',
            title: 'Modèle',
            type: 'string',
        }),
        defineField({
            name: 'category',
            title: 'Catégorie',
            type: 'string',
            options: {
                list: [
                    { title: 'Imagerie', value: 'imaging' },
                    { title: 'Laboratoire', value: 'laboratory' },
                    { title: 'Infrastructure', value: 'facility' },
                    { title: 'Chirurgie', value: 'surgery' },
                ],
            },
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'icon',
            title: 'Icône',
            type: 'string',
            description: 'Nom de l\'icône Lucide (ex: Scan, Brain, Activity)',
            options: {
                list: [
                    { title: 'Scanner', value: 'Scan' },
                    { title: 'Cerveau (IRM)', value: 'Brain' },
                    { title: 'Activité', value: 'Activity' },
                    { title: 'Cœur', value: 'Heart' },
                    { title: 'Radio', value: 'Radio' },
                    { title: 'Sourire (Dentaire)', value: 'Smile' },
                    { title: 'Laboratoire', value: 'FlaskConical' },
                    { title: 'Chirurgie', value: 'Scissors' },
                ],
            },
        }),
        defineField({
            name: 'image',
            title: 'Photo',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'features',
            title: 'Caractéristiques',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'order',
            title: 'Ordre d\'affichage',
            type: 'number',
            initialValue: 0,
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'brand',
            media: 'image',
        },
    },
    orderings: [
        {
            title: 'Ordre',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
})
