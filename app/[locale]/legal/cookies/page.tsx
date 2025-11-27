import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Gestion des Cookies | Clinique OKBA',
    description: 'Informations sur l\'utilisation des cookies sur le site de la Clinique OKBA.',
}

export default function Cookies() {
    return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-primary">Gestion des Cookies</h1>

            <div className="space-y-8 text-muted-foreground">
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">1. Qu'est-ce qu'un cookie ?</h2>
                    <p>
                        Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou mobile) lors de la visite d'un site.
                        Il permet de conserver des données utilisateur afin de faciliter la navigation et de permettre certaines fonctionnalités.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">2. Les cookies utilisés sur notre site</h2>
                    <p>Nous utilisons différents types de cookies :</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>
                            <strong>Cookies techniques nécessaires :</strong> Ces cookies sont indispensables au bon fonctionnement du site.
                            Ils vous permettent de naviguer sur le site et d'utiliser ses fonctionnalités de base.
                        </li>
                        <li>
                            <strong>Cookies de mesure d'audience :</strong> Ces cookies nous permettent d'analyser l'utilisation du site
                            afin d'en améliorer la performance et l'ergonomie.
                        </li>
                        <li>
                            <strong>Cookies de préférences :</strong> Ces cookies permettent de mémoriser vos choix (comme la langue)
                            pour personnaliser votre navigation.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">3. Gestion des cookies</h2>
                    <p>
                        Lors de votre première visite sur notre site, un bandeau vous informe de l'utilisation des cookies.
                        Vous pouvez à tout moment paramétrer vos cookies via les réglages de votre navigateur.
                    </p>
                    <p className="mt-2">
                        Notez toutefois que la désactivation de certains cookies peut altérer le fonctionnement du site.
                    </p>
                </section>
            </div>
        </div>
    )
}
