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
    <footer className="mt-auto bg-[var(--nav)] text-[var(--white)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xl uppercase tracking-[0.15em] text-[var(--white)]">
              FASHION<span className="text-[var(--gold)]">NOVA</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#d9d3c0]">
              Contemporary luxury. Crafted for those who dress with intention.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-[var(--gold)]">
              Categories
            </h3>
            <ul className="mt-6 flex flex-col gap-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-[#d9d3c0] transition hover:text-[var(--gold)]"
                >
                  All
                </Link>
              </li>
              {categoryLinks.map((cat) => (
                <li key={cat}>
                  <Link
                    href={categoryFilterHref(cat)}
                    className="text-sm text-[#d9d3c0] transition hover:text-[var(--gold)]"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs uppercase tracking-[0.15em] text-[var(--gold)]">
              Contact
            </h3>
            <p className="mt-6 text-sm text-[#d9d3c0]">WhatsApp</p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[var(--white)] transition hover:text-[var(--gold)]"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-[var(--nav)] text-xs font-semibold">
                W
              </span>
              {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>

        <div className="mt-14 border-t border-white/15 pt-8 text-center text-[11px] text-[#999]">
          © {new Date().getFullYear()} FashionNova. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
