import { prisma } from '@/lib/prisma'
import OrderStatusSelect from '../components/OrderStatusSelect'

function cleanPhone(phone: string) {
  return phone.replace(/[^0-9+]/g, '')
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { product: { select: { name: true } } } },
    },
  })

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="mt-2 text-sm text-zinc-400">Manage your incoming requests and update order status fast.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:hidden">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-white">{order.customerName}</p>
                    <p className="text-sm text-zinc-400">{order.phone}</p>
                  </div>
                  <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-400">
                    {order.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-300">
                  <span>Total: EGP {order.total.toLocaleString()}</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="space-y-2 rounded-2xl bg-zinc-950 p-3 text-sm text-zinc-400">
                  <p className="font-medium text-white">Items</p>
                  <p>
                    {order.items.length === 0
                      ? '—'
                      : order.items
                          .map(
                            (item) =>
                              `${item.product.name} ×${item.quantity}${item.size ? ` (${item.size})` : ''}`
                          )
                          .join(', ')}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <OrderStatusSelect orderId={order.id} current={order.status} />
                  <a
                    href={`https://wa.me/${cleanPhone(order.phone)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[46px] items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 sm:block">
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
                        {new Date(order.createdAt).toLocaleDateString()}
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
    </div>
  )
}
