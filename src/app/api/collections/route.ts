import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/api-auth'
import {
  createUniqueCollectionSlug,
  parseCollectionBody,
} from '@/lib/collection-payload'

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: [{ order: 'desc' }, { updatedAt: 'desc' }],
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    return NextResponse.json(
      collections.map((collection) => ({
        ...collection,
        productCount: collection._count.products,
      }))
    )
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
    const slug = await createUniqueCollectionSlug(parsed.data.slug || parsed.data.title, async (candidate) => {
      const existing = await prisma.collection.findUnique({
        where: { slug: candidate },
        select: { id: true },
      })
      return Boolean(existing)
    })

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const collection = await prisma.collection.create({
      data: {
        title: parsed.data.title,
        slug,
        description: parsed.data.description || null,
        coverImage: parsed.data.coverImage || null,
        mediaUrl: parsed.data.mediaUrl || null,
        mediaType: parsed.data.mediaType,
        thumbnail: parsed.data.thumbnail || parsed.data.coverImage || null,
        order: parsed.data.order,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    return NextResponse.json(
      {
        ...collection,
        productCount: collection._count.products,
      },
      { status: 201 }
    )
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
