import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/api-auth'
import {
  createUniqueCollectionSlug,
  parseCollectionBody,
} from '@/lib/collection-payload'

type RouteContext = { params: Promise<{ slug: string }> }

async function findCollection(slugOrId: string) {
  return prisma.collection.findFirst({
    where: {
      OR: [{ slug: slugOrId }, { id: slugOrId }],
    },
    include: {
      products: {
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        include: {
          product: true,
        },
      },
      _count: {
        select: { products: true },
      },
    },
  })
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params
  const collection = await findCollection(slug)

  if (!collection) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...collection,
    productCount: collection._count.products,
    products: collection.products.map((entry) => entry.product),
  })
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await context.params
  const existing = await findCollection(slug)

  if (!existing) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
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
    const nextSlug = await createUniqueCollectionSlug(parsed.data.slug || parsed.data.title, async (candidate) => {
      const match = await prisma.collection.findUnique({
        where: { slug: candidate },
        select: { id: true },
      })
      return Boolean(match && match.id !== existing.id)
    })

    const collection = await prisma.collection.update({
      where: { id: existing.id },
      data: {
        title: parsed.data.title,
        slug: nextSlug,
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

    return NextResponse.json({
      ...collection,
      productCount: collection._count.products,
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: 'Could not update collection' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await context.params
  const existing = await prisma.collection.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    select: { id: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
  }

  try {
    await prisma.collection.delete({ where: { id: existing.id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: 'Could not delete collection' },
      { status: 500 }
    )
  }
}
