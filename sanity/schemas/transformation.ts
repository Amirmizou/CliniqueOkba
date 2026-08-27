import { defineField, defineType } from 'sanity'

/**
 * Annonce de la transformation « Clinique Okba » → « Hôpital Okba ».
 * Document unique (singleton) : une seule fiche à éditer dans le Studio.
 * Passer « Annonce active » à non pour retirer la section du site.
 */
export default defineType({
    name: 'transformation',
    title: '🏥 Annonce — Hôpital Okba',
    type: 'document',
    groups: [
        { name: 'general', title: 'Général', default: true },
        { name: 'timeline', title: 'Étapes' },
        { name: 'highlights', title: 'Nouveautés' },
    ],
    fields: [
        defineField({
            name: 'enabled',
            title: 'Annonce active (afficher sur le site)',
            type: 'boolean',
            initialValue: true,
            group: 'general',
        }),
        defineField({
            name: 'badge',
            title: 'Badge (FR)',
            type: 'string',
            initialValue: 'Annonce officielle',
            group: 'general',
        }),
        defineField({
            name: 'badge_ar',
            title: 'Badge (AR)',
            type: 'string',
            initialValue: 'إعلان رسمي',
            group: 'general',
        }),
        defineField({
            name: 'fromWord',
            title: 'Mot de départ (FR) — ex. « Clinique »',
            type: 'string',
            initialValue: 'Clinique',
            group: 'general',
        }),
        defineField({
            name: 'fromWord_ar',
            title: 'Mot de départ (AR)',
            type: 'string',
            initialValue: 'عيادة',
            group: 'general',
        }),
        defineField({
            name: 'toWord',
            title: "Mot d'arrivée (FR) — ex. « Hôpital »",
            type: 'string',
            initialValue: 'Hôpital',
            group: 'general',
        }),
        defineField({
            name: 'toWord_ar',
            title: "Mot d'arrivée (AR)",
            type: 'string',
            initialValue: 'مستشفى',
            group: 'general',
        }),
        defineField({
            name: 'brandWord',
            title: 'Mot invariable (FR) — ex. « Okba »',
            type: 'string',
            initialValue: 'Okba',
            group: 'general',
        }),
        defineField({
            name: 'brandWord_ar',
            title: 'Mot invariable (AR)',
            type: 'string',
            initialValue: 'عقبة',
            group: 'general',
        }),
        defineField({
            name: 'kicker',
            title: 'Accroche au-dessus du titre (FR)',
            type: 'string',
            initialValue: 'Une nouvelle dimension du soin à Batna',
            group: 'general',
        }),
        defineField({
            name: 'kicker_ar',
            title: 'Accroche au-dessus du titre (AR)',
            type: 'string',
            initialValue: 'بعد جديد للرعاية الصحية في باتنة',
            group: 'general',
        }),
        defineField({
            name: 'subtitle',
            title: "Texte d'annonce (FR)",
            type: 'text',
            rows: 3,
            initialValue:
                "La Clinique Okba devient prochainement l'Hôpital Okba : plus de lits, plus de spécialités, un plateau technique élargi — avec la même équipe et la même exigence depuis le premier jour.",
            group: 'general',
        }),
        defineField({
            name: 'subtitle_ar',
            title: "Texte d'annonce (AR)",
            type: 'text',
            rows: 3,
            initialValue:
                'تتحول عيادة عقبة قريباً إلى مستشفى عقبة: أسرّة أكثر، تخصصات أوسع، وتجهيزات تقنية متطورة — بنفس الفريق ونفس مستوى الالتزام منذ اليوم الأول.',
            group: 'general',
        }),
        defineField({
            name: 'targetDate',
            title: "Date d'ouverture visée (facultatif — active le compte à rebours)",
            type: 'datetime',
            description: 'Laisser vide pour afficher simplement « Prochainement ».',
            group: 'general',
        }),
        defineField({
            name: 'ctaText',
            title: 'Texte du bouton (FR)',
            type: 'string',
            initialValue: 'Nous contacter',
            group: 'general',
        }),
        defineField({
            name: 'ctaText_ar',
            title: 'Texte du bouton (AR)',
            type: 'string',
            initialValue: 'اتصل بنا',
            group: 'general',
        }),
        defineField({
            name: 'ctaHref',
            title: 'Lien du bouton',
            type: 'string',
            initialValue: '#contact',
            group: 'general',
        }),
        defineField({
            name: 'milestones',
            title: 'Étapes du projet',
            type: 'array',
            group: 'timeline',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'period', title: 'Période (FR — ex. « 2026 »)', type: 'string' },
                        { name: 'period_ar', title: 'Période (AR)', type: 'string' },
                        { name: 'label', title: 'Libellé (FR)', type: 'string' },
                        { name: 'label_ar', title: 'Libellé (AR)', type: 'string' },
                        {
                            name: 'status',
                            title: 'Statut',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Terminé', value: 'done' },
                                    { title: 'En cours', value: 'current' },
                                    { title: 'À venir', value: 'upcoming' },
                                ],
                                layout: 'radio',
                            },
                            initialValue: 'upcoming',
                        },
                    ],
                    preview: { select: { title: 'label', subtitle: 'period' } },
                },
            ],
        }),
        defineField({
            name: 'highlights',
            title: 'Ce qui change',
            type: 'array',
            group: 'highlights',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'icon',
                            title: 'Icône',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Lit / hospitalisation', value: 'BedDouble' },
                                    { title: 'Urgences', value: 'Siren' },
                                    { title: 'Bloc opératoire', value: 'Stethoscope' },
                                    { title: 'Imagerie', value: 'ScanLine' },
                                    { title: 'Équipe', value: 'Users' },
                                    { title: 'Bâtiment', value: 'Building2' },
                                ],
                            },
                            initialValue: 'BedDouble',
                        },
                        { name: 'title', title: 'Titre (FR)', type: 'string' },
                        { name: 'title_ar', title: 'Titre (AR)', type: 'string' },
                        { name: 'desc', title: 'Description (FR)', type: 'text', rows: 2 },
                        { name: 'desc_ar', title: 'Description (AR)', type: 'text', rows: 2 },
                    ],
                    preview: { select: { title: 'title', subtitle: 'desc' } },
                },
            ],
        }),
    ],
    preview: {
        prepare: () => ({ title: 'Annonce — Hôpital Okba' }),
    },
})
