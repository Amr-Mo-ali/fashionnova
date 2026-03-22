import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/api-auth'

export async function GET() {
  const session = await requireSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: { select: { name: true } } },
      },
    },
  })

  return NextResponse.json(orders)
}

type IncomingItem = {
  productId: string
  quantity: number
  size: string
  color: string
}

function parseCheckoutItems(raw: unknown): IncomingItem[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  const out: IncomingItem[] = []
  for (const row of raw) {
    if (!row || typeof row !== 'object') return null
    const o = row as Record<string, unknown>
    const productId = typeof o.productId === 'string' ? o.productId : ''
    const quantity =
      typeof o.quantity === 'number' ? o.quantity : Number(o.quantity)
    const size = typeof o.size === 'string' ? o.size : ''
    const color = typeof o.color === 'string' ? o.color : ''
    if (!productId || !Number.isFinite(quantity) || quantity < 1 || !Number.isInteger(quantity)) {
      return null
    }
    out.push({ productId, quantity, size, color })
  }
  return out
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const o = body as Record<string, unknown>
  const customerName = typeof o.customerName === 'string' ? o.customerName.trim() : ''
  const phone = typeof o.phone === 'string' ? o.phone.trim() : ''
  const address = typeof o.address === 'string' ? o.address.trim() : ''

  if (!customerName || !phone || !address) {
    return NextResponse.json({ error: 'Name, phone, and address are required' }, { status: 400 })
  }

  const items = parseCheckoutItems(o.items)
  if (!items) {
    return NextResponse.json({ error: 'Add at least one valid item' }, { status: 400 })
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      let total = 0
      const orderLines: {
        productId: string
        quantity: number
        size: string
        color: string
        price: number
      }[] = []

      for (const line of items) {
        const product = await tx.product.findUnique({ where: { id: line.productId } })
        if (!product) {
          throw new Error('One or more products are no longer available')
        }

        if (product.sizes.length > 0 && !product.sizes.includes(line.size)) {
          throw new Error(`Invalid size for ${product.name}`)
        }
        if (product.colors.length > 0 && !product.colors.includes(line.color)) {
          throw new Error(`Invalid color for ${product.name}`)
        }

        if (product.stock < line.quantity) {
          throw new Error(`Not enough stock for ${product.name}`)
        }

        const lineTotal = product.price * line.quantity
        total += lineTotal
        orderLines.push({
          productId: line.productId,
          quantity: line.quantity,
          size: line.size,
          color: line.color,
          price: product.price,
        })
      }

      const created = await tx.order.create({
        data: {
          customerName,
          phone,
          address,
          total,
          status: 'PENDING',
          items: {
            create: orderLines.map((l) => ({
              productId: l.productId,
              quantity: l.quantity,
              size: l.size,
              color: l.color,
              price: l.price,
            })),
          },
        },
        include: {
          items: { include: { product: { select: { name: true } } } },
        },
      })

      for (const line of items) {
        await tx.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: line.quantity } },
        })
      }

      return created
    })

    return NextResponse.json(order, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not place order'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
