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
        <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#111113]/50 p-8 shadow-2xl shadow-black/30 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8B5CF6]">
            Confirmed
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-outfit),sans-serif] text-4xl font-black text-[#FAFAFA]">
            Thank you
          </h1>
          <p className="mt-4 leading-relaxed text-[rgba(250,250,250,0.6)]">
            We&apos;ve received your order. Pay the remaining balance in cash when your package arrives.
          </p>

          <dl className="mt-10 space-y-5 border-t border-[rgba(255,255,255,0.08)] pt-10">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-[rgba(250,250,250,0.6)]">
                Order ID
              </dt>
              <dd className="mt-2 font-mono text-sm text-[rgba(250,250,250,0.8)]">{order.id}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-[rgba(250,250,250,0.6)]">
                Customer
              </dt>
              <dd className="mt-2 text-[#FAFAFA]">{order.customerName}</dd>
            </div>
          </dl>

          <div className="mt-10 border-t border-[rgba(255,255,255,0.08)] pt-10">
            <h2 className="font-[family-name:var(--font-outfit),sans-serif] text-lg font-black text-[#FAFAFA]">
              Your pieces
            </h2>
            <ul className="mt-5 space-y-4">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-4 border-b border-[rgba(255,255,255,0.04)] pb-4 text-sm last:border-0 last:pb-0"
                >
                  <span className="text-[rgba(250,250,250,0.8)]">
                    {item.product.name}
                    <span className="mt-1 block text-xs text-[rgba(250,250,250,0.6)]">
                      {item.size} · {item.color} × {item.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium text-[#8B5CF6]">
                    EGP {(item.price * item.quantity).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-4 border-t border-[rgba(255,255,255,0.08)] pt-8 font-[family-name:var(--font-outfit),sans-serif] text-xl text-[#FAFAFA]">
              <div className="flex justify-between text-base">
                <span className="text-[rgba(250,250,250,0.6)]">Deposit (10% of highest item)</span>
                <span className="text-[#8B5CF6]">EGP {deposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-[rgba(250,250,250,0.6)]">Remaining on delivery</span>
                <span className="text-[#8B5CF6]">EGP {remaining.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-[rgba(255,255,255,0.04)] pt-4">
                <span>Order total</span>
                <span className="text-[#8B5CF6]">EGP {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="mt-10 rounded-2xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/10 px-5 py-4 text-sm leading-relaxed text-[rgba(250,250,250,0.6)]">
            <span className="font-medium text-[#8B5CF6]">Estimated delivery · </span>
            Most orders arrive within <span className="text-[rgba(250,250,250,0.8)]">3–5 business days</span> after
            confirmation. We&apos;ll reach you on the number you provided if anything changes.
          </p>

          <Link
            href="/"
            className="mt-10 inline-flex w-full items-center justify-center rounded-lg border border-[#8B5CF6]/60 bg-transparent py-4 text-sm font-bold uppercase tracking-wider text-[#8B5CF6] transition hover:bg-[#8B5CF6]/15 sm:w-auto sm:px-12"
          >
            Continue shopping
          </Link>
        </div>
      </OrderConfirmationMotion>
    </div>
  )
}
