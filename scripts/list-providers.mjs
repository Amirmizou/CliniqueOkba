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
  const section = await client.fetch(`*[_type=="insuranceSection"][0]{_id, providers}`)
  
  console.log(`Total providers: ${section.providers.length}\n`)
  for (const p of section.providers) {
    console.log(`_key: "${p._key}"`)
    console.log(`  name: "${p.name}"`)
    console.log(`  logo: ${p.logo ? 'OUI' : 'NON'}`)
    console.log(`  photos: ${p.signaturePhotos?.length || 0}`)
    console.log()
  }
}

run().catch(console.error)
