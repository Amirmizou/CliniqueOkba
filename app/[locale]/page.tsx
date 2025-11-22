import Header from '@/components/header'
import HeroCarousel from '@/components/hero-carousel'
import About from '@/components/about'
import Specialties from '@/components/specialties'
import Services from '@/components/services'
import MedicalTechnology from '@/components/medical-technology'
import HomeCare from '@/components/home-care'
import Gallery from '@/components/gallery'
import Testimonials from '@/components/testimonials'
import Contact from '@/components/contact'
import Footer from '@/components/footer'
import SkipLink from '@/components/skip-link'
import BackToTop from '@/components/back-to-top'
import ScrollProgress from '@/components/ui/scroll-progress'

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
        <MedicalTechnology />
        <HomeCare />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
