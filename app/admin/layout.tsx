'use client'

import type { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { inter } from '../fonts'
import '../globals.css'

export default function AdminLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
