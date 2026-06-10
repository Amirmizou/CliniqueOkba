// Données de repli pour la section « Conventions & Prise en charge ».
// Le contenu réel doit être édité dans Sanity Studio (schéma insuranceSection) ;
// ces valeurs ne s'affichent que tant que la section n'est pas renseignée.

export interface InsuranceProvider {
  name: string
  description: string
}

export interface InsuranceContent {
  badge: string
  title: string
  subtitle: string
  providers: InsuranceProvider[]
  note: string
  ctaText: string
}

export const insuranceFallback: InsuranceContent = {
  badge: 'Prise en charge',
  title: 'Conventions & Remboursement',
  subtitle:
    'La Clinique OKBA vous accompagne dans vos démarches de prise en charge et de remboursement.',
  providers: [
    {
      name: 'CNAS',
      description:
        'Assurés salariés : prise en charge selon les barèmes de la Caisse Nationale des Assurances Sociales.',
    },
    {
      name: 'CASNOS',
      description:
        'Travailleurs non-salariés : dossiers de remboursement pris en charge sur présentation des justificatifs.',
    },
    {
      name: 'Carte CHIFA',
      description:
        'Présentez votre carte CHIFA à l’accueil pour faciliter vos démarches administratives.',
    },
    {
      name: 'Mutuelles & Assurances',
      description:
        'Conventions avec plusieurs mutuelles d’entreprise. Contactez-nous pour vérifier votre couverture.',
    },
  ],
  note: 'Les modalités de remboursement dépendent de votre organisme. Notre équipe administrative reste à votre disposition pour toute question sur votre prise en charge.',
  ctaText: 'Vérifier ma prise en charge',
}
