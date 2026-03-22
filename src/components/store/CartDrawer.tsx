'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect } from 'react'
import ProductImage from './ProductImage'
import { useCart } from './CartProvider'

export default function CartDrawer() {
  const {
    cartDrawerOpen,
    closeCartDrawer,
    lines,
    subtotal,
    itemCount,
    setQuantity,
    removeLine,
  } = useCart()

  useEffect(() => {
    if (!cartDrawerOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCartDrawer()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [cartDrawerOpen, closeCartDrawer])

  return (
    <AnimatePresence>
      {cartDrawerOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCartDrawer}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-zinc-800/80 bg-zinc-950 shadow-2xl shadow-black/50"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-5">
              <h2
                id="cart-drawer-title"
                className="font-[family-name:var(--font-playfair),serif] text-xl font-semibold tracking-wide text-white"
              >
                Your bag
                {itemCount > 0 ? (
                  <span className="ml-2 text-sm font-normal text-zinc-500">({itemCount})</span>
                ) : null}
              </h2>
              <button
                type="button"
                onClick={closeCartDrawer}
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
              {lines.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                  <p className="text-zinc-500">Your bag is empty</p>
                  <button
                    type="button"
                    onClick={closeCartDrawer}
                    className="mt-6 text-sm text-[#D4AF37] transition hover:text-[#e5c04a]"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <>
                  <ul className="flex-1 overflow-y-auto px-4 py-4">
                    {lines.map((line) => (
                      <li
                        key={`${line.productId}-${line.size}-${line.color}`}
                        className="flex gap-3 border-b border-zinc-800/60 py-4 last:border-0"
                      >
                        <Link
                          href={`/products/${line.productId}`}
                          onClick={closeCartDrawer}
                          className="shrink-0"
                        >
                          <ProductImage
                            src={line.image}
                            alt={line.name}
                            className="h-20 w-16 rounded-lg"
                          />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/products/${line.productId}`}
                            onClick={closeCartDrawer}
                            className="font-medium text-white hover:text-[#D4AF37]"
                          >
                            {line.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            {line.size} · {line.color}
                          </p>
                          <p className="mt-1 text-sm text-[#D4AF37]">
                            EGP {line.price.toLocaleString()}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded border border-zinc-700 text-zinc-300 hover:border-[#D4AF37]/50 hover:text-white"
                              onClick={() =>
                                setQuantity(
                                  line.productId,
                                  line.size,
                                  line.color,
                                  line.quantity - 1
                                )
                              }
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm">{line.quantity}</span>
                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded border border-zinc-700 text-zinc-300 hover:border-[#D4AF37]/50 hover:text-white"
                              onClick={() =>
                                setQuantity(
                                  line.productId,
                                  line.size,
                                  line.color,
                                  line.quantity + 1
                                )
                              }
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                removeLine(line.productId, line.size, line.color)
                              }
                              className="ml-auto text-xs text-red-400/90 hover:text-red-400"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-zinc-800/80 bg-zinc-900/50 px-6 py-6">
                    <div className="flex justify-between text-sm text-zinc-400">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#D4AF37]">
                        EGP {subtotal.toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-zinc-600">Cash on delivery at checkout.</p>
                    <Link
                      href="/checkout"
                      onClick={closeCartDrawer}
                      className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#D4AF37] py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-[#e5c04a]"
                    >
                      Checkout
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeCartDrawer}
                      className="mt-3 block text-center text-sm text-zinc-500 transition hover:text-[#D4AF37]"
                    >
                      View full cart
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
