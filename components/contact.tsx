'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { type ClinicData } from '@/lib/admin-data'
import Map from '@/components/map'
import clinicData from '@/data/clinic.json'
import { siteConfig } from '@/data/site-config'

export default function Contact() {
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
          newErrors[name] = 'Le prénom est requis'
        } else if (value.trim().length < 2) {
          newErrors[name] = 'Le prénom doit contenir au moins 2 caractères'
        } else {
          delete newErrors[name]
        }
        break
      case 'lastName':
        if (!value.trim()) {
          newErrors[name] = 'Le nom est requis'
        } else if (value.trim().length < 2) {
          newErrors[name] = 'Le nom doit contenir au moins 2 caractères'
        } else {
          delete newErrors[name]
        }
        break
      case 'email':
        if (!value.trim()) {
          newErrors[name] = "L'email est requis"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[name] = 'Veuillez entrer un email valide'
        } else {
          delete newErrors[name]
        }
        break
      case 'phone':
        if (value && !/^[\+]?[0-9\s\-\(\)]{8,}$/.test(value)) {
          newErrors[name] = 'Veuillez entrer un numéro de téléphone valide'
        } else {
          delete newErrors[name]
        }
        break
      case 'message':
        if (!value.trim()) {
          newErrors[name] = 'Le message est requis'
        } else if (value.trim().length < 10) {
          newErrors[name] = 'Le message doit contenir au moins 10 caractères'
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
            Nous contacter
          </p>
          <h2 className='text-foreground text-2xl sm:text-3xl md:text-4xl font-bold'>
            Contact & Localisation
          </h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg'>
            Nous sommes à votre écoute pour toute question ou demande de
            rendez-vous
          </p>
        </ScrollAnimation>

        <div className='grid gap-12 md:grid-cols-2'>
          {/* Contact Info */}
          <ScrollAnimation variant="fadeRight" className='space-y-8'>
            <div className='space-y-6'>
              <div className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                    <MapPin className='text-primary h-6 w-6' />
                  </div>
                </div>
                <div>
                  <h3 className='text-foreground font-semibold'>Adresse</h3>
                  <p className='text-muted-foreground mt-1'>
                    {clinicData.address}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {clinicData.description}
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
                  <h3 className='text-foreground font-semibold'>Téléphone</h3>
                  <p className='text-muted-foreground mt-1'>{clinicData.phone}</p>
                  <p className='text-muted-foreground text-sm'>
                    {clinicData.hours.emergency}
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
                  <h3 className='text-foreground font-semibold'>Email</h3>
                  <p className='text-muted-foreground mt-1'>
                    {clinicData.email}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    Réponse rapide garantie
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
                  <h3 className='text-foreground font-semibold'>Horaires</h3>
                  <p className='text-muted-foreground mt-1'>
                    Sam - jeudi: {clinicData.hours.weekdays}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    Samedi: {clinicData.hours.saturday}
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className='border-border border-t pt-8'>
              <h3 className='text-foreground mb-4 font-semibold'>Notre localisation</h3>
              <Map
                address={clinicData.address}
                coordinates={clinicData.coordinates}
              />
            </div>

            {/* Social Links */}
            <div className='border-border border-t pt-8'>
              <p className='text-foreground mb-4 font-semibold'>Suivez-nous</p>
              <div className='flex gap-4'>
                <a
                  href={siteConfig.social.facebook}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-primary/10 hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg transition-colors'
                >
                  <span className='text-primary font-bold'>f</span>
                </a>
                <a
                  href={siteConfig.social.instagram}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-primary/10 hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg transition-colors'
                >
                  <span className='text-primary font-bold'>📷</span>
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
                    <label className='text-foreground mb-2 block text-sm font-medium'>
                      Prénom <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`bg-background w-full rounded-lg border px-4 py-3 transition-all duration-300 focus:outline-none ${touched.firstName && errors.firstName
                          ? 'border-red-500 focus:ring-red-500/50'
                          : touched.firstName && !errors.firstName
                            ? 'border-green-500 focus:ring-green-500/50'
                            : 'border-border focus:ring-primary/50'
                          }`}
                        placeholder='Votre prénom'
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
                      <p className='mt-1 flex items-center gap-1 text-sm text-red-500'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className='text-foreground mb-2 block text-sm font-medium'>
                      Nom <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`bg-background w-full rounded-lg border px-4 py-3 transition-all duration-300 focus:outline-none ${touched.lastName && errors.lastName
                          ? 'border-red-500 focus:ring-red-500/50'
                          : touched.lastName && !errors.lastName
                            ? 'border-green-500 focus:ring-green-500/50'
                            : 'border-border focus:ring-primary/50'
                          }`}
                        placeholder='Votre nom'
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
                      <p className='mt-1 flex items-center gap-1 text-sm text-red-500'>
                        <AlertCircle className='h-4 w-4' />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className='text-foreground mb-2 block text-sm font-medium'>
                    Email <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-background w-full rounded-lg border px-4 py-3 transition-all duration-300 focus:outline-none ${touched.email && errors.email
                        ? 'border-red-500 focus:ring-red-500/50'
                        : touched.email && !errors.email
                          ? 'border-green-500 focus:ring-green-500/50'
                          : 'border-border focus:ring-primary/50'
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
                    <p className='mt-1 flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircle className='h-4 w-4' />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className='text-foreground mb-2 block text-sm font-medium'>
                    Téléphone{' '}
                    <span className='text-muted-foreground text-xs'>
                      (optionnel)
                    </span>
                  </label>
                  <div className='relative'>
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-background w-full rounded-lg border px-4 py-3 transition-all duration-300 focus:outline-none ${touched.phone && errors.phone
                        ? 'border-red-500 focus:ring-red-500/50'
                        : touched.phone && !errors.phone && formData.phone
                          ? 'border-green-500 focus:ring-green-500/50'
                          : 'border-border focus:ring-primary/50'
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
                    <p className='mt-1 flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircle className='h-4 w-4' />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className='text-foreground mb-2 block text-sm font-medium'>
                    Message <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <textarea
                      name='message'
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={4}
                      className={`bg-background w-full resize-none rounded-lg border px-4 py-3 transition-all duration-300 focus:outline-none ${touched.message && errors.message
                        ? 'border-red-500 focus:ring-red-500/50'
                        : touched.message && !errors.message
                          ? 'border-green-500 focus:ring-green-500/50'
                          : 'border-border focus:ring-primary/50'
                        }`}
                      placeholder='Décrivez votre demande de consultation ou vos questions...'
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
                    <p className='mt-1 flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircle className='h-4 w-4' />
                      {errors.message}
                    </p>
                  )}
                  <p className='text-muted-foreground mt-1 text-xs'>
                    {formData.message.length}/10 caractères minimum
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
                  <div className='animate-fade-in rounded-lg border border-green-200 bg-green-50 p-4'>
                    <div className='flex items-center gap-3'>
                      <CheckCircle className='h-5 w-5 flex-shrink-0 text-green-600' />
                      <div>
                        <p className='font-medium text-green-800'>
                          Message envoyé avec succès !
                        </p>
                        <p className='text-sm text-green-700'>
                          Nous vous répondrons dans les plus brefs délais.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className='animate-fade-in rounded-lg border border-red-200 bg-red-50 p-4'>
                    <div className='flex items-center gap-3'>
                      <AlertCircle className='h-5 w-5 flex-shrink-0 text-red-600' />
                      <div>
                        <p className='font-medium text-red-800'>
                          Erreur lors de l'envoi
                        </p>
                        <p className='text-sm text-red-700'>
                          Veuillez réessayer ou nous contacter directement.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type='submit'
                  className='bg-primary hover:bg-primary/90 text-primary-foreground group w-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'
                  disabled={
                    isSubmitting || Object.values(errors).some((error) => error)
                  }
                >
                  {isSubmitting ? (
                    <div className='flex items-center gap-2'>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white'></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <Send className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                      Envoyer le message
                    </div>
                  )}
                </Button>
              </form>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
