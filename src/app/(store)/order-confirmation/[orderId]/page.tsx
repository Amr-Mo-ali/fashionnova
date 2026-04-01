import OrderConfirmationMotion from '@/components/store/OrderConfirmationMotion'
import { computeDepositFromUnitPrices } from '@/lib/order-deposit'
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

  const deposit = computeDepositFromUnitPrices(order.items.map((i) => i.price))
  const remaining = Math.round((order.total - deposit) * 100) / 100

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-8">
      <OrderConfirmationMotion>
        <div className="rounded-2xl border border-[#3D252F]/80 bg-[#23151c]/50 p-8 shadow-2xl shadow-black/30 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8728A]">
            Confirmed
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-cormorant),serif] text-4xl font-medium text-[#FAF6F1]">
            Thank you
          </h1>
          <p className="mt-4 leading-relaxed text-[#8C6070]">
            We&apos;ve received your order. Pay the remaining balance in cash when your package arrives.
          </p>

          <dl className="mt-10 space-y-5 border-t border-[#3D252F]/80 pt-10">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-[#8C6070]">
                Order ID
              </dt>
              <dd className="mt-2 font-mono text-sm text-[#C9A9B4]">{order.id}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-[#8C6070]">
                Customer
              </dt>
              <dd className="mt-2 text-[#FAF6F1]">{order.customerName}</dd>
            </div>
          </dl>

          <div className="mt-10 border-t border-[#3D252F]/80 pt-10">
            <h2 className="font-[family-name:var(--font-cormorant),serif] text-lg font-medium text-[#FAF6F1]">
              Your pieces
            </h2>
            <ul className="mt-5 space-y-4">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-4 border-b border-[#3D252F]/50 pb-4 text-sm last:border-0 last:pb-0"
                >
                  <span className="text-[#C9A9B4]">
                    {item.product.name}
                    <span className="mt-1 block text-xs text-[#8C6070]">
                      {item.size} · {item.color} × {item.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium text-[#C8728A]">
                    EGP {(item.price * item.quantity).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-4 border-t border-[#3D252F]/80 pt-8 font-[family-name:var(--font-cormorant),serif] text-xl text-[#FAF6F1]">
              <div className="flex justify-between text-base">
                <span className="text-[#8C6070]">Deposit (10% of highest item)</span>
                <span className="text-[#C8728A]">EGP {deposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-[#8C6070]">Remaining on delivery</span>
                <span className="text-[#C8728A]">EGP {remaining.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-[#3D252F]/50 pt-4">
                <span>Order total</span>
                <span className="text-[#C8728A]">EGP {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="mt-10 rounded-2xl border border-[#C8728A]/20 bg-[#C8728A]/10 px-5 py-4 text-sm leading-relaxed text-[#8C6070]">
            <span className="font-medium text-[#C8728A]">Estimated delivery · </span>
            Most orders arrive within <span className="text-[#C9A9B4]">3–5 business days</span> after
            confirmation. We&apos;ll reach you on the number you provided if anything changes.
          </p>

          <Link
            href="/"
            className="mt-10 inline-flex w-full items-center justify-center rounded-full border border-[#C8728A]/60 bg-transparent py-4 text-sm font-semibold uppercase tracking-wider text-[#C8728A] transition hover:bg-[#C8728A]/15 sm:w-auto sm:px-12"
          >
            Continue shopping
          </Link>
        </div>
      </OrderConfirmationMotion>
    </div>
  )
}
