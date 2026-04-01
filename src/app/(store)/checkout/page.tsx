'use client'

import { useCart } from '@/components/store/CartProvider'
import { computeDepositFromUnitPrices } from '@/lib/order-deposit'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

const PAYMENT_NUMBER = '01024888895'

export default function CheckoutPage() {
  const router = useRouter()
  const { lines, subtotal, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [depositConfirmed, setDepositConfirmed] = useState(false)

  const depositAmount = useMemo(
    () => computeDepositFromUnitPrices(lines.map((l) => l.price)),
    [lines]
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (lines.length === 0) {
      setError('Your cart is empty.')
      return
    }
    if (!depositConfirmed) {
      setError('Please confirm you have sent the deposit before placing your order.')
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
          className="rounded-2xl border border-[#3D252F]/80 bg-[#23151c]/40 p-16 text-center"
        >
          <h1 className="font-[family-name:var(--font-playfair),serif] text-3xl text-[#FAF6F1]">
            Checkout
          </h1>
          <p className="mt-4 text-[#8C6070]">Your cart is empty.</p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#C8728A]/70 px-10 py-3 text-sm font-semibold uppercase tracking-wider text-[#C8728A] transition hover:bg-[#C8728A]/15"
          >
            Back to collection
          </Link>
        </motion.div>
      </div>
    )
  }

  const depositLabel = depositAmount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8728A]">Secure</p>
        <h1 className="mt-4 font-[family-name:var(--font-playfair),serif] text-4xl font-medium leading-tight text-[#FAF6F1] md:text-5xl">
          Checkout
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#8C6070]">
          A required <span className="text-[#C8728A]">10% deposit</span> is based on your
          highest-priced item. The balance is <span className="text-[#C9A9B4]">cash on delivery</span>.
        </p>

        <div className="mt-8 flex flex-col gap-2">
          <div className="text-xs uppercase tracking-[0.35em] text-[#7a7068]">Checkout</div>
          <div className="grid grid-cols-3 gap-3 text-[11px] uppercase tracking-[0.25em] text-[#7a7068]">
            <span className="rounded-none border-b-2 border-[var(--gold)] pb-3 text-[var(--ink)]">Info</span>
            <span className="rounded-none border-b border-[var(--border)] pb-3">Payment</span>
            <span className="rounded-none border-b border-[var(--border)] pb-3">Confirm</span>
          </div>
        </div>
      </motion.div>

      <div className="mt-14 grid gap-14">
        <motion.form
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          onSubmit={handleSubmit}
          className="space-y-8 lg:col-span-3"
        >
          {error ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          <div className="space-y-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C6070]">
              Delivery details
            </h2>
            <div>
              <label htmlFor="name" className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-[#8C6070]">
                Full name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border-0 border-b border-[#3D252F]/40 bg-transparent py-3 text-base text-[#0f0e0d] outline-none transition focus:border-[var(--gold)]"
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-[#8C6070]">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full border-0 border-b border-[#3D252F]/40 bg-transparent py-3 text-base text-[#0f0e0d] outline-none transition focus:border-[var(--gold)]"
              />
            </div>
            <div>
              <label htmlFor="address" className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-[#8C6070]">
                Delivery address
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={4}
                className="w-full border-0 border-b border-[#3D252F]/40 bg-transparent py-3 text-base text-[#0f0e0d] outline-none transition focus:border-[var(--gold)]"
              />
            </div>
          </div>

          <div className="space-y-5 border-t border-[#3D252F]/80 pt-10">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C6070]">
              Payment deposit
            </h2>
            <p className="text-sm font-medium text-[#C9A9B4]">
              Please send the deposit BEFORE placing your order.
            </p>
            <p className="text-sm leading-relaxed text-[#8C6070]">
              Transfer <span className="font-semibold text-[#FAF6F1]">10%</span> of your most expensive
              item&apos;s unit price using one of the methods below.
            </p>
            <div className="rounded-2xl border border-[#C8728A]/35 bg-[#C8728A]/10 px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-[#8C6070]">
                Deposit required
              </p>
              <p className="mt-2 font-[family-name:var(--font-playfair),serif] text-2xl text-[#C8728A]">
                EGP {depositLabel}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-4 rounded-xl border border-[#3D252F]/90 bg-[#23151c]/40 p-4">
                <span className="text-2xl" aria-hidden>
                  📱
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#FAF6F1]">Vodafone Cash</p>
                  <p className="mt-1 font-mono text-sm text-[#C8728A]">{PAYMENT_NUMBER}</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl border border-[#3D252F]/90 bg-[#23151c]/40 p-4">
                <span className="text-2xl" aria-hidden>
                  💳
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#FAF6F1]">Instapay</p>
                  <p className="mt-1 font-mono text-sm text-[#C8728A]">{PAYMENT_NUMBER}</p>
                </div>
              </div>
            </div>

            <label className="flex min-h-[48px] cursor-pointer items-start gap-3 rounded-xl border border-[#3D252F] bg-[#23151c]/30 p-4 transition hover:border-[#C8728A]/30">
              <input
                type="checkbox"
                checked={depositConfirmed}
                onChange={(e) => setDepositConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-[#3D252F] text-[#C8728A] focus:ring-[#C8728A]/40"
              />
              <span className="text-sm leading-snug text-[#C9A9B4]">
                I confirm I have sent the deposit of EGP {depositLabel}
              </span>
            </label>
          </div>

          <motion.button
            type="submit"
            disabled={loading || !depositConfirmed}
            whileHover={loading || !depositConfirmed ? undefined : { scale: 1.01 }}
            whileTap={loading || !depositConfirmed ? undefined : { scale: 0.99 }}
            className="w-full min-h-[52px] rounded-full border-2 border-[#C8728A] bg-transparent py-4 text-sm font-semibold uppercase tracking-wider text-[#C8728A] transition hover:bg-[#C8728A]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8728A] disabled:cursor-not-allowed disabled:border-[#3D252F] disabled:text-[#8C6070] lg:max-w-sm"
          >
            {loading ? 'Placing order…' : 'Place order'}
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="h-fit rounded-2xl border border-[#3D252F]/80 bg-[#23151c]/50 p-8 lg:col-span-2 lg:sticky lg:top-28"
        >
          <h2 className="font-[family-name:var(--font-playfair),serif] text-xl font-medium text-[#FAF6F1]">
            Order summary
          </h2>
          <ul className="mt-8 space-y-4 border-b border-[#3D252F]/80 pb-8">
            {lines.map((l) => (
              <li key={`${l.productId}-${l.size}-${l.color}`} className="flex justify-between gap-4 text-sm">
                <span className="text-[#8C6070]">
                  {l.name} × {l.quantity}
                </span>
                <span className="shrink-0 text-[#C8728A]">EGP {(l.price * l.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex justify-between font-[family-name:var(--font-playfair),serif] text-lg text-[#FAF6F1]">
            <span>Total</span>
            <span className="text-[#C8728A]">EGP {subtotal.toLocaleString()}</span>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-[#8C6070]">
            Balance due in cash when your order arrives, after your deposit is received.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
