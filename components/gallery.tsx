'use client'

import { useState } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Stethoscope,
  Heart,
  Image as ImageIcon,
} from 'lucide-react'
import Image from 'next/image'
import ScrollAnimation from '@/components/ui/scroll-animation'
import StaggerContainer from '@/components/ui/stagger-container'
import { type GalleryImage } from '@/lib/admin-data'
import { useEffect } from 'react'

const categoryIcons = {
  exterior: MapPin,
  interior: Heart,
  equipment: Stethoscope,
  team: Users,
  other: ImageIcon,
} as const

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/gallery', { cache: 'no-store' })
        if (res.ok) setGalleryImages(await res.json())
      } catch { }
    }
    load()
  }, [])

  const published = galleryImages.filter((img) => img.published ?? true)
  const filteredImages =
    selectedCategory === 'all'
      ? published
      : published.filter((img) => img.category === selectedCategory)

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (!selectedImage) return
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id
    )
    const nextIndex = (currentIndex + 1) % filteredImages.length
    setSelectedImage(filteredImages[nextIndex])
  }

  const prevImage = () => {
    if (!selectedImage) return
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id
    )
    const prevIndex =
      currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1
    setSelectedImage(filteredImages[prevIndex])
  }

  return (
    <section id='gallery' className='bg-muted/30 py-12 sm:py-16 md:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <ScrollAnimation variant="fadeUp" className='mb-16 text-center'>
          <h2 className='text-foreground text-2xl sm:text-3xl md:text-4xl font-bold'>
            Notre Galerie
          </h2>
          <p className='text-muted-foreground mt-4 text-base sm:text-lg'>
            Découvrez nos installations modernes
          </p>
        </ScrollAnimation>

        {/* Filtres de catégorie */}
        <ScrollAnimation variant="fadeUp" delay={0.1} className='mb-8 sm:mb-12 flex flex-wrap justify-center gap-2 sm:gap-4'>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base transition-all duration-300 ${selectedCategory === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
          >
            Toutes les photos
          </button>
          {Object.entries(categoryIcons).map(([category, Icon]) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base transition-all duration-300 ${selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
            >
              <Icon className='h-4 w-4' />
              {category === 'exterior' && 'Extérieur'}
              {category === 'interior' && 'Intérieur'}
              {category === 'equipment' && 'Équipements'}
              {category === 'team' && 'Équipe'}
            </button>
          ))}
        </ScrollAnimation>

        {/* Grille de photos */}
        <StaggerContainer className='grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredImages.map((image, index) => {
            const Icon = categoryIcons[image.category as keyof typeof categoryIcons] ?? ImageIcon
            return (
              <ScrollAnimation key={image.id} variant="fadeUp" as="div">
                <div
                  className='group bg-card relative cursor-pointer overflow-hidden rounded-lg shadow-lg hover:scale-[1.03] hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] transition-all duration-300'
                  onClick={() => openModal(image)}
                >
                  <div className='relative aspect-video'>
                    <Image
                      src={image.image}
                      alt={image.caption}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className='object-cover transition-transform duration-300 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20' />

                    {/* Overlay avec icône */}
                    <div className='absolute top-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                      <div className='bg-primary/90 flex h-8 w-8 items-center justify-center rounded-full'>
                        <Icon className='text-primary-foreground h-4 w-4' />
                      </div>
                    </div>
                  </div>

                  <div className='p-4'>
                    <h3 className='text-foreground mb-2 font-semibold'>
                      {image.title}
                    </h3>
                    <p className='text-muted-foreground line-clamp-2 text-sm'>
                      {image.description}
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
            )
          })}
        </StaggerContainer>

        {/* Modal de visualisation */}
        {
          selectedImage && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4'>
              <div className='relative max-h-[90vh] w-full max-w-4xl'>
                {/* Bouton fermer */}
                <button
                  onClick={closeModal}
                  className='absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70'
                >
                  <X className='h-6 w-6' />
                </button>

                {/* Boutons navigation */}
                <button
                  onClick={prevImage}
                  className='absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70'
                >
                  <ChevronLeft className='h-6 w-6' />
                </button>

                <button
                  onClick={nextImage}
                  className='absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70'
                >
                  <ChevronRight className='h-6 w-6' />
                </button>

                {/* Image */}
                <div className='relative h-[70vh] w-full overflow-hidden rounded-lg'>
                  <Image
                    src={selectedImage.image}
                    alt={selectedImage.caption}
                    fill
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className='object-contain'
                  />
                </div>

                {/* Informations */}
                <div className='mt-4 text-center text-white'>
                  <h3 className='mb-2 text-2xl font-bold'>
                    {selectedImage.title}
                  </h3>
                  <p className='text-muted-foreground'>
                    {selectedImage.caption}
                  </p>
                  <p className='text-muted-foreground'>
                    {selectedImage.description}
                  </p>
                </div>
              </div>
            </div>
          )
        }
      </div >
    </section >
  )
}
