'use client'

import ProductImage from '@/components/store/ProductImage'
import { useCart } from '@/components/store/CartProvider'
import { motion } from 'framer-motion'
import Link from 'next/link'

const listItem = {
  hidden: { opacity: 0, x: -16 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function CartPage() {
  const { lines, subtotal, setQuantity, removeLine } = useCart()

  return (
    <div className="px-4 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <p className="text-label text-[#b8976a]">Your selection</p>
          <h1 className="mt-4 font-serif text-[42px] leading-none text-[#0f0e0d] sm:text-[56px]">
            <span className="font-[300]">Shopping </span>
            <span className="font-[900]">Bag</span>
          </h1>
        </motion.div>

        {lines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="dramatic-card flex min-h-[calc(100vh-18rem)] flex-col items-center justify-center p-16 text-center"
          >
            <p className="text-base text-[#7a7068]">Your bag is empty.</p>
            <Link href="/" className="btn-secondary mt-8">
              Continue shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.9fr_1fr]">
            <ul className="space-y-6">
              {lines.map((line, index) => (
                <motion.li
                  key={`${line.productId}-${line.size}-${line.color}`}
                  custom={index}
                  variants={listItem}
                  initial="hidden"
                  animate="show"
                  className="dramatic-card p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <Link href={`/products/${line.productId}`} className="shrink-0">
                      <ProductImage
                        src={line.image}
                        alt={line.name}
                        className="aspect-[4/5] w-28 object-cover sm:w-32"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${line.productId}`}
                        className="font-serif text-[24px] font-[900] text-[#0f0e0d] transition hover:text-[#b8976a]"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-2 text-[11px] font-[900] uppercase tracking-[0.2em] text-[#7a7068]">
                        {line.size} · {line.color}
                      </p>
                      <p className="mt-3 text-sm text-[#7a7068]">EGP {line.price.toLocaleString()} each</p>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`Decrease quantity for ${line.name}`}
                            className="flex h-12 w-12 items-center justify-center border border-[rgba(184,151,106,0.24)] text-[#0f0e0d] transition hover:border-[#b8976a]"
                            onClick={() => setQuantity(line.productId, line.size, line.color, line.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="w-9 text-center text-sm font-medium text-[#0f0e0d]">{line.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Increase quantity for ${line.name}`}
                            className="flex h-12 w-12 items-center justify-center border border-[rgba(184,151,106,0.24)] text-[#0f0e0d] transition hover:border-[#b8976a]"
                            onClick={() => setQuantity(line.productId, line.size, line.color, line.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLine(line.productId, line.size, line.color)}
                          className="text-[11px] font-[900] uppercase tracking-[0.2em] text-[#7a7068] transition hover:text-[#0f0e0d]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-end text-right">
                      <p className="text-base font-[900] text-[#b8976a]">
                        EGP {(line.price * line.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="dramatic-card h-fit p-8 lg:sticky lg:top-28"
            >
              <h2 className="font-serif text-[28px] font-[900] text-[#0f0e0d]">
                Summary
              </h2>
              <div className="mt-6 flex justify-between text-sm text-[#7a7068]">
                <span>Subtotal</span>
                <span className="font-[900] text-[#0f0e0d]">EGP {subtotal.toLocaleString()}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#7a7068]">
                Deposit + balance on delivery. Checkout shows the required amount clearly.
              </p>
              <Link href="/checkout" className="dramatic-button mt-8 flex w-full bg-[#0f0e0d] text-[#f5f2ed] hover:bg-[#f5f2ed] hover:text-[#0f0e0d]">
                Checkout
              </Link>
              <Link href="/" className="mt-4 block text-center text-[11px] font-[900] uppercase tracking-[0.2em] text-[#7a7068] transition hover:text-[#0f0e0d]">
                Continue shopping
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
