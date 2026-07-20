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

const DIR = resolve(root, 'Convention 3', 'Photos Convention 3')

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
  ev_group: 'IMG_8184.jpg',
  ev_signing: 'IMG_8207.jpg',
  ev_exchange: 'IMG_8227.jpg',
  ev_tour1: 'IMG_8174.jpg',
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
  console.log('\n1️⃣  Convention Association Oncologica')
  const posterImg = await uploadAsset(SRC.ev_group, 'convention-oncologica-affiche')
  const evRefs = {}
  for (const key of Object.keys(SRC)) {
    evRefs[key] = await uploadAsset(SRC[key], `convention-oncologica-${key.replace('ev_', '')}`)
  }
  const signaturePhotos = Object.values(evRefs).filter(Boolean).map(imageItem)

  // 1a) Partenaire Oncologica dans la section Conventions
  const oncologicaProvider = {
    _key: 'oncologica',
    name: 'Association Oncologica pour l\'aide aux cancéreux',
    name_ar: 'جمعية أونكولوجيكا لمساعدة مرضى السرطان',
    description:
      'Convention de partenariat : accès à des services et avantages de santé pour les membres et les malades pris en charge par l\'Association Oncologica.',
    description_ar: 'اتفاقية شراكة: الاستفادة من خدمات وامتيازات صحية لأعضاء والمرضى المتكفل بهم من طرف جمعية أونكولوجيكا.',
    signaturePhotos,
  }
  const existingOncologica = await client.fetch(
    `count(*[_type=="insuranceSection"][0].providers[_key=="oncologica"])`,
  )
  if (existingOncologica > 0) {
    await client
      .patch('insuranceSection')
      .set({ 'providers[_key=="oncologica"]': oncologicaProvider })
      .commit()
    console.log('   ✅ partenaire Oncologica mis à jour')
  } else {
    await client
      .patch('insuranceSection')
      .setIfMissing({ providers: [] })
      .insert('after', 'providers[-1]', [oncologicaProvider])
      .commit()
    console.log('   ✅ partenaire Oncologica ajouté')
  }

  // 1b) Actualité : signature de la convention
  await upsertById({
    _id: 'article-convention-oncologica',
    _type: 'article',
    title: 'Signature d’une convention de partenariat avec l\'Association Oncologica',
    title_ar: 'توقيع اتفاقية شراكة مع جمعية أونكولوجيكا لمساعدة مرضى السرطان',
    slug: { _type: 'slug', current: 'convention-oncologica-clinique-okba' },
    excerpt:
      'La Clinique OKBA et l\'Association Oncologica pour l\'aide aux cancéreux ont signé une convention de partenariat pour faire bénéficier les membres et les malades de services et d’avantages de santé.',
    excerpt_ar:
      'وقّعت مصحة عقبة وجمعية أونكولوجيكا لمساعدة مرضى السرطان اتفاقية شراكة لتمكين الأعضاء والمرضى من الاستفادة من خدمات وامتيازات صحية.',
    category: 'convention',
    author: 'Clinique OKBA',
    publishedAt: new Date().toISOString(),
    published: true,
    ...(posterImg ? { image: imageField(posterImg) } : {}),
    content: [
      block('La Clinique OKBA a le plaisir d’annoncer la signature d’une convention de partenariat avec l\'Association Oncologica pour l\'aide aux cancéreux.'),
      ...(evRefs.ev_group ? [imageItem(evRefs.ev_group)] : []),
      block('Un partenariat au service de la santé', 'h2'),
      block('Cette convention permet aux membres et aux patients encadrés par l\'Association Oncologica de bénéficier de services médicaux et d’avantages au sein de la Clinique OKBA, dans le cadre de son engagement « L’excellence médicale à votre service » pour l\'accompagnement des malades atteints de cancer.'),
      ...(evRefs.ev_signing ? [imageItem(evRefs.ev_signing)] : []),
      block('La cérémonie de signature s’est tenue à la Clinique OKBA, en présence des représentants des deux parties, consolidant ainsi la coopération entre la clinique et le tissu associatif engagé.'),
      ...(evRefs.ev_exchange ? [imageItem(evRefs.ev_exchange)] : []),
      ...(evRefs.ev_tour1 ? [imageItem(evRefs.ev_tour1)] : []),
    ],
    content_ar: [
      block('يسرّ مصحة عقبة أن تعلن عن توقيع اتفاقية شراكة مع جمعية أونكولوجيكا لمساعدة مرضى السرطان.'),
      ...(evRefs.ev_group ? [imageItem(evRefs.ev_group)] : []),
      block('شراكة في خدمة الصحة', 'h2'),
      block('تتيح هذه الاتفاقية للأعضاء والمرضى الذين تتكفل بهم جمعية أونكولوجيكا الاستفادة من خدمات طبية وامتيازات داخل مصحة عقبة، في إطار التزامها «التميّز الطبي في خدمتكم» ومرافقة مرضى السرطان.'),
      ...(evRefs.ev_signing ? [imageItem(evRefs.ev_signing)] : []),
      block('جرت مراسم التوقيع بمصحة عقبة بحضور ممثلي الطرفين، مما يعزز التعاون بين المصحة والنسيج الجمعوي الفاعل.'),
      ...(evRefs.ev_exchange ? [imageItem(evRefs.ev_exchange)] : []),
      ...(evRefs.ev_tour1 ? [imageItem(evRefs.ev_tour1)] : []),
    ],
  })

  console.log('\n✨ Terminé. Vérifie dans /admin/dashboard (Studio), Conventions et Actualités.')
}

run().catch((err) => {
  console.error('\n❌ Erreur :', err.message)
  process.exit(1)
})
