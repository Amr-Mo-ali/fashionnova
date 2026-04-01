'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/collections', label: 'Collections' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/settings', label: 'Settings' },
]

function linkActive(pathname: string, href: string) {
  if (href === '/admin/dashboard') {
    return pathname === '/admin/dashboard'
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-6 py-8">
        <p className="text-lg font-bold text-white">FashionNova</p>
        <p className="text-xs text-zinc-500">Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {nav.map((item) => {
          const isActive = linkActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full rounded-xl border border-zinc-700 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
