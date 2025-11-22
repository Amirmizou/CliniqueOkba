'use client'

import { useState } from 'react'
import { MapPin, Navigation, ExternalLink } from 'lucide-react'

interface MapProps {
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  className?: string
}

export default function Map({
  address,
  coordinates,
  className = '',
}: MapProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // URL Google Maps centré précisément sur lat,lng (avec marqueur implicite)
  const mapUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&hl=fr&z=17&output=embed`

  // URL pour ouvrir dans Google Maps
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`

  return (
    <div className={`relative ${className}`}>
      {/* Carte Google Maps */}
      <div className='bg-muted relative h-80 overflow-hidden rounded-lg shadow-lg lg:h-96'>
        {!isLoaded && (
          <div className='bg-muted absolute inset-0 flex items-center justify-center'>
            <div className='text-center'>
              <div className='border-primary/30 border-t-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2'></div>
              <p className='text-muted-foreground'>Chargement de la carte...</p>
            </div>
          </div>
        )}

        <iframe
          src={mapUrl}
          width='100%'
          height='100%'
          style={{ border: 0 }}
          allowFullScreen
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
          className='h-full w-full'
          title={`Localisation Clinique OKBA - ${address}`}
          onLoad={() => setIsLoaded(true)}
        />

        {/* Overlay avec gradient */}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>

        {/* Bouton d'action flottant */}
        <div className='absolute right-4 bottom-4'>
          <a
            href={googleMapsUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 shadow-lg transition-all duration-300 hover:scale-105'
          >
            <Navigation className='h-4 w-4' />
            <span className='hidden sm:inline'>Ouvrir dans Maps</span>
            <ExternalLink className='h-3 w-3 sm:hidden' />
          </a>
        </div>
      </div>

      {/* Informations de localisation */}
      <div className='bg-muted/50 mt-4 rounded-lg p-4'>
        <div className='flex items-start gap-3'>
          <MapPin className='text-primary mt-0.5 h-5 w-5 flex-shrink-0' />
          <div>
            <p className='text-sm font-medium'>{address}</p>
            <p className='text-muted-foreground mt-1 text-xs'>
              Coordonnées: {coordinates.lat.toFixed(4)}°N,{' '}
              {coordinates.lng.toFixed(4)}°E
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}




