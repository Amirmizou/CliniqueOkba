import { createClient } from 'next-sanity'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

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

const imageField = (ref) => (ref ? { _type: 'image', asset: { _type: 'reference', _ref: ref } } : undefined)
const imageItem = (ref) => ({ _type: 'image', _key: randomUUID(), asset: { _type: 'reference', _ref: ref } })
const block = (text, style = 'normal') => ({
  _key: randomUUID(),
  _type: 'block',
  style,
  markDefs: [],
  children: [{ _key: randomUUID(), _type: 'span', marks: [], text }],
})

async function getAssetId(filename) {
  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}`,
    { filename },
  )
  return existing?._id || null
}

async function run() {
  console.log('Récupération des images...')
  const posterId = await getAssetId('convention-ensb-affiche.jpg')
  const ev_group = await getAssetId('convention-ensb-group.jpg')
  const ev_signing = await getAssetId('convention-ensb-signing.jpg')
  const ev_tour1 = await getAssetId('convention-ensb-tour1.jpg')
  const ev_salon = await getAssetId('convention-ensb-salon.jpg')

  const article = await client.fetch(`*[_id == "article-convention-ensb"][0]`)
  if (!article) throw new Error("Article introuvable")

  console.log('Reconstruction du contenu...')
  
  const content = [
    block('La Clinique OKBA a le plaisir d’annoncer la signature d’une convention de partenariat avec l\'École Nationale Supérieure de Biotechnologie (ENSB).'),
    ...(ev_group ? [imageItem(ev_group)] : []),
    block('Un partenariat au service de la santé', 'h2'),
    block('Cette convention permet au personnel de l\'ENSB de bénéficier de services médicaux et d’avantages au sein de la Clinique OKBA, dans le cadre de son engagement « L’excellence médicale à votre service ».'),
    ...(ev_signing ? [imageItem(ev_signing)] : []),
    block('La cérémonie de signature s’est tenue à la Clinique OKBA, en présence des représentants des deux parties, suivie d’une visite des différents pôles et plateaux techniques de la clinique.'),
    ...(ev_tour1 ? [imageItem(ev_tour1)] : []),
    ...(ev_salon ? [imageItem(ev_salon)] : []),
  ]

  const content_ar = [
    block('يسرّ مصحة عقبة أن تعلن عن توقيع اتفاقية شراكة مع المدرسة الوطنية العليا للبيوتكنولوجيا (ENSB).'),
    ...(ev_group ? [imageItem(ev_group)] : []),
    block('شراكة في خدمة الصحة', 'h2'),
    block('تتيح هذه الاتفاقية لموظفي المدرسة الوطنية العليا للبيوتكنولوجيا الاستفادة من خدمات طبية وامتيازات داخل مصحة عقبة، في إطار التزامها «التميّز الطبي في خدمتكم».'),
    ...(ev_signing ? [imageItem(ev_signing)] : []),
    block('جرت مراسم التوقيع بمصحة عقبة بحضور ممثلي الطرفين، تلتها زيارة لمختلف أقسام ومنصات المصحة التقنية.'),
    ...(ev_tour1 ? [imageItem(ev_tour1)] : []),
    ...(ev_salon ? [imageItem(ev_salon)] : []),
  ]

  await client.patch(article._id).set({
    image: posterId ? imageField(posterId) : article.image,
    content,
    content_ar
  }).commit()

  console.log('✅ Article ENSB mis à jour avec les images.')
}

run().catch(console.error)
