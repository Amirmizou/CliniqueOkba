import { createClient } from 'next-sanity'
import { readFileSync, createReadStream, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
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
if (!projectId || !token) {
  console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID ou SANITY_API_TOKEN manquant dans .env')
  process.exit(1)
}
const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false })

const DIR = resolve(root, 'Convention 1', 'Photos Convention 1')

async function uploadAsset(sourceFile, cleanName) {
  const filename = `${cleanName}.jpg`
  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}`,
    { filename },
  )
  if (existing?._id) {
    console.log(`   ♻️  ${filename}`)
    return existing._id
  }
  const abs = join(DIR, sourceFile)
  if (!existsSync(abs)) {
    console.warn(`   ⚠️  image introuvable (ni dans Sanity, ni en local) : ${abs}`)
    return null
  }
  const asset = await client.assets.upload('image', createReadStream(abs), { filename })
  console.log(`   📤 ${filename}`)
  return asset._id
}

const imageField = (ref) => (ref ? { _type: 'image', asset: { _type: 'reference', _ref: ref } } : undefined)
const imageItem = (ref) => ({ _type: 'image', _key: randomUUID(), asset: { _type: 'reference', _ref: ref } })
const block = (text, style = 'normal') => ({
  _key: randomUUID(),
  _type: 'block',
  style,
  markDefs: [],
  children: [{ _key: randomUUID(), _type: 'span', marks: [], text }],
})

const SRC = {
  ev_group: '_MG_8850.jpg',
  ev_signing: '_MG_8820.jpg',
  ev_tour1: 'IMG_8857.jpg',
  ev_salon: '_MG_8780.jpg',
}

async function upsertById(doc) {
  const existing = await client.fetch(`*[_id == $id][0]{_id}`, { id: doc._id })
  if (existing?._id) {
    await client.patch(doc._id).set(doc).commit()
    console.log(`   ✅ mis à jour : ${doc._id}`)
  } else {
    await client.create(doc)
    console.log(`   ✅ créé : ${doc._id}`)
  }
}

async function run() {
  console.log('\n1️⃣  Convention SEACO')
  const posterImg = await uploadAsset(SRC.ev_group, 'convention-seaco-affiche')
  const evRefs = {}
  for (const key of Object.keys(SRC)) {
    evRefs[key] = await uploadAsset(SRC[key], `convention-seaco-${key.replace('ev_', '')}`)
  }
  const signaturePhotos = Object.values(evRefs).filter(Boolean).map(imageItem)

  // 1a) Partenaire SEACO dans la section Conventions
  const seacoProvider = {
    _key: 'seaco',
    name: 'SEACO – Société de l\'Eau et de l\'Assainissement de Constantine',
    name_ar: 'شركة المياه والتطهير لقسنطينة - سياكو',
    description:
      'Convention de partenariat : accès à des services et avantages de santé pour le personnel et les employés de la SEACO.',
    description_ar: 'اتفاقية شراكة: الاستفادة من خدمات وامتيازات صحية لموظفي وعمال شركة سياكو.',
    signaturePhotos,
  }
  const existingSeaco = await client.fetch(
    `count(*[_type=="insuranceSection"][0].providers[_key=="seaco"])`,
  )
  if (existingSeaco > 0) {
    await client
      .patch('insuranceSection')
      .set({ 'providers[_key=="seaco"]': seacoProvider })
      .commit()
    console.log('   ✅ partenaire SEACO mis à jour')
  } else {
    await client
      .patch('insuranceSection')
      .setIfMissing({ providers: [] })
      .insert('after', 'providers[-1]', [seacoProvider])
      .commit()
    console.log('   ✅ partenaire SEACO ajouté')
  }

  // 1b) Actualité : signature de la convention
  await upsertById({
    _id: 'article-convention-seaco',
    _type: 'article',
    title: 'Signature d’une convention de partenariat avec la SEACO',
    title_ar: 'توقيع اتفاقية شراكة مع شركة المياه والتطهير سياكو',
    slug: { _type: 'slug', current: 'convention-seaco-clinique-okba' },
    excerpt:
      'La Clinique OKBA et la Société de l\'Eau et de l\'Assainissement de Constantine (SEACO) ont signé une convention de partenariat pour faire bénéficier le personnel de services et d’avantages de santé.',
    excerpt_ar:
      'وقّعت مصحة عقبة وشركة المياه والتطهير لقسنطينة (سياكو) اتفاقية شراكة لتمكين موظفي وعمال الشركة من الاستفادة من خدمات وامتيازات صحية.',
    category: 'convention',
    author: 'Clinique OKBA',
    publishedAt: new Date().toISOString(),
    published: true,
    ...(posterImg ? { image: imageField(posterImg) } : {}),
    content: [
      block('La Clinique OKBA a le plaisir d’annoncer la signature d’une convention de partenariat avec la Société de l\'Eau et de l\'Assainissement de Constantine (SEACO).'),
      ...(evRefs.ev_group ? [imageItem(evRefs.ev_group)] : []),
      block('Un partenariat au service de la santé', 'h2'),
      block('Cette convention permet au personnel de la SEACO de bénéficier de services médicaux et d’avantages au sein de la Clinique OKBA, dans le cadre de son engagement « L’excellence médicale à votre service ».'),
      ...(evRefs.ev_signing ? [imageItem(evRefs.ev_signing)] : []),
      block('La cérémonie de signature s’est tenue à la Clinique OKBA, en présence des représentants des deux parties, suivie d’une visite des différents pôles et plateaux techniques de la clinique.'),
      ...(evRefs.ev_tour1 ? [imageItem(evRefs.ev_tour1)] : []),
      ...(evRefs.ev_salon ? [imageItem(evRefs.ev_salon)] : []),
    ],
    content_ar: [
      block('يسرّ مصحة عقبة أن تعلن عن توقيع اتفاقية شراكة مع شركة المياه والتطهير لقسنطينة (سياكو).'),
      ...(evRefs.ev_group ? [imageItem(evRefs.ev_group)] : []),
      block('شراكة في خدمة الصحة', 'h2'),
      block('تتيح هذه الاتفاقية لموظفي شركة سياكو الاستفادة من خدمات طبية وامتيازات داخل مصحة عقبة، في إطار التزامها «التميّز الطبي في خدمتكم».'),
      ...(evRefs.ev_signing ? [imageItem(evRefs.ev_signing)] : []),
      block('جرت مراسم التوقيع بمصحة عقبة بحضور ممثلي الطرفين، تلتها زيارة لمختلف أقسام ومنصات المصحة التقنية.'),
      ...(evRefs.ev_tour1 ? [imageItem(evRefs.ev_tour1)] : []),
      ...(evRefs.ev_salon ? [imageItem(evRefs.ev_salon)] : []),
    ],
  })

  console.log('\n✨ Terminé. Vérifie dans /admin/dashboard (Studio), Conventions et Actualités.')
}

run().catch((err) => {
  console.error('\n❌ Erreur :', err.message)
  process.exit(1)
})
