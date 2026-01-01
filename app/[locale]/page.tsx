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

// Sanity data fetching
import {
  getSiteSettings,
  getAboutSection,
  getServices,
  getTestimonials,
  getHomeCare,
  getAllSectionContents,
} from '@/sanity/lib/fetch'

// ISR: Revalidate every hour for better performance
export const revalidate = 3600

export default async function Home() {
  // Fetch all data from Sanity in parallel
  const [
    siteSettings,
    aboutSection,
    services,
    testimonials,
    homeCare,
    sectionContents,
  ] = await Promise.all([
    getSiteSettings(),
    getAboutSection(),
    getServices(),
    getTestimonials(),
    getHomeCare(),
    getAllSectionContents(),
  ])

  // Create a map of section contents for easy access
  const sectionContentMap = (sectionContents || []).reduce((acc: Record<string, any>, item: any) => {
    if (item?.sectionId) {
      acc[item.sectionId] = item
    }
    return acc
  }, {})

  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <Header siteSettings={siteSettings} />
      <main id='main-content' className='min-h-screen'>
        <HeroCarousel />
        <About
          data={aboutSection}
          sectionContent={sectionContentMap['about']}
        />
        <SectionDivider variant="gradient" />
        <Specialties sectionContent={sectionContentMap['specialties']} />
        <Services
          data={services}
          sectionContent={sectionContentMap['services']}
        />
        <SectionDivider />
        <LazyMedicalTechnology sectionContent={sectionContentMap['technology']} />
        <LazyHomeCare
          data={homeCare}
          sectionContent={sectionContentMap['homecare']}
        />
        <SectionDivider variant="gradient" />
        <LazyGallery sectionContent={sectionContentMap['gallery']} />
        <LazyTestimonials
          data={testimonials}
          sectionContent={sectionContentMap['testimonials']}
        />
        <SectionDivider />
        <Contact siteSettings={siteSettings} sectionContent={sectionContentMap['contact']} />
      </main>
      <Footer siteSettings={siteSettings} />
      <BackToTop />
    </>
  )
}
