export const CART_STORAGE_KEY = 'fashionnova-cart'

export type CartLine = {
  productId: string
  name: string
  price: number
  category: string
  image: string | null
  size: string
  color: string
  quantity: number
}

export function parseCartJson(raw: string | null): CartLine[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(isCartLine)
  } catch {
    return []
  }
}

function isCartLine(x: unknown): x is CartLine {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.productId === 'string' &&
    typeof o.name === 'string' &&
    typeof o.price === 'number' &&
    typeof o.category === 'string' &&
    (o.image === null || typeof o.image === 'string') &&
    typeof o.size === 'string' &&
    typeof o.color === 'string' &&
    typeof o.quantity === 'number' &&
    Number.isInteger(o.quantity) &&
    o.quantity >= 1
  )
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
}
