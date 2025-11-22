'use client'

import { useState } from 'react'
import { MapPin, Navigation, ExternalLink, Maximize2 } from 'lucide-react'

interface OpenStreetMapProps {
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  className?: string
  zoom?: number
}

export default function OpenStreetMap({
  address,
  coordinates,
  className = '',
  zoom = 15,
}: OpenStreetMapProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // URL OpenStreetMap avec les coordonnées
  const delta = 0.005
  const bbox = `${coordinates.lng - delta},${coordinates.lat - delta},${coordinates.lng + delta},${coordinates.lat + delta}`
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}#map=${zoom}/${coordinates.lat}/${coordinates.lng}`

  // URL pour ouvrir dans OpenStreetMap
  const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}&zoom=${zoom}&layers=M`

  // URL pour Google Maps (alternative)
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`

  return (
    <>
      <div
        className={`relative ${className} ${isFullscreen ? 'bg-background fixed inset-0 z-50' : ''}`}
      >
        {/* Carte OpenStreetMap */}
        <div
          className={`bg-muted relative overflow-hidden rounded-lg shadow-lg ${isFullscreen ? 'h-full' : 'h-80 lg:h-96'}`}
        >
          {!isLoaded && (
            <div className='bg-muted absolute inset-0 flex items-center justify-center'>
              <div className='text-center'>
                <div className='border-primary/30 border-t-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2'></div>
                <p className='text-muted-foreground'>
                  Chargement de la carte...
                </p>
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
            className='h-full w-full'
            title={`Localisation Clinique OKBA - ${address}`}
            onLoad={() => setIsLoaded(true)}
          />

          {/* Overlay avec gradient */}
          <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>

          {/* Boutons d'action flottants */}
          <div className='absolute right-4 bottom-4 flex gap-2'>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className='bg-background/90 text-foreground hover:bg-background inline-flex items-center gap-2 rounded-lg px-3 py-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105'
              title={isFullscreen ? 'Réduire' : 'Plein écran'}
            >
              <Maximize2 className='h-4 w-4' />
            </button>

            <a
              href={openStreetMapUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-3 py-2 shadow-lg transition-all duration-300 hover:scale-105'
              title='Ouvrir dans OpenStreetMap'
            >
              <Navigation className='h-4 w-4' />
              <span className='hidden sm:inline'>Maps</span>
            </a>
          </div>

          {/* Bouton Google Maps alternatif */}
          <div className='absolute top-4 right-4'>
            <a
              href={googleMapsUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-background/90 text-foreground hover:bg-background inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105'
              title='Ouvrir dans Google Maps'
            >
              <ExternalLink className='h-3 w-3' />
              <span className='hidden sm:inline'>Google</span>
            </a>
          </div>
        </div>

        {/* Informations de localisation */}
        <div className='bg-muted/50 mt-4 rounded-lg p-4'>
          <div className='flex items-start gap-3'>
            <MapPin className='text-primary mt-0.5 h-5 w-5 flex-shrink-0' />
            <div className='flex-1'>
              <p className='text-sm font-medium'>{address}</p>
              <p className='text-muted-foreground mt-1 text-xs'>
                Coordonnées: {coordinates.lat.toFixed(4)}°N,{' '}
                {coordinates.lng.toFixed(4)}°E
              </p>
              <div className='mt-2 flex gap-2'>
                <a
                  href={googleMapsUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:text-primary/80 text-xs transition-colors'
                >
                  Google Maps
                </a>
                <span className='text-muted-foreground text-xs'>•</span>
                <a
                  href={openStreetMapUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:text-primary/80 text-xs transition-colors'
                >
                  OpenStreetMap
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay pour le mode plein écran */}
      {isFullscreen && (
        <div
          className='fixed inset-0 z-40 bg-black/50'
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </>
  )
}




