'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Collection } from '@prisma/client'
import { createSlug } from '@/lib/collection-payload'

export default function CollectionForm({ collection }: { collection?: Collection }) {
  const router = useRouter()
  const isEdit = Boolean(collection)
  const [name, setName] = useState(collection?.name ?? '')
  const [slug, setSlug] = useState(collection?.slug ?? '')
  const [description, setDescription] = useState(collection?.description ?? '')
  const [image, setImage] = useState(collection?.image ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!collection) {
      setSlug(createSlug(name))
    }
  }, [collection, name])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      name: name.trim(),
      slug: slug.trim() || createSlug(name),
      description: description.trim(),
      image: image.trim(),
    }

    try {
      const url = isEdit ? `/api/collections/${collection!.id}` : '/api/collections'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        setError(data.error ?? 'Failed to save collection')
        setLoading(false)
        return
      }

      router.push('/admin/collections')
      router.refresh()
    } catch {
      setError('Failed to save collection')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {error ? (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm text-zinc-400">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="collection-slug"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
        />
        <p className="mt-1 text-xs text-zinc-500">Used in collection URLs.</p>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">Image URL</label>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Optional collection cover image. Use Cloudinary or an external image URL.
        </p>
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? 'Saving…' : isEdit ? 'Update collection' : 'Create collection'}
        </button>
      </div>
    </form>
  )
}
