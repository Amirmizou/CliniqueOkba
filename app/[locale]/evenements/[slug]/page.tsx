import { notFound } from 'next/navigation'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { getEvents, getEventBySlug, getSiteSettings } from '@/sanity/lib/fetch'
import { localizeSanityData } from '@/sanity/lib/localize'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { Link } from '@/navigation'
import { CalendarDays, MapPin, Clock, Phone, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PortableText } from '@portabletext/react'
import ScrollAnimation from '@/components/ui/scroll-animation'
import { type ClinicEvent } from '@/lib/events'
import { getTranslations } from 'next-intl/server'

export async function generateStaticParams() {
    const events: { slug: { current: string } }[] = await getEvents()
    return events.map((event) => ({ slug: event.slug.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params
    const event: ClinicEvent = localizeSanityData(await getEventBySlug(slug), locale)

    if (!event) {
        return { title: 'Événement non trouvé' }
    }

    return {
        title: `${event.title} | Clinique OKBA`,
        description: event.description,
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
        h2: ({ children }: any) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
                {children}
            </blockquote>
        ),
        normal: ({ children }: any) => <p className="mb-4 leading-relaxed">{children}</p>,
    },
}

function formatDateTime(value: string, dateLocale: string) {
    return new Date(value).toLocaleString(dateLocale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default async function EventPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params
    const event: ClinicEvent & { content?: any[] } = localizeSanityData(
        await getEventBySlug(slug),
        locale,
    )

    if (!event) {
        notFound()
    }

    const t = await getTranslations('events')
    const dateLocale = locale === 'ar' ? 'ar-DZ' : 'fr-FR'
    const siteSettings = localizeSanityData(await getSiteSettings(), locale)

    return (
        <>
            <SiteHeader siteSettings={siteSettings} />
            <main className="min-h-screen pt-24">
                <article className="py-16">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <ScrollAnimation variant="fadeUp">
                            <Link href="/evenements">
                                <Button variant="ghost" className="mb-8 -ml-4">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {t('backToEvents')}
                                </Button>
                            </Link>

                            <header className="mb-8">
                                {event.eventType && t.has(`type.${event.eventType}`) && (
                                    <Badge className="mb-4 bg-primary text-primary-foreground">
                                        {t(`type.${event.eventType}`)}
                                    </Badge>
                                )}
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                    {event.title}
                                </h1>
                                {event.description && (
                                    <p className="text-xl text-muted-foreground">{event.description}</p>
                                )}
                            </header>

                            {event.image && (
                                <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12">
                                    <Image
                                        src={urlFor(event.image).width(1200).height(600).url()}
                                        alt={event.title}
                                        fill
                                        sizes="(max-width: 1200px) 100vw, 1200px"
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            )}

                            {/* Informations pratiques */}
                            <div className="grid gap-4 sm:grid-cols-2 mb-12 rounded-2xl border bg-muted/30 p-6">
                                <div className="flex items-start gap-3">
                                    <CalendarDays className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-semibold">{t('dateTime')}</p>
                                        <p className="text-muted-foreground text-sm">
                                            {formatDateTime(event.startDate, dateLocale)}
                                            {event.endDate && (
                                                <> → {formatDateTime(event.endDate, dateLocale)}</>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {event.location && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold">{t('place')}</p>
                                            <p className="text-muted-foreground text-sm">{event.location}</p>
                                        </div>
                                    </div>
                                )}
                                {event.registrationDeadline && (
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold">{t('deadline')}</p>
                                            <p className="text-muted-foreground text-sm">
                                                {new Date(event.registrationDeadline).toLocaleDateString(
                                                    dateLocale,
                                                    { day: 'numeric', month: 'long', year: 'numeric' },
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {event.contact && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold">{t('contactLabel')}</p>
                                            <p className="text-muted-foreground text-sm">{event.contact}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {event.content && (
                                <div className="prose prose-lg dark:prose-invert max-w-none">
                                    <PortableText
                                        value={event.content}
                                        components={portableTextComponents}
                                    />
                                </div>
                            )}

                            <div className="mt-12 pt-8 border-t">
                                <Link href="/evenements">
                                    <Button variant="outline">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        {t('otherEvents')}
                                    </Button>
                                </Link>
                            </div>
                        </ScrollAnimation>
                    </div>
                </article>
            </main>
            <SiteFooter siteSettings={siteSettings} />
        </>
    )
}
