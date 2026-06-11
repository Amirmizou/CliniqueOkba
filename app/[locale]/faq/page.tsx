import { Suspense } from 'react'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { getTranslations } from 'next-intl/server'
import { getFaq, getSiteSettings } from '@/sanity/lib/fetch'
import { localizeSanityData } from '@/sanity/lib/localize'
import { HelpCircle, Phone, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import ScrollAnimation from '@/components/ui/scroll-animation'
import { faqFallback, type FaqItem } from '@/data/faq'
import { siteConfig } from '@/data/site-config'

type FAQ = FaqItem

const categoryLabels: Record<string, { label: string; icon: string }> = {
    appointment: { label: 'Rendez-vous', icon: '📅' },
    exams: { label: 'Examens', icon: '🔬' },
    payment: { label: 'Paiement', icon: '💳' },
    emergency: { label: 'Urgences', icon: '🚨' },
    general: { label: 'Général', icon: '❓' },
}

export const metadata = {
    title: 'FAQ | Clinique OKBA',
    description: 'Questions fréquemment posées sur la Clinique OKBA - Rendez-vous, examens, paiement et plus.',
}

async function FAQList({ locale }: { locale: string }) {
    const t = await getTranslations('faqPage')
    const sanityFaqs: FAQ[] = localizeSanityData(await getFaq(), locale)
    // Sanity prioritaire, repli sur les questions locales
    const faqs: FAQ[] = sanityFaqs && sanityFaqs.length > 0 ? sanityFaqs : faqFallback

    // Données structurées FAQPage (rich snippets Google)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
    }

    // Group FAQs by category
    const groupedFaqs = faqs.reduce((acc: Record<string, FAQ[]>, faq: FAQ) => {
        const category = faq.category || 'general'
        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push(faq)
        return acc
    }, {} as Record<string, FAQ[]>)

    return (
        <div className="space-y-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {Object.entries(groupedFaqs).map(([category, items]) => (
                <ScrollAnimation key={category} variant="fadeUp">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <span>{categoryLabels[category]?.icon || '❓'}</span>
                            {t.has(`cat.${category}`) ? t(`cat.${category}`) : (categoryLabels[category]?.label || category)}
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {items.map((faq: FAQ) => (
                            <details
                                key={faq._id}
                                className="glass-card rounded-xl overflow-hidden group"
                            >
                                <summary className="p-6 cursor-pointer list-none flex items-center justify-between hover:bg-muted/50 transition-colors">
                                    <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                                    <span className="text-2xl text-primary shrink-0 transition-transform group-open:rotate-45">
                                        +
                                    </span>
                                </summary>
                                <div className="px-6 pb-6 pt-0">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </details>
                        ))}
                    </div>
                </ScrollAnimation>
            ))}
        </div>
    )
}

export default async function FAQPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const t = await getTranslations('faqPage')
    const siteSettings = localizeSanityData(await getSiteSettings(), locale)
    const phoneDisplay = (siteSettings?.phone || siteConfig.contact.phone)
        .split('/')[0]
        .trim()
    const phoneHref = `tel:${phoneDisplay.replace(/[^+\d]/g, '')}`
    return (
        <>
            <SiteHeader siteSettings={siteSettings} />
            <main className="min-h-screen pt-24">
                <section className="py-16 md:py-24">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <ScrollAnimation variant="fadeUp" className="text-center mb-16">
                            <Badge variant="outline" className="mb-4">{t('badge')}</Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                {t('title')}
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                {t('subtitle')}
                            </p>
                        </ScrollAnimation>

                        <Suspense fallback={
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
                                ))}
                            </div>
                        }>
                            <FAQList locale={locale} />
                        </Suspense>

                        {/* Contact section */}
                        <ScrollAnimation variant="fadeUp" className="mt-16">
                            <div className="glass-card rounded-2xl p-8 text-center">
                                <h3 className="text-2xl font-bold mb-4">
                                    {t('ctaTitle')}
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    {t('ctaSubtitle')}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href={phoneHref}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        <Phone className="h-5 w-5" />
                                        {t('callUs')}
                                    </a>
                                    <a
                                        href="/#contact"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary rounded-xl font-medium hover:bg-primary/10 transition-colors"
                                    >
                                        <MapPin className="h-5 w-5" />
                                        {t('visitUs')}
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
