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
    <div className="bg-[#09090B] px-4 py-14 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8B5CF6]">Your selection</p>
          <h1 className="mt-4 font-[family-name:var(--font-outfit),sans-serif] text-4xl font-black text-[#FAFAFA] sm:text-5xl">
            Shopping bag
          </h1>
        </motion.div>

        {lines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[calc(100vh-18rem)] flex flex-col items-center justify-center rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#111113] p-16 text-center shadow-[0_30px_70px_rgba(0,0,0,0.3)]"
          >
            <span className="mb-4 text-[40px]">👜</span>
            <p className="text-base text-[rgba(250,250,250,0.6)]">Your bag is empty.</p>
            <Link href="/" className="btn-primary mt-8">
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
                  className="rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#111113] p-6 shadow-[0_24px_50px_rgba(0,0,0,0.3)]"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <Link href={`/products/${line.productId}`} className="shrink-0">
                      <ProductImage
                        src={line.image}
                        alt={line.name}
                        className="h-32 w-28 rounded-[4px] border border-[rgba(255,255,255,0.08)] object-cover sm:h-36 sm:w-32"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${line.productId}`}
                        className="text-lg font-[family-name:var(--font-outfit),sans-serif] font-bold text-[#FAFAFA] transition hover:text-[#8B5CF6]"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-1 text-sm text-[rgba(250,250,250,0.6)]">
                        {line.size} · {line.color}
                      </p>
                      <p className="mt-3 text-sm text-[rgba(250,250,250,0.6)]">EGP {line.price.toLocaleString()} each</p>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label="Decrease"
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.15)] text-[#FAFAFA] transition hover:border-[#8B5CF6]"
                            onClick={() =>
                              setQuantity(line.productId, line.size, line.color, line.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span className="w-9 text-center text-sm font-medium text-[#FAFAFA]">{line.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase"
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.15)] text-[#FAFAFA] transition hover:border-[#8B5CF6]"
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
                          className="text-sm font-bold uppercase tracking-[0.08em] text-[rgba(250,250,250,0.6)] transition hover:text-[#FAFAFA]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-end text-right">
                      <p className="text-base font-bold text-[#8B5CF6]">
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
              className="rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#111113] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
            >
              <h2 className="font-[family-name:var(--font-outfit),sans-serif] text-xl font-bold text-[#FAFAFA]">
                Summary
              </h2>
              <div className="mt-6 flex justify-between text-sm text-[rgba(250,250,250,0.6)]">
                <span>Subtotal</span>
                <span className="font-bold text-[#8B5CF6]">EGP {subtotal.toLocaleString()}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[rgba(250,250,250,0.6)]">
                Deposit + balance on delivery — see checkout for details.
              </p>
              <Link
                href="/checkout"
                className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-[#8B5CF6] px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#FAFAFA] transition hover:filter hover:brightness-110"
              >
                Checkout
              </Link>
              <Link
                href="/"
                className="mt-4 block text-center text-sm text-[rgba(250,250,250,0.6)] transition hover:text-[#FAFAFA]"
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
