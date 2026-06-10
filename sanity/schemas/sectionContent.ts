import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'sectionContent',
    title: '📝 Contenus des Sections',
    type: 'document',
    fields: [
        defineField({
            name: 'sectionId',
            title: 'Identifiant de Section',
            type: 'string',
            validation: (Rule) => Rule.required(),
            options: {
                list: [
                    { title: 'Hero', value: 'hero' },
                    { title: 'À Propos', value: 'about' },
                    { title: 'Services', value: 'services' },
                    { title: 'Spécialités', value: 'specialties' },
                    { title: 'Technologies', value: 'technology' },
                    { title: 'Témoignages', value: 'testimonials' },
                    { title: 'Galerie', value: 'gallery' },
                    { title: 'Contact', value: 'contact' },
                    { title: 'FAQ', value: 'faq' },
                    { title: 'Docteurs', value: 'doctors' },
                    { title: 'Soins à Domicile', value: 'homecare' },
                ],
            },
        }),
        defineField({
            name: 'badge',
            title: 'Badge / Label',
            type: 'string',
            description: 'Petit texte au-dessus du titre (ex: "Notre Excellence")',
        }),
        defineField({
            name: 'title',
            title: 'Titre',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: 'Sous-titre',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'ctaText',
            title: 'Texte du bouton CTA',
            type: 'string',
        }),
        defineField({
            name: 'ctaLink',
            title: 'Lien du bouton CTA',
            type: 'string',
        }),
        defineField({
            name: 'videoFile',
            title: 'Fichier vidéo (section « Vidéo » uniquement)',
            type: 'file',
            options: { accept: 'video/*' },
            description: 'Vidéo de présentation. Laisser vide pour conserver la vidéo par défaut.',
        }),
        defineField({
            name: 'videoPoster',
            title: 'Image de couverture de la vidéo',
            type: 'image',
            options: { hotspot: true },
        }),
    ],
    preview: {
        select: { title: 'sectionId', subtitle: 'title' },
        prepare({ title, subtitle }) {
            const sectionNames: Record<string, string> = {
                hero: '🏠 Hero',
                about: '📖 À Propos',
                services: '🏥 Services',
                specialties: '⚕️ Spécialités',
                technology: '🔬 Technologies',
                testimonials: '⭐ Témoignages',
                gallery: '🖼️ Galerie',
                contact: '📞 Contact',
                faq: '❓ FAQ',
                doctors: '👨‍⚕️ Docteurs',
                homecare: '🏠 Soins à Domicile',
            }
            return {
                title: sectionNames[title] || title,
                subtitle: subtitle,
            }
        },
    },
})
