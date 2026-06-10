import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'siteSettings',
    title: 'Paramètres du Site',
    type: 'document',
    fields: [
        defineField({
            name: 'clinicName',
            title: 'Nom de la Clinique',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
        }),
        defineField({
            name: 'phone',
            title: 'Téléphone',
            type: 'string',
        }),
        defineField({
            name: 'whatsappNumber',
            title: 'Numéro WhatsApp (Rendez-vous)',
            description:
                'Numéro qui recevra les demandes de rendez-vous via WhatsApp. Format international sans + ni espaces, ex : 213770884242. Un 0 initial sera converti en 213.',
            type: 'string',
        }),
        defineField({
            name: 'appointmentMessage',
            title: 'Message WhatsApp pré-rempli (Rendez-vous)',
            description:
                'Phrase d’introduction du message de demande de rendez-vous. Laisser vide pour utiliser le message par défaut.',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
        }),
        defineField({
            name: 'address',
            title: 'Adresse',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'coordinates',
            title: 'Coordonnées GPS',
            type: 'object',
            fields: [
                { name: 'lat', title: 'Latitude', type: 'number' },
                { name: 'lng', title: 'Longitude', type: 'number' },
            ],
        }),
        defineField({
            name: 'hours',
            title: 'Horaires',
            type: 'object',
            fields: [
                { name: 'emergency', title: 'Urgences', type: 'string' },
                { name: 'weekdays', title: 'Jours ouvrables', type: 'string' },
                { name: 'saturday', title: 'Vendredi/Samedi', type: 'string' },
            ],
        }),
        defineField({
            name: 'social',
            title: 'Réseaux Sociaux',
            type: 'object',
            fields: [
                { name: 'facebook', title: 'Facebook', type: 'url' },
                { name: 'instagram', title: 'Instagram', type: 'url' },
            ],
        }),
        defineField({
            name: 'heroStats',
            title: 'Statistiques (bandeau Accueil)',
            description: 'Chiffres-clés affichés sous le hero (ex : 8 Spécialités, 24/7 Urgences)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'value', title: 'Valeur', type: 'string' },
                        { name: 'label', title: 'Libellé', type: 'string' },
                    ],
                    preview: {
                        select: { title: 'value', subtitle: 'label' },
                    },
                },
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Paramètres du Site',
            }
        },
    },
})
