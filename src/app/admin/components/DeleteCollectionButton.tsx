'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteCollectionButton({
  collectionId,
  collectionName,
}: {
  collectionId: string
  collectionName: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete “${collectionName}”? This cannot be undone.`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/collections/${collectionId}`, { method: 'DELETE' })
      if (!res.ok) {
        let msg = 'Delete failed'
        try {
          const data = (await res.json()) as { error?: string }
          if (data.error) msg = data.error
        } catch {
          /* no body */
        }
        alert(msg)
        setLoading(false)
        return
      }
      router.refresh()
    } catch {
      alert('Delete failed')
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
    >
      {loading ? '…' : 'Delete'}
    </button>
  )
}
