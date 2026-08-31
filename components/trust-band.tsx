'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Clock, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface TrustBandProps {
  siteSettings?: {
    phone?: string
    hours?: { emergency?: string; weekdays?: string; saturday?: string }
  }
}

export default function TrustBand({ siteSettings }: TrustBandProps) {
  const t = useTranslations('trustBand')
  const phoneDisplay = (siteSettings?.phone || '')
    .split('/')[0]
    .trim()
  const phoneHref = `tel:${phoneDisplay.replace(/[^+\d]/g, '')}`
  const emergency = siteSettings?.hours?.emergency || ''
  const weekdays = siteSettings?.hours?.weekdays || ''

  return (
    <section className="relative z-10 bg-background pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="-mt-10 overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-xl backdrop-blur-sm sm:-mt-14"
        >
          {/* Infos pratiques. Les chiffres-clés (heroStats) ne sont plus repris
              ici : ils sont déjà affichés en chips dans le hero, juste au-dessus,
              et les voir deux fois à 200px d'intervalle diluait les deux blocs.
              Cette carte porte désormais uniquement le « quand / comment nous
              joindre », sur trois colonnes pleines. */}
          <div className="grid sm:grid-cols-3">
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
              aria-label={`Appeler la clinique : ${phoneDisplay}`}
              className="group flex cursor-pointer items-center gap-3 border-t border-border/60 px-5 py-5 transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset sm:border-l sm:border-t-0"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Phone className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
        <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="block font-semibold text-foreground">{value}</span>
        {sub && <span className="block text-xs text-muted-foreground">{sub}</span>}
      </span>
    </div>
  )
}
