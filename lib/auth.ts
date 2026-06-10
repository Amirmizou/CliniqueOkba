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
                if (!credentials?.password || !process.env.ADMIN_PASSWORD_HASH) {
                    // Fallback to old plaintext compare if no hash is provided (for migration purposes)
                    // Once fully migrated, remove this fallback and only rely on ADMIN_PASSWORD_HASH
                    if (credentials?.password && credentials.password === process.env.ADMIN_PASSWORD) {
                        return { id: "1", name: "Admin", email: "admin@cliniqueokba.com" }
                    }
                    return null;
                }

                const isMatch = await bcrypt.compare(credentials.password, process.env.ADMIN_PASSWORD_HASH);
                if (isMatch) {
                    return { id: "1", name: "Admin", email: "admin@cliniqueokba.com" }
                }
                return null
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
