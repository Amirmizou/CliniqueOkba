import { createClient } from 'next-sanity'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const envPath = join(root, file)
    if (!existsSync(envPath)) continue
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      if (!(m[1] in process.env)) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
    }
  }
}
loadEnv()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false })

async function run() {
  // Get the group photo asset ID (used as poster/cover)
  const groupAsset = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == "convention-ensb-group.jpg"][0]{_id}`
  )
  
  if (!groupAsset?._id) {
    console.error('Asset convention-ensb-group.jpg not found!')
    return
  }

  console.log('Found cover image asset:', groupAsset._id)

  await client.patch('article-convention-ensb').set({
    image: {
      _type: 'image',
      asset: { _type: 'reference', _ref: groupAsset._id }
    }
  }).commit()

  console.log('✅ Image de couverture ajoutée à l\'article ENSB')
}

run().catch(console.error)
