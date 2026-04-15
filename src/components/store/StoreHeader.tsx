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
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled 
            ? 'bg-[#0f0e0d] border-[rgba(184,151,106,0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.2)]' 
            : 'bg-[#f5f2ed] border-[rgba(184,151,106,0.15)]'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <motion.div
            whileHover={{ rotateY: 5, rotateX: -2 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{ perspective: '1000px' }}
          >
            <Link
              href="/"
              className={`font-serif text-lg font-bold uppercase tracking-tight transition-colors duration-300 ${
                scrolled ? 'text-[#f5f2ed]' : 'text-[#0f0e0d]'
              }`}
            >
              <span className="font-light">FASHION</span>
              <span className="font-bold">NOVA</span>
            </Link>
          </motion.div>

          <div className="hidden items-center gap-8 sm:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (link.href === '/' && pathname === '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[11px] font-900 uppercase tracking-[0.1em] transition-colors duration-300 ${
                    scrolled
                      ? active
                        ? 'text-[#b8976a] after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-[#b8976a]'
                        : 'text-[#d4b896] hover:text-[#b8976a]'
                      : active
                      ? 'text-[#b8976a] after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-[#b8976a]'
                      : 'text-[#7a7068] hover:text-[#b8976a]'
                  }`}
                >
                  {link.label}
                  {link.href === '/cart' && itemCount > 0 ? (
                    <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#b8976a] px-2 text-[10px] font-bold text-[#0f0e0d]">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  ) : null}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={openCartDrawer}
              className={`relative flex h-11 w-11 items-center justify-center border transition-all duration-300 ${
                scrolled
                  ? 'border-[rgba(212,184,150,0.3)] text-[#d4b896] hover:border-[#b8976a] hover:text-[#b8976a]'
                  : 'border-[rgba(122,112,104,0.3)] text-[#7a7068] hover:border-[#b8976a] hover:text-[#b8976a]'
              }`}
              aria-label="Open shopping bag"
              whileHover={scrolled ? { translateZ: 10 } : {}}
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
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b8976a] px-1 text-[10px] font-bold text-[#0f0e0d]"
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
              className={`flex h-11 w-11 items-center justify-center border transition sm:hidden ${
                scrolled
                  ? 'border-[rgba(212,184,150,0.3)] text-[#d4b896] hover:border-[#b8976a] hover:text-[#b8976a]'
                  : 'border-[rgba(122,112,104,0.3)] text-[#7a7068] hover:border-[#b8976a] hover:text-[#b8976a]'
              }`}
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
            className="fixed inset-0 z-40 mt-16 bg-[#f5f2ed] text-[#0f0e0d]"
          >
            <div className="flex h-full flex-col px-6 py-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-[0.1em] text-[#b8976a]">Menu</p>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="text-[#0f0e0d] transition hover:text-[#b8976a]"
                  aria-label="Close navigation"
                >
                  ✕
                </button>
              </div>

              <nav className="mt-16 flex flex-1 flex-col gap-8 text-3xl leading-none font-serif">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-bold uppercase tracking-tight text-[#0f0e0d] transition hover:text-[#b8976a]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto space-y-4">
                <button
                  type="button"
                  onClick={openCartDrawer}
                  className="inline-flex min-h-[48px] w-full items-center justify-center border border-[#b8976a] bg-[#b8976a] px-6 py-3 font-bold uppercase tracking-[0.1em] text-[#0f0e0d] transition hover:bg-[#0f0e0d] hover:text-[#b8976a]"
                >
                  View Bag
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="h-16" />
    </>
  )
}
