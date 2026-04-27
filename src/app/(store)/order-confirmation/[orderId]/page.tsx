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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8 md:py-24">
      <OrderConfirmationMotion>
        <div className="dramatic-card p-8 sm:p-10">
          <p className="text-label text-[#b8976a]">Confirmed</p>
          <h1 className="mt-4 font-serif text-[42px] leading-none text-[#0f0e0d]">
            <span className="font-[300]">Thank </span>
            <span className="font-[900]">You</span>
          </h1>
          <p className="mt-4 leading-7 text-[#7a7068]">
            We&apos;ve received your order. Pay the remaining balance in cash when your package arrives.
          </p>

          <dl className="mt-10 space-y-5 border-t border-[rgba(184,151,106,0.2)] pt-10">
            <div>
              <dt className="text-[11px] font-[900] uppercase tracking-[0.2em] text-[#7a7068]">
                Order ID
              </dt>
              <dd className="mt-2 font-mono text-sm text-[#0f0e0d]">{order.id}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-[900] uppercase tracking-[0.2em] text-[#7a7068]">
                Customer
              </dt>
              <dd className="mt-2 text-[#0f0e0d]">{order.customerName}</dd>
            </div>
          </dl>

          <div className="mt-10 border-t border-[rgba(184,151,106,0.2)] pt-10">
            <h2 className="font-serif text-[28px] font-[900] text-[#0f0e0d]">
              Your pieces
            </h2>
            <ul className="mt-5 space-y-4">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-4 border-b border-[rgba(184,151,106,0.08)] pb-4 text-sm last:border-0 last:pb-0"
                >
                  <span className="text-[#0f0e0d]">
                    {item.product.name}
                    <span className="mt-1 block text-xs text-[#7a7068]">
                      {item.size} · {item.color} × {item.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 font-[900] text-[#b8976a]">
                    EGP {(item.price * item.quantity).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-4 border-t border-[rgba(184,151,106,0.2)] pt-8 text-xl text-[#0f0e0d]">
              <div className="flex justify-between text-base">
                <span className="text-[#7a7068]">Deposit (10% of highest item)</span>
                <span className="font-[900] text-[#b8976a]">EGP {deposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-[#7a7068]">Remaining on delivery</span>
                <span className="font-[900] text-[#b8976a]">EGP {remaining.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-[rgba(184,151,106,0.08)] pt-4 font-[900]">
                <span>Order total</span>
                <span className="text-[#b8976a]">EGP {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="mt-10 border border-[rgba(184,151,106,0.24)] bg-[rgba(184,151,106,0.08)] px-5 py-4 text-sm leading-7 text-[#7a7068]">
            <span className="font-[900] text-[#0f0e0d]">Estimated delivery · </span>
            Most orders arrive within <span className="font-[900] text-[#0f0e0d]">3-5 business days</span> after
            confirmation. We&apos;ll reach you on the number you provided if anything changes.
          </p>

          <Link href="/" className="dramatic-button mt-10 inline-flex bg-[#0f0e0d] text-[#f5f2ed] hover:bg-[#f5f2ed] hover:text-[#0f0e0d] sm:px-12">
            Continue shopping
          </Link>
        </div>
      </OrderConfirmationMotion>
    </div>
  )
}
