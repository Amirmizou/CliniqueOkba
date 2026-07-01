'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Phone,
  PhoneCall,
  Siren,
  Bell,
  ScanLine,
  FlaskConical,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { useLocale } from 'next-intl'
import { clinicContacts, telHref } from '@/data/clinic-contacts'
import { cn } from '@/lib/utils'

const ICONS: Record<string, LucideIcon> = { Siren, Bell, ScanLine, FlaskConical, Phone }

/**
 * Menu d'appel — feuille du bas (mobile) / carte centrée (desktop) qui liste
 * toutes les lignes de la clinique et laisse l'utilisateur choisir laquelle
 * appeler. Ouvert par les boutons « Appeler ».
 */
export function CallMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const locale = useLocale()
  const isAr = locale === 'ar'

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Fond */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Feuille */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={isAr ? 'اختر رقمًا للاتصال' : 'Choisir un numéro à appeler'}
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-slate-900 sm:rounded-3xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* En-tête vert */}
            <div className="relative px-5 pb-4 pt-4" style={{ background: 'linear-gradient(135deg, #006633 0%, #004422 100%)' }}>
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/30 sm:hidden" />
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/20">
                  <PhoneCall className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-base font-black leading-none text-white">
                    {isAr ? 'اتصل بالعيادة' : 'Appeler la clinique'}
                  </p>
                  <p className="mt-1 text-[11px] font-medium leading-none text-[#FDE68A]/90">
                    {isAr ? 'اختر الخدمة المطلوبة' : 'Choisissez le service souhaité'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label={isAr ? 'إغلاق' : 'Fermer'}
                  className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Liste des numéros */}
            <div className="max-h-[62vh] overflow-y-auto overscroll-contain p-3">
              <ul className="flex flex-col gap-1.5">
                {clinicContacts.map((c, i) => {
                  const Icon = ICONS[c.icon] || Phone
                  const isUrgent = c.kind === 'urgent'
                  return (
                    <motion.li
                      key={`${c.number}-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 + i * 0.03, duration: 0.22 }}
                    >
                      <a
                        href={telHref(c.number)}
                        onClick={onClose}
                        aria-label={`${isAr ? 'اتصل' : 'Appeler'} — ${isAr ? c.label_ar : c.label} ${c.number}`}
                        className={cn(
                          'group flex items-center gap-3 rounded-2xl border p-3 transition-all active:scale-[0.98]',
                          isUrgent
                            ? 'border-red-200 bg-red-50 hover:bg-red-100/70 dark:border-red-900/40 dark:bg-red-950/30'
                            : 'border-gray-100 bg-gray-50 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800',
                        )}
                      >
                        <span
                          className={cn(
                            'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm',
                            isUrgent ? 'bg-red-500' : 'bg-[#006633]',
                          )}
                        >
                          {isUrgent && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-xl bg-red-500/40" />}
                          <Icon className="relative h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              'block text-[11px] font-bold uppercase tracking-wide',
                              isUrgent ? 'text-red-500' : 'text-gray-400',
                            )}
                          >
                            {isAr ? c.label_ar : c.label}
                          </span>
                          <span className="block text-[15px] font-bold text-gray-900 dark:text-white" dir="ltr">
                            {c.number}
                          </span>
                        </span>
                        <span
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition',
                            isUrgent ? 'bg-red-500' : 'bg-[#006633] group-hover:bg-[#004d26]',
                          )}
                        >
                          <Phone className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </a>
                    </motion.li>
                  )
                })}
              </ul>

              <p className="mt-2 px-2 pb-1 text-center text-[11px] text-gray-400">
                {isAr ? 'اضغط على أي رقم للاتصال مباشرة' : 'Touchez un numéro pour appeler directement'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
