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
    <footer className="mt-auto border-t border-[#b8976a]/45 bg-[#0f0e0d]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-[family-name:var(--font-playfair),serif] text-xl tracking-[0.15em] text-[#ffffff]">
              FASHION<span className="text-[#b8976a]">NOVA</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#7a7068]">
              Contemporary luxury. Crafted for those who dress with intention.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b8976a]">
              Categories
            </h3>
            <ul className="mt-6 flex flex-col gap-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-[#7a7068] transition hover:text-[#b8976a]"
                >
                  All
                </Link>
              </li>
              {categoryLinks.map((cat) => (
                <li key={cat}>
                  <Link
                    href={categoryFilterHref(cat)}
                    className="text-sm text-[#7a7068] transition hover:text-[#b8976a]"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b8976a]">
              Contact
            </h3>
            <p className="mt-6 text-sm text-[#7a7068]">WhatsApp</p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-[44px] items-center text-sm font-medium text-[#b8976a] underline-offset-4 hover:underline"
            >
              {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>

        <div className="mt-14 border-t border-[#b8976a]/35 pt-8 text-center text-xs text-[#7a7068]">
          © {new Date().getFullYear()} FashionNova. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
