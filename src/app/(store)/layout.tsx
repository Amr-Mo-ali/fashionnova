import CartDrawer from '@/components/store/CartDrawer'
import StoreFooter from '@/components/store/StoreFooter'
import StoreHeader from '@/components/store/StoreHeader'

export const dynamic = 'force-dynamic'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="store-front flex min-h-screen flex-col bg-[var(--cream)] text-[var(--ink)]">
      <StoreHeader />
      <main className="flex-1 pt-16">{children}</main>
      <StoreFooter />
      <CartDrawer />
    </div>
  )
}
