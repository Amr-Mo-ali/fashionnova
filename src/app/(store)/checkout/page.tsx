'use client'

import { useCart } from '@/components/store/CartProvider'
import { computeDepositFromUnitPrices } from '@/lib/order-deposit'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

const PAYMENT_NUMBER = '01024888895'

type FieldErrors = {
  name?: string
  phone?: string
  address?: string
  depositConfirmed?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { lines, subtotal, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [depositConfirmed, setDepositConfirmed] = useState(false)

  const depositAmount = useMemo(
    () => computeDepositFromUnitPrices(lines.map((l) => l.price)),
    [lines]
  )

  const depositLabel = depositAmount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const nextErrors: FieldErrors = {}

    if (!name.trim()) nextErrors.name = 'Enter the full name for delivery.'
    if (!phone.trim()) nextErrors.phone = 'Enter a phone number we can reach.'
    if (!address.trim()) nextErrors.address = 'Enter the delivery address.'
    if (!depositConfirmed) {
      nextErrors.depositConfirmed = 'Confirm the deposit after you send it.'
    }

    if (lines.length === 0) {
      setError('Your cart is empty.')
      return
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      setError('Please review the highlighted checkout fields.')
      return
    }

    setFieldErrors({})
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
        setError(data.error ?? 'Could not place order.')
        return
      }

      if (!data.id) {
        setError('Order created, but confirmation failed. Please contact support.')
        return
      }

      clearCart()
      router.push(`/order-confirmation/${data.id}`)
      router.refresh()
    } catch {
      setError('Something went wrong while placing your order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 md:py-24">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="dramatic-card p-16 text-center">
          <h1 className="font-serif text-[42px] font-[900] text-[#0f0e0d]">Checkout</h1>
          <p className="mt-4 text-[#7a7068]">Your cart is empty.</p>
          <Link href="/" className="btn-secondary mt-8">
            Back to collection
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 md:py-24">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-label text-[#b8976a]">Secure</p>
        <h1 className="mt-4 font-serif text-[42px] leading-none text-[#0f0e0d] sm:text-[56px]">
          <span className="font-[300]">Checkout </span>
          <span className="font-[900]">Flow</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#7a7068]">
          A required <span className="font-[900] text-[#0f0e0d]">10% deposit</span> is based
          on your highest-priced item. The balance is cash on delivery.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.form
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          onSubmit={handleSubmit}
          className="dramatic-card space-y-8 p-6 sm:p-8"
          noValidate
        >
          {error ? (
            <div className="border border-[#dc2626]/35 bg-[#dc2626]/8 px-4 py-3 text-sm text-[#b91c1c]">
              {error}
            </div>
          ) : null}

          <div className="space-y-6">
            <h2 className="text-label text-[#7a7068]">Delivery details</h2>

            <div className={`dramatic-input-wrap ${fieldErrors.name ? 'dramatic-input-error' : ''}`}>
              <label htmlFor="name" className="dramatic-input-label">
                Full name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="dramatic-input"
                placeholder="Recipient name"
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? 'checkout-name-error' : undefined}
              />
              {fieldErrors.name ? (
                <p id="checkout-name-error" className="dramatic-error">
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div className={`dramatic-input-wrap ${fieldErrors.phone ? 'dramatic-input-error' : ''}`}>
              <label htmlFor="phone" className="dramatic-input-label">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="dramatic-input"
                placeholder="01XXXXXXXXX"
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-describedby={fieldErrors.phone ? 'checkout-phone-error' : undefined}
              />
              {fieldErrors.phone ? (
                <p id="checkout-phone-error" className="dramatic-error">
                  {fieldErrors.phone}
                </p>
              ) : null}
            </div>

            <div className={`dramatic-input-wrap ${fieldErrors.address ? 'dramatic-input-error' : ''}`}>
              <label htmlFor="address" className="dramatic-input-label">
                Delivery address
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="dramatic-textarea"
                placeholder="Street, building, floor, area"
                aria-invalid={Boolean(fieldErrors.address)}
                aria-describedby={fieldErrors.address ? 'checkout-address-error' : undefined}
              />
              {fieldErrors.address ? (
                <p id="checkout-address-error" className="dramatic-error">
                  {fieldErrors.address}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-5 border-t border-[rgba(184,151,106,0.2)] pt-8">
            <h2 className="text-label text-[#7a7068]">Payment deposit</h2>
            <p className="text-sm font-[900] text-[#0f0e0d]">
              Please send the deposit before placing your order.
            </p>
            <p className="text-sm leading-7 text-[#7a7068]">
              Transfer <span className="font-[900] text-[#0f0e0d]">10%</span> of your most
              expensive item&apos;s unit price using one of the methods below.
            </p>

            <div className="border border-[rgba(184,151,106,0.28)] bg-[rgba(184,151,106,0.08)] px-5 py-4">
              <p className="text-[11px] font-[900] uppercase tracking-[0.2em] text-[#7a7068]">
                Deposit required
              </p>
              <p className="mt-2 text-[24px] font-[900] text-[#b8976a]">
                EGP {depositLabel}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-[rgba(184,151,106,0.24)] bg-[rgba(184,151,106,0.04)] p-4">
                <p className="text-sm font-[900] text-[#0f0e0d]">Vodafone Cash</p>
                <p className="mt-1 font-mono text-sm text-[#b8976a]">{PAYMENT_NUMBER}</p>
              </div>
              <div className="border border-[rgba(184,151,106,0.24)] bg-[rgba(184,151,106,0.04)] p-4">
                <p className="text-sm font-[900] text-[#0f0e0d]">Instapay</p>
                <p className="mt-1 font-mono text-sm text-[#b8976a]">{PAYMENT_NUMBER}</p>
              </div>
            </div>

            <label className={`flex min-h-[48px] cursor-pointer items-start gap-3 border p-4 transition ${
              fieldErrors.depositConfirmed
                ? 'border-[#dc2626]/35 bg-[#dc2626]/8'
                : 'border-[rgba(184,151,106,0.24)] bg-[rgba(184,151,106,0.04)] hover:border-[#b8976a]'
            }`}>
              <input
                type="checkbox"
                checked={depositConfirmed}
                onChange={(e) => setDepositConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#0f0e0d]"
              />
              <span className="text-sm leading-6 text-[#7a7068]">
                I confirm I have sent the deposit of EGP {depositLabel}.
              </span>
            </label>
            {fieldErrors.depositConfirmed ? (
              <p className="dramatic-error">{fieldErrors.depositConfirmed}</p>
            ) : null}
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={loading ? undefined : { scale: 1.01 }}
            whileTap={loading ? undefined : { scale: 0.96 }}
            className="dramatic-button w-full bg-[#0f0e0d] text-[#f5f2ed] hover:bg-[#f5f2ed] hover:text-[#0f0e0d] lg:max-w-sm"
          >
            {loading ? <span className="button-spinner" aria-hidden /> : null}
            <span className={loading ? 'button-label-hidden' : undefined}>
              Place order
            </span>
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="dramatic-card h-fit p-6 sm:p-8 lg:sticky lg:top-28"
        >
          <h2 className="font-serif text-[28px] font-[900] text-[#0f0e0d]">
            Order summary
          </h2>
          <ul className="mt-8 space-y-4 border-b border-[rgba(184,151,106,0.2)] pb-8">
            {lines.map((l) => (
              <li key={`${l.productId}-${l.size}-${l.color}`} className="flex justify-between gap-4 text-sm">
                <span className="text-[#7a7068]">
                  {l.name} × {l.quantity}
                </span>
                <span className="shrink-0 font-[900] text-[#0f0e0d]">
                  EGP {(l.price * l.quantity).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex justify-between text-lg font-[900] text-[#0f0e0d]">
            <span>Total</span>
            <span className="text-[#b8976a]">EGP {subtotal.toLocaleString()}</span>
          </div>
          <p className="mt-6 text-xs leading-6 text-[#7a7068]">
            Balance due in cash when your order arrives, after your deposit is received.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
