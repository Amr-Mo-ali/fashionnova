'use client'

import { useCart } from '@/components/store/CartProvider'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CheckoutPage() {
  const router = useRouter()
  const { lines, subtotal, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (lines.length === 0) {
      setError('Your cart is empty.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          items: lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
            size: l.size,
            color: l.color,
          })),
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string; id?: string }
      if (!res.ok) {
        setError(data.error ?? 'Could not place order')
        return
      }
      if (!data.id) {
        setError('Order created but confirmation failed. Please contact support.')
        return
      }
      clearCart()
      router.push(`/order-confirmation/${data.id}`)
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-16 text-center"
        >
          <h1 className="font-[family-name:var(--font-playfair),serif] text-3xl text-white">
            Checkout
          </h1>
          <p className="mt-4 text-zinc-500">Your cart is empty.</p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#D4AF37] transition hover:border-[#D4AF37]"
          >
            Back to collection
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Secure</p>
        <h1 className="mt-3 font-[family-name:var(--font-playfair),serif] text-4xl font-medium text-white">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Cash on delivery only</p>
      </motion.div>

      <div className="mt-12 grid gap-12 lg:grid-cols-5">
        <motion.form
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          onSubmit={handleSubmit}
          className="space-y-6 lg:col-span-3"
        >
          {error ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          ) : null}

          <div>
            <label htmlFor="name" className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Full name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-3.5 text-white placeholder:text-zinc-600 focus:border-[#D4AF37]/60 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-3.5 text-white focus:border-[#D4AF37]/60 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30"
            />
          </div>
          <div>
            <label htmlFor="address" className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Delivery address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={4}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-3.5 text-white focus:border-[#D4AF37]/60 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={loading ? undefined : { scale: 1.01 }}
            whileTap={loading ? undefined : { scale: 0.99 }}
            className="w-full rounded-full bg-[#D4AF37] py-4 text-sm font-semibold uppercase tracking-wider text-zinc-950 transition hover:bg-[#e5c04a] disabled:opacity-50 lg:max-w-xs"
          >
            {loading ? 'Placing order…' : 'Place order'}
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="h-fit rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-8 lg:col-span-2 lg:sticky lg:top-28"
        >
          <h2 className="font-[family-name:var(--font-playfair),serif] text-xl font-medium text-white">
            Order summary
          </h2>
          <ul className="mt-6 space-y-3 border-b border-zinc-800/80 pb-6">
            {lines.map((l) => (
              <li key={`${l.productId}-${l.size}-${l.color}`} className="flex justify-between text-sm">
                <span className="text-zinc-400">
                  {l.name} × {l.quantity}
                </span>
                <span className="text-[#D4AF37]">EGP {(l.price * l.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between font-[family-name:var(--font-playfair),serif] text-lg text-white">
            <span>Total</span>
            <span className="text-[#D4AF37]">EGP {subtotal.toLocaleString()}</span>
          </div>
          <p className="mt-4 text-xs text-zinc-600">
            You&apos;ll pay in cash when your order is delivered.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
