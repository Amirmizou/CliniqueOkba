import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Mentions Légales | Clinique OKBA',
    description: 'Mentions légales de la Clinique OKBA à Constantine.',
}

export default function MentionsLegales() {
    return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-primary">Mentions Légales</h1>

            <div className="space-y-8 text-muted-foreground">
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">1. Éditeur du site</h2>
                    <p>
                        Le site internet <strong>Clinique OKBA</strong> est édité par la Clinique OKBA,
                        établissement de santé privé situé à Constantine.
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><strong>Adresse :</strong> Nouvelle ville Ali Mendjeli, Constantine, Algérie</li>
                        <li><strong>Téléphone :</strong> +213 555 123 456</li>
                        <li><strong>Email :</strong> contact@cliniqueokba.com</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">2. Directeur de la publication</h2>
                    <p>
                        Le directeur de la publication est la Direction de la Clinique OKBA.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">3. Hébergement</h2>
                    <p>
                        Ce site est hébergé par [Nom de l'hébergeur], [Adresse de l'hébergeur].
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">4. Propriété intellectuelle</h2>
                    <p>
                        L'ensemble de ce site relève de la législation algérienne et internationale sur le droit d'auteur et la propriété intellectuelle.
                        Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">5. Responsabilité</h2>
                    <p>
                        La Clinique OKBA s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site,
                        dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu.
                        Toutefois, la Clinique OKBA ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à la disposition sur ce site.
                    </p>
                </section>
            </div>
        </div>
    )
}
