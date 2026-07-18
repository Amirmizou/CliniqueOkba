/**
 * Ajoute le contenu issu du dossier `imagenew/` :
 *   1. Directeur médical (Dr Amine Khodja Mohamed Yacine) — nouvelle fiche médecin
 *   2. Enrichit la fiche du Dr Rouabah Youcef (dentiste) + photo « service dentaire »
 *      ajoutée à la galerie du Pôle dentaire (facilityPhoto, catégorie « dentaire »)
 *   3. Convention BNA : partenaire ajouté dans « Conventions » (photos de signature)
 *      + actualité « Signature de convention avec la BNA »
 *
 * Idempotent : réexécutable sans créer de doublons (upload d'images mis en cache
 * par nom de fichier, documents par _id, partenaire BNA par _key).
 *
 * Pré-requis : SANITY_API_TOKEN (Editor) dans .env
 * Lancement  : node scripts/add-imagenew-content.mjs
 */

import { createClient } from 'next-sanity'
import { readFileSync, createReadStream, existsSync } from 'node:fs'
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
if (!projectId || !token) {
  console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID ou SANITY_API_TOKEN manquant dans .env')
  process.exit(1)
}
const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false })

const DIR = join(root, 'imagenew')

/** Upload une image (mise en cache par nom de fichier propre), renvoie l'asset _id. */
async function uploadAsset(sourceFile, cleanName) {
  const filename = `${cleanName}.jpg`
  // On regarde d'abord si l'asset existe déjà dans Sanity : le script reste
  // réexécutable même si le dossier imagenew/ n'est plus présent en local.
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
    console.warn(`   ⚠️  image introuvable (ni dans Sanity, ni en local) : ${sourceFile}`)
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

// Fichiers source (dossier imagenew/)
const SRC = {
  directeur: 'WhatsApp Image 2026-07-18 at 15.50.18 (1).jpeg',
  salleDentaire: 'WhatsApp Image 2026-07-18 at 15.50.17 (2).jpeg',
  conventionPoster: 'WhatsApp Image 2026-07-18 at 15.50.17 (1).jpeg',
  ev_table: 'WhatsApp Image 2026-07-18 at 15.50.14.jpeg',
  ev_flags: 'WhatsApp Image 2026-07-18 at 15.50.15.jpeg',
  ev_guests: 'WhatsApp Image 2026-07-18 at 15.50.15 (1).jpeg',
  ev_tour1: 'WhatsApp Image 2026-07-18 at 15.50.15 (2).jpeg',
  ev_echo: 'WhatsApp Image 2026-07-18 at 15.50.16.jpeg',
  ev_signing: 'WhatsApp Image 2026-07-18 at 15.50.16 (1).jpeg',
  ev_stamp: 'WhatsApp Image 2026-07-18 at 15.50.16 (2).jpeg',
  ev_salon: 'WhatsApp Image 2026-07-18 at 15.50.16 (3).jpeg',
  ev_group: 'WhatsApp Image 2026-07-18 at 15.50.16 (4).jpeg',
  ev_folders: 'WhatsApp Image 2026-07-18 at 15.50.17.jpeg',
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
  // 1) DIRECTEUR MÉDICAL --------------------------------------------------
  console.log('\n1️⃣  Directeur médical')
  const directeurImg = await uploadAsset(SRC.directeur, 'directeur-medical-amine-khodja')
  await upsertById({
    _id: 'doctor-amine-khodja-yacine',
    _type: 'doctor',
    slug: { _type: 'slug', current: 'amine-khodja-mohamed-yacine' },
    title: 'Dr.',
    title_ar: 'د.',
    name: 'Amine Khodja Mohamed Yacine',
    name_ar: 'أمين خوجة محمد ياسين',
    specialty: 'Directeur Médical',
    specialty_ar: 'المدير الطبي',
    subtitle: 'Une vision médicale au service de l’excellence',
    subtitle_ar: 'رؤية طبية في خدمة التميّز',
    services: ['Leadership médical', 'Innovation en santé', 'Expertise médicale', 'Coordination des équipes médicales'],
    services_ar: ['القيادة الطبية', 'الابتكار الصحي', 'الخبرة الطبية', 'تنسيق الفرق الطبية'],
    iconName: 'Stethoscope',
    accentColor: '#006633',
    order: -1,
    active: true,
    ...(directeurImg ? { image: imageField(directeurImg) } : {}),
  })

  // 2) DENTISTE ROUABAH + PHOTO SERVICE DENTAIRE --------------------------
  console.log('\n2️⃣  Dr Rouabah Youcef (dentiste) + galerie Pôle dentaire')
  await client
    .patch('8r1dPnkQdEmu9mkREQo7KM')
    .set({
      subtitle: 'Médecin dentiste',
      subtitle_ar: 'طبيب أسنان',
      experience: '45 ans d’expérience',
      experience_ar: '45 سنة خبرة',
      services: ['Prothèses fixes et amovibles', 'Consultations dentaires', 'Soins et traitements', 'Suivi personnalisé'],
      services_ar: ['تركيبات ثابتة ومتحركة', 'استشارات الأسنان', 'العلاجات والرعاية', 'متابعة شخصية'],
      consultationDays: 'Dimanche, Mardi, Jeudi',
      consultationDays_ar: 'الأحد، الثلاثاء، الخميس',
      consultationHours: '08h00 – 16h00',
      consultationHours_ar: 'من 08:00 إلى 16:00',
      iconName: 'Smile',
    })
    .commit()
  console.log('   ✅ fiche Dr Rouabah enrichie')

  const salleImg = await uploadAsset(SRC.salleDentaire, 'pole-dentaire-salle-consultation')
  if (salleImg) {
    await upsertById({
      _id: 'facility-dentaire-salle-consultation',
      _type: 'facilityPhoto',
      image: imageField(salleImg),
      title: 'Salle de consultation dentaire',
      title_ar: 'قاعة استشارة الأسنان',
      description: 'Salle de soins du pôle dentaire, équipée d’un fauteuil dentaire moderne.',
      description_ar: 'قاعة علاج بقسم طب الأسنان، مجهّزة بكرسي أسنان عصري.',
      category: 'dentaire',
      order: 10,
      active: true,
      featured: false,
    })
  }

  // 3) CONVENTION BNA : partenaire + actualité ----------------------------
  console.log('\n3️⃣  Convention BNA')
  const posterImg = await uploadAsset(SRC.conventionPoster, 'convention-bna-affiche')
  const evRefs = {}
  for (const key of ['ev_group', 'ev_signing', 'ev_folders', 'ev_flags', 'ev_stamp', 'ev_salon', 'ev_guests', 'ev_tour1', 'ev_echo', 'ev_table']) {
    evRefs[key] = await uploadAsset(SRC[key], `convention-bna-${key.replace('ev_', '')}`)
  }
  const signaturePhotos = Object.values(evRefs).filter(Boolean).map(imageItem)

  // 3a) Partenaire BNA dans la section Conventions
  const bnaProvider = {
    _key: 'bna',
    name: 'BNA – Banque Nationale d’Algérie',
    name_ar: 'البنك الوطني الجزائري',
    description:
      'Convention de partenariat : accès à des services et avantages de santé pour le personnel et les clients de la banque.',
    description_ar: 'اتفاقية شراكة: الاستفادة من خدمات وامتيازات صحية لموظفي وعملاء البنك.',
    signaturePhotos,
  }
  const existingBna = await client.fetch(
    `count(*[_type=="insuranceSection"][0].providers[_key=="bna"])`,
  )
  if (existingBna > 0) {
    await client
      .patch('insuranceSection')
      .set({ 'providers[_key=="bna"]': bnaProvider })
      .commit()
    console.log('   ✅ partenaire BNA mis à jour')
  } else {
    await client
      .patch('insuranceSection')
      .setIfMissing({ providers: [] })
      .insert('after', 'providers[-1]', [bnaProvider])
      .commit()
    console.log('   ✅ partenaire BNA ajouté')
  }

  // 3b) Actualité : signature de la convention
  await upsertById({
    _id: 'article-convention-bna',
    _type: 'article',
    title: 'Signature d’une convention de partenariat avec la BNA',
    title_ar: 'توقيع اتفاقية شراكة مع البنك الوطني الجزائري',
    slug: { _type: 'slug', current: 'convention-bna-clinique-okba' },
    excerpt:
      'La Clinique OKBA et la Banque Nationale d’Algérie (BNA) ont signé une convention de partenariat pour faire bénéficier le personnel et les clients de la banque de services et d’avantages de santé.',
    excerpt_ar:
      'وقّعت مصحة عقبة والبنك الوطني الجزائري اتفاقية شراكة لتمكين موظفي وعملاء البنك من الاستفادة من خدمات وامتيازات صحية.',
    category: 'convention',
    author: 'Clinique OKBA',
    publishedAt: new Date().toISOString(),
    published: true,
    ...(posterImg ? { image: imageField(posterImg) } : {}),
    content: [
      block('La Clinique OKBA a le plaisir d’annoncer la signature d’une convention de partenariat avec la Banque Nationale d’Algérie (BNA).'),
      ...(evRefs.ev_group ? [imageItem(evRefs.ev_group)] : []),
      block('Un partenariat au service de la santé', 'h2'),
      block('Cette convention permet au personnel et aux clients de la BNA de bénéficier de services médicaux et d’avantages au sein de la Clinique OKBA, dans le cadre de son engagement « L’excellence médicale à votre service ».'),
      ...(evRefs.ev_signing ? [imageItem(evRefs.ev_signing)] : []),
      block('La cérémonie de signature s’est tenue à la Clinique OKBA, en présence des représentants des deux parties, suivie d’une visite des différents pôles et plateaux techniques de la clinique.'),
      ...(evRefs.ev_folders ? [imageItem(evRefs.ev_folders)] : []),
    ],
    content_ar: [
      block('يسرّ مصحة عقبة أن تعلن عن توقيع اتفاقية شراكة مع البنك الوطني الجزائري (BNA).'),
      ...(evRefs.ev_group ? [imageItem(evRefs.ev_group)] : []),
      block('شراكة في خدمة الصحة', 'h2'),
      block('تتيح هذه الاتفاقية لموظفي وعملاء البنك الوطني الجزائري الاستفادة من خدمات طبية وامتيازات داخل مصحة عقبة، في إطار التزامها «التميّز الطبي في خدمتكم».'),
      ...(evRefs.ev_signing ? [imageItem(evRefs.ev_signing)] : []),
      block('جرت مراسم التوقيع بمصحة عقبة بحضور ممثلي الطرفين، تلتها زيارة لمختلف أقسام ومنصات المصحة التقنية.'),
      ...(evRefs.ev_folders ? [imageItem(evRefs.ev_folders)] : []),
    ],
  })

  console.log('\n✨ Terminé. Vérifie dans /admin/dashboard (Studio), page Équipe, Pôle dentaire, Conventions et Actualités.')
}

run().catch((err) => {
  console.error('\n❌ Erreur :', err.message)
  process.exit(1)
})
