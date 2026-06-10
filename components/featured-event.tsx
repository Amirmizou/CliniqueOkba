'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Link } from '@/navigation'
import {
  CalendarDays,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { EVENT_TYPE_LABELS, type ClinicEvent } from '@/lib/events'

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

function countdownLabel(value: string): string {
  const start = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diff = Math.round((start(new Date(value)) - start(new Date())) / 86400000)
  if (diff <= 0) return "Aujourd'hui"
  if (diff === 1) return 'Demain'
  return `Dans ${diff} jours`
}

export default function FeaturedEvent({ event }: { event: ClinicEvent }) {
  const typeLabel = event.eventType ? EVENT_TYPE_LABELS[event.eventType] : null

  return (
    <section
      id="evenement"
      className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24"
    >
      {/* Décor */}
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-[#006633]/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-[#FDE68A]/20 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-10 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            À la une
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="text-gradient">Prochain événement</span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-white/5"
        >
          <div className="grid lg:grid-cols-2">
            {/* Visuel */}
            <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
              {event.image ? (
                <Image
                  src={urlFor(event.image).width(1000).height(800).url()}
                  alt={event.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#006633] via-[#0a7a3f] to-[#FDE68A]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Badges flottants */}
              <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                {typeLabel && (
                  <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                    {typeLabel}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/95 px-3 py-1 text-xs font-bold text-amber-950 shadow-md">
                  <Clock className="h-3 w-3" />
                  {countdownLabel(event.startDate)}
                </span>
              </div>
            </div>

            {/* Contenu */}
            <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 md:p-10">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span className="capitalize">{formatDateTime(event.startDate)}</span>
              </div>

              <h3 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {event.title}
              </h3>

              {event.description && (
                <p className="text-muted-foreground sm:text-lg">{event.description}</p>
              )}

              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {event.location && (
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span>{event.location}</span>
                  </li>
                )}
                {event.registrationDeadline && (
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-primary" />
                    Inscription avant le{' '}
                    {new Date(event.registrationDeadline).toLocaleDateString('fr-FR')}
                  </li>
                )}
                {event.contact && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-primary" />
                    <span>{event.contact}</span>
                  </li>
                )}
              </ul>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/evenements/${event.slug.current}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform duration-200 hover:scale-[1.03] active:scale-95"
                >
                  En savoir plus
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/evenements"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Tous les événements
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
