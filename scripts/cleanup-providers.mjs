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
  const section = await client.fetch(`*[_type=="insuranceSection"][0]{_id, providers}`)
  
  console.log('=== AVANT ===')
  console.log(`Total: ${section.providers.length} providers`)
  section.providers.forEach(p => console.log(`  [${p._key}] ${p.name}`))

  // 1. Supprimer le doublon "association-oncologica" (l'ancien sans photos ni logo)
  let providers = section.providers.filter(p => p._key !== 'association-oncologica')
  console.log(`\n✂️  Doublon "association-oncologica" supprimé`)

  // 2. Upload et ajouter le logo Dembri
  const dembriLogoId = await uploadAsset(
    resolve(root, 'public', 'images', 'conventions', 'dambri.png'),
    'logo-dambri.png'
  )

  if (dembriLogoId) {
    providers = providers.map(p => {
      if (p._key === 'promotion-dembri') {
        return {
          ...p,
          logo: {
            _type: 'image',
            asset: { _type: 'reference', _ref: dembriLogoId }
          }
        }
      }
      return p
    })
    console.log('✅ Logo Dembri ajouté')
  }

  // 3. Sauvegarder
  await client.patch(section._id).set({ providers }).commit()

  console.log('\n=== APRÈS ===')
  const after = await client.fetch(`*[_type=="insuranceSection"][0]{providers}`)
  console.log(`Total: ${after.providers.length} providers`)
  after.providers.forEach(p => console.log(`  [${p._key}] ${p.name} | logo=${p.logo ? 'OUI' : 'NON'}`))
}

run().catch(console.error)
