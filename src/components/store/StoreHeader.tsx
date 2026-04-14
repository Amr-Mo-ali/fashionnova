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
        className={`fixed inset-x-0 top-0 z-50 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(9,9,11,0.95)] backdrop-blur-[12px] transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_24px_60px_rgba(0,0,0,0.3)]' : 'shadow-none'
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
              className="font-[family-name:var(--font-outfit),sans-serif] text-base font-bold uppercase tracking-[0.08em] text-[#FAFAFA]"
            >
              Fashion<span className="text-[#8B5CF6]">Nova</span>
            </Link>
          </motion.div>

          <div className="hidden items-center gap-8 sm:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (link.href === '/' && pathname === '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[12px] font-bold uppercase tracking-[0.08em] transition ${
                    active
                      ? 'text-[#FAFAFA] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-[#8B5CF6]'
                      : 'text-[rgba(250,250,250,0.6)] hover:text-[#FAFAFA]'
                  }`}
                >
                  {link.label}
                  {link.href === '/cart' && itemCount > 0 ? (
                    <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#8B5CF6] px-2 text-[10px] font-bold text-[#09090B]">
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
              className="relative flex h-11 w-11 items-center justify-center rounded-none border border-[rgba(255,255,255,0.15)] text-[#FAFAFA] transition hover:border-[#8B5CF6] hover:text-[#8B5CF6]"
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
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8B5CF6] px-1 text-[10px] font-bold text-[#09090B]"
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
              className="flex h-11 w-11 items-center justify-center rounded-none border border-[rgba(255,255,255,0.15)] text-[#FAFAFA] transition hover:border-[#8B5CF6] hover:text-[#8B5CF6] sm:hidden"
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
            className="fixed inset-0 z-40 bg-[rgba(9,9,11,0.95)] text-[#FAFAFA]"
          >
            <div className="flex h-full flex-col px-6 py-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#8B5CF6]">Menu</p>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="text-[#FAFAFA] transition hover:text-[#8B5CF6]"
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
                    className="font-bold uppercase tracking-[0.08em] text-[#FAFAFA] transition hover:text-[#8B5CF6]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto space-y-4">
                <button
                  type="button"
                  onClick={openCartDrawer}
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border border-[#8B5CF6] bg-[#8B5CF6] px-6 py-3 font-bold uppercase tracking-[0.08em] text-[#09090B] transition hover:filter hover:brightness-110"
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
