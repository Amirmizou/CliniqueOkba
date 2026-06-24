'use client'

import type { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import '../globals.css'

export default function AdminLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <SessionProvider>
            <div className="admin-panel min-h-screen bg-background">
                {children}
            </div>
        </SessionProvider>
    )
}
