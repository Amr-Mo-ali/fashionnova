'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Collection } from '@prisma/client'
import { createSlug } from '@/lib/collection-payload'

const ACCEPTED_MEDIA = 'image/*,video/*'
const VIDEO_PATTERN = /\.(mp4|mov|webm)(\?|$)/i
const IMAGE_PATTERN = /\.(jpe?g|png|webp|gif)(\?|$)/i

function isVideoUrl(url: string) {
  return VIDEO_PATTERN.test(url)
}

function isImageUrl(url: string) {
  return IMAGE_PATTERN.test(url)
}

export default function CollectionForm({ collection }: { collection?: Collection }) {
  const router = useRouter()
  const isEdit = Boolean(collection)
  const [name, setName] = useState(collection?.name ?? '')
  const [slug, setSlug] = useState(collection?.slug ?? '')
  const [description, setDescription] = useState(collection?.description ?? '')
  const [mediaUrl, setMediaUrl] = useState(collection?.image ?? '')
  const [order, setOrder] = useState(String(collection?.order ?? 0))
  const [error, setError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [pendingPreview, setPendingPreview] = useState('')

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!collection) {
      setSlug(createSlug(name))
    }
  }, [collection, name])

  useEffect(() => {
    return () => {
      if (pendingPreview) {
        URL.revokeObjectURL(pendingPreview)
      }
    }
  }, [pendingPreview])

  async function uploadFile(file: File) {
    setUploadError('')
    setUploading(true)
    setUploadProgress(10)

    const preview = URL.createObjectURL(file)
    setPendingPreview(preview)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = (await response.json().catch(() => ({}))) as {
        url?: string
        error?: string
      }

      if (!response.ok || !data.url) {
        setUploadError(data.error ?? 'Upload failed')
        setUploadProgress(0)
        return
      }

      setMediaUrl(data.url)
      setPendingPreview('')
      setUploadProgress(100)
    } catch {
      setUploadError('Upload failed. Please try again.')
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]
    if (!file) return

    await uploadFile(file)
    event.target.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    if (!slug.trim()) {
      setError('Slug is required')
      return
    }

    setLoading(true)

    const payload = {
      name: name.trim(),
      slug: slug.trim() || createSlug(name),
      description: description.trim(),
      image: mediaUrl.trim(),
      order: Number(order) || 0,
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

  const previewSource = pendingPreview || mediaUrl
  const previewIsVideo = previewSource ? isVideoUrl(previewSource) : false

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {(error || uploadError) && (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error || uploadError}
        </div>
      )}

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
        <label className="mb-2 block text-sm text-zinc-400">Media</label>
        <p className="mb-3 text-xs text-zinc-500">
          Upload an image or video for this collection. Maximum 10MB for images, 50MB for videos.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:border-zinc-500 disabled:opacity-50"
          >
            📷 Take Photo
          </button>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:border-zinc-500 disabled:opacity-50"
          >
            🖼️ Choose from Gallery
          </button>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept={ACCEPTED_MEDIA}
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept={ACCEPTED_MEDIA}
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="mt-4 rounded-3xl border border-zinc-700 bg-zinc-900 overflow-hidden">
          {previewSource ? (
            previewIsVideo ? (
              <video
                controls
                src={previewSource}
                className="h-72 w-full bg-black object-cover"
              />
            ) : (
              <img
                src={previewSource}
                alt="Collection preview"
                className="h-72 w-full object-cover"
              />
            )
          ) : (
            <div className="flex h-72 items-center justify-center bg-zinc-950 px-4 text-sm text-zinc-500">
              No media selected yet
            </div>
          )}
        </div>

        {uploading ? (
          <div className="mt-3 rounded-2xl bg-zinc-800 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-700">
              <div
                className="h-full bg-white transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">Order</label>
        <input
          type="number"
          min={0}
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none"
        />
        <p className="mt-1 text-xs text-zinc-500">Higher order values appear first in the admin list.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={loading || uploading}
          className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? 'Saving…' : isEdit ? 'Update collection' : 'Create collection'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/collections')}
          className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
