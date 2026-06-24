import { notFound } from 'next/navigation'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { getArticles, getArticleBySlug, getSiteSettings } from '@/sanity/lib/fetch'
import { localizeSanityData } from '@/sanity/lib/localize'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { Link } from '@/navigation'
import { Calendar, ArrowLeft, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PortableText } from '@portabletext/react'
import ScrollAnimation from '@/components/ui/scroll-animation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

interface Article {
    _id: string
    title: string
    slug: { current: string }
    excerpt: string
    content: any[]
    image: any
    category?: string
    author?: string
    publishedAt: string
}

export async function generateStaticParams() {
    const articles: { slug: { current: string } }[] = await getArticles()
    return articles.map((article) => ({
        slug: article.slug.current,
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params
    const article: Article = localizeSanityData(await getArticleBySlug(slug), locale)

    if (!article) {
        return { title: 'Article non trouvé' }
    }

    return {
        title: `${article.title} | Clinique OKBA`,
        description: article.excerpt,
    }
}

const portableTextComponents = {
    types: {
        image: ({ value }: any) => (
            <div className="my-8 rounded-xl overflow-hidden">
                <Image
                    src={urlFor(value).width(1200).url()}
                    alt={value.alt || ''}
                    width={1200}
                    height={600}
                    className="w-full object-cover"
                />
            </div>
        ),
    },
    block: {
        h2: ({ children }: any) => (
            <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>
        ),
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
                {children}
            </blockquote>
        ),
        normal: ({ children }: any) => (
            <p className="mb-4 leading-relaxed">{children}</p>
        ),
    },
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params
    setRequestLocale(locale)
    const article: Article = localizeSanityData(await getArticleBySlug(slug), locale)

    if (!article) {
        notFound()
    }

    const t = await getTranslations('news')
    const dateLocale = locale === 'ar' ? 'ar-DZ' : 'fr-FR'
    const siteSettings = localizeSanityData(await getSiteSettings(), locale)

    return (
        <>
            <SiteHeader siteSettings={siteSettings} />
            <main className="min-h-screen pt-24">
                <article className="py-16">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <ScrollAnimation variant="fadeUp">
                            <Link href="/actualites">
                                <Button variant="ghost" className="mb-8 -ml-4">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {t('backToNews')}
                                </Button>
                            </Link>

                            <header className="mb-8">
                                {article.category && t.has(`cat.${article.category}`) && (
                                    <Badge className="mb-4 bg-primary text-primary-foreground">
                                        {t(`cat.${article.category}`)}
                                    </Badge>
                                )}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-4">
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
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                    {article.title}
                                </h1>
                                {article.excerpt && (
                                    <p className="text-xl text-muted-foreground">
                                        {article.excerpt}
                                    </p>
                                )}
                            </header>

                            {article.image && (
                                <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12">
                                    <Image
                                        src={urlFor(article.image).width(1200).height(600).url()}
                                        alt={article.title}
                                        fill
                                        sizes="(max-width: 1200px) 100vw, 1200px"
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            )}

                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                {article.content && (
                                    <PortableText
                                        value={article.content}
                                        components={portableTextComponents}
                                    />
                                )}
                            </div>

                            <div className="mt-12 pt-8 border-t">
                                <div className="flex items-center justify-between">
                                    <Link href="/actualites">
                                        <Button variant="outline">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            {t('otherNews')}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </ScrollAnimation>
                    </div>
                </article>
            </main>
            <SiteFooter siteSettings={siteSettings} />
        </>
    )
}
