import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function requireSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  return session
}

export async function requireAdminSession() {
  const session = await requireSession()
  if (!session) return null
  const role = session.user?.role
  if (typeof role !== 'string') return null
  if (role !== 'ADMIN' && role !== 'SUPERADMIN') return null
  return session
}
