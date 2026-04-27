import { headers } from 'next/headers'
import type { Collection, Product } from '@prisma/client'

async function internalOrigin(): Promise<string | null> {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  if (!host) return null
  const forwardedProto = h.get('x-forwarded-proto')
  const proto =
    forwardedProto ??
    (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https')
  return `${proto}://${host}`
}

export async function fetchProductsFromApi(): Promise<Product[]> {
  const origin = await internalOrigin()
  if (!origin) return []

  try {
    const res = await fetch(`${origin}/api/products`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json() as Promise<Product[]>
  } catch {
    return []
  }
}

export async function fetchProductFromApi(id: string): Promise<Product | null> {
  const origin = await internalOrigin()
  if (!origin) return null

  try {
    const res = await fetch(`${origin}/api/products/${id}`, { cache: 'no-store' })
    if (res.status === 404) return null
    if (!res.ok) return null
    return res.json() as Promise<Product>
  } catch {
    return null
  }
}

export async function fetchCollectionsFromApi(): Promise<Collection[]> {
  const origin = await internalOrigin()
  if (!origin) return []

  try {
    const res = await fetch(`${origin}/api/collections`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json() as Promise<Collection[]>
  } catch {
    return []
  }
}
