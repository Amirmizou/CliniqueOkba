import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'pageSeo',
    title: '🔍 SEO des Pages',
    type: 'document',
    fields: [
        defineField({
            name: 'page',
            title: 'Page',
            type: 'string',
            validation: (Rule) => Rule.required(),
            options: {
                list: [
                    { title: 'Accueil', value: 'home' },
                    { title: 'À Propos', value: 'about' },
                    { title: 'Services', value: 'services' },
                    { title: 'Contact', value: 'contact' },
                    { title: 'Galerie', value: 'gallery' },
                    { title: 'Équipe', value: 'team' },
                    { title: 'FAQ', value: 'faq' },
                    { title: 'Blog', value: 'blog' },
                ],
            },
        }),
        defineField({
            name: 'metaTitle',
            title: 'Meta Title',
            type: 'string',
            description: 'Titre pour les moteurs de recherche (50-60 caractères)',
            validation: (Rule) => Rule.max(70),
        }),
        defineField({
            name: 'metaTitle_ar',
            title: 'Meta Title (AR)',
            type: 'string',
            description: 'Titre pour les moteurs de recherche (50-60 caractères)',
            }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description',
            type: 'text',
            rows: 3,
            description: 'Description pour les moteurs de recherche (150-160 caractères)',
            validation: (Rule) => Rule.max(170),
        }),
        defineField({
            name: 'metaDescription_ar',
            title: 'Meta Description (AR)',
            type: 'text',
            rows: 3,
            description: 'Description pour les moteurs de recherche (150-160 caractères)',
            }),
        defineField({
            name: 'ogImage',
            title: 'Image OpenGraph',
            type: 'image',
            description: 'Image pour les réseaux sociaux (1200x630 recommandé)',
        }),
        defineField({
            name: 'keywords',
            title: 'Mots-clés',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'keywords_ar',
            title: 'Mots-clés (AR)',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'canonicalUrl',
            title: 'URL Canonique',
            type: 'url',
        }),
        defineField({
            name: 'canonicalUrl_ar',
            title: 'URL Canonique (AR)',
            type: 'url',
        }),
        defineField({
            name: 'noIndex',
            title: 'No Index',
            type: 'boolean',
            initialValue: false,
            description: 'Empêcher l\'indexation par les moteurs de recherche',
        }),
    ],
    preview: {
        select: { title: 'page', subtitle: 'metaTitle' },
        prepare({ title, subtitle }) {
            const pageNames: Record<string, string> = {
                home: '🏠 Accueil',
                about: '📖 À Propos',
                services: '🏥 Services',
                contact: '📞 Contact',
                gallery: '🖼️ Galerie',
                team: '👨‍⚕️ Équipe',
                faq: '❓ FAQ',
                blog: '📝 Blog',
            }
            return {
                title: pageNames[title] || title,
                subtitle: subtitle,
            }
        },
    },
})
