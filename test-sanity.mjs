import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function test() {
  const data = await client.fetch(`*[_type == "facilityPhoto" && active == true] { _id, title, category, "hasImage": defined(image) }`)
  console.log("Sanity facilityPhotos data:", JSON.stringify(data, null, 2))
}

test().catch(console.error)
