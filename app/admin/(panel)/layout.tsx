'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import AdminShell from '@/components/admin/admin-shell'

/**
 * Layout du dashboard sur-mesure (groupe (panel)).
 * Garde d'accès côté client via la session next-auth (le parent
 * app/admin/layout.tsx fournit le SessionProvider). La sécurité réelle des
 * données est assurée côté serveur par getServerSession dans les routes
 * /api/admin/*. Le Studio Sanity (/admin/dashboard) est hors de ce groupe.
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin?callbackUrl=/admin')
    }
  }, [status, router])

  if (status !== 'authenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    )
  }

  return <AdminShell>{children}</AdminShell>
}
