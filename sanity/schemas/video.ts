import { defineField, defineType } from 'sanity'

/**
 * Vidéos de la clinique — section « Vidéothèque » de la page d'accueil.
 * L'admin téléverse directement le fichier vidéo (MP4/WebM) + une affiche.
 * La section ne s'affiche que s'il existe au moins une vidéo active.
 */
export default defineType({
    name: 'video',
    title: 'Vidéos',
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
            name: 'videoFile',
            title: 'Fichier vidéo',
            type: 'file',
            options: { accept: 'video/mp4,video/webm' },
            validation: (Rule) => Rule.required(),
            description: 'MP4 recommandé (H.264). Compressez la vidéo avant envoi (max ~100 Mo).',
        }),
        defineField({
            name: 'poster',
            title: 'Affiche (image de couverture)',
            type: 'image',
            options: { hotspot: true },
            description: 'Image affichée avant la lecture. Fortement recommandé.',
        }),
        defineField({
            name: 'order',
            title: 'Ordre d’affichage',
            type: 'number',
            initialValue: 0,
        }),
        defineField({
            name: 'category',
            title: 'Catégorie / Service',
            type: 'string',
            options: {
                list: [
                    { title: 'Général', value: 'general' },
                    { title: 'Podcast / Interview', value: 'podcast' },
                    { title: 'Imagerie Médicale', value: 'imagerie' },
                    { title: 'Médecine Nucléaire', value: 'nucleaire' },
                    { title: 'Pôle Dentaire', value: 'dentaire' },
                    { title: 'Maternité & Pédiatrie', value: 'maternite' },
                    { title: 'Urgences & Réanimation', value: 'urgences' },
                    { title: 'Chirurgie', value: 'chirurgie' },
                    { title: 'Laboratoire', value: 'laboratoire' },
                    { title: 'Autre (Préciser dans le titre)', value: 'autre' }
                ],
            },
            initialValue: 'general',
        }),
        defineField({
            name: 'active',
            title: 'Active',
            type: 'boolean',
            initialValue: true,
        }),
    ],
    orderings: [
        {
            title: 'Ordre',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
    preview: {
        select: { title: 'title', media: 'poster', active: 'active', category: 'category' },
        prepare({ title, media, active, category }) {
            const catEmoji = category === 'podcast' ? '🎙️ ' : '🎬 '
            return {
                title: `${active === false ? '🚫 ' : catEmoji}${title}`,
                subtitle: category || 'general',
                media,
            }
        },
    },
})
