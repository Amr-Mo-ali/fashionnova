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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Your selection</p>
        <h1 className="mt-3 font-[family-name:var(--font-playfair),serif] text-4xl font-medium text-white">
          Shopping bag
        </h1>
      </motion.div>

      {lines.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-12 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-16 text-center"
        >
          <p className="text-zinc-500">Your bag is empty.</p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#D4AF37] transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/20"
          >
            Continue shopping
          </Link>
        </motion.div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          <ul className="space-y-4 lg:col-span-2">
            {lines.map((line, index) => (
              <motion.li
                key={`${line.productId}-${line.size}-${line.color}`}
                custom={index}
                variants={listItem}
                initial="hidden"
                animate="show"
                className="flex gap-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5 shadow-lg shadow-black/20"
              >
                <Link href={`/products/${line.productId}`} className="shrink-0">
                  <ProductImage
                    src={line.image}
                    alt={line.name}
                    className="h-32 w-28 rounded-xl border border-zinc-800/60 sm:h-36 sm:w-32"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${line.productId}`}
                    className="font-[family-name:var(--font-playfair),serif] text-lg font-medium text-white transition hover:text-[#D4AF37]"
                  >
                    {line.name}
                  </Link>
                  <p className="mt-1 text-sm text-zinc-500">
                    {line.size} · {line.color}
                  </p>
                  <p className="mt-2 text-sm text-[#D4AF37]">EGP {line.price.toLocaleString()} each</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Decrease"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-white transition hover:border-[#D4AF37]/50"
                        onClick={() =>
                          setQuantity(line.productId, line.size, line.color, line.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{line.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-white transition hover:border-[#D4AF37]/50"
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
                      className="text-sm text-red-400/90 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold text-[#D4AF37]">
                    EGP {(line.price * line.quantity).toLocaleString()}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="h-fit rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-8 lg:sticky lg:top-28"
          >
            <h2 className="font-[family-name:var(--font-playfair),serif] text-xl font-medium text-white">
              Summary
            </h2>
            <div className="mt-6 flex justify-between text-sm text-zinc-400">
              <span>Subtotal</span>
              <span className="font-semibold text-[#D4AF37]">EGP {subtotal.toLocaleString()}</span>
            </div>
            <p className="mt-3 text-xs text-zinc-600">Cash on delivery at checkout.</p>
            <Link
              href="/checkout"
              className="mt-8 flex w-full items-center justify-center rounded-full bg-[#D4AF37] py-4 text-sm font-semibold uppercase tracking-wider text-zinc-950 transition hover:bg-[#e5c04a]"
            >
              Checkout
            </Link>
            <Link
              href="/"
              className="mt-4 block text-center text-sm text-zinc-500 transition hover:text-[#D4AF37]"
            >
              Continue shopping
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  )
}
