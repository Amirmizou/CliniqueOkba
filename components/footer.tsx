"use client"
import Image from 'next/image'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Mail, MapPin, Phone, ArrowRight, HeartPulse } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { poles } from '@/data/poles'

interface SiteSettings {
  clinicName?: string
  phone?: string
  email?: string
  address?: string
  address_ar?: string
  social?: { facebook?: string; instagram?: string }
}

interface FooterContent {
  description?: string
  copyright?: string
}

interface FooterProps {
  siteSettings?: SiteSettings
  footerContent?: FooterContent
  sanityPoles?: any[]
}

export default function Footer({ siteSettings, footerContent, sanityPoles }: FooterProps) {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const locale = useLocale()

  const isAr = locale === 'ar'

  const siteConfig = {
    contact: {
      address: siteSettings?.address || '',
      phone: siteSettings?.phone || '',
      email: siteSettings?.email || '',
    },
    social: siteSettings?.social || { facebook: '', instagram: '' },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { key: 'home', href: '/' },
    { key: 'about', href: '/#about' },
    { key: 'specialties', href: '/#specialties' },
    { key: 'gallery', href: '/#equipements' },
    { key: 'news', href: '/actualites' },
    { key: 'contact', href: '/#contact' }
  ]

  const contactNumbers = [
    { label: isAr ? 'الاستعجالات' : 'Urgences / Standard', number: '+213 770 88 42 42', urgent: true },
    { label: isAr ? '' : '', number: '+213 770 88 43 43', urgent: true, hideLabel: true },
    { label: isAr ? 'الاستقبال' : 'Réception', number: '0550 25 00 54' },
    { label: isAr ? 'مخبر التحاليل' : 'Laboratoire d\'analyses', number: '0550 25 00 58' },
    { label: isAr ? 'الهاتف الثابت' : 'Fix', number: '039 33 88 71' },
    { label: isAr ? '' : '', number: '039 33 81 27', hideLabel: true },
  ]

  return (
    <footer className='relative bg-[#080c16] text-white overflow-hidden pt-24 selection:bg-primary/30'>
      {/* Curved Top Border (More subtle for premium feel) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-[40px] w-full fill-background">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Cinematic Glowing Meshes */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.08, 0.03], rotate: [0, 45, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className='absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-primary rounded-full blur-[150px]'
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.02, 0.06, 0.02] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className='absolute bottom-0 -left-[10%] w-[600px] h-[600px] bg-secondary rounded-full blur-[150px]'
        />
      </div>

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12'>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className='grid gap-x-8 gap-y-16 md:grid-cols-12'
        >
          {/* Brand Section (Col 1-4) */}
          <motion.div variants={itemVariants} className='md:col-span-12 lg:col-span-4 flex flex-col'>
            <Link href="/" className='inline-flex items-center gap-5 group w-fit'>
              <div className='relative h-20 w-20 bg-white/[0.02] backdrop-blur-md rounded-2xl p-3 flex items-center justify-center shadow-2xl border border-white/[0.05] group-hover:bg-white/[0.06] group-hover:border-primary/30 transition-all duration-500'>
                <Image
                  src="/footer-logo.png"
                  alt='Clinique OKBA'
                  width={64}
                  height={64}
                  className='h-full w-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-transform duration-500 group-hover:scale-110'
                />
              </div>
              <div className="flex flex-col">
                {isAr ? (
                    <span className='block text-2xl font-bold tracking-tight text-white drop-shadow-md'>المصحة الطبية <span className="text-primary font-extrabold">عقبة</span></span>
                ) : (
                    <span className='block text-2xl font-bold tracking-tight text-white drop-shadow-md'>Clinique <span className="text-primary font-extrabold">OKBA</span></span>
                )}
                <span className='text-[10px] w-fit text-primary font-bold tracking-[0.25em] uppercase mt-1 opacity-80'>
                  {tNav('tagline')}
                </span>
              </div>
            </Link>
            
            <p className='mt-8 text-white/50 leading-relaxed text-[15px] max-w-[22rem]'>
              {footerContent?.description || t('brandDescription')}
            </p>
            
            <div className='flex gap-4 mt-10'>
              <motion.a
                href={siteConfig?.social?.facebook || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='h-11 w-11 bg-white/[0.03] backdrop-blur-md rounded-full text-white/60 hover:text-white hover:bg-[#1877F2]/20 hover:border-[#1877F2]/50 transition-all duration-300 border border-white/[0.05] flex items-center justify-center shadow-lg group'
              >
                <Facebook size={18} strokeWidth={1.5} className="group-hover:text-[#1877F2] transition-colors" />
              </motion.a>
              <motion.a
                href={siteConfig?.social?.instagram || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='h-11 w-11 bg-white/[0.03] backdrop-blur-md rounded-full text-white/60 hover:text-white hover:bg-[#E4405F]/20 hover:border-[#E4405F]/50 transition-all duration-300 border border-white/[0.05] flex items-center justify-center shadow-lg group'
              >
                <Instagram size={18} strokeWidth={1.5} className="group-hover:text-[#E4405F] transition-colors" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links (Col 5-6) */}
          <motion.div variants={itemVariants} className='md:col-span-4 lg:col-span-2'>
            <h4 className='text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-8 flex items-center gap-3'>
              {t('navigation')}
              <div className="h-px bg-white/[0.05] flex-1" />
            </h4>
            <ul className='space-y-4'>
              {quickLinks.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className='group flex items-center text-[15px] text-white/60 hover:text-white transition-colors duration-300 touch-target'>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-4 mr-1 text-primary group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 rtl:rotate-180 rtl:ml-1 rtl:mr-0 rtl:-mr-4 rtl:group-hover:mr-0" />
                    <span className="relative overflow-hidden">
                      {tNav(item.key)}
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/40 -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300 rtl:translate-x-[101%]" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Services (Col 7-9) */}
          <motion.div variants={itemVariants} className='md:col-span-4 lg:col-span-3'>
            <h4 className='text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-8 flex items-center gap-3'>
              {t('poles')}
              <div className="h-px bg-white/[0.05] flex-1" />
            </h4>
            <ul className='space-y-4'>
              {(sanityPoles && sanityPoles.length > 0 ? sanityPoles : poles).slice(0, 6).map((pole: any) => {
                const poleSlug = pole.slug?.current || pole.slug
                const displayTitle = sanityPoles && sanityPoles.length > 0
                  ? pole.title
                  : (isAr ? (pole.title_ar || pole.title) : pole.title)
                return (
                <li key={poleSlug}>
                  <Link href={`/poles/${poleSlug}`} className='group flex items-center gap-3 text-[15px] text-white/60 hover:text-white transition-colors duration-300 touch-target'>
                    <HeartPulse className={cn("w-4 h-4 transition-colors", pole.urgent ? "text-red-500/80 group-hover:text-red-400" : "text-white/20 group-hover:text-secondary/80")} />
                    <span className={pole.urgent ? "text-red-400 font-medium" : ""}>{displayTitle}</span>
                  </Link>
                </li>
                )
              })}
            </ul>
          </motion.div>
          
          {/* Contact Cards (Col 10-12) */}
          <motion.div variants={itemVariants} className='md:col-span-4 lg:col-span-3'>
            <h4 className='text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-8 flex items-center gap-3'>
              {t('contact')}
              <div className="h-px bg-white/[0.05] flex-1" />
            </h4>
            <div className='flex flex-col gap-3'>
              {/* Address Card */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/[0.08] transition-colors duration-300 group cursor-default">
                <MapPin className='w-5 h-5 text-primary/70 shrink-0 mt-0.5 group-hover:text-primary transition-colors' />
                <div className="flex flex-col">
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">{t('address')}</p>
                  <p className="text-[14px] text-white/80 leading-relaxed font-medium">{siteConfig?.contact.address || (isAr ? 'المدينة الجديدة علي منجلي، قسنطينة' : 'Nouvelle ville Ali Mendjeli, Constantine')}</p>
                </div>
              </div>
              
              {/* Phone Card (Consolidated) */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/[0.08] transition-colors duration-300 group cursor-default">
                <Phone className='w-5 h-5 text-primary/70 shrink-0 mt-0.5 group-hover:text-primary transition-colors' />
                <div className="flex flex-col gap-3 w-full">
                  {contactNumbers.map((item, idx) => (
                    <div key={idx} className={cn("flex flex-col", item.hideLabel ? "mt-[-8px]" : "")}>
                      {!item.hideLabel && (
                         <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">{item.label}</p>
                      )}
                      <p className={cn("text-[14px] font-medium tracking-wide ltr:text-left rtl:text-right", item.urgent ? "text-red-400" : "text-white/80")} dir="ltr">{item.number}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
        </motion.div>
        
        {/* Separator & Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 pt-8 relative flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Subtle gradient border top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <p className='text-[13px] text-white/40 font-medium'>
            {footerContent?.copyright || (isAr ? `© ${currentYear} المصحة الطبية عقبة. ${t('rights')}.` : `© ${currentYear} Clinique OKBA. ${t('rights')}.`)}
          </p>
          <div className='flex flex-wrap justify-center gap-x-8 gap-y-4 text-[13px] font-medium text-white/40'>
            <Link href="/legal/mentions-legales" className='hover:text-white transition-colors py-2 touch-target'>{t('terms')}</Link>
            <Link href="/legal/confidentialite" className='hover:text-white transition-colors py-2 touch-target'>{t('privacy')}</Link>
            <Link href="/plan-du-site" className='hover:text-white transition-colors py-2 touch-target'>{t('sitemap')}</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
