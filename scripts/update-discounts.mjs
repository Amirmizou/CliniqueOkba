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
  const keys = ['seaco', 'ensb', 'oncologica']
  const section = await client.fetch(`*[_type=="insuranceSection"][0]{_id, providers}`)
  
  const updates = {}
  
  for (const key of keys) {
    const provider = section.providers.find(p => p._key === key)
    if (provider) {
       console.log(`\n--- ${key} ---`)
       console.log('FR:', provider.description)
       console.log('AR:', provider.description_ar)
       
       let newFr = provider.description
       let newAr = provider.description_ar
       
       if (!newFr.includes('remise') && !newFr.includes('réduction')) {
         newFr = newFr.replace('.', ', incluant des remises et des réductions tarifaires.')
       }
       
       if (!newAr.includes('خصوم') && !newAr.includes('تخفيض')) {
         newAr = newAr.replace('.', '، تتضمن خصومات وتخفيضات في الأسعار.')
       }
       
       updates[`providers[_key=="${key}"].description`] = newFr
       updates[`providers[_key=="${key}"].description_ar`] = newAr
    }
  }
  
  console.log('\nUpdates:', updates)
  
  await client.patch(section._id).set(updates).commit()
  console.log('\n✅ Patched insuranceSection')
  
  // Articles
  const articles = await client.fetch(`*[_id in ["article-convention-seaco", "article-convention-ensb", "article-convention-oncologica"]]`)
  for (const article of articles) {
     let newExFr = article.excerpt
     let newExAr = article.excerpt_ar
     
     if (!newExFr.includes('remise') && !newExFr.includes('réduction')) {
        newExFr = newExFr.replace('.', ' avec des remises et des réductions tarifaires.')
     }
     
     if (!newExAr.includes('خصوم') && !newExAr.includes('تخفيض')) {
        newExAr = newExAr.replace('.', ' مع خصومات وتخفيضات في الأسعار.')
     }
     
     await client.patch(article._id).set({ excerpt: newExFr, excerpt_ar: newExAr }).commit()
     console.log(`✅ Patched article ${article._id}`)
  }
}

run().catch(console.error)
