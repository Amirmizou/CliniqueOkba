import type { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { defaultMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Politique de Confidentialité - Clinique OKBA',
  description:
    'Politique de confidentialité et protection des données personnelles de la Clinique OKBA à Constantine, Algérie.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Header />
      <main className='min-h-screen pt-20'>
        <div className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
          <h1 className='text-foreground mb-8 text-4xl font-bold'>
            Politique de Confidentialité
          </h1>

          <div className='prose prose-lg max-w-none space-y-8'>
            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Introduction
              </h2>
              <p>
                La Clinique OKBA s'engage à protéger la confidentialité et la
                sécurité des informations personnelles que vous nous confiez.
                Cette politique de confidentialité explique comment nous
                collectons, utilisons et protégeons vos données personnelles
                conformément à la législation algérienne en vigueur.
              </p>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Données collectées
              </h2>
              <p>Nous collectons les informations suivantes :</p>
              <ul className='list-inside list-disc space-y-2'>
                <li>
                  <strong>Données d'identification :</strong> nom, prénom,
                  adresse email, numéro de téléphone
                </li>
                <li>
                  <strong>Données de navigation :</strong> adresse IP, cookies,
                  pages visitées
                </li>
                <li>
                  <strong>Données médicales :</strong> uniquement si vous prenez
                  rendez-vous (via notre formulaire de contact)
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Finalités du traitement
              </h2>
              <p>Vos données personnelles sont utilisées pour :</p>
              <ul className='list-inside list-disc space-y-2'>
                <li>Répondre à vos demandes de contact et de rendez-vous</li>
                <li>Améliorer nos services et la qualité de notre site web</li>
                <li>Respecter nos obligations légales</li>
                <li>
                  Analyser l'utilisation de notre site (via Vercel Analytics)
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Base légale
              </h2>
              <p>Le traitement de vos données personnelles est fondé sur :</p>
              <ul className='list-inside list-disc space-y-2'>
                <li>Votre consentement pour les cookies non essentiels</li>
                <li>L'intérêt légitime pour l'amélioration de nos services</li>
                <li>
                  L'exécution de mesures précontractuelles pour les demandes de
                  rendez-vous
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Conservation des données
              </h2>
              <p>
                Vos données personnelles sont conservées uniquement le temps
                nécessaire aux finalités pour lesquelles elles ont été
                collectées :
              </p>
              <ul className='list-inside list-disc space-y-2'>
                <li>
                  <strong>Données de contact :</strong> 3 ans après le dernier
                  contact
                </li>
                <li>
                  <strong>Données de navigation :</strong> 13 mois maximum
                </li>
                <li>
                  <strong>Données médicales :</strong> conformément aux
                  obligations légales du secteur médical
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Partage des données
              </h2>
              <p>
                Vos données personnelles ne sont pas vendues, louées ou
                partagées avec des tiers, sauf dans les cas suivants :
              </p>
              <ul className='list-inside list-disc space-y-2'>
                <li>Avec votre consentement explicite</li>
                <li>Pour respecter une obligation légale</li>
                <li>
                  Avec nos prestataires techniques (Vercel, Google Fonts) sous
                  contrat de confidentialité
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Sécurité
              </h2>
              <p>
                Nous mettons en œuvre des mesures techniques et
                organisationnelles appropriées pour protéger vos données contre
                la perte, l'utilisation abusive, l'accès non autorisé, la
                divulgation, l'altération ou la destruction.
              </p>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Vos droits
              </h2>
              <p>
                Conformément à la législation algérienne, vous disposez des
                droits suivants :
              </p>
              <ul className='list-inside list-disc space-y-2'>
                <li>
                  <strong>Droit d'accès :</strong> obtenir une copie de vos
                  données
                </li>
                <li>
                  <strong>Droit de rectification :</strong> corriger des données
                  inexactes
                </li>
                <li>
                  <strong>Droit d'effacement :</strong> demander la suppression
                  de vos données
                </li>
                <li>
                  <strong>Droit d'opposition :</strong> vous opposer au
                  traitement
                </li>
                <li>
                  <strong>Droit de portabilité :</strong> récupérer vos données
                </li>
              </ul>
              <p className='mt-4'>
                Pour exercer ces droits, contactez-nous à :
                contact@cliniqueokba.com
              </p>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Cookies
              </h2>
              <p>
                Notre site utilise des cookies pour améliorer votre expérience
                de navigation. Vous pouvez accepter ou refuser les cookies non
                essentiels via les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Modifications
              </h2>
              <p>
                Cette politique de confidentialité peut être modifiée à tout
                moment. Les modifications prendront effet dès leur publication
                sur cette page. Nous vous encourageons à consulter régulièrement
                cette page.
              </p>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Contact
              </h2>
              <p>
                Pour toute question concernant cette politique de
                confidentialité ou vos données personnelles, contactez-nous à :
                contact@cliniqueokba.com
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

