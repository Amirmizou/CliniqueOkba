import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Charger le .env local (qui contient les clés de la NOUVELLE base)
dotenv.config()

// =========================================================================
// ⚠️ À REMPLIR : Remplacez par les clés de l'ANCIEN projet Supabase ⚠️
// =========================================================================
const OLD_SUPABASE_URL = process.env.OLD_SUPABASE_URL
const OLD_SUPABASE_SERVICE_KEY = process.env.OLD_SUPABASE_SERVICE_ROLE_KEY

// =========================================================================
// Clés du NOUVEAU projet (récupérées du fichier .env automatiquement)
// =========================================================================
const NEW_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const NEW_SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const BUCKET_NAME = 'beneficiaires'

if (!NEW_SUPABASE_URL || !NEW_SUPABASE_SERVICE_KEY) {
  console.error("❌ Erreur : Les variables du nouveau Supabase sont absentes du fichier .env")
  process.exit(1)
}

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_KEY)
const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_KEY)

/**
 * Fonction pour lister tous les fichiers d'un bucket récursivement
 */
async function listAllFiles(supabase, bucket, path = '') {
  console.log(`Exploration du dossier: /${path}`)
  const { data, error } = await supabase.storage.from(bucket).list(path, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  })

  if (error) {
    console.error(`Erreur listage /${path}:`, error.message)
    return []
  }

  let files = []
  for (const item of data) {
    // Dans Supabase, un dossier est retourné sans ID ou sans métadonnées
    if (!item.id || item.metadata === null || item.name === '.emptyFolderPlaceholder') {
      if (item.name !== '.emptyFolderPlaceholder') {
        const folderPath = path ? `${path}/${item.name}` : item.name
        const subFiles = await listAllFiles(supabase, bucket, folderPath)
        files = files.concat(subFiles)
      }
    } else {
      files.push(path ? `${path}/${item.name}` : item.name)
    }
  }
  return files
}

async function migrate() {
  console.log('🚀 Démarrage de la migration du bucket :', BUCKET_NAME)

  // 1. Lister tous les fichiers de l'ancien bucket
  console.log('\nÉtape 1 : Récupération de la liste des fichiers...')
  const allFiles = await listAllFiles(oldSupabase, BUCKET_NAME)
  
  if (allFiles.length === 0) {
    console.log('Aucun fichier trouvé dans l\'ancien bucket.')
    return
  }
  
  console.log(`\n✅ ${allFiles.length} fichiers trouvés. Début du transfert...`)

  // 2. Transférer chaque fichier
  let successCount = 0
  let errorCount = 0

  for (const filePath of allFiles) {
    try {
      console.log(`\n⏳ Copie en cours : ${filePath}...`)
      
      // Télécharger depuis l'ancien
      const { data: fileData, error: downloadError } = await oldSupabase.storage
        .from(BUCKET_NAME)
        .download(filePath)

      if (downloadError) {
        throw new Error(`Erreur téléchargement: ${downloadError.message}`)
      }

      // Convertir le Blob en Buffer/ArrayBuffer pour l'upload
      const arrayBuffer = await fileData.arrayBuffer()

      // Détecter le type (ex: image/jpeg)
      const contentType = fileData.type

      // Uploader vers le nouveau
      const { error: uploadError } = await newSupabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, arrayBuffer, {
          contentType,
          upsert: true // Écrase si existe déjà
        })

      if (uploadError) {
        throw new Error(`Erreur upload: ${uploadError.message}`)
      }

      console.log(`✅ Fichier copié avec succès !`)
      successCount++
    } catch (err) {
      console.error(`❌ Échec pour ${filePath}:`, err.message)
      errorCount++
    }
  }

  console.log('\n=============================================')
  console.log('🎉 Migration terminée !')
  console.log(`✅ Réussis : ${successCount}`)
  console.log(`❌ Échecs : ${errorCount}`)
  console.log('=============================================')
}

migrate()
