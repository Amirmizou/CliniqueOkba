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

                try {
                    // Try to use the hash if provided
                    if (process.env.ADMIN_PASSWORD_HASH) {
                        // Hostinger sometimes adds backslashes or strips $ signs. Let's sanitize.
                        const rawHash = process.env.ADMIN_PASSWORD_HASH;
                        const cleanHash = rawHash.replace(/\\/g, ''); // remove backslashes
                        
                        // bcrypt hashes MUST start with $2a$, $2b$, or $2y$. 
                        // If Hostinger stripped the $ variables (e.g., $2b became empty), it's corrupted and compare will throw.
                        if (cleanHash.startsWith('$2')) {
                            const isMatch = await bcrypt.compare(credentials.password, cleanHash);
                            if (isMatch) return { id: "1", name: "Admin", email: "admin@cliniqueokba.com" };
                        }
                    }
                } catch (e) {
                    console.error("Bcrypt compare error:", e);
                }

                // Fallback to plain text if hash is missing, corrupted, or doesn't match
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
