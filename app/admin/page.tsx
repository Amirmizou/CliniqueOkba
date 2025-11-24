'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated') {
            // User is authenticated, redirect to dashboard
            router.push('/admin/dashboard')
        } else if (status === 'unauthenticated') {
            // User is not authenticated, redirect to signin
            router.push('/auth/signin?callbackUrl=/admin')
        }
    }, [status, router])

    // Show loading state while checking authentication
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Vérification de l'authentification...</p>
            </div>
        </div>
    )
}
