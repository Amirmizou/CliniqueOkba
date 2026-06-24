import { Suspense } from 'react'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { getArticles, getSiteSettings } from '@/sanity/lib/fetch'
import { localizeSanityData } from '@/sanity/lib/localize'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { Link } from '@/navigation'
import { Calendar, ArrowRight, Newspaper, User } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ScrollAnimation from '@/components/ui/scroll-animation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

interface Article {
    _id: string
    title: string
    slug: { current: string }
    excerpt: string
    image: any
    category?: string
    author?: string
    publishedAt: string
}

export const metadata = {
    title: 'Actualités | Clinique OKBA',
    description: 'Découvrez les dernières actualités et informations de la Clinique OKBA à Constantine.',
}

async function ArticlesList({ locale }: { locale: string }) {
    const t = await getTranslations('news')
    const dateLocale = locale === 'ar' ? 'ar-DZ' : 'fr-FR'
    try {
        const articles: Article[] = localizeSanityData(await getArticles(), locale)

        if (!articles || articles.length === 0) {
            return (
                <div className="text-center py-16">
                    <div className="bg-muted/30 rounded-2xl p-12 max-w-lg mx-auto">
                        <Newspaper className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-lg">
                            {t('none')}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            {t('noneHint')}
                        </p>
                    </div>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article: Article, index: number) => (
                    <ScrollAnimation key={article._id} variant="fadeUp" delay={index * 0.1}>
                        <Link href={`/actualites/${article.slug.current}`}>
                            <Card className="glass-card h-full border-0 hover-lift overflow-hidden group">
                                {article.image && (
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={urlFor(article.image).width(600).height(400).url()}
                                            alt={article.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        {article.category && t.has(`cat.${article.category}`) && (
                                            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground shadow-md">
                                                {t(`cat.${article.category}`)}
                                            </Badge>
                                        )}
                                    </div>
                                )}
                                <CardHeader className="pb-2">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mb-2">
                                        <span className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(article.publishedAt).toLocaleDateString(dateLocale, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                        {article.author && (
                                            <span className="flex items-center gap-1.5">
                                                <User className="h-4 w-4" />
                                                {article.author}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground line-clamp-3 mb-4">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex items-center text-primary font-medium">
                                        {t('readMore')}
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </ScrollAnimation>
                ))}
            </div>
        )
    } catch (error) {
        console.error('Error loading articles:', error)
        return (
            <div className="text-center py-16">
                <div className="bg-destructive/10 rounded-2xl p-12 max-w-lg mx-auto">
                    <p className="text-destructive text-lg font-semibold mb-2">
                        {t('errorTitle')}
                    </p>
                    <p className="text-muted-foreground text-sm">
                        {t('loadError')}
                    </p>
                </div>
            </div>
        )
    }
}

export default async function ActualitesPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations('news')
    const siteSettings = localizeSanityData(await getSiteSettings(), locale)
    return (
        <>
            <SiteHeader siteSettings={siteSettings} />
            <main className="min-h-screen pt-24">
                <section className="py-16 md:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <ScrollAnimation variant="fadeUp" className="text-center mb-16">
                            <Badge variant="outline" className="mb-4">{t('pageBadge')}</Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('pageTitle')}</h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                {t('pageSubtitle')}
                            </p>
                        </ScrollAnimation>

                        <Suspense fallback={
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-96 bg-muted animate-pulse rounded-xl" />
                                ))}
                            </div>
                        }>
                            <ArticlesList locale={locale} />
                        </Suspense>
                    </div>
                </section>
            </main>
            <SiteFooter siteSettings={siteSettings} />
        </>
    )
}
