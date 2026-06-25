'use client'

import { motion } from 'framer-motion'
import { Award, ShieldCheck, BadgeCheck } from 'lucide-react'
import { useLocale } from 'next-intl'

const ACCREDITATIONS = [
  {
    icon: Award,
    fr: { name: 'Agréée MSPRH', desc: 'Ministère de la Santé' },
    ar: { name: 'معتمدة من وزارة الصحة', desc: 'وزارة الصحة والسكان' },
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200/80 dark:border-emerald-800/50',
  },
  {
    icon: ShieldCheck,
    fr: { name: 'Conventionnée CNAS', desc: 'Sécurité sociale salariés' },
    ar: { name: 'متعاقدة مع الصندوق الوطني', desc: 'للضمان الاجتماعي للعمال' },
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200/80 dark:border-blue-800/50',
  },
  {
    icon: BadgeCheck,
    fr: { name: 'Conventionnée CASNOS', desc: 'Sécurité sociale non-salariés' },
    ar: { name: 'متعاقدة مع الكاسنوس', desc: 'لغير الأجراء' },
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    border: 'border-violet-200/80 dark:border-violet-800/50',
  },
]

export default function AccreditationsBand() {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const label = isAr ? 'اعتماداتنا' : 'Nos accréditations'

  return (
    <section aria-label={label} className="border-b border-border/50 bg-muted/20 py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {/* Label */}
          <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </span>

          <div className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />

          {/* Accreditation pills */}
          {ACCREDITATIONS.map((item, i) => {
            const Icon = item.icon
            const text = isAr ? item.ar : item.fr
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.23, 1, 0.32, 1] }}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 ${item.bg} ${item.border}`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${item.color}`} aria-hidden="true" />
                <div className="leading-tight">
                  <span className={`block text-xs font-semibold ${item.color}`}>
                    {text.name}
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    {text.desc}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
