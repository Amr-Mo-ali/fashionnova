import CartDrawer from '@/components/store/CartDrawer'
import StoreHeader from '@/components/store/StoreHeader'

export const dynamic = 'force-dynamic'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="store-front min-h-screen bg-zinc-950 [&_h1]:font-[family-name:var(--font-playfair),serif] [&_h2]:font-[family-name:var(--font-playfair),serif] [&_h3]:font-[family-name:var(--font-playfair),serif]">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <CartDrawer />
    </div>
  )
}
