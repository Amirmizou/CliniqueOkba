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
import SectionDivider from '@/components/ui/section-divider'
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
        <SectionDivider variant="gradient" />
        <Specialties />
        <Services />
        <SectionDivider />
        <LazyMedicalTechnology />
        <LazyHomeCare />
        <SectionDivider variant="gradient" />
        <LazyGallery />
        <LazyTestimonials />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

