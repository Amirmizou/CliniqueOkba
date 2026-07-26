import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

/** Extension canonique par type d'image réellement détecté. */
const EXT_BY_TYPE: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
}

/** Détection du format par signature binaire (magic bytes). */
function sniffImageType(buf: Buffer): string | null {
    if (buf.length < 12) return null
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'
    if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
        return 'image/png'
    if (buf.subarray(0, 6).toString('ascii').startsWith('GIF8')) return 'image/gif'
    if (
        buf.subarray(0, 4).toString('ascii') === 'RIFF' &&
        buf.subarray(8, 12).toString('ascii') === 'WEBP'
    )
        return 'image/webp'
    return null
}

export async function POST(request: Request) {
    try {
        // 1. Check Authentication
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const category = formData.get('category') as string || 'general'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // 2. Validate File Type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 })
        }

        // 3. Validate File Size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File too large. Max size is 5MB.' }, { status: 400 })
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // 3bis. Le `Content-Type` d'un envoi multipart est déclaré par le client.
        // On valide la signature binaire réelle : sinon un fichier arbitraire
        // (HTML/JS/PHP) est écrit dans /public et servi par le site.
        const realType = sniffImageType(buffer)
        if (!realType || !allowedTypes.includes(realType)) {
            return NextResponse.json({ error: 'File content is not a valid image.' }, { status: 400 })
        }

        // 4. Sanitize Category (prevent path traversal)
        const safeCategory = category.replace(/[^a-zA-Z0-9-_]/g, '') || 'general'

        // Create upload directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeCategory)
        await mkdir(uploadDir, { recursive: true })

        // 5. Generate Safe Filename
        // L'extension provient du type RÉEL, jamais du nom fourni : un nom comme
        // « photo.html » (déclaré image/png) aurait produit un fichier servi en
        // HTML depuis notre domaine, donc un XSS stocké.
        const base = path.basename(file.name).replace(/[^a-zA-Z0-9-]/g, '').slice(0, 60) || 'image'
        const filename = `${Date.now()}-${base}.${EXT_BY_TYPE[realType]}`
        const filepath = path.join(uploadDir, filename)

        // Write file
        await writeFile(filepath, buffer)

        // Return the public URL
        const publicUrl = `/uploads/${safeCategory}/${filename}`

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename: filename
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }
}
