import { prisma } from '@/lib/prisma'
import OrderStatusSelect from '../components/OrderStatusSelect'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { product: { select: { name: true } } } },
    },
  })

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Orders</h1>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        {orders.length === 0 ? (
          <p className="py-16 text-center text-zinc-400">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-sm text-zinc-400">
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Phone</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-zinc-800/60 text-sm">
                    <td className="px-6 py-4 font-medium text-white">{order.customerName}</td>
                    <td className="px-6 py-4 text-zinc-300">{order.phone}</td>
                    <td className="px-6 py-4 text-zinc-300">EGP {order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <OrderStatusSelect
                        key={`${order.id}-${order.status}`}
                        orderId={order.id}
                        current={order.status}
                      />
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="max-w-xs px-6 py-4 text-xs text-zinc-400">
                      {order.items.length === 0
                        ? '—'
                        : order.items
                            .map(
                              (i) =>
                                `${i.product.name} ×${i.quantity}${i.size ? ` (${i.size})` : ''}`
                            )
                            .join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
