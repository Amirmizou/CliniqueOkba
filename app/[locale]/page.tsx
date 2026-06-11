import SiteHeader from '@/components/site-header'
import HeroCarousel from '@/components/hero-carousel'
import About from '@/components/about'
import VideoPresentation from '@/components/video-presentation'
import VideosGallery from '@/components/videos-gallery'
import LogoIntro from '@/components/logo-intro'
import TrustBand from '@/components/trust-band'
import Poles from '@/components/poles'
import DoctorsShowcase from '@/components/doctors-showcase'
import FeaturedEvent from '@/components/featured-event'
import Insurance from '@/components/insurance'
import FaqTeaser from '@/components/faq-teaser'
import Contact from '@/components/contact'
import SiteFooter from '@/components/site-footer'
import SkipLink from '@/components/skip-link'
import BackToTop from '@/components/back-to-top'
import MobileActionBar from '@/components/mobile-action-bar'
import ScrollProgress from '@/components/ui/scroll-progress'
import SectionDivider from '@/components/ui/section-divider'
// Lazy load des composants lourds (below the fold)
import {
  LazyEquipementsGallery,
  LazyHomeCare,
  LazyTestimonials
} from '@/components/lazy'

// Sanity data fetching
import {
  getSiteSettings,
  getAboutSection,
  getTestimonials,
  getHomeCare,
  getAllSectionContents,
  getHeroSlides,
  getDoctors,
  getFacilityPhotos,
  getPoles,
  getEvents,
  getInsuranceSection,
  getFaq,
  getVideos,
} from '@/sanity/lib/fetch'
import { localizeSanityData } from '@/sanity/lib/localize'
import type { ClinicEvent } from '@/lib/events'

// ISR: Revalidate every hour for better performance
export const revalidate = 3600

export default async function Home(props: { params: Promise<{ locale: string }> }) {
  // Fetch all data from Sanity in parallel
  const [
    siteSettings,
    aboutSection,
    testimonials,
    homeCare,
    sectionContents,
    heroSlides,
    doctors,
    facilityPhotos,
    poles,
    events,
    insurance,
    faqs,
    videos,
  ] = await Promise.all([
    getSiteSettings(),
    getAboutSection(),
    getTestimonials(),
    getHomeCare(),
    getAllSectionContents(),
    getHeroSlides(),
    getDoctors(),
    getFacilityPhotos(),
    getPoles(),
    getEvents(),
    getInsuranceSection(),
    getFaq(),
    getVideos(),
  ])

  // Get current locale
  const { locale } = await props.params

  // Localize all fetched data
  const localizedData = {
    siteSettings: localizeSanityData(siteSettings, locale),
    aboutSection: localizeSanityData(aboutSection, locale),
    testimonials: localizeSanityData(testimonials, locale),
    homeCare: localizeSanityData(homeCare, locale),
    sectionContents: localizeSanityData(sectionContents, locale),
    heroSlides: localizeSanityData(heroSlides, locale),
    doctors: localizeSanityData(doctors, locale),
    facilityPhotos: localizeSanityData(facilityPhotos, locale),
    poles: localizeSanityData(poles, locale),
    events: localizeSanityData(events, locale),
    insurance: localizeSanityData(insurance, locale),
    faqs: localizeSanityData(faqs, locale),
    videos: localizeSanityData(videos, locale),
  }

  // Create a map of section contents for easy access
  const sectionContentMap = (localizedData.sectionContents || []).reduce((acc: Record<string, any>, item: any) => {
    if (item?.sectionId) {
      acc[item.sectionId] = item
    }
    return acc
  }, {})

  // Prochain événement publié (à venir) pour la section « À la une »
  const now = Date.now()
  const featuredEvent: ClinicEvent | null =
    (localizedData.events as ClinicEvent[] | undefined)?.find(
      (e) => new Date(e.endDate || e.startDate).getTime() >= now,
    ) || null

  return (
    <>
      <LogoIntro />
      <SkipLink />
      <ScrollProgress />
      <SiteHeader siteSettings={localizedData.siteSettings} />
      <main id='main-content' className='min-h-screen'>
        <HeroCarousel slides={localizedData.heroSlides} siteSettings={localizedData.siteSettings} sectionContent={sectionContentMap['hero']} />
        <TrustBand siteSettings={localizedData.siteSettings} />
        <About
          data={localizedData.aboutSection}
          sectionContent={sectionContentMap['about']}
        />
        <VideoPresentation sectionContent={sectionContentMap['video']} />
        <VideosGallery data={localizedData.videos} />
        <SectionDivider variant="ecg" />
        <Poles data={localizedData.poles} />
        <SectionDivider variant="ecg" />
        <DoctorsShowcase data={localizedData.doctors} />
        <SectionDivider variant="ecg" />
        {featuredEvent && (
          <>
            <FeaturedEvent event={featuredEvent} />
            <SectionDivider variant="ecg" />
          </>
        )}
        <LazyEquipementsGallery data={localizedData.facilityPhotos} />
        <LazyHomeCare
          data={localizedData.homeCare}
          sectionContent={sectionContentMap['homecare']}
        />
        <SectionDivider variant="gradient" />
        <LazyTestimonials
          data={localizedData.testimonials}
          sectionContent={sectionContentMap['testimonials']}
        />
        <SectionDivider variant="ecg" />
        <Insurance data={localizedData.insurance} />
        <SectionDivider variant="ecg" />
        <FaqTeaser data={localizedData.faqs} sectionContent={sectionContentMap['faq']} />
        <SectionDivider />
        <Contact siteSettings={localizedData.siteSettings} sectionContent={sectionContentMap['contact']} />
      </main>
      <SiteFooter siteSettings={localizedData.siteSettings} />
      <BackToTop />
      <MobileActionBar siteSettings={localizedData.siteSettings} />
    </>
  )
}
