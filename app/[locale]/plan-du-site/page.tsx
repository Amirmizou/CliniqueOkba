import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Plan du Site | Clinique OKBA',
    description: 'Plan du site de la Clinique OKBA pour une navigation facilitée.',
}

export default function PlanDuSite() {
    return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-primary">Plan du Site</h1>

            <div className="grid md:grid-cols-2 gap-12">
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground border-b pb-2">Navigation Principale</h2>
                    <ul className="space-y-3">
                        <li>
                            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                                Accueil
                            </Link>
                        </li>
                        <li>
                            <Link href="/#about" className="text-muted-foreground hover:text-primary transition-colors">
                                À Propos
                            </Link>
                        </li>
                        <li>
                            <Link href="/#specialties" className="text-muted-foreground hover:text-primary transition-colors">
                                Nos Spécialités
                            </Link>
                        </li>
                        <li>
                            <Link href="/#services" className="text-muted-foreground hover:text-primary transition-colors">
                                Nos Services
                            </Link>
                        </li>
                        <li>
                            <Link href="/#gallery" className="text-muted-foreground hover:text-primary transition-colors">
                                Galerie
                            </Link>
                        </li>
                        <li>
                            <Link href="/#contact" className="text-muted-foreground hover:text-primary transition-colors">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground border-b pb-2">Informations Légales</h2>
                    <ul className="space-y-3">
                        <li>
                            <Link href="/legal/mentions-legales" className="text-muted-foreground hover:text-primary transition-colors">
                                Mentions Légales
                            </Link>
                        </li>
                        <li>
                            <Link href="/legal/confidentialite" className="text-muted-foreground hover:text-primary transition-colors">
                                Politique de Confidentialité
                            </Link>
                        </li>
                        <li>
                            <Link href="/legal/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                                Gestion des Cookies
                            </Link>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-foreground border-b pb-2">Pôles Médicaux</h2>
                    <ul className="space-y-3">
                        <li>
                            <span className="text-muted-foreground">Urgences 24/7</span>
                        </li>
                        <li>
                            <span className="text-muted-foreground">Chirurgie</span>
                        </li>
                        <li>
                            <span className="text-muted-foreground">Cardiologie</span>
                        </li>
                        <li>
                            <span className="text-muted-foreground">Maternité</span>
                        </li>
                        <li>
                            <span className="text-muted-foreground">Imagerie Médicale</span>
                        </li>
                        <li>
                            <span className="text-muted-foreground">Laboratoire d'Analyses</span>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    )
}
