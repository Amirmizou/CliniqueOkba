'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, Car, Train, Plane, Map as MapIcon, ExternalLink, ArrowRight } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface LocationBentoProps {
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  className?: string
}

export default function LocationBento({ address, coordinates, className }: LocationBentoProps) {
  const [activeTab, setActiveTab] = useState<'car' | 'tram' | 'plane'>('car')
  const locale = useLocale()
  const isAr = locale === 'ar'

  // We can use basic translations or hardcoded elegant fallbacks for now
  const t = {
    title: isAr ? 'كيفية الوصول إلينا' : 'Comment nous rejoindre',
    subtitle: isAr ? 'خطط لزيارتك بكل سهولة' : 'Planifiez votre visite en toute simplicité.',
    car: isAr ? 'بالسيارة' : 'Voiture',
    tram: isAr ? 'الترامواي' : 'Tramway',
    plane: isAr ? 'المطار' : 'Aéroport',
    carDesc: isAr ? 'موقف سيارات متاح بالقرب من المصحة. سهولة الوصول من الطريق السريع.' : 'Parking disponible à proximité de la clinique. Accès facile depuis l\'autoroute.',
    tramDesc: isAr ? 'محطة الترامواي "جامعة عبد الحميد مهري" (المحطة النهائية) على بعد حوالي 10 دقائق بسيارة الأجرة (4.5 كم).' : 'Station de tramway "Université Abdelhamid Mehri" (Terminus) à environ 10 min en taxi (4,5 km).',
    planeDesc: isAr ? 'على بعد 15 دقيقة بالسيارة من مطار قسنطينة محمد بوضياف.' : 'À 15 min en voiture de l\'Aéroport International Mohamed Boudiaf.',
    waze: isAr ? 'فتح في Waze' : 'Ouvrir avec Waze',
    google: isAr ? 'فتح في خرائط جوجل' : 'Google Maps',
    facade: isAr ? 'واجهة المصحة' : 'Façade de la clinique',
    facadeSub: isAr ? 'لتتعرف علينا عند وصولك' : 'Pour nous reconnaître à votre arrivée',
  }

  const mapEmbedUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&hl=${locale}&z=16&output=embed`
  const wazeUrl = `https://waze.com/ul?ll=${coordinates.lat},${coordinates.lng}&navigate=yes`
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-8 flex flex-col items-center text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t.title}</h3>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
        
        {/* TILE 1: The Map (Large) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-3xl overflow-hidden group border border-border bg-card shadow-sm"
        >
          {/* Custom Filter Overlay to match premium theme */}
          <div className="absolute inset-0 z-10 pointer-events-none mix-blend-color transition-opacity duration-700 group-hover:opacity-0 bg-primary/20 dark:bg-slate-900/50" />
          <iframe
            src={mapEmbedUrl}
            width='100%'
            height='100%'
            style={{ border: 0 }}
            allowFullScreen
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            className="w-full h-full grayscale-[30%] contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:contrast-100"
          />
          {/* Pulsing Marker Overlay (Decorative) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[120%] z-20 pointer-events-none drop-shadow-2xl flex flex-col items-center">
            <div className="bg-primary text-white p-3 rounded-2xl rounded-br-none shadow-lg mb-1 animate-bounce">
              <MapIcon className="w-6 h-6" />
            </div>
            <div className="w-4 h-4 bg-primary/50 rounded-full animate-ping absolute -bottom-1" />
            <div className="w-2 h-2 bg-primary rounded-full absolute -bottom-0" />
          </div>
        </motion.div>

        {/* TILE 2: Facade / Street View */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative col-span-1 md:col-span-1 lg:col-span-1 row-span-2 rounded-3xl overflow-hidden border border-border group bg-muted"
        >
          {/* Placeholder or real image for Facade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          <Image
            src="/images/facade.jpg" // We will use a medical texture or facade if uploaded
            alt="Façade de la clinique"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            // If the image doesn't exist, we fallback nicely in CSS
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-primary/10 z-0" /> {/* Fallback bg */}
          
          <div className="absolute bottom-0 left-0 w-full p-6 z-20 text-white">
            <div className="bg-white/20 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg leading-tight mb-1">{t.facade}</h4>
            <p className="text-white/70 text-xs font-medium">{t.facadeSub}</p>
          </div>
        </motion.div>

        {/* TILE 3: Transport Modes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 rounded-3xl p-6 bg-card border border-border shadow-sm flex flex-col justify-between"
        >
          <div className="flex gap-2 p-1 bg-muted rounded-xl mb-4">
            <button 
              onClick={() => setActiveTab('car')}
              className={cn("flex-1 py-1.5 rounded-lg flex justify-center items-center transition-all", activeTab === 'car' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <Car className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab('tram')}
              className={cn("flex-1 py-1.5 rounded-lg flex justify-center items-center transition-all", activeTab === 'tram' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <Train className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab('plane')}
              className={cn("flex-1 py-1.5 rounded-lg flex justify-center items-center transition-all", activeTab === 'plane' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <Plane className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <h5 className="font-bold text-foreground text-sm mb-1">
                  {activeTab === 'car' && t.car}
                  {activeTab === 'tram' && t.tram}
                  {activeTab === 'plane' && t.plane}
                </h5>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {activeTab === 'car' && t.carDesc}
                  {activeTab === 'tram' && t.tramDesc}
                  {activeTab === 'plane' && t.planeDesc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* TILE 4: GPS CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="col-span-1 md:col-span-2 lg:col-span-1 row-span-1 rounded-3xl p-1 bg-gradient-to-br from-primary to-secondary shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 opacity-10 mix-blend-overlay" />
          <div className="w-full h-full bg-card/95 dark:bg-card/90 backdrop-blur-xl rounded-[22px] p-5 flex flex-col justify-center gap-3 relative z-10">
            
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-primary/10 hover:bg-primary/20 text-primary p-3 rounded-xl transition-colors group/btn">
              <span className="font-bold text-sm">{t.google}</span>
              <Navigation className="w-4 h-4 group-hover/btn:rotate-45 transition-transform" />
            </a>
            
            <a href={wazeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-[#33ccff]/10 hover:bg-[#33ccff]/20 text-[#0099cc] dark:text-[#33ccff] p-3 rounded-xl transition-colors group/btn">
              <span className="font-bold text-sm">{t.waze}</span>
              <ExternalLink className="w-4 h-4 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </a>

          </div>
        </motion.div>

      </div>
    </div>
  )
}
