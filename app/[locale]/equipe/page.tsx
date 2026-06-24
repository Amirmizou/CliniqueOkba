import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import DoctorsShowcase from '@/components/doctors-showcase'
import ScrollAnimation from '@/components/ui/scroll-animation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getSiteSettings, getDoctors, getAllSectionContents } from '@/sanity/lib/fetch'
import { localizeSanityData } from '@/sanity/lib/localize'
import { urlFor } from '@/sanity/lib/image'
import { generatePhysiciansStructuredData } from '@/lib/seo'
import { siteConfig } from '@/data/site-config'

export const metadata = {
    title: 'Notre Équipe Médicale | Clinique OKBA',
    description: 'Découvrez notre équipe de médecins spécialistes dévoués à votre santé à la Clinique OKBA.',
}

export default async function EquipePage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations('equipe')
    const [siteSettingsRaw, doctorsRaw, sectionContentsRaw] = await Promise.all([
        getSiteSettings(),
        getDoctors(),
        getAllSectionContents(),
    ])

    // Localisation FR/AR du contenu Sanity (repli sur le français)
    const siteSettings = localizeSanityData(siteSettingsRaw, locale)
    const doctors = localizeSanityData(doctorsRaw, locale)
    const sectionContents = localizeSanityData(sectionContentsRaw, locale)

    const doctorsSectionContent = (sectionContents || []).find((s: any) => s.sectionId === 'doctors')

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
                <DoctorsShowcase data={doctors} sectionContent={doctorsSectionContent} />

                {/* Contact CTA */}
                <section className="pb-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <ScrollAnimation variant="fadeUp">
                            <div className="glass-card rounded-2xl p-8 text-center">
                                <h3 className="text-2xl font-bold mb-4">
                                    {t('ctaTitle')}
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                                    {t('ctaSubtitle')}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href={phoneHref}
                                        className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        📞 {t('callNow')}
                                    </a>
                                    <a
                                        href="/#contact"
                                        className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-xl font-medium hover:bg-primary/10 transition-colors"
                                    >
                                        📍 {t('locate')}
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
