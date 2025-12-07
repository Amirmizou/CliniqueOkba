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
    ],
    preview: {
        prepare() {
            return {
                title: 'Paramètres du Site',
            }
        },
    },
})
