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
    <div className="bg-[var(--cream)] px-4 py-14 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--gold)]">Your selection</p>
          <h1 className="mt-4 font-[family-name:var(--font-cormorant),serif] text-4xl font-semibold text-[var(--ink)] sm:text-5xl">
            Shopping bag
          </h1>
        </motion.div>

        {lines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--white)] p-16 text-center shadow-[0_30px_70px_rgba(15,14,13,0.08)]"
          >
            <p className="text-[var(--muted)]">Your bag is empty.</p>
            <Link
              href="/"
              className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-none border border-[var(--gold)] bg-[var(--ink)] px-10 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--cream)] transition hover:bg-[var(--gold)]"
            >
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
                  className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--white)] p-6 shadow-[0_24px_50px_rgba(15,14,13,0.08)]"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <Link href={`/products/${line.productId}`} className="shrink-0">
                      <ProductImage
                        src={line.image}
                        alt={line.name}
                        className="h-32 w-28 rounded-[1rem] border border-[var(--border)] object-cover sm:h-36 sm:w-32"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${line.productId}`}
                        className="text-lg font-[family-name:var(--font-cormorant),serif] font-medium text-[var(--ink)] transition hover:text-[var(--gold)]"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {line.size} · {line.color}
                      </p>
                      <p className="mt-3 text-sm text-[var(--gold)]">EGP {line.price.toLocaleString()} each</p>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label="Decrease"
                            className="flex h-10 w-10 items-center justify-center rounded-none border border-[var(--border)] text-[var(--ink)] transition hover:border-[var(--gold)]"
                            onClick={() =>
                              setQuantity(line.productId, line.size, line.color, line.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span className="w-9 text-center text-sm font-medium text-[var(--ink)]">{line.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase"
                            className="flex h-10 w-10 items-center justify-center rounded-none border border-[var(--border)] text-[var(--ink)] transition hover:border-[var(--gold)]"
                            onClick={() =>
                              setQuantity(line.productId, line.size, line.color, line.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLine(line.productId, line.size, line.color)}
                          className="text-sm uppercase tracking-[0.2em] text-[var(--muted)] transition hover:text-[var(--ink)]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-end text-right">
                      <p className="text-base font-semibold text-[var(--gold)]">
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
              className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--white)] p-8 shadow-[0_24px_60px_rgba(15,14,13,0.08)]"
            >
              <h2 className="font-[family-name:var(--font-cormorant),serif] text-xl font-semibold text-[var(--ink)]">
                Summary
              </h2>
              <div className="mt-6 flex justify-between text-sm text-[var(--muted)]">
                <span>Subtotal</span>
                <span className="font-semibold text-[var(--gold)]">EGP {subtotal.toLocaleString()}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                Deposit + balance on delivery — see checkout for details.
              </p>
              <Link
                href="/checkout"
                className="mt-8 inline-flex w-full items-center justify-center rounded-none border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 uppercase tracking-[0.22em] text-[var(--cream)] transition hover:bg-[var(--gold)]"
              >
                Checkout
              </Link>
              <Link
                href="/"
                className="mt-4 block text-center text-sm text-[var(--muted)] transition hover:text-[var(--ink)]"
              >
                Continue shopping
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
