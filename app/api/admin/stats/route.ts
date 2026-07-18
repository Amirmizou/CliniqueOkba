import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin/api'
import { getSummary, resetVisits, restoreVisits, hasBackup } from '@/lib/visits'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  return NextResponse.json({ stats: await getSummary(), canUndo: await hasBackup() })
}

/** Remise à zéro des compteurs (action explicite depuis le panneau admin). */
export async function DELETE() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  await resetVisits()
  // `canUndo` : une sauvegarde vient d'être créée, l'annulation est possible.
  return NextResponse.json({ ok: true, stats: await getSummary(), canUndo: await hasBackup() })
}

/** Annule la dernière réinitialisation en restaurant la sauvegarde. */
export async function POST() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const restored = await restoreVisits()
  if (!restored) {
    return NextResponse.json({ error: 'Aucune sauvegarde à restaurer.' }, { status: 404 })
  }
  return NextResponse.json({ ok: true, stats: await getSummary(), canUndo: true })
}
