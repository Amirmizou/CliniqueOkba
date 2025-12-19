import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'doctor',
    title: 'Médecin',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nom complet',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'URL (slug)',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'specialty',
            title: 'Spécialité',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title',
            title: 'Titre (Dr., Pr., etc.)',
            type: 'string',
            initialValue: 'Dr.',
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
            name: 'bio',
            title: 'Biographie',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'qualifications',
            title: 'Diplômes et qualifications',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'languages',
            title: 'Langues parlées',
            type: 'array',
            of: [{ type: 'string' }],
            initialValue: ['Français', 'Arabe'],
        }),
        defineField({
            name: 'consultationDays',
            title: 'Jours de consultation',
            type: 'string',
            description: 'Ex: Lundi, Mercredi, Vendredi',
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
            title: 'name',
            subtitle: 'specialty',
            media: 'image',
            active: 'active',
        },
        prepare({ title, subtitle, media, active }) {
            return {
                title: `${active ? '' : '🔴 '}${title}`,
                subtitle,
                media,
            }
        },
    },
    orderings: [
        {
            title: 'Ordre d\'affichage',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
})
