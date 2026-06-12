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
}

export default function Footer({ siteSettings, footerContent }: FooterProps) {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const locale = useLocale()

  const isAr = locale === 'ar'

  // Use Sanity data if available
  const siteConfig = {
    contact: {
      address: isAr ? (siteSettings?.address_ar || siteSettings?.address || '') : (siteSettings?.address || ''),
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className='relative bg-[#0f172a] text-white overflow-hidden pt-20'>
      {/* Curved Top Border */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-[60px] w-full fill-background">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Animated Background Elements - Hidden on mobile for performance */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden hidden md:block'>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className='absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]'
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className='absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px]'
        />
      </div>
      {/* Static gradient for mobile */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden md:hidden'>
        <div className='absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px]' />
        <div className='absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px]' />
      </div>

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12'>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className='grid gap-12 md:grid-cols-2 lg:grid-cols-4'
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className='space-y-6'>
            <div className='flex items-center gap-4'>
              <div className='relative h-14 w-14 bg-white/10 backdrop-blur-md rounded-2xl p-2 flex items-center justify-center shadow-xl shadow-primary/20 border border-white/10 group-hover:border-primary/50 transition-colors'>
                <Image
                  src='/logo.png'
                  alt='Clinique OKBA'
                  width={44}
                  height={44}
                  className='object-contain drop-shadow-lg'
                />
              </div>
              <div className="flex flex-col gap-1.5">
                {isAr ? (
                    <span className='block text-2xl font-bold tracking-tight text-white drop-shadow-md'>المصحة الطبية <span className="text-primary">عقبة</span></span>
                ) : (
                    <span className='block text-2xl font-bold tracking-tight text-white drop-shadow-md'>Clinique <span className="text-primary">OKBA</span></span>
                )}
                <span className='text-[10px] w-fit text-primary font-bold tracking-widest uppercase bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20'>
                  {tNav('tagline')}
                </span>
              </div>
            </div>
            <p className='text-slate-400 leading-relaxed text-sm'>
              {footerContent?.description || t('brandDescription')}
            </p>
            <div className='flex gap-3'>
              <motion.a
                href={siteConfig?.social?.facebook || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                className='bg-white/5 p-3 rounded-full text-slate-400 hover:text-primary transition-colors border border-white/5 touch-target flex items-center justify-center'
              >
                <Facebook size={18} />
              </motion.a>
              <motion.a
                href={siteConfig?.social?.instagram || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                className='bg-white/5 p-3 rounded-full text-slate-400 hover:text-primary transition-colors border border-white/5 touch-target flex items-center justify-center'
              >
                <Instagram size={18} />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className='text-lg font-semibold mb-6 flex items-center gap-2'>
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              {t('navigation')}
            </h4>
            <ul className='space-y-3'>
              {[
                { key: 'home', href: '#home' },
                { key: 'about', href: '#about' },
                { key: 'specialties', href: '#specialties' },
                { key: 'gallery', href: '#equipements' },
                { key: 'contact', href: '#contact' }
              ].map((item) => (
                <li key={item.key}>
                  <a href={item.href} className='group flex items-center gap-3 text-base md:text-sm text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1.5 py-2 touch-target'>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-primary group-hover:w-3 transition-all duration-300" />
                    {tNav(item.key)}
                  </a>
                </li>
              ))}
              {/* Additional pages */}
              {[
                { key: 'news', href: '/actualites' },
                { key: 'events', href: '/evenements' },
                { key: 'team', href: '/equipe' },
                { key: 'faq', href: '/faq' },
              ].map((item) => (
                <li key={item.key}>
                  <a href={item.href} className='group flex items-center gap-3 text-base md:text-sm text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1.5 py-2 touch-target'>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-primary group-hover:w-3 transition-all duration-300" />
                    {tNav(item.key)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className='text-lg font-semibold mb-6 flex items-center gap-2'>
              <span className="w-1.5 h-6 bg-secondary rounded-full" />
              {t('poles')}
            </h4>
            <ul className='space-y-3'>
              {poles.map((pole) => (
                <li key={pole.slug}>
                  <Link href={`/poles/${pole.slug}`} className='group flex items-center gap-3 text-base md:text-sm text-slate-400 hover:text-white transition-all duration-300 hover:translate-x-1.5 py-2 touch-target'>
                    <HeartPulse className={cn("w-4 h-4 transition-colors", pole.urgent ? "text-red-500" : "text-slate-600 group-hover:text-secondary")} />
                    <span className={pole.urgent ? "text-red-400 font-medium" : ""}>{locale === 'ar' && pole.title_ar ? pole.title_ar : pole.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className='text-lg font-semibold mb-6 flex items-center gap-2'>
              <span className="w-1.5 h-6 bg-red-500 rounded-full" />
              {t('contact')}
            </h4>
            <ul className='space-y-4 mt-2'>
              <li className='flex gap-4 group p-3 -ml-3 rounded-xl hover:bg-white/5 transition-colors duration-300'>
                <div className="bg-white/5 p-3 h-fit rounded-xl group-hover:bg-primary/20 transition-colors shadow-inner shadow-white/5">
                  <MapPin className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase mb-1 tracking-widest">{t('address')}</p>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">{siteConfig?.contact.address || (isAr ? 'المدينة الجديدة علي منجلي، قسنطينة' : 'Nouvelle ville Ali Mendjeli, Constantine')}</p>
                </div>
              </li>
              <li className='flex gap-4 group p-3 -ml-3 rounded-xl hover:bg-white/5 transition-colors duration-300'>
                <div className="bg-white/5 p-3 h-fit rounded-xl group-hover:bg-primary/20 transition-colors shadow-inner shadow-white/5">
                  <Phone className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase mb-1 tracking-widest">{t('phone')}</p>
                  <p className="text-sm text-slate-300 ltr:text-left rtl:text-right font-medium" dir="ltr">{siteConfig?.contact.phone || '+213 555 123 456'}</p>
                </div>
              </li>
              <li className='flex gap-4 group p-3 -ml-3 rounded-xl hover:bg-white/5 transition-colors duration-300'>
                <div className="bg-white/5 p-3 h-fit rounded-xl group-hover:bg-primary/20 transition-colors shadow-inner shadow-white/5">
                  <Mail className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase mb-1 tracking-widest">{t('email')}</p>
                  <p className="text-sm text-slate-300 font-medium">{siteConfig?.contact.email || 'contact@cliniqueokba.com'}</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className='mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4'>
          <p className='text-xs text-slate-500'>
            {footerContent?.copyright || (isAr ? `© ${currentYear} المصحة الطبية عقبة. ${t('rights')}.` : `© ${currentYear} Clinique OKBA. ${t('rights')}.`)}
          </p>
          <div className='flex flex-wrap justify-center gap-x-6 gap-y-4 text-xs md:text-sm text-slate-500'>
            <Link href="/legal/mentions-legales" className='hover:text-white transition-colors py-2 px-1 touch-target'>{t('terms')}</Link>
            <Link href="/legal/confidentialite" className='hover:text-white transition-colors py-2 px-1 touch-target'>{t('privacy')}</Link>
            <Link href="/legal/cookies" className='hover:text-white transition-colors py-2 px-1 touch-target'>{t('cookies')}</Link>
            <Link href="/plan-du-site" className='hover:text-white transition-colors py-2 px-1 touch-target'>{t('sitemap')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
