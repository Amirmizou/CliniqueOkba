import Header from '@/components/header'
import HeroCarousel from '@/components/hero-carousel'
import About from '@/components/about'
import Specialties from '@/components/specialties'
import Services from '@/components/services'
import Contact from '@/components/contact'
import Footer from '@/components/footer'
import SkipLink from '@/components/skip-link'
import BackToTop from '@/components/back-to-top'
import ScrollProgress from '@/components/ui/scroll-progress'
// Lazy load des composants lourds (below the fold)
import {
  LazyMedicalTechnology,
  LazyHomeCare,
  LazyGallery,
  LazyTestimonials
} from '@/components/lazy'

export default function Home() {
  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <Header />
      <main id='main-content' className='min-h-screen'>
        <HeroCarousel />
        <About />
        <Specialties />
        <Services />
        <LazyMedicalTechnology />
        <LazyHomeCare />
        <LazyGallery />
        <LazyTestimonials />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
