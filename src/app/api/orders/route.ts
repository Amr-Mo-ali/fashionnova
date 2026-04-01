import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/api-auth'
import { computeDepositFromUnitPrices } from '@/lib/order-deposit'

export async function GET() {
  const session = await requireAdminSession()
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
    const quantity = typeof o.quantity === 'number' ? o.quantity : Number(o.quantity)
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
    // collect product names before transaction for WhatsApp message
    const productDetails: Record<string, { name: string; price: number }> = {}

    for (const line of items) {
      const product = await prisma.product.findUnique({ where: { id: line.productId } })
      if (product) {
        productDetails[line.productId] = { name: product.name, price: product.price }
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      const productIds = items.map((line) => line.productId)
      const products = await tx.product.findMany({ where: { id: { in: productIds } } })
      const productMap = new Map(products.map((product) => [product.id, product]))

      let total = 0
      const orderLines: {
        productId: string
        quantity: number
        size: string
        color: string
        price: number
      }[] = []

      for (const line of items) {
        const product = productMap.get(line.productId)
        if (!product) throw new Error('One or more products are no longer available')
        if (product.sizes.length > 0 && !product.sizes.includes(line.size)) throw new Error(`Invalid size for ${product.name}`)
        if (product.colors.length > 0 && !product.colors.includes(line.color)) throw new Error(`Invalid color for ${product.name}`)
        if (product.stock < line.quantity) throw new Error(`Not enough stock for ${product.name}`)

        total += product.price * line.quantity
        orderLines.push({ productId: line.productId, quantity: line.quantity, size: line.size, color: line.color, price: product.price })
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
        const updateResult = await tx.product.updateMany({
          where: { id: line.productId, stock: { gte: line.quantity } },
          data: { stock: { decrement: line.quantity } },
        })
        if (updateResult.count === 0) {
          const productName = productMap.get(line.productId)?.name ?? 'product'
          throw new Error(`Not enough stock for ${productName}`)
        }
      }

      return created
    })

    // WhatsApp notification
    try {
      const itemsList = items
        .map((l) => {
          const name = productDetails[l.productId]?.name ?? 'Product'
          return `${l.quantity}x ${name}${l.size ? ` (${l.size})` : ''}${l.color ? ` - ${l.color}` : ''}`
        })
        .join('\n')

      const total = items.reduce((sum, l) => sum + (productDetails[l.productId]?.price ?? 0) * l.quantity, 0)
      const unitPrices = items
        .map((l) => productDetails[l.productId]?.price)
        .filter((p): p is number => typeof p === 'number')
      const deposit = computeDepositFromUnitPrices(unitPrices)
      const message = `🛍️ New Order!\n👤 Customer: ${customerName}\n📞 Phone: ${phone}\n📍 Address: ${address}\n\n📦 Items:\n${itemsList}\n\n💰 Total: EGP ${total}\n\n💳 Deposit: EGP ${deposit} (10% of highest item)\nPay via 📱 Vodafone Cash or 💳 Instapay to 01024888895`
      const whatsappPhone = process.env.WHATSAPP_PHONE
      const whatsappApiKey = process.env.WHATSAPP_API_KEY
      if (whatsappPhone && whatsappApiKey) {
        const encodedMessage = encodeURIComponent(message)
        await fetch(
          `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
            whatsappPhone
          )}&text=${encodedMessage}&apikey=${encodeURIComponent(whatsappApiKey)}`
        )
      }
    } catch {
      // don't block the order if notification fails
    }

    return NextResponse.json(order, { status: 201 })
  } catch (e) {
    const safeErrors = [
      'One or more products are no longer available',
      'Invalid size for ',
      'Invalid color for ',
      'Not enough stock for ',
    ]

    if (e instanceof Error && safeErrors.some((prefix) => e.message.startsWith(prefix))) {
      return NextResponse.json({ error: e.message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Could not place order' }, { status: 400 })
  }
}