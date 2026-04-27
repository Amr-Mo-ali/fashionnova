'use client'
/* eslint-disable @next/next/no-img-element */

import type { Product } from '@prisma/client'
import { useMemo, useState } from 'react'

type CollectionProductsManagerProps = {
  collectionSlug: string
  initialProducts: Product[]
  allProducts: Product[]
}

export default function CollectionProductsManager({
  collectionSlug,
  initialProducts,
  allProducts,
}: CollectionProductsManagerProps) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loadingIds, setLoadingIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const productIds = useMemo(() => new Set(products.map((product) => product.id)), [products])

  const availableProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return allProducts.filter((product) => {
      if (productIds.has(product.id)) return false
      if (!query) return true
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    })
  }, [allProducts, productIds, search])

  function toggleProduct(productId: string) {
    setSelectedIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    )
  }

  async function addSelected() {
    if (selectedIds.length === 0) return
    setSaving(true)
    setError('')

    try {
      const addedProducts: Product[] = []

      for (const productId of selectedIds) {
        const res = await fetch(`/api/collections/${collectionSlug}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
        const data = (await res.json().catch(() => ({}))) as {
          error?: string
          product?: Product
        }
        if (!res.ok) {
          throw new Error(data.error ?? 'Failed to add product.')
        }
        if (data.product) {
          addedProducts.push(data.product)
        }
      }

      setProducts((current) => [...current, ...addedProducts])
      setSelectedIds([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add products.')
    } finally {
      setSaving(false)
    }
  }

  async function removeProduct(productId: string) {
    setLoadingIds((current) => [...current, productId])
    setError('')

    try {
      const res = await fetch(`/api/collections/${collectionSlug}/products/${productId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? 'Failed to remove product.')
      }
      setProducts((current) => current.filter((product) => product.id !== productId))
      setSelectedIds((current) => current.filter((id) => id !== productId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove product.')
    } finally {
      setLoadingIds((current) => current.filter((id) => id !== productId))
    }
  }

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Products in collection</h2>
            <p className="mt-1 text-sm text-zinc-500">{products.length} assigned</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-500">
            No products have been added to this collection yet.
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => {
              const removing = loadingIds.includes(product.id)
              return (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:flex-row sm:items-center"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-zinc-900">
                    {product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-600">No image</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">{product.name}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {product.category} · EGP {product.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    disabled={removing}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-red-500/40 px-4 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                    aria-label={`Remove ${product.name} from collection`}
                  >
                    {removing ? '...' : 'X'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Add products</h2>
          <p className="mt-1 text-sm text-zinc-500">Search your catalog, select products, and add them to this collection.</p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product name or category"
          className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
        />

        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {availableProducts.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-500">
              No matching products are available to add.
            </div>
          ) : (
            availableProducts.map((product) => {
              const checked = selectedIds.includes(product.id)
              return (
                <label
                  key={product.id}
                  className="flex cursor-pointer items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleProduct(product.id)}
                    className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-white focus:ring-white"
                  />
                  <div className="h-14 w-14 overflow-hidden rounded-2xl bg-zinc-900">
                    {product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-600">No image</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">{product.name}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {product.category} · EGP {product.price.toLocaleString()}
                    </p>
                  </div>
                </label>
              )
            })
          )}
        </div>

        <button
          type="button"
          onClick={addSelected}
          disabled={saving || selectedIds.length === 0}
          className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
        >
          {saving ? 'Adding...' : `Add Selected (${selectedIds.length})`}
        </button>
      </section>
    </div>
  )
}
