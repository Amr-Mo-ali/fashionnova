'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from './CartProvider'
import SocialLinks from './SocialLinks'

const NAV_LINKS = [
  { label: 'Shop', href: '/' },
  { label: 'Collections', href: '/collections' },
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

  return (
    <>
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? 'border-[rgba(184,151,106,0.28)] bg-[rgba(245,242,237,0.82)] backdrop-blur-xl shadow-[0_10px_30px_rgba(15,14,13,0.12)]'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-8 md:h-16">
          <motion.div
            whileHover={{ rotateY: 5, rotateX: -2 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{ perspective: '1000px' }}
          >
            <Link
              href="/"
              className="text-lg uppercase tracking-[-0.04em] text-[#0f0e0d] transition-colors duration-150 md:text-xl"
            >
              <span className="font-[400]">FASHION</span>
              <span className="font-[900]">NOVA</span>
            </Link>
          </motion.div>

          <div className="hidden items-center gap-8 sm:flex">
            <nav className="flex items-center gap-8" aria-label="Primary navigation">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative inline-flex min-h-[44px] items-center py-2 text-[11px] font-[900] uppercase tracking-[0.2em] transition-colors duration-150 ${
                      active
                        ? 'text-[#b8976a] after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:bg-[#b8976a]'
                        : 'text-[#7a7068] hover:text-[#b8976a]'
                    }`}
                  >
                    {link.label}
                    {link.href === '/cart' && itemCount > 0 ? (
                      <span className="ml-2 inline-flex min-h-5 min-w-5 items-center justify-center bg-[#b8976a] px-2 text-[10px] font-[900] text-[#0f0e0d]">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    ) : null}
                  </Link>
                )
              })}
            </nav>

            <SocialLinks
              className="ml-2 flex items-center gap-1"
              iconClassName="text-[#0f0e0d]"
            />
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={openCartDrawer}
              className="relative flex h-12 w-12 items-center justify-center border border-[rgba(184,151,106,0.28)] bg-transparent text-[#0f0e0d] transition-all duration-150 hover:bg-[#0f0e0d] hover:text-[#f5f2ed]"
              aria-label="Open shopping bag"
              whileHover={{ translateZ: 10 }}
              animate={itemCount > 0 ? { rotateY: [0, 360], rotateZ: [0, -5, 5, 0] } : {}}
              transition={{
                rotateY: { type: 'spring', stiffness: 200, damping: 15 },
                rotateZ: { type: 'spring', stiffness: 300, damping: 20 },
              }}
              style={{ perspective: '1000px' }}
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
                <motion.span
                  className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center bg-[#b8976a] px-1 text-[10px] font-[900] text-[#0f0e0d]"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </motion.span>
              ) : null}
            </motion.button>

            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menuOpen}
              className="flex h-12 w-12 items-center justify-center border border-[rgba(184,151,106,0.28)] text-[#0f0e0d] transition hover:bg-[#0f0e0d] hover:text-[#f5f2ed] sm:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
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
            className="fixed inset-0 z-40 bg-[rgba(15,14,13,0.96)] text-[#f5f2ed]"
          >
            <div className="flex h-full flex-col px-6 py-6">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-[900] uppercase tracking-[0.2em] text-[#b8976a]">Menu</p>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 min-w-12 items-center justify-center text-[#f5f2ed] transition hover:text-[#b8976a]"
                  aria-label="Close navigation"
                >
                  ×
                </button>
              </div>

              <nav className="mt-16 flex flex-1 flex-col justify-center gap-8 text-4xl leading-none font-serif" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-bold uppercase tracking-[0.04em] text-[#f5f2ed] transition hover:text-[#b8976a]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mb-6">
                <p className="mb-3 text-[11px] font-[900] uppercase tracking-[0.2em] text-[#b8976a]">Follow us</p>
                <SocialLinks />
              </div>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  openCartDrawer()
                }}
                className="inline-flex min-h-[48px] w-full items-center justify-center border border-[#b8976a] bg-transparent px-6 py-3 text-[11px] font-[900] uppercase tracking-[0.2em] text-[#f5f2ed] transition hover:bg-[#b8976a] hover:text-[#0f0e0d]"
              >
                View Bag
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="h-14 md:h-16" />
    </>
  )
}
