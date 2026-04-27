export function createSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function createUniqueCollectionSlug(
  title: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = createSlug(title)
  if (!base) return ''

  let slug = base
  let attempt = 1

  while (await exists(slug)) {
    attempt += 1
    slug = `${base}-${attempt}`
  }

  return slug
}

type CollectionPayload = {
  title: string
  slug: string
  description: string
  coverImage: string
  mediaUrl: string
  mediaType: string
  thumbnail: string
  order: number
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
  const title = typeof o.title === 'string' ? o.title.trim() : ''
  const rawSlug = typeof o.slug === 'string' ? o.slug.trim() : ''
  const slug = createSlug(rawSlug || title)
  const description = typeof o.description === 'string' ? o.description.trim() : ''
  const coverImage = typeof o.coverImage === 'string' ? o.coverImage.trim() : ''
  const mediaUrl = typeof o.mediaUrl === 'string' ? o.mediaUrl.trim() : ''
  const mediaTypeRaw = typeof o.mediaType === 'string' ? o.mediaType.trim().toLowerCase() : 'image'
  const mediaType = mediaTypeRaw === 'video' ? 'video' : 'image'
  const thumbnail = typeof o.thumbnail === 'string' ? o.thumbnail.trim() : ''
  const orderCandidate =
    typeof o.order === 'number'
      ? o.order
      : typeof o.order === 'string'
        ? Number(o.order)
        : 0
  const order = Number.isFinite(orderCandidate) ? Math.max(0, Math.round(orderCandidate)) : 0

  if (!title) {
    return { ok: false, error: 'Title is required' }
  }

  if (!slug) {
    return { ok: false, error: 'Slug is required' }
  }

  return {
    ok: true,
    data: {
      title,
      slug,
      description,
      coverImage,
      mediaUrl,
      mediaType,
      thumbnail,
      order,
    },
  }
}
