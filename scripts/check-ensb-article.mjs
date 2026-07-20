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
  const article = await client.fetch(`*[_id == "article-convention-ensb"][0]{
    title,
    "hasImage": defined(image),
    "imageRef": image.asset._ref,
    "contentBlockTypes": content[]._type,
    "contentArBlockTypes": content_ar[]._type,
    "imageCount": count(content[_type == "image"]),
    "imageArCount": count(content_ar[_type == "image"])
  }`)
  console.log(JSON.stringify(article, null, 2))
}

run().catch(console.error)
