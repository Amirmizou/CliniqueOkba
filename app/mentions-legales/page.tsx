import type { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { defaultMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Mentions Légales - Clinique OKBA',
  description:
    'Mentions légales et informations juridiques de la Clinique OKBA à Constantine, Algérie.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function MentionsLegales() {
  return (
    <>
      <Header />
      <main className='min-h-screen pt-20'>
        <div className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
          <h1 className='text-foreground mb-8 text-4xl font-bold'>
            Mentions Légales
          </h1>

          <div className='prose prose-lg max-w-none space-y-8'>
            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Informations sur l'entreprise
              </h2>
              <div className='bg-muted/50 rounded-lg p-6'>
                <p>
                  <strong>Raison sociale :</strong> Clinique OKBA
                </p>
                <p>
                  <strong>Forme juridique :</strong> Société par actions
                  simplifiée (SAS)
                </p>
                <p>
                  <strong>Adresse :</strong> Nouvelle ville Ali Mendjeli,
                  Constantine, Algérie
                </p>
                <p>
                  <strong>Téléphone :</strong> +213 555 123 456
                </p>
                <p>
                  <strong>Email :</strong> contact@cliniqueokba.com
                </p>
                <p>
                  <strong>Directeur de publication :</strong> Dr. [Nom du
                  directeur]
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Hébergement
              </h2>
              <p>Ce site est hébergé par Vercel Inc.</p>
              <p>
                Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
              </p>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Propriété intellectuelle
              </h2>
              <p>
                L'ensemble du contenu de ce site (textes, images, vidéos,
                design, etc.) est protégé par le droit d'auteur et appartient à
                la Clinique OKBA ou à ses partenaires. Toute reproduction,
                distribution, modification, adaptation, retransmission ou
                publication de ces éléments est strictement interdite sans
                l'accord exprès par écrit de la Clinique OKBA.
              </p>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Responsabilité
              </h2>
              <p>
                Les informations contenues sur ce site sont aussi précises que
                possible et le site remis à jour à différentes périodes de
                l'année, mais peut toutefois contenir des inexactitudes ou des
                omissions.
              </p>
              <p>
                Si vous constatez une lacune, erreur ou ce qui parait être un
                dysfonctionnement, merci de bien vouloir le signaler par email,
                à l'adresse contact@cliniqueokba.com, en décrivant le problème
                de la manière la plus précise possible.
              </p>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Liens hypertextes
              </h2>
              <p>
                Ce site peut contenir des liens hypertextes vers d'autres sites
                présents sur le réseau Internet. Les liens vers ces autres
                ressources vous font quitter le site de la Clinique OKBA.
              </p>
              <p>
                Il est possible de créer un lien vers la page de présentation de
                ce site sans autorisation expresse de l'éditeur. Aucune
                autorisation ou demande d'information préalable ne peut être
                exigée par l'éditeur à l'égard d'un site qui souhaite établir un
                lien vers le site de l'éditeur.
              </p>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Droit applicable
              </h2>
              <p>
                Tant le présent site que les modalités et conditions de son
                utilisation sont régis par le droit algérien, quel que soit le
                lieu d'utilisation. En cas de contestation éventuelle, et après
                l'échec de toute tentative de recherche d'une solution amiable,
                les tribunaux algériens seront seuls compétents pour connaître
                de ce litige.
              </p>
            </section>

            <section>
              <h2 className='text-foreground mb-4 text-2xl font-semibold'>
                Contact
              </h2>
              <p>
                Pour toute question concernant les présentes mentions légales,
                vous pouvez nous contacter à l'adresse :
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

