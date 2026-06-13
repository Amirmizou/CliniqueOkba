import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get('ref')
  if (!ref) return NextResponse.json({ error: 'Missing ref' }, { status: 400 })
  
  try {
    const asset = await client.fetch(`*[_id == $ref][0] { url }`, { ref })
    return NextResponse.json({ url: asset?.url || null })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
