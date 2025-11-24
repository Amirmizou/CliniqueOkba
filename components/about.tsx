import Image from 'next/image'
import clinicData from '@/data/clinic.json'
import ScrollAnimation from '@/components/ui/scroll-animation'
import StaggerContainer from '@/components/ui/stagger-container'

export default function About() {
  return (
    <section id='about' className='bg-card py-12 sm:py-16 md:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid items-center gap-12 md:grid-cols-2'>
          {/* Image */}
          <ScrollAnimation variant="fadeRight" className='relative order-2 h-64 sm:h-80 md:h-96 md:order-1'>
            <div className='from-secondary/30 to-primary/20 absolute inset-0 rounded-2xl bg-gradient-to-br'></div>
            <Image
              src='/modern-medical-clinic-facade-architecture.png'
              alt='Façade architecturale moderne de la Clinique OKBA située à Constantine, Ali Mendjeli'
              className='h-full w-full rounded-2xl object-cover'
              fill
              sizes='(max-width: 768px) 100vw, 50vw'
              loading='lazy'
              placeholder='blur'
              blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
            />
          </ScrollAnimation>

          {/* Content */}
          <div className='order-1 space-y-6 md:order-2'>
            <ScrollAnimation variant="fadeLeft" className='space-y-2'>
              <p className='text-primary text-sm font-semibold tracking-wide uppercase'>
                À propos de nous
              </p>
              <h2 className='text-foreground text-2xl sm:text-3xl md:text-4xl font-bold'>
                {clinicData.name}
              </h2>
            </ScrollAnimation>

            <ScrollAnimation variant="fadeLeft" delay={0.1}>
              <p className='text-muted-foreground text-base sm:text-lg leading-relaxed'>
                {clinicData.description || 'Clinique médicale multidisciplinaire offrant des soins complets et de haute qualité à Constantine. Nous sommes équipés des dernières technologies médicales et disposons d\'une équipe de spécialistes expérimentés.'}
              </p>
            </ScrollAnimation>

            <StaggerContainer className='space-y-4' delayChildren={0.2}>
              <ScrollAnimation variant="fadeUp" as="div" className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                    <span className='text-primary font-bold'>✓</span>
                  </div>
                </div>
                <div>
                  <h3 className='text-foreground font-semibold'>
                    Équipements modernes
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    Dernières technologies médicales
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation variant="fadeUp" as="div" className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                    <span className='text-primary font-bold'>✓</span>
                  </div>
                </div>
                <div>
                  <h3 className='text-foreground font-semibold'>
                    Équipe expérimentée
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    Spécialistes qualifiés et dévoués
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation variant="fadeUp" as="div" className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                    <span className='text-primary font-bold'>✓</span>
                  </div>
                </div>
                <div>
                  <h3 className='text-foreground font-semibold'>
                    Soins de qualité
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    Approche centrée sur le patient
                  </p>
                </div>
              </ScrollAnimation>
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
