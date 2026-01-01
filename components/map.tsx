'use client'

import { useState } from 'react'
import { MapPin, Navigation, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MapComponentProps {
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  className?: string
}

export default function MapComponent({
  address,
  coordinates,
  className = '',
}: MapComponentProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // URLs Google Maps
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`

  // URL iframe Google Maps avec vraie carte
  const mapEmbedUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&hl=fr&z=16&output=embed`

  return (
    <div className={cn('relative', className)}>
      {/* Carte Google Maps avec iframe - affiche les vraies routes */}
      <div className='relative h-80 overflow-hidden rounded-2xl shadow-2xl lg:h-96 border border-border'>
        {/* Loading state */}
        {!isLoaded && (
          <div className='absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 dark:from-emerald-950 dark:via-teal-900 dark:to-cyan-950'>
            <div className='text-center'>
              <div className='relative mx-auto mb-4'>
                {/* Animated loader */}
                <div className='h-12 w-12 rounded-full border-4 border-emerald-200 dark:border-emerald-800'></div>
                <div className='absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-emerald-500'></div>
              </div>
              <p className='text-emerald-700 dark:text-emerald-300 font-medium'>Chargement de la carte...</p>
            </div>
          </div>
        )}

        {/* Google Maps iframe - vraie carte avec routes */}
        <iframe
          src={mapEmbedUrl}
          width='100%'
          height='100%'
          style={{ border: 0 }}
          allowFullScreen
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
          className={cn(
            'h-full w-full transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          title={`Localisation Clinique OKBA - ${address}`}
          onLoad={() => setIsLoaded(true)}
        />

        {/* Overlay gradient subtil en bas */}
        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent'></div>

        {/* Action buttons flottants */}
        <div className='absolute bottom-4 right-4 flex gap-3 z-20'>
          <a
            href={directionsUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 flex items-center gap-2 rounded-xl px-4 py-2.5 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-emerald-200 dark:border-emerald-700 font-medium backdrop-blur-sm'
          >
            <Navigation className='h-5 w-5' />
            <span className='hidden sm:inline'>Itinéraire</span>
          </a>
          <a
            href={googleMapsUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 flex items-center gap-2 rounded-xl px-4 py-2.5 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl font-medium'
          >
            <ExternalLink className='h-5 w-5' />
            <span className='hidden sm:inline'>Ouvrir</span>
          </a>
        </div>
      </div>

      {/* Informations de localisation */}
      <div className='mt-6 grid gap-4 sm:grid-cols-2'>
        {/* Address card */}
        <div className='group/card bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 rounded-xl p-5 transition-all duration-300 hover:shadow-xl border border-emerald-200 dark:border-emerald-800'>
          <div className='flex items-start gap-4'>
            <div className='bg-gradient-to-br from-emerald-500 to-teal-600 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl shadow-lg'>
              <MapPin className='h-7 w-7 text-white' />
            </div>
            <div>
              <h4 className='font-bold text-emerald-800 dark:text-emerald-200 mb-1 text-lg'>Adresse</h4>
              <p className='text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed'>{address}</p>
              <p className='text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1 font-mono'>
                📍 {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
              </p>
            </div>
          </div>
        </div>

        {/* Quick access card */}
        <a
          href={directionsUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='group/card bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 hover:from-teal-100 hover:to-cyan-100 dark:hover:from-teal-900/50 dark:hover:to-cyan-900/50 rounded-xl p-5 transition-all duration-300 hover:shadow-xl border border-teal-200 dark:border-teal-800 hover:border-teal-400 dark:hover:border-teal-600'
        >
          <div className='flex items-start gap-4'>
            <div className='bg-gradient-to-br from-teal-500 to-cyan-600 group-hover/card:from-teal-600 group-hover/card:to-cyan-700 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl shadow-lg transition-all'>
              <Navigation className='h-7 w-7 text-white' />
            </div>
            <div>
              <h4 className='font-bold text-teal-800 dark:text-teal-200 mb-1 text-lg flex items-center gap-2'>
                Obtenir l'itinéraire
                <ExternalLink className='h-4 w-4 opacity-0 group-hover/card:opacity-100 transition-opacity' />
              </h4>
              <p className='text-sm text-teal-700 dark:text-teal-300'>Ouvrir dans Google Maps pour vous guider</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}
