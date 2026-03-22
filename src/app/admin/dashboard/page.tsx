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
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <p className="text-zinc-400 text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">EGP {stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <p className="text-zinc-400 text-sm mb-1">Total Orders</p>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <p className="text-zinc-400 text-sm mb-1">Pending Orders</p>
          <p className="text-3xl font-bold text-yellow-400">{stats.pendingOrders}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <p className="text-zinc-400 text-sm mb-1">Total Products</p>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
        <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
        {stats.orders.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">No orders yet</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-zinc-400 text-sm border-b border-zinc-800">
                <th className="text-left pb-3">Customer</th>
                <th className="text-left pb-3">Phone</th>
                <th className="text-left pb-3">Total</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-left pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.orders.map((order) => (
                <tr key={order.id} className="border-b border-zinc-800/50 text-sm">
                  <td className="py-3">{order.customerName}</td>
                  <td className="py-3">{order.phone}</td>
                  <td className="py-3">EGP {order.total.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'PENDING' ? 'bg-yellow-400/10 text-yellow-400' :
                      order.status === 'DELIVERED' ? 'bg-green-400/10 text-green-400' :
                      order.status === 'CANCELLED' ? 'bg-red-400/10 text-red-400' :
                      'bg-blue-400/10 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}