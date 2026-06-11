'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate, useReducedMotion } from 'framer-motion'
import { ShieldCheck, Clock, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { siteConfig } from '@/data/site-config'

interface TrustBandProps {
  siteSettings?: {
    phone?: string
    hours?: { emergency?: string; weekdays?: string; saturday?: string }
    heroStats?: { value?: string; label?: string }[]
  }
}

/* Compteur animé (entiers), respecte prefers-reduced-motion */
function StatValue({ raw }: { raw: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const match = /^(\d+)(\+?)$/.exec(raw)
  const isNumeric = match !== null
  const target = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : ''
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isNumeric || !inView) return
    if (reduce) {
      setCount(target)
      return
    }
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    })
    return () => controls.stop()
    // Dépendances primitives uniquement (pas l'objet `match`) pour éviter une relance en boucle
  }, [inView, target, reduce, isNumeric])

  // Valeur non numérique (ex : « 24/7 ») : affichage direct
  if (!isNumeric) return <span ref={ref}>{raw}</span>

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export default function TrustBand({ siteSettings }: TrustBandProps) {
  const t = useTranslations('trustBand')
  const phoneDisplay = (siteSettings?.phone || siteConfig.contact.phone)
    .split('/')[0]
    .trim()
  const phoneHref = `tel:${phoneDisplay.replace(/[^+\d]/g, '')}`
  const emergency = siteSettings?.hours?.emergency || siteConfig.hours.emergency
  const weekdays = siteSettings?.hours?.weekdays || siteConfig.hours.consultation

  const statsFallback = [
    { value: '6', label: t('polesExcellence') },
    { value: '24/7', label: t('emergencyStat') },
    { value: '30+', label: t('doctorsStat') },
  ]
  const stats =
    siteSettings?.heroStats && siteSettings.heroStats.length > 0
      ? siteSettings.heroStats
      : statsFallback

  return (
    <section className="relative z-10 bg-background pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="-mt-10 grid overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-xl backdrop-blur-sm sm:-mt-14 lg:grid-cols-12"
        >
          {/* Chiffres-clés */}
          <div className="grid grid-cols-3 lg:col-span-5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="px-3 py-5 text-center sm:px-5 sm:py-6"
              >
                <p className="stat-number bg-gradient-to-br from-[#006633] to-[#4caf6e] bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl md:text-4xl">
                  <StatValue raw={s.value || ''} />
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Infos pratiques */}
          <div className="grid border-t border-border/60 sm:grid-cols-3 lg:col-span-7 lg:border-t-0 lg:border-l">
            <TrustItem
              icon={<ShieldCheck className="h-5 w-5" />}
              label={t('emergency')}
              value={emergency}
              sub={t('emergencySub')}
            />
            <TrustItem
              icon={<Clock className="h-5 w-5" />}
              label={t('consultations')}
              value={weekdays}
              sub={t('consultationsSub')}
              className="border-t border-border/60 sm:border-l sm:border-t-0"
            />
            <a
              href={phoneHref}
              className="group flex items-center gap-3 border-t border-border/60 px-5 py-5 transition-colors hover:bg-primary/5 sm:border-l sm:border-t-0"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Phone className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {t('phone')}
                </span>
                <span className="block truncate font-semibold text-foreground" dir="ltr">
                  {phoneDisplay}
                </span>
                <span className="block text-xs text-muted-foreground">{t('phoneSub')}</span>
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function TrustItem({
  icon,
  label,
  value,
  sub,
  className = '',
}: {
  icon: React.ReactNode
  label: string
  value?: string
  sub?: string
  className?: string
}) {
  return (
    <div className={`flex items-center gap-3 px-5 py-5 ${className}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="block font-semibold text-foreground">{value}</span>
        {sub && <span className="block text-xs text-muted-foreground">{sub}</span>}
      </span>
    </div>
  )
}
