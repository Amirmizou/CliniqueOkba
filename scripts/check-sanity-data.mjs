import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-03-20',
})

async function check() {
  const about = await client.fetch(`*[_type == "aboutSection"][0]`)
  console.log("About Section:", {
    hasStats: !!about?.stats?.length,
    hasStatsAr: !!about?.stats_ar?.length,
    hasValues: !!about?.values?.length,
    hasValuesAr: !!about?.values_ar?.length,
  })

  const heroSlides = await client.fetch(`*[_type == "heroSlide" && active == true]`)
  console.log("Hero Slides count:", heroSlides.length)

  const videos = await client.fetch(`*[_type == "video"]`)
  console.log("Videos count:", videos.length)

  const doctors = await client.fetch(`*[_type == "doctor" && active == true]`)
  console.log("Doctors count:", doctors.length)
  
  const siteSettings = await client.fetch(`*[_type == "siteSettings"][0]`)
  console.log("Site Settings:", {
    hasHeroVideo: !!siteSettings?.heroVideo,
    hasSocials: !!siteSettings?.socialMedia?.length
  })

  const homeCare = await client.fetch(`*[_type == "homeCare"][0]`)
  console.log("Home Care:", !!homeCare)

  const insurance = await client.fetch(`*[_type == "insuranceSection"][0]`)
  console.log("Insurance:", !!insurance)
}

check().catch(console.error)
