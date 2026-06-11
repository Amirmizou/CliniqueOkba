'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { siteConfig as siteConfigFallback } from '@/data/site-config'

// Icône officielle WhatsApp (simple-icons, MIT)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

interface WhatsAppBookingProps {
  whatsappNumber?: string
  clinicName?: string
  introMessage?: string
  specialties?: string[]
}

export default function WhatsAppBooking({
  whatsappNumber,
  clinicName = 'Clinique OKBA',
  introMessage,
  specialties,
}: WhatsAppBookingProps) {
  const t = useTranslations('whatsappBooking')
  const number = whatsappNumber || siteConfigFallback.contact.phone
  const specialtyList =
    specialties && specialties.length > 0
      ? specialties
      : [
          t('specialties.endocrinology'),
          t('specialties.gynecology'),
          t('specialties.internalMedicine'),
          t('specialties.orl'),
          t('specialties.pediatrics'),
          t('specialties.other'),
        ]
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const buildMessage = () => {
    const intro =
      introMessage?.trim() || t('msgIntro', { clinic: clinicName })
    const lines = [intro, '']
    if (name.trim()) lines.push(`${t('msgName')} : ${name.trim()}`)
    if (phone.trim()) lines.push(`${t('msgPhone')} : ${phone.trim()}`)
    if (specialty) lines.push(`${t('msgSpecialty')} : ${specialty}`)
    if (date) lines.push(`${t('msgDate')} : ${date}`)
    if (note.trim()) lines.push(`${t('msgReason')} : ${note.trim()}`)
    return lines.join('\n')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError(t('nameError'))
      return
    }
    setError('')
    const url = buildWhatsAppUrl(number, buildMessage())
    if (!url) {
      setError(t('noNumberError'))
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const inputClass =
    'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/30'

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#25D366]/30 bg-gradient-to-br from-[#25D366]/10 via-card to-background p-6 shadow-xl sm:p-8">
      {/* Halo */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#25D366]/20 blur-3xl" />

      <div className="relative">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30">
            <WhatsAppIcon className="h-7 w-7" />
          </span>
          <div>
            <h3 className="text-foreground text-lg font-bold sm:text-xl">
              {t('title')}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t('subtitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="wa-name" className="mb-1.5 block text-sm font-medium text-foreground">
                {t('nameLabel')} <span className="text-[#25D366]">*</span>
              </label>
              <input
                id="wa-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="wa-phone" className="mb-1.5 block text-sm font-medium text-foreground">
                {t('phoneLabel')}
              </label>
              <input
                id="wa-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phonePlaceholder')}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="wa-specialty" className="mb-1.5 block text-sm font-medium text-foreground">
                {t('specialtyLabel')}
              </label>
              <select
                id="wa-specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className={inputClass}
              >
                <option value="">{t('choose')}</option>
                {specialtyList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="wa-date" className="mb-1.5 block text-sm font-medium text-foreground">
                {t('dateLabel')}
              </label>
              <input
                id="wa-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="wa-note" className="mb-1.5 block text-sm font-medium text-foreground">
              {t('noteLabel')}
            </label>
            <textarea
              id="wa-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder={t('notePlaceholder')}
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}

          <button
            type="submit"
            className="group inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:bg-[#1ebe5b] hover:shadow-xl hover:shadow-[#25D366]/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 active:scale-[0.99]"
          >
            <WhatsAppIcon className="h-6 w-6" />
            {t('submit')}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            {t('redirectNote')}
          </p>
        </form>
      </div>
    </div>
  )
}
