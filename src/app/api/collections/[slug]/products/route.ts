import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/api-auth'

type RouteContext = { params: Promise<{ slug: string }> }

async function findCollection(slugOrId: string) {
  return prisma.collection.findFirst({
    where: {
      OR: [{ slug: slugOrId }, { id: slugOrId }],
    },
    select: {
      id: true,
      slug: true,
      title: true,
    },
  })
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params
  const collection = await findCollection(slug)

  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
  }

  const products = await prisma.collectionProduct.findMany({
    where: { collectionId: collection.id },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    include: { product: true },
  })

  return NextResponse.json(products.map((entry) => entry.product))
}

export async function POST(request: Request, context: RouteContext) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await context.params
  const collection = await findCollection(slug)

  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const productId = typeof (body as { productId?: unknown })?.productId === 'string'
    ? (body as { productId: string }).productId.trim()
    : ''

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  })

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  try {
    const lastEntry = await prisma.collectionProduct.findFirst({
      where: { collectionId: collection.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    })

    const entry = await prisma.collectionProduct.create({
      data: {
        collectionId: collection.id,
        productId,
        order: (lastEntry?.order ?? -1) + 1,
      },
      include: {
        product: true,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Product already exists in this collection.' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Could not add product to collection' },
      { status: 500 }
    )
  }
}
