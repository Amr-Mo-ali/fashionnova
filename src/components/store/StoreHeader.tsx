'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from './CartProvider'

const NAV_LINKS = [
  { label: 'Collection', href: '/' },
  { label: 'Cart', href: '/cart' },
]

export default function StoreHeader() {
  const pathname = usePathname()
  const { itemCount, openCartDrawer } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
        className={`fixed inset-x-0 top-0 z-50 border-b border-[var(--gold)]/20 bg-[var(--cream)]/95 backdrop-blur-md transition-all duration-300 ${
          scrolled ? 'py-3 shadow-[0_18px_48px_rgba(15,14,13,0.08)]' : 'py-4'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link
            href="/"
            className="font-[family-name:var(--font-cormorant),serif] text-lg uppercase tracking-[0.28em] text-[var(--ink)] sm:text-xl"
          >
            Fashion<span className="text-[var(--gold)]">Nova</span>
          </Link>

          <div className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (link.href === '/' && pathname === '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] uppercase tracking-[0.22em] transition ${
                    active ? 'text-[var(--ink)]' : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCartDrawer}
              className="relative flex h-11 w-11 items-center justify-center rounded-none border border-[var(--ink)]/15 text-[var(--ink)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
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
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-none bg-[var(--gold)] px-1 text-[10px] font-bold text-[var(--ink)]">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-none border border-[var(--ink)]/15 text-[var(--ink)] transition hover:border-[var(--gold)] hover:text-[var(--gold)] sm:hidden"
            >
              <span className="relative block h-0.5 w-6 bg-current"></span>
              <span className="absolute block h-0.5 w-6 bg-current [transform:translateY(8px)]"></span>
              <span className="absolute block h-0.5 w-6 bg-current [transform:translateY(-8px)]"></span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[rgba(15,14,13,0.92)] text-[var(--cream)]"
          >
            <div className="flex h-full flex-col px-6 py-8">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.35em] text-[var(--gold)]">Menu</p>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="text-[var(--cream)] transition hover:text-[var(--gold)]"
                  aria-label="Close navigation"
                >
                  ✕
                </button>
              </div>

              <nav className="mt-16 flex flex-1 flex-col gap-8 text-3xl leading-none">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="uppercase tracking-[0.25em] text-[var(--cream)] transition hover:text-[var(--gold)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto space-y-4">
                <button
                  type="button"
                  onClick={openCartDrawer}
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-none border border-[var(--gold)] bg-[var(--gold)] px-6 py-3 uppercase tracking-[0.25em] text-[var(--ink)] transition hover:bg-[var(--gold-light)]"
                >
                  View bag
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
