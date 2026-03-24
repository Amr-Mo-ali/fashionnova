'use client'

import { useCart } from '@/components/store/CartProvider'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

const PAYMENT_NUMBER = '01024888895'

function VodafoneIcon() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600/90 text-xs font-bold text-white">
      V
    </span>
  )
}

function InstapayIcon() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/50 text-[#D4AF37]">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    </span>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { lines, subtotal, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [depositConfirmed, setDepositConfirmed] = useState(false)

  const depositAmount = useMemo(() => {
    if (lines.length === 0) return 0
    const maxUnit = Math.max(...lines.map((l) => l.price))
    return Math.round(maxUnit * 0.1 * 100) / 100
  }, [lines])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (lines.length === 0) {
      setError('Your cart is empty.')
      return
    }
    if (!depositConfirmed) {
      setError('Please confirm you will send the deposit before delivery.')
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
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#D4AF37]/70 px-10 py-3 text-sm font-semibold uppercase tracking-wider text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
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
        <h1 className="mt-4 font-[family-name:var(--font-playfair),serif] text-4xl font-medium leading-tight text-white md:text-5xl">
          Checkout
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-500">
          Send a <span className="text-[#D4AF37]">10% deposit</span> on the highest-priced item in your
          bag before we ship. The rest is <span className="text-zinc-400">cash on delivery</span>.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-14 lg:grid-cols-5">
        <motion.form
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          onSubmit={handleSubmit}
          className="space-y-8 lg:col-span-3"
        >
          {error ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          ) : null}

          <div className="space-y-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Delivery details
            </h2>
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
          </div>

          <div className="space-y-5 border-t border-zinc-800/80 pt-10">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Payment deposit
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              Transfer <span className="font-semibold text-white">10%</span> of your most expensive
              item&apos;s price before we dispatch your order.
            </p>
            <div className="rounded-2xl border border-[#D4AF37]/35 bg-[#D4AF37]/5 px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Deposit required
              </p>
              <p className="mt-2 font-[family-name:var(--font-playfair),serif] text-2xl text-[#D4AF37]">
                EGP {depositAmount.toLocaleString()}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-4 rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-4">
                <VodafoneIcon />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">Vodafone Cash</p>
                  <p className="mt-1 font-mono text-sm text-[#D4AF37]">{PAYMENT_NUMBER}</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-4">
                <InstapayIcon />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">Instapay</p>
                  <p className="mt-1 font-mono text-sm text-[#D4AF37]">{PAYMENT_NUMBER}</p>
                </div>
              </div>
            </div>

            <label className="flex min-h-[48px] cursor-pointer items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 transition hover:border-zinc-700">
              <input
                type="checkbox"
                checked={depositConfirmed}
                onChange={(e) => setDepositConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-600 text-[#D4AF37] focus:ring-[#D4AF37]/40"
              />
              <span className="text-sm leading-snug text-zinc-300">
                I confirm I will send the deposit before delivery
              </span>
            </label>
          </div>

          <motion.button
            type="submit"
            disabled={loading || !depositConfirmed}
            whileHover={loading || !depositConfirmed ? undefined : { scale: 1.01 }}
            whileTap={loading || !depositConfirmed ? undefined : { scale: 0.99 }}
            className="w-full min-h-[52px] rounded-full border-2 border-[#D4AF37] bg-transparent py-4 text-sm font-semibold uppercase tracking-wider text-[#D4AF37] transition hover:bg-[#D4AF37]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-600 lg:max-w-sm"
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
          <ul className="mt-8 space-y-4 border-b border-zinc-800/80 pb-8">
            {lines.map((l) => (
              <li key={`${l.productId}-${l.size}-${l.color}`} className="flex justify-between gap-4 text-sm">
                <span className="text-zinc-400">
                  {l.name} × {l.quantity}
                </span>
                <span className="shrink-0 text-[#D4AF37]">EGP {(l.price * l.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex justify-between font-[family-name:var(--font-playfair),serif] text-lg text-white">
            <span>Total</span>
            <span className="text-[#D4AF37]">EGP {subtotal.toLocaleString()}</span>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-zinc-600">
            Balance due in cash when your order arrives. Deposit must be sent first using the methods
            above.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
