"use client"
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { type ClinicData } from '@/lib/admin-data'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ArrowRight } from 'lucide-react'

export default function Footer() {
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
    <footer className='relative bg-[#0f172a] text-white overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50' />
      <div className='absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none' />
      <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none' />

      <div className='py-20 relative z-10'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
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
                <div className='relative h-16 w-16 bg-white/5 rounded-2xl p-2 backdrop-blur-sm border border-white/10'>
                  <Image
                    src='/logo.png'
                    alt='Clinique OKBA Logo'
                    fill
                    className='object-contain p-1'
                  />
                </div>
                <div>
                  <p className='text-xl font-bold tracking-tight text-white'>Clinique OKBA</p>
                  <p className='text-sm text-gray-400'>Excellence Médicale</p>
                </div>
              </div>
              <p className='text-sm leading-relaxed text-gray-400 max-w-xs'>
                Votre partenaire santé de confiance à Constantine. Une équipe dévouée et des équipements de pointe pour votre bien-être.
              </p>
              <div className='flex gap-4'>
                {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className='bg-white/5 p-2.5 rounded-xl hover:bg-primary hover:text-white text-gray-400 hover:scale-110 transition-all duration-300 border border-white/5'>
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className='mb-8 text-lg font-semibold flex items-center gap-3 text-white'>
                <span className='w-8 h-1 bg-primary rounded-full'></span>
                Navigation
              </h4>
              <ul className='space-y-4'>
                {['Accueil', 'À propos', 'Spécialités', 'Services', 'Galerie', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase().replace('à', 'a').replace('é', 'e')}`} className='group flex items-center gap-2 text-sm text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-300'>
                      <ArrowRight size={14} className='opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary' />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div variants={itemVariants}>
              <h4 className='mb-8 text-lg font-semibold flex items-center gap-3 text-white'>
                <span className='w-8 h-1 bg-primary rounded-full'></span>
                Nos Pôles
              </h4>
              <ul className='space-y-4'>
                {['Urgences 24/7', 'Chirurgie Générale', 'Cardiologie', 'Maternité', 'Radiologie', 'Laboratoire'].map((item) => (
                  <li key={item}>
                    <a href="#specialties" className='group flex items-center gap-3 text-sm text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-300'>
                      <span className='w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors'></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h4 className='mb-8 text-lg font-semibold flex items-center gap-3 text-white'>
                <span className='w-8 h-1 bg-primary rounded-full'></span>
                Contact
              </h4>
              <ul className='space-y-6'>
                <li className='flex items-start gap-4 text-sm text-gray-400 group'>
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <MapPin className='shrink-0 text-primary' size={18} />
                  </div>
                  <span className="leading-relaxed">{clinicData?.contact.address || 'Nouvelle ville Ali Mendjeli, Constantine, Algérie'}</span>
                </li>
                <li className='flex items-center gap-4 text-sm text-gray-400 group'>
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Phone className='shrink-0 text-primary' size={18} />
                  </div>
                  <span>{clinicData?.contact.phone || '+213 555 123 456'}</span>
                </li>
                <li className='flex items-center gap-4 text-sm text-gray-400 group'>
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Mail className='shrink-0 text-primary' size={18} />
                  </div>
                  <span>{clinicData?.contact.email || 'contact@cliniqueokba.com'}</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-white/5 bg-black/20 backdrop-blur-xl'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500'>
            <p>© {currentYear} Clinique OKBA. Tous droits réservés.</p>
            <div className='flex gap-8'>
              <a href="#" className='hover:text-primary transition-colors'>Mentions Légales</a>
              <a href="#" className='hover:text-primary transition-colors'>Politique de Confidentialité</a>
              <a href="#" className='hover:text-primary transition-colors'>Plan du site</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
