'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Link from 'next/link'

const mobileNav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '👗' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/collections', label: 'Collections', icon: '🎬' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

function linkActive(pathname: string, href: string) {
  if (href === '/admin/dashboard') {
    return pathname === '/admin/dashboard'
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (isLogin) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="lg:flex">
        <div
          className={`fixed inset-0 z-40 transition-opacity lg:hidden ${
            drawerOpen ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
          aria-hidden={!drawerOpen}
          onClick={() => setDrawerOpen(false)}
        />

        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-zinc-800 bg-zinc-900 p-4 transition duration-300 lg:static lg:translate-x-0 lg:w-64 ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar onNavigate={() => setDrawerOpen(false)} />
        </div>

        <main className="min-h-screen flex-1 overflow-auto pb-28 lg:pb-8">
          <div className="lg:hidden border-b border-zinc-800 px-4 py-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-2xl transition hover:border-zinc-500"
              aria-label="Open menu"
            >
              ☰
            </button>
            <div className="text-sm uppercase tracking-[0.24em] text-zinc-400">Admin</div>
            <div className="h-12 w-12" />
          </div>

          <div className="px-4 py-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-zinc-950 px-2 py-2 lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          {mobileNav.map((item) => {
            const active = linkActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className={`inline-flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition ${
                  active
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
