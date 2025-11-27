"use client"
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { type ClinicData } from '@/lib/admin-data'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ArrowRight, HeartPulse } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const [clinicData, setClinicData] = useState<ClinicData | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/clinic', { cache: 'no-store' })
        if (res.ok) {
          const data: ClinicData = await res.json()
          setClinicData(data)
        }
      } catch { }
    }
    load()
  }, [])

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

      {/* Animated Background Elements */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
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
            <div className='flex items-center gap-3'>
              <div className='relative h-12 w-12 bg-white rounded-xl p-1 flex items-center justify-center shadow-lg shadow-primary/20'>
                <Image
                  src='/logo.png'
                  alt='Clinique OKBA'
                  width={40}
                  height={40}
                  className='object-contain'
                />
              </div>
              <div>
                <span className='block text-xl font-bold tracking-tight'>Clinique OKBA</span>
                <span className='text-xs text-primary font-medium tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded-full'>Excellence Médicale</span>
              </div>
            </div>
            <p className='text-slate-400 leading-relaxed text-sm'>
              {t('brandDescription')}
            </p>
            <div className='flex gap-3'>
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                  className='bg-white/5 p-2.5 rounded-full text-slate-400 hover:text-primary transition-colors border border-white/5'
                >
                  <Icon size={18} />
                </motion.a>
              ))}
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
                { key: 'services', href: '#services' },
                { key: 'gallery', href: '#gallery' },
                { key: 'contact', href: '#contact' }
              ].map((item) => (
                <li key={item.key}>
                  <a href={item.href} className='group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors'>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-primary transition-colors" />
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
              {['Urgences 24/7', 'Chirurgie', 'Cardiologie', 'Maternité', 'Imagerie', 'Laboratoire'].map((item) => (
                <li key={item}>
                  <a href="#specialties" className='group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors'>
                    <HeartPulse className="w-4 h-4 text-slate-600 group-hover:text-secondary transition-colors" />
                    {item}
                  </a>
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
            <ul className='space-y-5'>
              <li className='flex gap-4 group'>
                <div className="bg-white/5 p-2.5 h-fit rounded-lg group-hover:bg-primary/20 transition-colors">
                  <MapPin className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">{t('address')}</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{clinicData?.contact.address || 'Nouvelle ville Ali Mendjeli, Constantine'}</p>
                </div>
              </li>
              <li className='flex gap-4 group'>
                <div className="bg-white/5 p-2.5 h-fit rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Phone className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">{t('phone')}</p>
                  <p className="text-sm text-slate-300 ltr:text-left rtl:text-right" dir="ltr">{clinicData?.contact.phone || '+213 555 123 456'}</p>
                </div>
              </li>
              <li className='flex gap-4 group'>
                <div className="bg-white/5 p-2.5 h-fit rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Mail className='w-5 h-5 text-primary' />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">{t('email')}</p>
                  <p className="text-sm text-slate-300">{clinicData?.contact.email || 'contact@cliniqueokba.com'}</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className='mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4'>
          <p className='text-xs text-slate-500'>
            © {currentYear} Clinique OKBA. {t('rights')}.
          </p>
          <div className='flex gap-6 text-xs text-slate-500'>
            <Link href="/legal/mentions-legales" className='hover:text-white transition-colors'>{t('terms')}</Link>
            <Link href="/legal/confidentialite" className='hover:text-white transition-colors'>{t('privacy')}</Link>
            <Link href="/legal/cookies" className='hover:text-white transition-colors'>{t('cookies')}</Link>
            <Link href="/plan-du-site" className='hover:text-white transition-colors'>{t('sitemap')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
