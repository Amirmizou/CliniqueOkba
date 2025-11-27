import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Politique de Confidentialité | Clinique OKBA',
    description: 'Politique de confidentialité et protection des données personnelles de la Clinique OKBA.',
}

export default function Confidentialite() {
    return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-primary">Politique de Confidentialité</h1>

            <div className="space-y-8 text-muted-foreground">
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">1. Collecte des données</h2>
                    <p>
                        La Clinique OKBA s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site cliniqueokba.com,
                        soient conformes à la réglementation générale sur la protection des données (RGPD) et à la loi Informatique et Libertés.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">2. Utilisation des données</h2>
                    <p>
                        Les données personnelles recueillies sur le site (via les formulaires de contact ou de prise de rendez-vous)
                        sont destinées à l'usage exclusif de la Clinique OKBA. Elles ne sont en aucun cas cédées ou vendues à des tiers.
                    </p>
                    <p className="mt-2">Elles sont utilisées pour :</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>La gestion de vos demandes de rendez-vous</li>
                        <li>La réponse à vos demandes d'information</li>
                        <li>L'envoi d'informations médicales ou administratives</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">3. Durée de conservation</h2>
                    <p>
                        Vos données personnelles sont conservées pendant une durée qui n'excède pas la durée nécessaire aux finalités
                        pour lesquelles elles ont été collectées.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">4. Vos droits</h2>
                    <p>
                        Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification, d'effacement,
                        de limitation et de portabilité de vos données.
                    </p>
                    <p className="mt-2">
                        Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante : <strong>contact@cliniqueokba.com</strong>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">5. Sécurité</h2>
                    <p>
                        Nous mettons en œuvre toutes les mesures techniques et organisationnelles nécessaires pour assurer la sécurité
                        et la confidentialité de vos données personnelles.
                    </p>
                </section>
            </div>
        </div>
    )
}
