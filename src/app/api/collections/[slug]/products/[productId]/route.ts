import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/api-auth'

type RouteContext = { params: Promise<{ slug: string; productId: string }> }

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug, productId } = await context.params
  const collection = await prisma.collection.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    select: { id: true },
  })

  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
  }

  const relation = await prisma.collectionProduct.findFirst({
    where: {
      collectionId: collection.id,
      productId,
    },
    select: { id: true },
  })

  if (!relation) {
    return NextResponse.json({ error: 'Product not found in collection' }, { status: 404 })
  }

  await prisma.collectionProduct.delete({
    where: { id: relation.id },
  })

  return new NextResponse(null, { status: 204 })
}
