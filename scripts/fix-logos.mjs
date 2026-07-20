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
    console.log(`   ♻️  ${filename} → ${existing._id}`)
    return existing._id
  }
  if (!existsSync(absPath)) {
    console.warn(`   ⚠️  introuvable : ${absPath}`)
    return null
  }
  const asset = await client.assets.upload('image', createReadStream(absPath), { filename })
  console.log(`   📤 ${filename} → ${asset._id}`)
  return asset._id
}

async function run() {
  console.log('=== Diagnostic logos ===\n')

  // 1. Upload / find logo assets
  const logos = {
    seaco: await uploadAsset(resolve(root, 'public', 'images', 'conventions', 'seaco.png'), 'logo-seaco.png'),
    ensb: await uploadAsset(resolve(root, 'public', 'images', 'conventions', 'ensb.png'), 'logo-ensb.png'),
    oncologica: await uploadAsset(resolve(root, 'public', 'images', 'conventions', 'oncologica.png'), 'logo-oncologica.png'),
  }

  console.log('\nAsset IDs:', logos)

  // 2. Read current providers
  const section = await client.fetch(`*[_type=="insuranceSection"][0]{_id, providers}`)
  console.log('\nProviders AVANT patch:')
  for (const p of section.providers) {
    console.log(`  ${p._key}: logo=${p.logo ? 'OUI (' + p.logo?.asset?._ref + ')' : 'NON'}`)
  }

  // 3. Patch each provider's logo by modifying the full providers array
  const updatedProviders = section.providers.map(p => {
    if (logos[p._key]) {
      return {
        ...p,
        logo: {
          _type: 'image',
          asset: { _type: 'reference', _ref: logos[p._key] }
        }
      }
    }
    return p
  })

  await client.patch(section._id).set({ providers: updatedProviders }).commit()
  console.log('\n✅ Providers mis à jour avec logos')

  // 4. Verify
  const after = await client.fetch(`*[_type=="insuranceSection"][0]{providers}`)
  console.log('\nProviders APRÈS patch:')
  for (const p of after.providers) {
    console.log(`  ${p._key}: logo=${p.logo ? 'OUI (' + p.logo?.asset?._ref + ')' : 'NON'}`)
  }
}

run().catch(console.error)
