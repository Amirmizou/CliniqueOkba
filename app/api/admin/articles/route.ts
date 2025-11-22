import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'clinic.json')

export async function GET() {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        return NextResponse.json(data.articles || [])
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        const newArticle = await request.json()

        // Generate ID if not provided
        if (!newArticle.id) {
            const maxId = data.articles?.reduce((max: number, article: any) =>
                Math.max(max, parseInt(article.id) || 0), 0) || 0
            newArticle.id = String(maxId + 1)
        }

        // Add timestamp
        newArticle.date = newArticle.date || new Date().toISOString().split('T')[0]

        data.articles = data.articles || []
        data.articles.push(newArticle)

        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        return NextResponse.json({ success: true, article: newArticle })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add article' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)
        const updatedArticle = await request.json()

        const index = data.articles?.findIndex((a: any) => a.id === updatedArticle.id)
        if (index === -1) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 })
        }

        data.articles[index] = updatedArticle
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        return NextResponse.json({ success: true, article: updatedArticle })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Article ID required' }, { status: 400 })
        }

        const fileContent = await fs.readFile(dataPath, 'utf-8')
        const data = JSON.parse(fileContent)

        data.articles = data.articles?.filter((a: any) => a.id !== id) || []

        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
    }
}
