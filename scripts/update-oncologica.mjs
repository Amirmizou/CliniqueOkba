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

const block = (text, style = 'normal') => ({
  _key: randomUUID(),
  _type: 'block',
  style,
  markDefs: [],
  children: [{ _key: randomUUID(), _type: 'span', marks: [], text }],
})

async function run() {
  console.log('\n📝 Mise à jour des textes de la convention Oncologica...')

  // 1. Mise à jour de la description du partenaire dans insuranceSection
  console.log('Mise à jour du partenaire...')
  await client
    .patch('insuranceSection')
    .set({
      'providers[_key=="oncologica"].description': 
        "Convention de partenariat : prise en charge, accès aux services et avantages de santé au profit des patients atteints de cancer et orientés par l'Association Oncologica.",
      'providers[_key=="oncologica"].description_ar': 
        "اتفاقية شراكة: التكفل والاستفادة من خدمات وامتيازات صحية لصالح مرضى السرطان الموجّهين من طرف جمعية أونكولوجيكا."
    })
    .commit()
  
  // 2. Récupérer l'article existant pour conserver les images
  console.log('Mise à jour de l\'article...')
  const article = await client.fetch(`*[_id == "article-convention-oncologica"][0]`)
  if (!article) {
    throw new Error("L'article article-convention-oncologica est introuvable.")
  }

  // Extraire les images existantes du contenu pour les réinsérer
  const extractImages = (content) => content ? content.filter(b => b._type === 'image') : []
  const imagesFr = extractImages(article.content)
  const imagesAr = extractImages(article.content_ar)

  // On reconstruit le contenu FR
  const content = [
    block("La Clinique OKBA a le plaisir d’annoncer la signature d’une convention de partenariat avec l'Association Oncologica pour l'aide aux cancéreux."),
    imagesFr[0] || undefined,
    block("Un partenariat au service de la santé", 'h2'),
    block("Cette convention permet aux patients encadrés et orientés par l'Association Oncologica de bénéficier d'une prise en charge médicale optimale et d’avantages au sein de la Clinique OKBA, et ce, dans le cadre de notre engagement indéfectible : « L’excellence médicale à votre service » pour l'accompagnement des malades atteints de cancer."),
    imagesFr[1] || undefined,
    block("La cérémonie de signature s’est tenue à la Clinique OKBA, en présence des représentants des deux parties, consolidant ainsi la coopération entre la clinique et le tissu associatif actif dans le domaine de la santé."),
    imagesFr[2] || undefined,
    imagesFr[3] || undefined,
  ].filter(Boolean)

  // On reconstruit le contenu AR
  const content_ar = [
    block("يسرّ مصحة عقبة أن تعلن عن توقيع اتفاقية شراكة مع جمعية أونكولوجيكا لمساعدة مرضى السرطان."),
    imagesAr[0] || undefined,
    block("شراكة في خدمة الصحة", 'h2'),
    block("تتيح هذه الاتفاقية للمرضى الذين تتكفل بهم وتوجههم جمعية أونكولوجيكا الاستفادة من رعاية طبية مثلى وامتيازات داخل مصحة عقبة، وذلك في إطار التزامنا الراسخ: «التميّز الطبي في خدمتكم» ومرافقة مرضى السرطان."),
    imagesAr[1] || undefined,
    block("جرت مراسم التوقيع بمصحة عقبة بحضور ممثلي الطرفين، مما يعزز التعاون بين المصحة والنسيج الجمعوي الفاعل في مجال الصحة."),
    imagesAr[2] || undefined,
    imagesAr[3] || undefined,
  ].filter(Boolean)

  await client.patch(article._id).set({
    excerpt: "La Clinique OKBA et l'Association Oncologica pour l'aide aux cancéreux ont signé une convention de partenariat visant à faire bénéficier les patients, orientés par l'association, de soins et d'avantages de santé de qualité.",
    excerpt_ar: "وقّعت مصحة عقبة وجمعية أونكولوجيكا لمساعدة مرضى السرطان اتفاقية شراكة تهدف لتمكين المرضى الموجّهين من طرف الجمعية من الاستفادة من رعاية وامتيازات صحية ذات جودة.",
    content,
    content_ar
  }).commit()

  console.log('✅ Mise à jour terminée avec succès.')
}

run().catch(console.error)
