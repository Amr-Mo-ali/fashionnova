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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8728A]">Your selection</p>
        <h1 className="mt-4 font-[family-name:var(--font-playfair),serif] text-4xl font-medium leading-tight text-[#FAF6F1] md:text-5xl">
          Shopping bag
        </h1>
      </motion.div>

      {lines.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-12 rounded-2xl border border-[#3D252F]/80 bg-[#23151c]/40 p-16 text-center"
        >
          <p className="text-[#8C6070]">Your bag is empty.</p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#C8728A]/70 px-10 py-3 text-sm font-semibold uppercase tracking-wider text-[#C8728A] transition hover:bg-[#C8728A]/15"
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
                className="flex gap-5 rounded-2xl border border-[#3D252F]/80 bg-[#23151c]/30 p-5 shadow-lg shadow-black/20"
              >
                <Link href={`/products/${line.productId}`} className="shrink-0">
                  <ProductImage
                    src={line.image}
                    alt={line.name}
                    className="h-32 w-28 rounded-xl border border-[#3D252F]/60 sm:h-36 sm:w-32"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${line.productId}`}
                    className="font-[family-name:var(--font-playfair),serif] text-lg font-medium text-[#FAF6F1] transition hover:text-[#C8728A]"
                  >
                    {line.name}
                  </Link>
                  <p className="mt-1 text-sm text-[#8C6070]">
                    {line.size} · {line.color}
                  </p>
                  <p className="mt-2 text-sm text-[#C8728A]">EGP {line.price.toLocaleString()} each</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Decrease"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3D252F] text-[#FAF6F1] transition hover:border-[#C8728A]/50"
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
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3D252F] text-[#FAF6F1] transition hover:border-[#C8728A]/50"
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
                  <p className="font-semibold text-[#C8728A]">
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
            className="h-fit rounded-2xl border border-[#3D252F]/80 bg-[#23151c]/50 p-8 lg:sticky lg:top-28"
          >
            <h2 className="font-[family-name:var(--font-playfair),serif] text-xl font-medium text-[#FAF6F1]">
              Summary
            </h2>
            <div className="mt-6 flex justify-between text-sm text-[#8C6070]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#C8728A]">EGP {subtotal.toLocaleString()}</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#8C6070]">
              Deposit + balance on delivery — see checkout for details.
            </p>
            <Link
              href="/checkout"
              className="mt-8 flex min-h-[52px] w-full items-center justify-center rounded-full border-2 border-[#C8728A] bg-transparent py-3.5 text-sm font-semibold uppercase tracking-wider text-[#C8728A] transition hover:bg-[#C8728A]/15"
            >
              Checkout
            </Link>
            <Link
              href="/"
              className="mt-4 block text-center text-sm text-[#8C6070] transition hover:text-[#C8728A]"
            >
              Continue shopping
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  )
}
