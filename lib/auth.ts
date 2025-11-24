import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET || 'dev-secret-key-change-in-production',
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Vérification du mot de passe uniquement
                console.log('🔐 Auth attempt:', {
                    hasPassword: !!credentials?.password,
                    envPassword: !!process.env.ADMIN_PASSWORD,
                    passwordMatch: credentials?.password === process.env.ADMIN_PASSWORD
                })

                if (credentials?.password === process.env.ADMIN_PASSWORD) {
                    console.log('✅ Auth successful')
                    return { id: "1", name: "Admin", email: "admin@cliniqueokba.com" }
                }
                console.log('❌ Auth failed')
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
