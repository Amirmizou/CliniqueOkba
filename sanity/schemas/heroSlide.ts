import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'heroSlide',
    title: 'Slide Hero',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title_ar',
            title: 'Titre (AR)',
            type: 'string',
            }),
        defineField({
            name: 'subtitle',
            title: 'Sous-titre',
            type: 'string',
        }),
        defineField({
            name: 'subtitle_ar',
            title: 'Sous-titre (AR)',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Image (ou laisser vide si vidéo)',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'videoFile',
            title: 'Vidéo (optionnel — remplace l\'image si présente)',
            type: 'file',
            options: {
                accept: 'video/mp4,video/webm',
            },
        }),
        defineField({
            name: 'order',
            title: 'Ordre d\'affichage',
            type: 'number',
            initialValue: 1,
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
            title: 'title',
            media: 'image',
            active: 'active',
        },
        prepare({ title, media, active }) {
            return {
                title: title,
                subtitle: active ? '✅ Actif' : '❌ Inactif',
                media,
            }
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
