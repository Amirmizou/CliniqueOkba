import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { isAuthenticated } from '@/lib/admin/api'
import { NO_STORE_HEADERS } from '@/lib/security'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Route d'outillage du panneau admin : elle était publique et permettait à
  // n'importe quel robot d'énumérer les identifiants de documents Sanity pour
  // en extraire les URL, requête par requête.
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: NO_STORE_HEADERS })
  }

  const ref = new URL(request.url).searchParams.get('ref')
  // Un `_id` Sanity est alphanumérique avec tirets/points (assets : « image-<hash>-<dim>-<ext> »).
  if (!ref || ref.length > 200 || !/^[A-Za-z0-9._-]+$/.test(ref)) {
    return NextResponse.json({ error: 'Missing ref' }, { status: 400, headers: NO_STORE_HEADERS })
  }

  try {
    const asset = await client.fetch(`*[_id == $ref][0] { url }`, { ref })
    return NextResponse.json({ url: asset?.url || null }, { headers: NO_STORE_HEADERS })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500, headers: NO_STORE_HEADERS })
  }
}
