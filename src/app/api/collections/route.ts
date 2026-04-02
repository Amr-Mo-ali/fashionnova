import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/api-auth'
import { parseCollectionBody } from '@/lib/collection-payload'

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: [{ order: 'desc' }, { updatedAt: 'desc' }],
    })
    return NextResponse.json(collections)
  } catch (error) {
    console.error('Failed to fetch collections:', error)
    return NextResponse.json(
      { error: 'Could not load collections' },
      { status: 500 }
    )
  }
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
        order: parsed.data.order,
      },
    })
    return NextResponse.json(collection, { status: 201 })
  } catch (error) {
    console.error('Failed to create collection:', error)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'A collection with that slug already exists.' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Could not create collection' },
      { status: 500 }
    )
  }
}
