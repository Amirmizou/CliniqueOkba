import { createClient } from '@sanity/client'
import fs from 'fs'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function run() {
  const data = await client.fetch(`{
    "aboutSection": *[_type == "aboutSection"][0],
    "homeCare": *[_type == "homeCare"][0],
    "sectionContent": *[_type == "sectionContent"],
    "testimonial": *[_type == "testimonial"],
    "heroSlide": *[_type == "heroSlide"],
    "siteSettings": *[_type == "siteSettings"][0],
    "footerContent": *[_type == "footerContent"][0],
    "pole": *[_type == "pole"],
    "doctor": *[_type == "doctor"],
    "faq": *[_type == "faq"],
    "actualite": *[_type == "article"],
    "evenement": *[_type == "event"],
    "conventions": *[_type == "insuranceSection"][0],
    "videos": *[_type == "video"]
  }`)
  fs.writeFileSync('sanity_dump.json', JSON.stringify(data, null, 2))
  console.log('Dumped to sanity_dump.json')
}

run().catch(console.error)
