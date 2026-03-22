export function parseStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean)
  }
  if (typeof value === 'string') {
    return value.split(/[,\n]/).map((s) => s.trim()).filter(Boolean)
  }
  return []
}

export type ProductPayload = {
  name: string
  description: string
  price: number
  stock: number
  category: string
  sizes: string[]
  colors: string[]
  images: string[]
}

export function parseProductBody(
  body: unknown
): { ok: true; data: ProductPayload } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid JSON' }
  }

  const o = body as Record<string, unknown>
  const name = typeof o.name === 'string' ? o.name.trim() : ''
  const description = typeof o.description === 'string' ? o.description.trim() : ''
  const category = typeof o.category === 'string' ? o.category.trim() : ''

  const price = typeof o.price === 'number' ? o.price : Number(o.price)
  const stockRaw = typeof o.stock === 'number' ? o.stock : Number(o.stock)
  const stock = Math.round(stockRaw)

  if (!name) return { ok: false, error: 'Name is required' }
  if (!Number.isFinite(price) || price < 0) return { ok: false, error: 'Invalid price' }
  if (!Number.isFinite(stockRaw) || stock < 0 || stock !== stockRaw) {
    return { ok: false, error: 'Invalid stock' }
  }

  const imagesRaw = o.images !== undefined ? o.images : o.imageUrls

  return {
    ok: true,
    data: {
      name,
      description,
      category,
      price,
      stock,
      sizes: parseStringList(o.sizes),
      colors: parseStringList(o.colors),
      images: parseStringList(imagesRaw),
    },
  }
}
