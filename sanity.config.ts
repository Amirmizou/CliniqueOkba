import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
    name: 'clinique-okba-studio',
    title: 'Clinique OKBA - Gestion du Contenu',
    basePath: '/studio',

    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Contenu')
                    .items([
                        // 🏠 ACCUEIL
                        S.listItem()
                            .title('🏠 Accueil')
                            .child(
                                S.list()
                                    .title('Contenu Accueil')
                                    .items([
                                        S.listItem()
                                            .title('Slides Hero')
                                            .icon(() => '🎬')
                                            .child(S.documentTypeList('heroSlide').title('Slides Hero')),
                                        S.listItem()
                                            .title('Galerie Photos')
                                            .icon(() => '📸')
                                            .child(S.documentTypeList('galleryImage').title('Galerie')),
                                    ])
                            ),

                        S.divider(),

                        // ⚕️ MÉDICAL
                        S.listItem()
                            .title('⚕️ Contenu Médical')
                            .child(
                                S.list()
                                    .title('Contenu Médical')
                                    .items([
                                        S.listItem()
                                            .title('Spécialités')
                                            .icon(() => '🩺')
                                            .child(S.documentTypeList('specialty').title('Spécialités')),
                                        S.listItem()
                                            .title('Équipements')
                                            .icon(() => '🏥')
                                            .child(S.documentTypeList('equipment').title('Équipements')),
                                        S.listItem()
                                            .title('Équipe Médicale')
                                            .icon(() => '👨‍⚕️')
                                            .child(S.documentTypeList('doctor').title('Équipe Médicale')),
                                    ])
                            ),

                        S.divider(),

                        // 📰 PUBLICATIONS
                        S.listItem()
                            .title('📰 Publications')
                            .child(
                                S.list()
                                    .title('Publications')
                                    .items([
                                        S.listItem()
                                            .title('Articles')
                                            .icon(() => '📝')
                                            .child(S.documentTypeList('article').title('Articles')),
                                        S.listItem()
                                            .title('FAQ')
                                            .icon(() => '❓')
                                            .child(S.documentTypeList('faq').title('FAQ')),
                                    ])
                            ),

                        S.divider(),

                        // ⚙️ PARAMÈTRES
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

    document: {
        // Preview URLs pour voir le rendu
        productionUrl: async (prev, { document }) => {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

            if (document._type === 'article' && document.slug?.current) {
                return `${baseUrl}/actualites/${document.slug.current}`
            }
            if (document._type === 'doctor' && document.slug?.current) {
                return `${baseUrl}/equipe/${document.slug.current}`
            }

            return prev
        },
    },
})
