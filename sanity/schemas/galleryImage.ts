import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'galleryImage',
    title: 'Image Galerie',
    type: 'document',
    fields: [
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'caption',
            title: 'Légende',
            type: 'string',
        }),
        defineField({
            name: 'category',
            title: 'Catégorie',
            type: 'string',
            options: {
                list: [
                    { title: 'Infrastructure', value: 'infrastructure' },
                    { title: 'Extérieur', value: 'exterior' },
                    { title: 'Équipements', value: 'equipment' },
                    { title: 'Personnel', value: 'staff' },
                    { title: 'Patients', value: 'patients' },
                ],
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
            title: 'caption',
            subtitle: 'category',
            media: 'image',
        },
        prepare({ title, subtitle, media }) {
            return {
                title: title || 'Sans légende',
                subtitle: subtitle,
                media,
            }
        },
    },
})
