'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from './CartProvider'

export default function StoreHeader() {
  const pathname = usePathname()
  const { itemCount, openCartDrawer } = useCart()
  const shopActive = pathname === '/' || pathname.startsWith('/products')
  const cartActive =
    pathname.startsWith('/cart') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/order-confirmation')

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
      className="sticky top-0 z-50 border-b border-[#b8976a]/55 bg-[#f5f2ed]/90 backdrop-blur-md backdrop-saturate-150"
    >
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-playfair),serif] text-xl font-semibold tracking-[0.2em] text-[#0f0e0d] sm:text-2xl"
        >
          FASHION<span className="text-[#b8976a]">NOVA</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className={`px-4 py-2 text-sm font-medium tracking-wide transition ${
              shopActive
                ? 'text-[#b8976a]'
                : 'text-[#7a7068] hover:text-[#b8976a]'
            }`}
          >
            Collection
          </Link>
          <Link
            href="/cart"
            className={`hidden px-4 py-2 text-sm font-medium tracking-wide transition sm:inline-block ${
              cartActive ? 'text-[#b8976a]' : 'text-[#7a7068] hover:text-[#b8976a]'
            }`}
          >
            Cart
          </Link>
          <button
            type="button"
            onClick={openCartDrawer}
            className="relative flex h-11 w-11 items-center justify-center rounded-none border border-[#0f0e0d]/55 text-[#0f0e0d] transition hover:border-[#b8976a] hover:text-[#b8976a]"
            aria-label="Open shopping bag"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.25}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {itemCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-none bg-[#b8976a] px-1 text-[10px] font-bold text-[#0f0e0d]">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            ) : null}
          </button>
        </nav>
      </div>
    </motion.header>
  )
}
