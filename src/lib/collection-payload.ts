export function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

type CollectionPayload = {
  name: string
  slug: string
  description: string
  image: string
}

export function parseCollectionBody(
  body: unknown
):
  | { ok: true; data: CollectionPayload }
  | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid JSON' }
  }

  const o = body as Record<string, unknown>
  const name = typeof o.name === 'string' ? o.name.trim() : ''
  const rawSlug = typeof o.slug === 'string' ? o.slug.trim() : ''
  const slug = rawSlug || createSlug(name)
  const description = typeof o.description === 'string' ? o.description.trim() : ''
  const image = typeof o.image === 'string' ? o.image.trim() : ''

  if (!name) {
    return { ok: false, error: 'Name is required' }
  }

  if (!slug) {
    return { ok: false, error: 'Slug is required' }
  }

  return {
    ok: true,
    data: {
      name,
      slug,
      description,
      image,
    },
  }
}
