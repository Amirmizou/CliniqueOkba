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

/**
 * Barre d'actions rapides mobile (patient en situation de besoin) :
 * Appeler / Prendre RDV (WhatsApp) / Itinéraire.
 * Apparaît après le hero pour ne pas doublonner les CTA du haut de page.
 */
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
          initial={{ y: 88, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 88, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          aria-label="Actions rapides"
          className="fixed inset-x-3 bottom-3 z-50 md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-border/50 bg-background/85 p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <a
              href={phoneHref}
              className="flex flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-b from-[#006633] to-[#00532a] py-2.5 text-white shadow-md active:scale-95 transition-transform"
            >
              <Phone className="h-5 w-5" />
              <span className="text-[11px] font-semibold leading-none">{t('call')}</span>
            </a>

            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-b from-[#25D366] to-[#1da851] py-2.5 text-white shadow-md active:scale-95 transition-transform"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-[11px] font-semibold leading-none">{t('appointment')}</span>
              </a>
            ) : (
              <a
                href="#contact"
                className="flex flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-b from-[#25D366] to-[#1da851] py-2.5 text-white shadow-md active:scale-95 transition-transform"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-[11px] font-semibold leading-none">{t('appointment')}</span>
              </a>
            )}

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 rounded-xl border border-border/60 bg-card py-2.5 text-foreground active:scale-95 transition-transform"
            >
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-[11px] font-semibold leading-none">{t('directions')}</span>
            </a>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
