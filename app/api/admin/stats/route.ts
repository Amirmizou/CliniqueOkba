import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin/api'
import { getSummary, resetVisits } from '@/lib/visits'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  return NextResponse.json({ stats: await getSummary() })
}

/** Remise à zéro des compteurs (action explicite depuis le panneau admin). */
export async function DELETE() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  await resetVisits()
  return NextResponse.json({ ok: true, stats: await getSummary() })
}
