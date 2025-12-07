import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
    name: 'clinique-okba-studio',
    title: 'Clinique OKBA - Gestion du Contenu',

    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Contenu')
                    .items([
                        S.listItem()
                            .title('🏠 Slides Hero')
                            .child(S.documentTypeList('heroSlide').title('Slides Hero')),
                        S.listItem()
                            .title('🏥 Équipements Médicaux')
                            .child(S.documentTypeList('equipment').title('Équipements')),
                        S.listItem()
                            .title('⚕️ Spécialités')
                            .child(S.documentTypeList('specialty').title('Spécialités')),
                        S.listItem()
                            .title('🖼️ Galerie')
                            .child(S.documentTypeList('galleryImage').title('Images Galerie')),
                        S.listItem()
                            .title('📰 Articles')
                            .child(S.documentTypeList('article').title('Articles')),
                        S.divider(),
                        S.listItem()
                            .title('⚙️ Paramètres du Site')
                            .child(
                                S.document()
                                    .schemaType('siteSettings')
                                    .documentId('siteSettings')
                            ),
                    ]),
        }),
        visionTool({ defaultApiVersion: '2024-01-01' }),
    ],

    schema: {
        types: schemaTypes,
    },
})
