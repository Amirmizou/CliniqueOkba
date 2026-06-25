import { createClient } from 'next-sanity'
import { createReadStream } from 'fs'
import { basename } from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
})

async function uploadVideo() {
  const filePath = 'public/videos/Présentation laboratoire OKBA.mp4'
  console.log('Uploading video (this might take a few minutes for ~100MB)...')
  
  const asset = await client.assets.upload('file', createReadStream(filePath), {
    filename: basename(filePath)
  })
  console.log('Video uploaded! Asset ID:', asset._id)
  
  console.log('Creating video document in Sanity...')
  const doc = await client.create({
    _type: 'video',
    title: 'Présentation laboratoire',
    description: "Présentation officielle du laboratoire d'analyses médicales de la clinique OKBA.",
    category: 'laboratoire',
    active: true,
    videoFile: {
      _type: 'file',
      asset: {
        _type: 'reference',
        _ref: asset._id
      }
    }
  })
  console.log('Document created! Document ID:', doc._id)
  console.log('Done.')
}

uploadVideo().catch(console.error)
