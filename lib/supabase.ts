import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Client Supabase côté SERVEUR uniquement.
 *
 * Utilise la SERVICE_ROLE_KEY : elle contourne la Row Level Security, donc elle
 * ne doit JAMAIS être importée dans un composant client ni exposée au navigateur.
 * Tous les accès aux données des bénéficiaires (lecture, écriture, upload de
 * fichiers, URLs signées) passent par ce client via les routes API.
 */

export const BENEFICIAIRES_BUCKET = 'beneficiaires'

let cached: SupabaseClient | null = null

/**
 * Retourne le client admin Supabase, ou `null` si les variables d'environnement
 * ne sont pas configurées (permet aux routes de renvoyer une erreur 503 propre
 * plutôt que de planter au build).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}
