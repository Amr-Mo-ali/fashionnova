'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'

  if (isLogin) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <main className="min-h-0 flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
