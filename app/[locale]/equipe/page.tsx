import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import DoctorsShowcase from '@/components/doctors-showcase'
import ScrollAnimation from '@/components/ui/scroll-animation'
import { getSiteSettings, getDoctors } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import { generatePhysiciansStructuredData } from '@/lib/seo'
import { siteConfig } from '@/data/site-config'

export const metadata = {
    title: 'Notre Équipe Médicale | Clinique OKBA',
    description: 'Découvrez notre équipe de médecins spécialistes dévoués à votre santé à la Clinique OKBA.',
}

export default async function EquipePage() {
    const [siteSettings, doctors] = await Promise.all([
        getSiteSettings(),
        getDoctors(),
    ])

    // Données structurées Physician (SEO) à partir des médecins Sanity
    const physiciansJsonLd = generatePhysiciansStructuredData(
        (doctors || []).map((d: any) => ({
            name: d.name,
            title: d.title,
            specialty: d.specialty,
            slug: d.slug?.current || d.slug,
            languages: d.languages,
            imageUrl: d.image
                ? urlFor(d.image).width(400).height(533).url()
                : undefined,
        })),
    )

    // Numéro d'appel : Sanity prioritaire, repli sur la config locale
    const phoneDisplay = (siteSettings?.phone || siteConfig.contact.phone)
        .split('/')[0]
        .trim()
    const phoneHref = `tel:${phoneDisplay.replace(/[^+\d]/g, '')}`

    return (
        <>
            {physiciansJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(physiciansJsonLd) }}
                />
            )}
            <SiteHeader siteSettings={siteSettings} />
            <main className="min-h-screen pt-20">
                <DoctorsShowcase data={doctors} />

                {/* Contact CTA */}
                <section className="pb-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <ScrollAnimation variant="fadeUp">
                            <div className="glass-card rounded-2xl p-8 text-center">
                                <h3 className="text-2xl font-bold mb-4">
                                    Besoin d'une consultation ?
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                                    Prenez rendez-vous directement par téléphone ou rendez-vous sur place à la clinique.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href={phoneHref}
                                        className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        📞 Appeler maintenant
                                    </a>
                                    <a
                                        href="/#contact"
                                        className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-xl font-medium hover:bg-primary/10 transition-colors"
                                    >
                                        📍 Nous localiser
                                    </a>
                                </div>
                            </div>
                        </ScrollAnimation>
                    </div>
                </section>
            </main>
            <SiteFooter siteSettings={siteSettings} />
        </>
    )
}
