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
  const docs = await client.fetch(`*[_type=="insuranceSection"]{_id, _updatedAt, providers}`)
  console.log(JSON.stringify(docs.map(d => ({ 
    _id: d._id, 
    _updatedAt: d._updatedAt,
    seaco: d.providers?.find(p => p._key === 'seaco')?.logo ? 'has logo' : 'no logo',
    seacoPhotos: d.providers?.find(p => p._key === 'seaco')?.signaturePhotos?.length,
    ensb: d.providers?.find(p => p._key === 'ensb')?.logo ? 'has logo' : 'no logo',
    ensbPhotos: d.providers?.find(p => p._key === 'ensb')?.signaturePhotos?.length
  })), null, 2))
}

run().catch(console.error)
