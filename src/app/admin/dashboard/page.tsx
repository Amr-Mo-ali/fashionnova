import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getStats() {
  const [totalOrders, totalProducts, pendingOrders, orders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
  ])

  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: 'DELIVERED' },
  })

  return { totalOrders, totalProducts, pendingOrders, orders, totalRevenue: totalRevenue._sum.total || 0 }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="text-white">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-400">At-a-glance admin metrics and quick actions.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/admin/products/new"
            className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            + Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500"
          >
            View Orders
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
          <p className="text-zinc-400 text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">EGP {stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
          <p className="text-zinc-400 text-sm mb-1">Total Orders</p>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
          <p className="text-zinc-400 text-sm mb-1">Pending Orders</p>
          <p className="text-3xl font-bold text-yellow-400">{stats.pendingOrders}</p>
        </div>
        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
          <p className="text-zinc-400 text-sm mb-1">Total Products</p>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
        <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
        {stats.orders.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {stats.orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">{order.customerName}</p>
                    <p className="text-sm text-zinc-400">{order.phone}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-zinc-300">
                    <span>Total: EGP {order.total.toLocaleString()}</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-400">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}