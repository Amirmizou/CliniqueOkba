import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'specialty',
    title: 'Spécialité Médicale',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nom',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'icon',
            title: 'Icône',
            type: 'string',
            description: 'Nom de l\'icône Lucide',
            options: {
                list: [
                    { title: 'Cœur (Cardiologie)', value: 'Heart' },
                    { title: 'Vent (Pneumologie)', value: 'Wind' },
                    { title: 'Cerveau (Neurologie)', value: 'Brain' },
                    { title: 'Œil (Ophtalmologie)', value: 'Eye' },
                    { title: 'Sourire (Dentisterie)', value: 'Smile' },
                    { title: 'Bébé (Pédiatrie)', value: 'Baby' },
                    { title: 'Stéthoscope (Médecine interne)', value: 'Stethoscope' },
                    { title: 'Os (Rhumatologie)', value: 'Bone' },
                    { title: 'Oreille (ORL)', value: 'Ear' },
                    { title: 'Seringue (Dermatologie)', value: 'Syringe' },
                ],
            },
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
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
            subtitle: 'description',
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
