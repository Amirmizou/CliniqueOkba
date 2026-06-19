'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Phone, MessageCircle, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { siteConfig } from '@/data/site-config'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

interface MobileActionBarProps {
  siteSettings?: {
    clinicName?: string
    phone?: string
    whatsappNumber?: string
    appointmentMessage?: string
    coordinates?: { lat: number; lng: number }
  }
}

export default function MobileActionBar({ siteSettings }: MobileActionBarProps) {
  const t = useTranslations('actionBar')
  const [visible, setVisible] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > 480)
  })

  const phoneDisplay = (siteSettings?.phone || siteConfig.contact.phone)
    .split('/')[0]
    .trim()
  const phoneHref = `tel:${phoneDisplay.replace(/[^+\d]/g, '')}`

  const clinic = siteSettings?.clinicName || 'la Clinique OKBA'
  const waMessage =
    siteSettings?.appointmentMessage?.trim() ||
    `Bonjour ${clinic}, je souhaite prendre un rendez-vous.`
  const waUrl = buildWhatsAppUrl(
    siteSettings?.whatsappNumber || siteSettings?.phone || siteConfig.contact.phone,
    waMessage,
  )

  const coords = siteSettings?.coordinates || siteConfig.contact.coordinates
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          aria-label={t('ariaLabel') || 'Actions rapides'}
          className="fixed inset-x-3 bottom-3 z-50 md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border/40 bg-background/90 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl">
            {/* Call */}
            <a
              href={phoneHref}
              aria-label={t('callAria') || `Appeler la clinique : ${phoneDisplay}`}
              className="group flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl bg-[#006633] px-2 py-3 text-white shadow-md transition-all active:scale-95 hover:bg-[#004d26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006633] focus-visible:ring-offset-2 cursor-pointer"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              <span className="text-[11px] font-semibold leading-none">{t('call')}</span>
            </a>

            {/* WhatsApp / Appointment */}
            <a
              href={waUrl || '#contact'}
              target={waUrl ? '_blank' : undefined}
              rel={waUrl ? 'noopener noreferrer' : undefined}
              aria-label={t('appointmentAria') || 'Prendre rendez-vous par WhatsApp'}
              className="group flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl bg-[#25D366] px-2 py-3 text-white shadow-md transition-all active:scale-95 hover:bg-[#1da851] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 cursor-pointer"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              <span className="text-[11px] font-semibold leading-none">{t('appointment')}</span>
            </a>

            {/* Directions */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('directionsAria') || 'Obtenir un itinéraire vers la clinique'}
              className="group flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl border border-border/60 bg-card px-2 py-3 text-foreground transition-all active:scale-95 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
            >
              <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-[11px] font-semibold leading-none">{t('directions')}</span>
            </a>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
