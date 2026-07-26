import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { loginGlobalLimiter, loginRateLimiter } from "@/lib/rate-limit"
import { getClientIp, safeEqual } from "@/lib/security"

const ADMIN_USER = { id: "1", name: "Admin", email: "admin@cliniqueokba.com" }

/** Tentatives autorisées par IP et au total, par fenêtre de 15 minutes. */
const MAX_ATTEMPTS_PER_IP = 8
const MAX_ATTEMPTS_GLOBAL = 40

/**
 * L'authentification n'utilise QUE un mot de passe (aucun identifiant) : c'est
 * un secret unique, deviné par des robots qui rejouent des listes de mots de
 * passe. Sans limitation, chaque tentative est gratuite. On plafonne donc les
 * tentatives par IP ET globalement (résistance aux botnets / proxys tournants).
 */
async function loginAllowed(headers: Headers): Promise<boolean> {
    const ip = getClientIp(headers)
    const [perIp, global] = await Promise.all([
        loginRateLimiter.check(ip, MAX_ATTEMPTS_PER_IP),
        loginGlobalLimiter.check('all', MAX_ATTEMPTS_GLOBAL),
    ])
    if (!perIp.success) {
        console.warn(`[auth] Trop de tentatives de connexion depuis ${ip} — bloqué`)
        return false
    }
    if (!global.success) {
        console.warn('[auth] Plafond global de tentatives de connexion atteint — bloqué')
        return false
    }
    return true
}

/** Ralentit mécaniquement les campagnes automatisées (coût par tentative). */
const failDelay = () => new Promise((r) => setTimeout(r, 400 + Math.random() * 400))

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.password) return null;

                const headers = new Headers(
                    Object.entries((req?.headers as Record<string, string>) || {}).filter(
                        ([, v]) => typeof v === 'string',
                    ) as [string, string][],
                )
                if (!(await loginAllowed(headers))) {
                    // Message générique : ne pas révéler qu'un blocage est actif.
                    throw new Error('RateLimited')
                }

                // If a bcrypt hash is configured, use ONLY the hash — never fall through to plaintext.
                if (process.env.ADMIN_PASSWORD_HASH) {
                    try {
                        // Hostinger sometimes adds backslashes or strips $ signs.
                        const cleanHash = process.env.ADMIN_PASSWORD_HASH.replace(/\\/g, '');
                        if (cleanHash.startsWith('$2')) {
                            const isMatch = await bcrypt.compare(credentials.password, cleanHash);
                            if (isMatch) return ADMIN_USER;
                        }
                    } catch (e) {
                        console.error("Bcrypt compare error:", e);
                    }
                    await failDelay();
                    return null;
                }

                // Plaintext fallback — only when ADMIN_PASSWORD_HASH is not set at all.
                // Comparaison à temps constant : `===` fuit la longueur du préfixe
                // commun et permet de reconstruire le secret par mesures répétées.
                if (safeEqual(credentials.password, process.env.ADMIN_PASSWORD)) {
                    return ADMIN_USER
                }

                await failDelay();
                return null;
            }
        })
    ],
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt",
        // Session courte : réduit la fenêtre d'exploitation d'un jeton volé
        // (poste partagé, extension malveillante) sans gêner l'usage quotidien.
        maxAge: 8 * 60 * 60,
        updateAge: 60 * 60,
    },
    // Cookies verrouillés : httpOnly (inaccessible en JS), sameSite=lax (le
    // cookie n'accompagne pas les requêtes cross-site déclenchées par un tiers),
    // secure en production.
    useSecureCookies: process.env.NODE_ENV === 'production',
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production'
                ? '__Secure-next-auth.session-token'
                : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id
            }
            return session
        }
    }
}
