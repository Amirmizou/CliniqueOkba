import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getInsuranceSection, getSiteSettings } from '@/sanity/lib/fetch'
import { localizeSanityData } from '@/sanity/lib/localize'
import { Badge } from '@/components/ui/badge'
import ScrollAnimation from '@/components/ui/scroll-animation'
import BeneficiaireForm from '@/components/beneficiaire-form'

export const metadata = {
    title: 'Inscription bénéficiaire | Clinique OKBA',
    description:
        "Bénéficiaires des organismes conventionnés avec la Clinique OKBA : inscrivez-vous en ligne, ajoutez les membres de votre famille et joignez vos documents.",
}

export default async function InscriptionBeneficiairePage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    setRequestLocale(locale)

    const t = await getTranslations('beneficiaireForm')
    const [insuranceRaw, siteSettingsRaw] = await Promise.all([getInsuranceSection(), getSiteSettings()])
    const insurance = localizeSanityData(insuranceRaw, locale)
    const siteSettings = localizeSanityData(siteSettingsRaw, locale)

    const organismes: string[] = Array.isArray(insurance?.providers)
        ? insurance.providers
              .map((p: { name?: string }) => (p?.name || '').trim())
              .filter((n: string) => n.length > 0)
        : []

    return (
        <>
            <SiteHeader siteSettings={siteSettings} />
            <main className="min-h-screen pt-8">
                <section className="py-16 md:py-24">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <ScrollAnimation variant="fadeUp" className="mb-12 text-center">
                            <Badge variant="outline" className="mb-4">
                                {t('badge')}
                            </Badge>
                            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('title')}</h1>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{t('subtitle')}</p>
                        </ScrollAnimation>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8 md:p-10">
                            <BeneficiaireForm organismes={organismes} />
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter siteSettings={siteSettings} />
        </>
    )
}
