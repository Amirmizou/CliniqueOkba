import { Suspense } from 'react'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { getEvents, getSiteSettings } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { Link } from '@/navigation'
import { CalendarDays, MapPin, ArrowRight, Clock, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ScrollAnimation from '@/components/ui/scroll-animation'
import { EVENT_TYPE_LABELS, type ClinicEvent } from '@/lib/events'

export const metadata = {
    title: 'Événements | Clinique OKBA',
    description:
        'Journées de dépistage, campagnes de sensibilisation, conférences et portes ouvertes de la Clinique OKBA à Constantine.',
}

function formatDateTime(value: string) {
    return new Date(value).toLocaleString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function EventCard({ event, index, past }: { event: ClinicEvent; index: number; past?: boolean }) {
    return (
        <ScrollAnimation variant="fadeUp" delay={index * 0.1}>
            <Link href={`/evenements/${event.slug.current}`}>
                <Card className={`glass-card h-full border-0 hover-lift overflow-hidden group ${past ? 'opacity-75' : ''}`}>
                    {event.image && (
                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src={urlFor(event.image).width(600).height(400).url()}
                                alt={event.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            {event.eventType && EVENT_TYPE_LABELS[event.eventType] && (
                                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground shadow-md">
                                    {EVENT_TYPE_LABELS[event.eventType]}
                                </Badge>
                            )}
                            {past && (
                                <Badge variant="secondary" className="absolute top-3 right-3">
                                    Terminé
                                </Badge>
                            )}
                        </div>
                    )}
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                            <CalendarDays className="h-4 w-4" />
                            {formatDateTime(event.startDate)}
                        </div>
                        <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                            {event.title}
                        </h3>
                    </CardHeader>
                    <CardContent>
                        {event.description && (
                            <p className="text-muted-foreground line-clamp-3 mb-4">{event.description}</p>
                        )}
                        <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                            {event.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 shrink-0" />
                                    <span className="line-clamp-1">{event.location}</span>
                                </div>
                            )}
                            {event.registrationDeadline && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 shrink-0" />
                                    Inscription avant le{' '}
                                    {new Date(event.registrationDeadline).toLocaleDateString('fr-FR')}
                                </div>
                            )}
                            {event.contact && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <span className="line-clamp-1">{event.contact}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center text-primary font-medium">
                            En savoir plus
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </ScrollAnimation>
    )
}

async function EventsList() {
    try {
        const events: ClinicEvent[] = await getEvents()

        if (!events || events.length === 0) {
            return (
                <div className="text-center py-16">
                    <div className="bg-muted/30 rounded-2xl p-12 max-w-lg mx-auto">
                        <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-lg">
                            Aucun événement programmé pour le moment.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Ajoutez des événements via le Studio Sanity.
                        </p>
                    </div>
                </div>
            )
        }

        const now = Date.now()
        const upcoming = events.filter((e) => new Date(e.endDate || e.startDate).getTime() >= now)
        const past = events
            .filter((e) => new Date(e.endDate || e.startDate).getTime() < now)
            .reverse()

        return (
            <div className="space-y-16">
                <div>
                    <h2 className="text-2xl font-bold mb-8">À venir</h2>
                    {upcoming.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {upcoming.map((event, index) => (
                                <EventCard key={event._id} event={event} index={index} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">
                            Aucun événement à venir pour l’instant. Revenez bientôt !
                        </p>
                    )}
                </div>

                {past.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-8">Événements passés</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {past.map((event, index) => (
                                <EventCard key={event._id} event={event} index={index} past />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    } catch (error) {
        console.error('Error loading events:', error)
        return (
            <div className="text-center py-16">
                <div className="bg-destructive/10 rounded-2xl p-12 max-w-lg mx-auto">
                    <p className="text-destructive text-lg font-semibold mb-2">Erreur de chargement</p>
                    <p className="text-muted-foreground text-sm">
                        Impossible de charger les événements. Vérifiez la connexion à Sanity.
                    </p>
                </div>
            </div>
        )
    }
}

export default async function EvenementsPage() {
    const siteSettings = await getSiteSettings()
    return (
        <>
            <SiteHeader siteSettings={siteSettings} />
            <main className="min-h-screen pt-24">
                <section className="py-16 md:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <ScrollAnimation variant="fadeUp" className="text-center mb-16">
                            <Badge variant="outline" className="mb-4">
                                Agenda
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Événements</h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Journées de dépistage, campagnes de sensibilisation, conférences et portes
                                ouvertes : retrouvez l’agenda de la Clinique OKBA.
                            </p>
                        </ScrollAnimation>

                        <Suspense
                            fallback={
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-96 bg-muted animate-pulse rounded-xl" />
                                    ))}
                                </div>
                            }
                        >
                            <EventsList />
                        </Suspense>
                    </div>
                </section>
            </main>
            <SiteFooter siteSettings={siteSettings} />
        </>
    )
}
