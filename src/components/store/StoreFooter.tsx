import Link from 'next/link'
import {
  SHOP_CATEGORY_CHIPS,
  categoryFilterHref,
} from '@/lib/shop-categories'

const WHATSAPP_DISPLAY = '01024888895'
const WHATSAPP_LINK = 'https://wa.me/201024888895'

export default function StoreFooter() {
  const categoryLinks = SHOP_CATEGORY_CHIPS.filter((c) => c !== 'All')

  return (
    <footer className="mt-auto bg-[#09090B] text-[#FAFAFA] border-t border-[rgba(255,255,255,0.08)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xl font-bold uppercase tracking-[0.08em] text-[#FAFAFA]">
              FASHION<span className="text-[#8B5CF6]">NOVA</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[rgba(250,250,250,0.6)]">
              Dramatic luxury. Crafted for those who dress with intention.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#8B5CF6]">
              Categories
            </h3>
            <ul className="mt-6 flex flex-col gap-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-[rgba(250,250,250,0.6)] transition hover:text-[#8B5CF6]"
                >
                  All
                </Link>
              </li>
              {categoryLinks.map((cat) => (
                <li key={cat}>
                  <Link
                    href={categoryFilterHref(cat)}
                    className="text-sm text-[rgba(250,250,250,0.6)] transition hover:text-[#8B5CF6]"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#8B5CF6]">
              Contact
            </h3>
            <p className="mt-6 text-sm text-[rgba(250,250,250,0.6)]">WhatsApp</p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[#FAFAFA] transition hover:text-[#8B5CF6]"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-[#09090B] text-xs font-bold">
                W
              </span>
              {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>

        <div className="mt-14 border-t border-[rgba(255,255,255,0.08)] pt-8 text-center text-[11px] text-[rgba(250,250,250,0.5)]">
          © {new Date().getFullYear()} FashionNova. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
