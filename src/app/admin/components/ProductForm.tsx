'use client'

import type { Product } from '@prisma/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

type Props = {
  product?: Product
}

type UploadSlot = { id: string; previewUrl: string }

const VIDEO_PATTERN = /\.(mp4|mov|webm)(\?|$)/i
const IMAGE_PATTERN = /\.(jpe?g|png|webp|gif)(\?|$)/i

function isVideoUrl(url: string) {
  return VIDEO_PATTERN.test(url)
}

export default function ProductForm({ product }: Props) {
  const router = useRouter()
  const isEdit = Boolean(product)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(String(product?.price ?? ''))
  const [stock, setStock] = useState(String(product?.stock ?? 0))
  const [category, setCategory] = useState(product?.category ?? '')
  const [sizes, setSizes] = useState((product?.sizes ?? []).join(', '))
  const [colors, setColors] = useState((product?.colors ?? []).join(', '))
  const [imageUrls, setImageUrls] = useState<string[]>(() =>
    [...(product?.images ?? [])].filter(Boolean)
  )
  const [manualUrl, setManualUrl] = useState('')
  const [uploadSlots, setUploadSlots] = useState<UploadSlot[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const removeImageAt = useCallback((index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const addManualUrl = useCallback(() => {
    const u = manualUrl.trim()
    if (!u) return
    try {
      if (u.startsWith('/') || u.startsWith('http://') || u.startsWith('https://')) {
        setImageUrls((prev) => [...prev, u])
        setManualUrl('')
        setError('')
      } else {
        setError('URL must start with /, http://, or https://')
      }
    } catch {
      setError('Invalid URL')
    }
  }, [manualUrl])

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files?.length) return
      setError('')

      for (const file of Array.from(files)) {
        const id = crypto.randomUUID()
        const previewUrl = URL.createObjectURL(file)
        setUploadSlots((s) => [...s, { id, previewUrl }])
        setUploadProgress((prev) => ({ ...prev, [id]: 10 }))

        try {
          const fd = new FormData()
          fd.append('file', file)
          const res = await fetch('/api/upload', { method: 'POST', body: fd })
          const data = (await res.json().catch(() => ({}))) as { error?: string; url?: string }

          const url = data.url
          if (!res.ok || !url) {
            setError(data.error ?? 'Upload failed')
            continue
          }

          setUploadProgress((prev) => ({ ...prev, [id]: 100 }))
          setImageUrls((prev) => [...prev, url])
        } catch {
          setError('Upload failed')
        } finally {
          URL.revokeObjectURL(previewUrl)
          setUploadSlots((s) => s.filter((x) => x.id !== id))
          setUploadProgress((prev) => {
            const next = { ...prev }
            delete next[id]
            return next
          })
        }
      }

      e.target.value = ''
    },
    []
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Math.round(Number(stock)),
      category: category.trim(),
      sizes: sizes
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      colors: colors
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      images: imageUrls,
    }

    try {
      const res = await fetch(
        isEdit ? `/api/products/${product!.id}` : '/api/products',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      const data = (await res.json().catch(() => ({}))) as { error?: string }

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
        setLoading(false)
        return
      }

      router.push('/admin/products')
      router.refresh()
    } catch {
      setError('Request failed')
      setLoading(false)
    }
  }

  const busyUploading = uploadSlots.length > 0

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
        <label className="mb-2 block text-sm text-zinc-400">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Price (EGP)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Stock</label>
          <input
            type="number"
            min={0}
            step={1}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">Sizes</label>
        <input
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
          placeholder="S, M, L, XL"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
        />
        <p className="mt-1 text-xs text-zinc-500">Comma-separated</p>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">Colors</label>
        <input
          value={colors}
          onChange={(e) => setColors(e.target.value)}
          placeholder="Black, White, Navy"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
        />
        <p className="mt-1 text-xs text-zinc-500">Comma-separated</p>
      </div>

      <div>
        <span className="mb-2 block text-sm text-zinc-400">Images</span>
        <p className="mb-3 text-xs text-zinc-500">
          Upload files (saved to Cloudinary when configured) or add an external URL. First image is
          the main photo on the store.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*,video/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            disabled={busyUploading || loading}
            onClick={() => cameraInputRef.current?.click()}
            className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-zinc-600 bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:border-zinc-400 disabled:opacity-50"
          >
            📷 Take Photo
          </button>
          <button
            type="button"
            disabled={busyUploading || loading}
            onClick={() => galleryInputRef.current?.click()}
            className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-zinc-600 bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:border-zinc-400 disabled:opacity-50"
          >
            🖼️ Choose from Gallery
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-1 gap-2">
            <input
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://… or /uploads/…"
              className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
            />
            <button
              type="button"
              onClick={addManualUrl}
              className="shrink-0 rounded-xl border border-zinc-600 px-4 py-3 text-sm font-medium text-white hover:border-zinc-400"
            >
              Add URL
            </button>
          </div>
        </div>

        {(imageUrls.length > 0 || uploadSlots.length > 0) && (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {imageUrls.map((url, index) => (
              <li
                key={`${url}-${index}`}
                className="relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800"
              >
                {isVideoUrl(url) ? (
                  <video
                    src={url}
                    controls
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <img src={url} alt="" className="aspect-square w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeImageAt(index)}
                  className="absolute right-2 top-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-medium text-white hover:bg-black"
                >
                  Remove
                </button>
              </li>
            ))}
            {uploadSlots.map((slot) => (
              <li
                key={slot.id}
                className="relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800"
              >
                <img
                  src={slot.previewUrl}
                  alt=""
                  className="aspect-square w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 px-4 text-center">
                  <span className="text-sm font-medium text-white">Uploading…</span>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-700">
                    <div
                      className="h-full bg-white"
                      style={{ width: `${uploadProgress[slot.id] ?? 0}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={loading || busyUploading}
          className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? 'Saving…' : isEdit ? 'Update product' : 'Create product'}
        </button>
        <Link
          href="/admin/products"
          className="rounded-xl border border-zinc-600 px-6 py-3 font-medium text-zinc-300 transition hover:border-zinc-400 hover:text-white"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
