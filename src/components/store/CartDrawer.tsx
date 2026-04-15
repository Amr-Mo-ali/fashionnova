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
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-[#b8976a] border-opacity-20 bg-[#f5f2ed] shadow-2xl shadow-black/50"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="flex items-center justify-between border-b border-[#b8976a] border-opacity-20 px-6 py-5">
              <h2
                id="cart-drawer-title"
                className="font-serif text-xl font-bold tracking-wide text-[#0f0e0d]"
              >
                Your bag
                {itemCount > 0 ? (
                  <span className="ml-2 text-sm font-normal text-[#7a7068]">({itemCount})</span>
                ) : null}
              </h2>
              <button
                type="button"
                onClick={closeCartDrawer}
                className="rounded-lg p-2 text-[#7a7068] transition hover:bg-[#e8e0d4] hover:text-[#0f0e0d]"
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
                  <p className="text-[#7a7068]">Your bag is empty</p>
                  <button
                    type="button"
                    onClick={closeCartDrawer}
                    className="mt-6 text-sm text-[#b8976a] transition hover:text-[#0f0e0d]"
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
                        className="flex gap-3 border-b border-[#b8976a] border-opacity-10 py-4 last:border-0"
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
                            className="font-medium text-[#0f0e0d] hover:text-[#b8976a]"
                          >
                            {line.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-[#7a7068]">
                            {line.size} · {line.color}
                          </p>
                          <p className="mt-1 text-sm text-[#b8976a]">
                            EGP {line.price.toLocaleString()}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded border border-[#b8976a] border-opacity-30 text-[#7a7068] hover:border-[#b8976a] hover:text-[#0f0e0d]"
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
                            <span className="w-6 text-center text-sm text-[#0f0e0d]">{line.quantity}</span>
                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded border border-[#b8976a] border-opacity-30 text-[#7a7068] hover:border-[#b8976a] hover:text-[#0f0e0d]"
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
                              className="ml-auto text-xs text-[#7a7068] hover:text-[#0f0e0d]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-[#b8976a] border-opacity-20 bg-[#e8e0d4] bg-opacity-30 px-6 py-6">
                    <div className="flex justify-between text-sm text-[#7a7068]">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#b8976a]">
                        EGP {subtotal.toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#7a7068]">
                      Send the deposit before placing your order; balance on delivery.
                    </p>
                    <Link
                      href="/checkout"
                      onClick={closeCartDrawer}
                      className="mt-4 flex min-h-[48px] w-full items-center justify-center border-2 border-[#0f0e0d] bg-[#0f0e0d] py-3 text-sm font-bold uppercase tracking-wider text-[#f5f2ed] transition hover:bg-[#b8976a] hover:border-[#b8976a] hover:text-[#0f0e0d]"
                    >
                      Checkout
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeCartDrawer}
                      className="mt-3 block text-center text-sm text-[#7a7068] transition hover:text-[#b8976a]"
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
