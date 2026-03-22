'use client'

import type { OrderStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]

const statusClass: Record<OrderStatus, string> = {
  PENDING: 'border-zinc-600 bg-zinc-800 text-yellow-400',
  CONFIRMED: 'border-zinc-600 bg-zinc-800 text-blue-400',
  SHIPPED: 'border-zinc-600 bg-zinc-800 text-cyan-400',
  DELIVERED: 'border-zinc-600 bg-zinc-800 text-green-400',
  CANCELLED: 'border-zinc-600 bg-zinc-800 text-red-400',
}

export default function OrderStatusSelect({
  orderId,
  current,
}: {
  orderId: string
  current: OrderStatus
}) {
  const router = useRouter()
  const [value, setValue] = useState<OrderStatus>(current)
  const [loading, setLoading] = useState(false)

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as OrderStatus
    const prev = value
    setValue(next)
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        alert(data.error ?? 'Update failed')
        setValue(prev)
      } else {
        router.refresh()
      }
    } catch {
      alert('Update failed')
      setValue(prev)
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={loading}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 ${statusClass[value]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-zinc-900 text-white">
          {s}
        </option>
      ))}
    </select>
  )
}
