import { createClient } from 'next-sanity'
import { readFileSync, createReadStream, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
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

async function uploadAsset(absPath, filename) {
  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}`,
    { filename },
  )
  if (existing?._id) {
    console.log(`   ♻️  ${filename}`)
    return existing._id
  }
  if (!existsSync(absPath)) {
    console.warn(`   ⚠️  image introuvable : ${absPath}`)
    return null
  }
  const asset = await client.assets.upload('image', createReadStream(absPath), { filename })
  console.log(`   📤 ${filename}`)
  return asset._id
}

const imageField = (ref) => (ref ? { _type: 'image', asset: { _type: 'reference', _ref: ref } } : undefined)

async function run() {
  const logos = [
    { key: 'seaco', file: 'seaco.png' },
    { key: 'ensb', file: 'ensb.png' },
    { key: 'oncologica', file: 'oncologica.png' },
  ]

  const section = await client.fetch(`*[_type=="insuranceSection"][0]{_id, providers}`)
  const updates = {}

  for (const logo of logos) {
    const absPath = resolve(root, 'public', 'images', 'conventions', logo.file)
    const assetId = await uploadAsset(absPath, `logo-${logo.file}`)
    if (assetId) {
      updates[`providers[_key=="${logo.key}"].logo`] = imageField(assetId)
    }
  }

  if (Object.keys(updates).length > 0) {
     await client.patch(section._id).set(updates).commit()
     console.log('✅ Logos mis à jour dans insuranceSection')
  } else {
     console.log('Rien à mettre à jour')
  }
}

run().catch(console.error)
