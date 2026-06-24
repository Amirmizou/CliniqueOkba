import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'doctor',
    title: 'Médecin',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nom complet (FR)',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'name_ar',
            title: 'Nom complet (AR)',
            type: 'string',
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
            title: 'Spécialité (FR)',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'specialty_ar',
            title: 'Spécialité (AR)',
            type: 'string',
        }),
        defineField({
            name: 'title',
            title: 'Titre (Dr., Pr., etc.) (FR)',
            type: 'string',
            initialValue: 'Dr.',
        }),
        defineField({
            name: 'title_ar',
            title: 'Titre (Dr., Pr., etc.) (AR)',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: 'Sous-titre / mention (FR)',
            type: 'string',
            description: 'Ex : « Ancienne Maître Assistante » ou une sous-spécialité',
        }),
        defineField({
            name: 'subtitle_ar',
            title: 'Sous-titre / mention (AR)',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Affiche / Photo',
            type: 'image',
            description: 'Affiche officielle du médecin (format portrait recommandé)',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'experience',
            title: 'Expérience (FR)',
            type: 'string',
            description: 'Ex : « Plus de 25 ans d’expérience » (optionnel)',
        }),
        defineField({
            name: 'experience_ar',
            title: 'Expérience (AR)',
            type: 'string',
        }),
        defineField({
            name: 'services',
            title: 'Prestations / actes (FR)',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Liste des prestations affichées sur la carte',
        }),
        defineField({
            name: 'services_ar',
            title: 'Prestations / actes (AR)',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'videos',
            title: 'Vidéos (liens)',
            type: 'array',
            of: [{ type: 'url' }],
            description:
                'Liens de présentation du médecin (YouTube, Facebook ou MP4). Affichés dans une fenêtre vidéo sur la carte.',
        }),
        defineField({
            name: 'consultationHours',
            title: 'Horaires de consultation',
            type: 'string',
            description: 'Ex : 08h00 – 16h00',
        }),
        defineField({
            name: 'consultationHours_ar',
            title: 'Horaires de consultation (AR)',
            type: 'string',
            description: 'Ex : من 08:00 إلى 16:00',
        }),
        defineField({
            name: 'accentColor',
            title: 'Couleur d’accent',
            type: 'string',
            description: 'Couleur HEX de la carte (ex : #A855F7)',
            initialValue: '#006633',
        }),
        defineField({
            name: 'iconName',
            title: 'Icône de la spécialité',
            type: 'string',
            options: {
                list: [
                    { title: 'Gynéco / Pédiatrie (bébé)', value: 'Baby' },
                    { title: 'Endocrino (activité)', value: 'Activity' },
                    { title: 'Médecine interne (stéthoscope)', value: 'Stethoscope' },
                    { title: 'ORL (oreille)', value: 'Ear' },
                    { title: 'Cardiologie (cœur)', value: 'Heart' },
                    { title: 'Dentaire (sourire)', value: 'Smile' },
                    { title: 'Laboratoire (fiole)', value: 'FlaskConical' },
                ],
            },
            initialValue: 'Stethoscope',
        }),
        defineField({
            name: 'bio',
            title: 'Biographie (FR)',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'bio_ar',
            title: 'Biographie (AR)',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'qualifications',
            title: 'Diplômes et qualifications (FR)',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'qualifications_ar',
            title: 'Diplômes et qualifications (AR)',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'languages',
            title: 'Langues parlées (FR)',
            type: 'array',
            of: [{ type: 'string' }],
            initialValue: ['Français', 'Arabe'],
        }),
        defineField({
            name: 'languages_ar',
            title: 'Langues parlées (AR)',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'consultationDays',
            title: 'Jours de consultation (FR)',
            type: 'string',
            description: 'Ex: Lundi, Mercredi, Vendredi',
        }),
        defineField({
            name: 'consultationDays_ar',
            title: 'Jours de consultation (AR)',
            type: 'string',
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
