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
            name: 'subtitle',
            title: 'Sous-titre / mention',
            type: 'string',
            description: 'Ex : « Ancienne Maître Assistante » ou une sous-spécialité',
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
            title: 'Expérience',
            type: 'string',
            description: 'Ex : « Plus de 25 ans d’expérience » (optionnel)',
        }),
        defineField({
            name: 'services',
            title: 'Prestations / actes',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Liste des prestations affichées sur la carte',
        }),
        defineField({
            name: 'consultationHours',
            title: 'Horaires de consultation',
            type: 'string',
            description: 'Ex : 08h00 – 16h00',
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
