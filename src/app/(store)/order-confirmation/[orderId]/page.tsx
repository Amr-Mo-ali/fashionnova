import OrderConfirmationMotion from '@/components/store/OrderConfirmationMotion'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type PageProps = { params: Promise<{ orderId: string }> }

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = await params

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: { select: { name: true } } },
      },
    },
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-8">
      <OrderConfirmationMotion>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-8 shadow-2xl shadow-black/30 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Confirmed
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-playfair),serif] text-4xl font-medium text-white">
            Thank you
          </h1>
          <p className="mt-4 leading-relaxed text-zinc-400">
            We&apos;ve received your order. You&apos;ll pay in cash when your package arrives.
          </p>

          <dl className="mt-10 space-y-5 border-t border-zinc-800/80 pt-10">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Order ID
              </dt>
              <dd className="mt-2 font-mono text-sm text-zinc-200">{order.id}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Customer
              </dt>
              <dd className="mt-2 text-white">{order.customerName}</dd>
            </div>
          </dl>

          <div className="mt-10 border-t border-zinc-800/80 pt-10">
            <h2 className="font-[family-name:var(--font-playfair),serif] text-lg font-medium text-white">
              Your pieces
            </h2>
            <ul className="mt-5 space-y-4">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-4 border-b border-zinc-800/50 pb-4 text-sm last:border-0 last:pb-0"
                >
                  <span className="text-zinc-300">
                    {item.product.name}
                    <span className="mt-1 block text-xs text-zinc-500">
                      {item.size} · {item.color} × {item.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium text-[#D4AF37]">
                    EGP {(item.price * item.quantity).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-between border-t border-zinc-800/80 pt-8 font-[family-name:var(--font-playfair),serif] text-xl text-white">
              <span>Total</span>
              <span className="text-[#D4AF37]">EGP {order.total.toLocaleString()}</span>
            </div>
          </div>

          <p className="mt-10 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-5 py-4 text-sm leading-relaxed text-zinc-400">
            <span className="font-medium text-[#D4AF37]">Estimated delivery · </span>
            Most orders arrive within <span className="text-zinc-200">3–5 business days</span> after
            confirmation. We&apos;ll reach you on the number you provided if anything changes.
          </p>

          <Link
            href="/"
            className="mt-10 inline-flex w-full items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37] py-4 text-sm font-semibold uppercase tracking-wider text-zinc-950 transition hover:bg-[#e5c04a] sm:w-auto sm:px-12"
          >
            Continue shopping
          </Link>
        </div>
      </OrderConfirmationMotion>
    </div>
  )
}
