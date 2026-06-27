'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import ScrollAnimation from '@/components/ui/scroll-animation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Facebook,
  Instagram,
} from 'lucide-react'
import LocationBento from '@/components/location-bento'
import WhatsAppBooking from '@/components/whatsapp-booking'


interface SiteSettings {
  clinicName?: string
  phone?: string
  whatsappNumber?: string
  appointmentMessage?: string
  email?: string
  address?: string
  coordinates?: { lat: number; lng: number }
  hours?: { emergency?: string; weekdays?: string; saturday?: string }
  social?: { facebook?: string; instagram?: string }
  description?: string
}

interface SectionContent {
  badge?: string
  title?: string
  subtitle?: string
}

interface ContactProps {
  siteSettings?: SiteSettings
  sectionContent?: SectionContent
}

export default function Contact({ siteSettings, sectionContent }: ContactProps) {
  const t = useTranslations('contact')
  const tf = useTranslations('contact.form')
  const ti = useTranslations('contact.info')
  // Use Sanity data or fallback to static
  const contactData = {
    address: siteSettings?.address || '',
    phone: siteSettings?.phone || '',
    email: siteSettings?.email || '',
    coordinates: siteSettings?.coordinates || { lat: 35.700010, lng: -0.569500 },
    hours: siteSettings?.hours || { emergency: '24h/24 et 7j/7', weekdays: '08:00 - 20:00', saturday: '08:00 - 18:00' },
    social: siteSettings?.social || { facebook: '', instagram: '' },
    description: siteSettings?.description || 'La Clinique OKBA est votre partenaire de confiance pour votre santé.',
  }
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    honeypot: '', // Champ anti-spam caché
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Préremplir message si service=home-care
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('service') === 'home-care') {
        setFormData((prev) => ({
          ...prev,
          message: 'Bonjour, je souhaite planifier des soins à domicile. Merci de me contacter.',
        }))
      }
    } catch { }
  }, [])

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          newErrors[name] = tf('vFirstNameRequired')
        } else if (value.trim().length < 2) {
          newErrors[name] = tf('vFirstNameMin')
        } else {
          delete newErrors[name]
        }
        break
      case 'lastName':
        if (!value.trim()) {
          newErrors[name] = tf('vLastNameRequired')
        } else if (value.trim().length < 2) {
          newErrors[name] = tf('vLastNameMin')
        } else {
          delete newErrors[name]
        }
        break
      case 'email':
        if (!value.trim()) {
          newErrors[name] = tf('vEmailRequired')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[name] = tf('vEmailInvalid')
        } else {
          delete newErrors[name]
        }
        break
      case 'phone':
        if (value && !/^[\+]?[0-9\s\-\(\)]{8,}$/.test(value)) {
          newErrors[name] = tf('vPhoneInvalid')
        } else {
          delete newErrors[name]
        }
        break
      case 'message':
        if (!value.trim()) {
          newErrors[name] = tf('vMessageRequired')
        } else if (value.trim().length < 10) {
          newErrors[name] = tf('vMessageMin')
        } else {
          delete newErrors[name]
        }
        break
    }

    setErrors(newErrors)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Vérification anti-spam (honeypot)
    if (formData.honeypot) {
      return
    }

    // Marquer tous les champs comme touchés (sauf honeypot)
    const fieldsToValidate = Object.keys(formData).filter(
      (key) => key !== 'honeypot'
    )
    const allTouched = fieldsToValidate.reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    )
    setTouched(allTouched)

    // Valider tous les champs (sauf honeypot)
    fieldsToValidate.forEach((key) => {
      validateField(key, formData[key as keyof typeof formData])
    })

    // Vérifier s'il y a des erreurs
    const hasErrors = Object.values(errors).some((error) => error)
    if (hasErrors) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      })

      const responseData = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          honeypot: '',
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <section id='contact' className='bg-background py-12 sm:py-16 md:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <ScrollAnimation variant="fadeUp" className='mb-16 space-y-4 text-center'>
          <p className='text-primary text-sm font-semibold tracking-wide uppercase'>
            {sectionContent?.badge || t('badge')}
          </p>
          <h2 className='text-foreground text-2xl sm:text-3xl md:text-4xl font-bold'>
            {sectionContent?.title || t('title')}
          </h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg'>
            {sectionContent?.subtitle || t('subtitle')}
          </p>
        </ScrollAnimation>

        {/* Prise de rendez-vous via WhatsApp */}
        <ScrollAnimation variant="fadeUp" className='mb-12'>
          <WhatsAppBooking
            whatsappNumber={siteSettings?.whatsappNumber}
            clinicName={siteSettings?.clinicName}
            introMessage={siteSettings?.appointmentMessage}
          />
        </ScrollAnimation>

        <div className='grid gap-12 md:grid-cols-2'>
          {/* Contact Info */}
          <ScrollAnimation variant="fadeRight" className='space-y-8'>
            {/* Urgences : priorité absolue d'un site médical */}
            <a
              href={`tel:${contactData.phone.split('/')[0].trim().replace(/[^+\d]/g, '')}`}
              className='group flex items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 transition-all duration-300 hover:border-red-300 hover:shadow-lg hover:shadow-red-500/10 dark:border-red-500/30 dark:bg-red-500/10'
            >
              <div className='relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-md'>
                <span className='absolute inset-0 animate-ping rounded-xl bg-red-500/40' />
                <Phone className='relative h-6 w-6' />
              </div>
              <div className='min-w-0'>
                <h3 className='font-bold text-red-700 dark:text-red-400'>
                  {ti('emergency')} {contactData.hours?.emergency}
                </h3>
                <p className='truncate font-semibold text-foreground' dir='ltr'>
                  {contactData.phone.split('/')[0].trim()}
                </p>
                <p className='text-sm text-red-700/70 dark:text-red-400/70'>
                  {ti('emergencyCallHint')}
                </p>
              </div>
            </a>

            <div className='space-y-6'>
              <div className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                    <MapPin className='text-primary h-6 w-6' />
                  </div>
                </div>
                <div>
                  <h3 className='text-foreground font-semibold'>{ti('address')}</h3>
                  <p className='text-muted-foreground mt-1'>
                    {contactData.address}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {contactData.description}
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                    <Phone className='text-primary h-6 w-6' />
                  </div>
                </div>
                <div>
                  <h3 className='text-foreground font-semibold'>{ti('phone')}</h3>
                  <div className='mt-1 flex flex-wrap gap-x-3 gap-y-1'>
                    {contactData.phone.split('/').map((num) => {
                      const display = num.trim()
                      return (
                        <a
                          key={display}
                          href={`tel:${display.replace(/[^+\d]/g, '')}`}
                          dir='ltr'
                          className='text-muted-foreground hover:text-primary font-medium underline-offset-4 transition-colors hover:underline'
                        >
                          {display}
                        </a>
                      )
                    })}
                  </div>
                  <p className='text-muted-foreground text-sm'>
                    {ti('emergency')} : {contactData.hours?.emergency}
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                    <Mail className='text-primary h-6 w-6' />
                  </div>
                </div>
                <div>
                  <h3 className='text-foreground font-semibold'>{ti('email')}</h3>
                  <a
                    href={`mailto:${contactData.email}`}
                    className='text-muted-foreground hover:text-primary mt-1 block break-all font-medium underline-offset-4 transition-colors hover:underline'
                  >
                    {contactData.email}
                  </a>
                  <p className='text-muted-foreground text-sm'>
                    {ti('fastReply')}
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                    <Clock className='text-primary h-6 w-6' />
                  </div>
                </div>
                <div>
                  <h3 className='text-foreground font-semibold'>{ti('hours')}</h3>
                  <p className='text-muted-foreground mt-1'>
                    {ti('weekdaysLabel')} : {contactData.hours?.weekdays}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {ti('fridayLabel')} : {contactData.hours?.saturday}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className='border-border border-t pt-8 mt-8'>
              <p className='text-foreground mb-4 font-semibold'>{ti('followUs')}</p>
              <div className='flex gap-3'>
                <a
                  href={contactData.social?.facebook || '#'}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group bg-blue-600 hover:bg-blue-700 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-600/30'
                >
                  <Facebook className='w-5 h-5 text-white' />
                </a>
                <a
                  href={contactData.social?.instagram || '#'}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30'
                >
                  <Instagram className='w-5 h-5 text-white' />
                </a>
              </div>
            </div>
          </ScrollAnimation>

          {/* Contact Form */}
          <ScrollAnimation variant="fadeLeft" as="div">
            <Card className='p-4 sm:p-6 md:p-8'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div>
                    <label htmlFor='contact-firstName' className='text-foreground mb-2 block text-sm font-medium'>
                      {tf('firstName')} <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        id='contact-firstName'
                        name='firstName'
                        autoComplete='given-name'
                        aria-invalid={Boolean(touched.firstName && errors.firstName)}
                        aria-describedby={touched.firstName && errors.firstName ? 'error-firstName' : undefined}
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`bg-background w-full rounded-lg border px-4 py-3 text-base md:text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 ${touched.firstName && errors.firstName
                          ? 'border-red-500 focus:ring-red-500'
                          : touched.firstName && !errors.firstName
                            ? 'border-green-500 focus:ring-green-500'
                            : 'border-border focus:ring-primary'
                          }`}
                        placeholder={tf('firstNamePlaceholder')}
                        disabled={isSubmitting}
                      />
                      {touched.firstName &&
                        !errors.firstName &&
                        formData.firstName && (
                          <CheckCircle className='absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-green-500' />
                        )}
                      {touched.firstName && errors.firstName && (
                        <AlertCircle className='absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-red-500' />
                      )}
                    </div>
                    {touched.firstName && errors.firstName && (
                      <p id='error-firstName' className='mt-1 flex items-center gap-1 text-sm text-red-500'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor='contact-lastName' className='text-foreground mb-2 block text-sm font-medium'>
                      {tf('lastName')} <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        id='contact-lastName'
                        name='lastName'
                        autoComplete='family-name'
                        aria-invalid={Boolean(touched.lastName && errors.lastName)}
                        aria-describedby={touched.lastName && errors.lastName ? 'error-lastName' : undefined}
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`bg-background w-full rounded-lg border px-4 py-3 text-base md:text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 ${touched.lastName && errors.lastName
                          ? 'border-red-500 focus:ring-red-500'
                          : touched.lastName && !errors.lastName
                            ? 'border-green-500 focus:ring-green-500'
                            : 'border-border focus:ring-primary'
                          }`}
                        placeholder={tf('lastNamePlaceholder')}
                        disabled={isSubmitting}
                      />
                      {touched.lastName &&
                        !errors.lastName &&
                        formData.lastName && (
                          <CheckCircle className='absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-green-500' />
                        )}
                      {touched.lastName && errors.lastName && (
                        <AlertCircle className='absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-red-500' />
                      )}
                    </div>
                    {touched.lastName && errors.lastName && (
                      <p id='error-lastName' className='mt-1 flex items-center gap-1 text-sm text-red-500'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor='contact-email' className='text-foreground mb-2 block text-sm font-medium'>
                    {tf('email')} <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <input
                      type='email'
                      id='contact-email'
                      name='email'
                      autoComplete='email'
                      aria-invalid={Boolean(touched.email && errors.email)}
                      aria-describedby={touched.email && errors.email ? 'error-email' : undefined}
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-background w-full rounded-lg border px-4 py-3 text-base md:text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 ${touched.email && errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : touched.email && !errors.email
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-border focus:ring-primary'
                        }`}
                      placeholder='votre@email.com'
                      disabled={isSubmitting}
                    />
                    {touched.email && !errors.email && formData.email && (
                      <CheckCircle className='absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-green-500' />
                    )}
                    {touched.email && errors.email && (
                      <AlertCircle className='absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-red-500' />
                    )}
                  </div>
                  {touched.email && errors.email && (
                    <p id='error-email' className='mt-1 flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircle className='h-4 w-4' />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor='contact-phone' className='text-foreground mb-2 block text-sm font-medium'>
                    {tf('phone')}{' '}
                    <span className='text-muted-foreground text-xs'>
                      ({tf('optional')})
                    </span>
                  </label>
                  <div className='relative'>
                    <input
                      type='tel'
                      id='contact-phone'
                      name='phone'
                      autoComplete='tel'
                      aria-invalid={Boolean(touched.phone && errors.phone)}
                      aria-describedby={touched.phone && errors.phone ? 'error-phone' : undefined}
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-background w-full rounded-lg border px-4 py-3 text-base md:text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 ${touched.phone && errors.phone
                        ? 'border-red-500 focus:ring-red-500'
                        : touched.phone && !errors.phone && formData.phone
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-border focus:ring-primary'
                        }`}
                      placeholder='+213 ...'
                      disabled={isSubmitting}
                    />
                    {touched.phone && !errors.phone && formData.phone && (
                      <CheckCircle className='absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-green-500' />
                    )}
                    {touched.phone && errors.phone && (
                      <AlertCircle className='absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-red-500' />
                    )}
                  </div>
                  {touched.phone && errors.phone && (
                    <p id='error-phone' className='mt-1 flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircle className='h-4 w-4' />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor='contact-message' className='text-foreground mb-2 block text-sm font-medium'>
                    {tf('message')} <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <textarea
                      id='contact-message'
                      name='message'
                      aria-invalid={Boolean(touched.message && errors.message)}
                      aria-describedby={touched.message && errors.message ? 'error-message' : undefined}
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={4}
                      className={`bg-background w-full resize-none rounded-lg border px-4 py-3 text-base md:text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 ${touched.message && errors.message
                        ? 'border-red-500 focus:ring-red-500'
                        : touched.message && !errors.message
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-border focus:ring-primary'
                        }`}
                      placeholder={tf('messagePlaceholder')}
                      disabled={isSubmitting}
                    />
                    {touched.message && !errors.message && formData.message && (
                      <CheckCircle className='absolute top-3 right-3 h-5 w-5 text-green-500' />
                    )}
                    {touched.message && errors.message && (
                      <AlertCircle className='absolute top-3 right-3 h-5 w-5 text-red-500' />
                    )}
                  </div>
                  {touched.message && errors.message && (
                    <p id='error-message' className='mt-1 flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircle className='h-4 w-4' />
                      {errors.message}
                    </p>
                  )}
                  <p className='text-muted-foreground mt-1 text-xs'>
                    {tf('charsMin', { count: formData.message.length })}
                  </p>
                </div>

                {/* Honeypot - Champ anti-spam caché */}
                <div style={{ display: 'none' }} aria-hidden='true'>
                  <label htmlFor='honeypot'>Ne pas remplir ce champ</label>
                  <input
                    type='text'
                    id='honeypot'
                    name='honeypot'
                    value={formData.honeypot}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete='off'
                  />
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div role='status' aria-live='polite' className='animate-fade-in rounded-lg border border-green-200 bg-green-50 p-4'>
                    <div className='flex items-center gap-3'>
                      <CheckCircle className='h-5 w-5 flex-shrink-0 text-green-600' />
                      <div>
                        <p className='font-medium text-green-800'>
                          {tf('success')}
                        </p>
                        <p className='text-sm text-green-700'>
                          {tf('successDetail')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div role='alert' className='animate-fade-in rounded-lg border border-red-200 bg-red-50 p-4'>
                    <div className='flex items-center gap-3'>
                      <AlertCircle className='h-5 w-5 flex-shrink-0 text-red-600' />
                      <div>
                        <p className='font-medium text-red-800'>
                          {tf('error')}
                        </p>
                        <p className='text-sm text-red-700'>
                          {tf('errorMessage')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type='submit'
                  className='bg-primary hover:bg-primary/90 text-primary-foreground group w-full h-12 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 touch-target'
                  disabled={
                    isSubmitting || Object.values(errors).some((error) => error)
                  }
                >
                  {isSubmitting ? (
                    <div className='flex items-center gap-2'>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white'></div>
                      {tf('sending')}
                    </div>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <Send className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                      {tf('send')}
                    </div>
                  )}
                </Button>
              </form>
            </Card>
          </ScrollAnimation>
        </div>

        {/* Out-of-the-box Location Bento Dashboard */}
        <ScrollAnimation variant="fadeUp" className='mt-20 pt-16 border-t border-border'>
          <LocationBento
            address={contactData.address}
            coordinates={contactData.coordinates}
          />
        </ScrollAnimation>
      </div>
    </section>
  )
}
