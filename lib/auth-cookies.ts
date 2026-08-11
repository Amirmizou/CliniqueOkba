/**
 * Définition UNIQUE du cookie de session NextAuth.
 *
 * Ce fichier est volontairement sans dépendance (aucun import Node : bcrypt,
 * crypto…) car il est chargé à la fois par la configuration serveur
 * (`lib/auth.ts`) et par le middleware, qui s'exécute sur le runtime Edge.
 *
 * Pourquoi le partager ? `lib/auth.ts` écrit le cookie sous le nom
 * `__Secure-next-auth.session-token` dès que NODE_ENV vaut `production`, alors
 * que `getToken()` (utilisé par `withAuth` dans le middleware) déduit ce nom de
 * `NEXTAUTH_URL.startsWith('https://')`. Derrière le reverse-proxy Hostinger,
 * ces deux sources peuvent diverger : le cookie est bien posé à la connexion,
 * mais le middleware cherche `next-auth.session-token` et ne le trouve jamais →
 * redirection permanente vers /auth/signin, panneau d'administration
 * inaccessible. En imposant le même nom des deux côtés, la question ne se pose
 * plus, quelle que soit la valeur de NEXTAUTH_URL.
 */

export const USE_SECURE_COOKIES = process.env.NODE_ENV === 'production'

export const SESSION_COOKIE_NAME = USE_SECURE_COOKIES
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token'

/** Cookie de session verrouillé : httpOnly, sameSite=lax, secure en production. */
export const SESSION_COOKIE = {
  name: SESSION_COOKIE_NAME,
  options: {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secure: USE_SECURE_COOKIES,
  },
}
