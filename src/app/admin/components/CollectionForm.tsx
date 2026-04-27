'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Collection } from '@prisma/client'
import { createSlug } from '@/lib/collection-payload'

const ACCEPTED_MEDIA = 'image/*,video/*'
const VIDEO_PATTERN = /\.(mp4|mov|webm)(\?|$)/i

function isVideoUrl(url: string) {
  return VIDEO_PATTERN.test(url)
}

type CollectionFormProps = {
  collection?: Collection
}

type UploadState = {
  loading: boolean
  progress: number
  error: string
}

const initialUploadState: UploadState = {
  loading: false,
  progress: 0,
  error: '',
}

export default function CollectionForm({ collection }: CollectionFormProps) {
  const router = useRouter()
  const isEdit = Boolean(collection)
  const [title, setTitle] = useState(collection?.title ?? '')
  const [slugPreview, setSlugPreview] = useState(collection?.slug ?? '')
  const [description, setDescription] = useState(collection?.description ?? '')
  const [coverImage, setCoverImage] = useState(collection?.coverImage ?? '')
  const [mediaUrl, setMediaUrl] = useState(collection?.mediaUrl ?? '')
  const [mediaType, setMediaType] = useState(collection?.mediaType ?? 'image')
  const [order, setOrder] = useState(String(collection?.order ?? 0))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [coverUpload, setCoverUpload] = useState<UploadState>(initialUploadState)
  const [mediaUpload, setMediaUpload] = useState<UploadState>(initialUploadState)
  const [pendingCoverPreview, setPendingCoverPreview] = useState('')
  const [pendingMediaPreview, setPendingMediaPreview] = useState('')

  const coverInputRef = useRef<HTMLInputElement>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSlugPreview(createSlug(title))
  }, [title])

  useEffect(() => {
    return () => {
      if (pendingCoverPreview) URL.revokeObjectURL(pendingCoverPreview)
      if (pendingMediaPreview) URL.revokeObjectURL(pendingMediaPreview)
    }
  }, [pendingCoverPreview, pendingMediaPreview])

  const coverPreviewSource = pendingCoverPreview || coverImage
  const mediaPreviewSource = pendingMediaPreview || mediaUrl

  async function uploadFile(
    file: File,
    onSuccess: (url: string) => void,
    setUploadState: React.Dispatch<React.SetStateAction<UploadState>>,
    setPreview: React.Dispatch<React.SetStateAction<string>>
  ) {
    setUploadState({ loading: true, progress: 10, error: '' })
    const preview = URL.createObjectURL(file)
    setPreview(preview)

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
        setUploadState({
          loading: false,
          progress: 0,
          error: data.error ?? 'Upload failed',
        })
        return
      }

      onSuccess(data.url)
      setPreview('')
      setUploadState({ loading: false, progress: 100, error: '' })
    } catch {
      setUploadState({
        loading: false,
        progress: 0,
        error: 'Upload failed. Please try again.',
      })
    }
  }

  async function handleCoverUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    await uploadFile(file, setCoverImage, setCoverUpload, setPendingCoverPreview)
    event.target.value = ''
  }

  async function handleMediaUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    await uploadFile(file, setMediaUrl, setMediaUpload, setPendingMediaPreview)
    if (file.type.startsWith('video/')) {
      setMediaType('video')
    } else if (file.type.startsWith('image/')) {
      setMediaType('image')
    }
    event.target.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required.')
      return
    }

    setLoading(true)

    const payload = {
      title: title.trim(),
      description: description.trim(),
      coverImage: coverImage.trim(),
      mediaUrl: mediaUrl.trim(),
      mediaType,
      order: Number(order) || 0,
    }

    try {
      const url = isEdit ? `/api/collections/${collection!.slug}` : '/api/collections'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = (await res.json().catch(() => ({}))) as { error?: string; slug?: string }

      if (!res.ok) {
        setError(data.error ?? 'Failed to save collection.')
        setLoading(false)
        return
      }

      router.push(isEdit ? `/admin/collections/${data.slug ?? slugPreview}` : '/admin/collections')
      router.refresh()
    } catch {
      setError('Failed to save collection.')
      setLoading(false)
      return
    }

    setLoading(false)
  }

  const mediaIsVideo = useMemo(
    () => (mediaPreviewSource ? isVideoUrl(mediaPreviewSource) || mediaType === 'video' : mediaType === 'video'),
    [mediaPreviewSource, mediaType]
  )

  function renderUploadProgress(state: UploadState) {
    if (!state.loading && !state.error && state.progress !== 100) return null

    return (
      <div className="mt-3 rounded-2xl bg-zinc-800 p-3">
        {state.error ? (
          <p className="text-sm text-red-400">{state.error}</p>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
              <span>Uploading...</span>
              <span>{state.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-700">
              <div className="h-full bg-white transition-all" style={{ width: `${state.progress}%` }} />
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error ? (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Slug preview</label>
            <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
              /collections/{slugPreview || 'collection-slug'}
            </div>
            <p className="mt-1 text-xs text-zinc-500">Slug is auto-generated from the title and kept unique by the API.</p>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Media type</label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
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
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Cover image</label>
            <p className="mb-3 text-xs text-zinc-500">Used for storefront collection pages and admin cards.</p>
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={coverUpload.loading}
              className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:border-zinc-500 disabled:opacity-50"
            >
              Upload cover image
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverUpload}
            />

            <div className="mt-4 overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-950">
              {coverPreviewSource ? (
                <img src={coverPreviewSource} alt="Collection cover preview" className="h-72 w-full object-cover" />
              ) : (
                <div className="flex h-72 items-center justify-center px-4 text-sm text-zinc-500">
                  No cover image selected yet
                </div>
              )}
            </div>
            {renderUploadProgress(coverUpload)}
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Homepage media</label>
            <p className="mb-3 text-xs text-zinc-500">Displayed on the homepage collection card. Supports image or video.</p>
            <button
              type="button"
              onClick={() => mediaInputRef.current?.click()}
              disabled={mediaUpload.loading}
              className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:border-zinc-500 disabled:opacity-50"
            >
              Upload homepage media
            </button>
            <input
              ref={mediaInputRef}
              type="file"
              accept={ACCEPTED_MEDIA}
              className="hidden"
              onChange={handleMediaUpload}
            />

            <div className="mt-4 overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-950">
              {mediaPreviewSource ? (
                mediaIsVideo ? (
                  <video controls src={mediaPreviewSource} className="h-72 w-full bg-black object-cover" />
                ) : (
                  <img src={mediaPreviewSource} alt="Collection homepage media preview" className="h-72 w-full object-cover" />
                )
              ) : (
                <div className="flex h-72 items-center justify-center px-4 text-sm text-zinc-500">
                  No homepage media selected yet
                </div>
              )}
            </div>
            {renderUploadProgress(mediaUpload)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={loading || coverUpload.loading || mediaUpload.loading}
          className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEdit ? 'Update collection' : 'Create collection'}
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
