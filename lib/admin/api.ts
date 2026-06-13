import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

/**
 * Utilitaires partagés par les routes API du dashboard admin sur-mesure.
 * Toutes les écritures passent par le client Sanity authentifié (token serveur)
 * et déclenchent une revalidation ISR pour que le site reflète vite les changements.
 */

/** Vérifie la session admin. Retourne true si autorisé. */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession(authOptions)
  return !!session
}

/** Revalide les pages publiques (les deux langues partagent le layout racine). */
export function revalidateSite() {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // no-op : la revalidation ne doit jamais faire échouer une sauvegarde
  }
}
