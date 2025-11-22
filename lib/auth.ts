import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // This is a temporary hardcoded check. 
                // In production, this should check against a database.
                if (
                    credentials?.username === process.env.ADMIN_USER &&
                    credentials?.password === process.env.ADMIN_PASSWORD
                ) {
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
