import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.password) return null;

                // If a bcrypt hash is configured, use ONLY the hash — never fall through to plaintext.
                if (process.env.ADMIN_PASSWORD_HASH) {
                    try {
                        // Hostinger sometimes adds backslashes or strips $ signs.
                        const cleanHash = process.env.ADMIN_PASSWORD_HASH.replace(/\\/g, '');
                        if (cleanHash.startsWith('$2')) {
                            const isMatch = await bcrypt.compare(credentials.password, cleanHash);
                            return isMatch ? { id: "1", name: "Admin", email: "admin@cliniqueokba.com" } : null;
                        }
                    } catch (e) {
                        console.error("Bcrypt compare error:", e);
                    }
                    return null;
                }

                // Plaintext fallback — only when ADMIN_PASSWORD_HASH is not set at all.
                if (process.env.ADMIN_PASSWORD && credentials.password === process.env.ADMIN_PASSWORD) {
                    return { id: "1", name: "Admin", email: "admin@cliniqueokba.com" }
                }

                return null;
            }
        })
    ],
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt",
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
