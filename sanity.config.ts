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
                    .title('🏥 Clinique OKBA - CMS')
                    .items([
                        // ⚙️ PARAMÈTRES GÉNÉRAUX
                        S.listItem()
                            .title('⚙️ Paramètres Généraux')
                            .child(
                                S.list()
                                    .title('Paramètres')
                                    .items([
                                        S.listItem()
                                            .title('Informations du Site')
                                            .icon(() => '🏥')
                                            .child(
                                                S.document()
                                                    .schemaType('siteSettings')
                                                    .documentId('siteSettings')
                                            ),
                                        S.listItem()
                                            .title('Contenu du Footer')
                                            .icon(() => '🦶')
                                            .child(
                                                S.document()
                                                    .schemaType('footerContent')
                                                    .documentId('footerContent')
                                            ),
                                        S.listItem()
                                            .title('SEO des Pages')
                                            .icon(() => '🔍')
                                            .child(S.documentTypeList('pageSeo').title('SEO des Pages')),
                                    ])
                            ),

                        S.divider(),

                        // 🏠 PAGE D'ACCUEIL
                        S.listItem()
                            .title('🏠 Page d\'Accueil')
                            .child(
                                S.list()
                                    .title('Contenu Accueil')
                                    .items([
                                        S.listItem()
                                            .title('Slides Hero (Carrousel)')
                                            .icon(() => '🎬')
                                            .child(S.documentTypeList('heroSlide').title('Slides Hero')),
                                        S.listItem()
                                            .title('Section À Propos')
                                            .icon(() => '📖')
                                            .child(
                                                S.document()
                                                    .schemaType('aboutSection')
                                                    .documentId('aboutSection')
                                            ),
                                        S.listItem()
                                            .title('Titres des Sections')
                                            .icon(() => '📝')
                                            .child(S.documentTypeList('sectionContent').title('Contenus des Sections')),
                                    ])
                            ),

                        S.divider(),

                        // 🏥 SERVICES
                        S.listItem()
                            .title('🏥 Services & Prestations')
                            .child(
                                S.list()
                                    .title('Services')
                                    .items([
                                        S.listItem()
                                            .title('Tous les Services')
                                            .icon(() => '🏥')
                                            .child(S.documentTypeList('service').title('Services')),
                                        S.listItem()
                                            .title('Soins à Domicile')
                                            .icon(() => '🏠')
                                            .child(
                                                S.document()
                                                    .schemaType('homeCare')
                                                    .documentId('homeCare')
                                            ),
                                    ])
                            ),

                        S.divider(),

                        // ⚕️ CONTENU MÉDICAL
                        S.listItem()
                            .title('⚕️ Contenu Médical')
                            .child(
                                S.list()
                                    .title('Contenu Médical')
                                    .items([
                                        S.listItem()
                                            .title('Spécialités Médicales')
                                            .icon(() => '🩺')
                                            .child(S.documentTypeList('specialty').title('Spécialités')),
                                        S.listItem()
                                            .title('Équipements & Technologies')
                                            .icon(() => '🔬')
                                            .child(S.documentTypeList('equipment').title('Équipements')),
                                        S.listItem()
                                            .title('Équipe Médicale')
                                            .icon(() => '👨‍⚕️')
                                            .child(S.documentTypeList('doctor').title('Équipe Médicale')),
                                    ])
                            ),

                        S.divider(),

                        // ⭐ TÉMOIGNAGES & AVIS
                        S.listItem()
                            .title('⭐ Témoignages Patients')
                            .icon(() => '⭐')
                            .child(S.documentTypeList('testimonial').title('Témoignages')),

                        S.divider(),

                        // 📸 MÉDIAS
                        S.listItem()
                            .title('📸 Galerie Photos')
                            .icon(() => '📸')
                            .child(S.documentTypeList('galleryImage').title('Galerie')),

                        S.divider(),

                        // 📰 PUBLICATIONS
                        S.listItem()
                            .title('📰 Publications & Blog')
                            .child(
                                S.list()
                                    .title('Publications')
                                    .items([
                                        S.listItem()
                                            .title('Articles de Blog')
                                            .icon(() => '📝')
                                            .child(S.documentTypeList('article').title('Articles')),
                                        S.listItem()
                                            .title('FAQ')
                                            .icon(() => '❓')
                                            .child(S.documentTypeList('faq').title('FAQ')),
                                    ])
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
        productionUrl: async (prev, { document }: { document: any }) => {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

            if (document._type === 'article' && document.slug?.current) {
                return `${baseUrl}/actualites/${document.slug.current}`
            }
            if (document._type === 'doctor' && document.slug?.current) {
                return `${baseUrl}/equipe/${document.slug.current}`
            }
            if (document._type === 'service' && document.slug?.current) {
                return `${baseUrl}/services/${document.slug.current}`
            }

            return prev
        },
    },
})
