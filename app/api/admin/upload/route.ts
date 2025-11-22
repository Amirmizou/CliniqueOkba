import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

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

        // 4. Sanitize Category (prevent path traversal)
        const safeCategory = category.replace(/[^a-zA-Z0-9-_]/g, '')

        // Create upload directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeCategory)
        await mkdir(uploadDir, { recursive: true })

        // 5. Generate Safe Filename
        const timestamp = Date.now()
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '') // Remove unsafe chars
        const filename = `${timestamp}-${originalName}`
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
