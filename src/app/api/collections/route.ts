import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/api-auth'
import { parseCollectionBody } from '@/lib/collection-payload'

export async function GET() {
  const collections = await prisma.collection.findMany({
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(collections)
}

export async function POST(request: Request) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = parseCollectionBody(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  try {
    const collection = await prisma.collection.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
        image: parsed.data.image || null,
      },
    })
    return NextResponse.json(collection, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Could not create collection' },
      { status: 500 }
    )
  }
}
