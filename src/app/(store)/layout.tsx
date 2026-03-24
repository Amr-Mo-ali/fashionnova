import CartDrawer from '@/components/store/CartDrawer'
import StoreFooter from '@/components/store/StoreFooter'
import StoreHeader from '@/components/store/StoreHeader'

export const dynamic = 'force-dynamic'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="store-front flex min-h-screen flex-col bg-[#1A0E13] [&_h1]:font-[family-name:var(--font-playfair),serif] [&_h2]:font-[family-name:var(--font-playfair),serif] [&_h3]:font-[family-name:var(--font-playfair),serif]">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
      <CartDrawer />
    </div>
  )
}
