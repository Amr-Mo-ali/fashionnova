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
    <footer className="bg-[#0f0e0d] text-[#f5f2ed] border-t border-[#b8976a] border-opacity-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="grid gap-16 sm:grid-cols-3 lg:grid-cols-4 pb-12 border-b border-[#b8976a] border-opacity-20">
          {/* Left Column - FN Monogram & Brand Story */}
          <div className="sm:col-span-1 flex flex-col justify-between">
            <div>
              <div className="font-serif text-[64px] font-bold text-[#b8976a] leading-none mb-6">
                FN
              </div>
              <p className="text-[14px] leading-[1.8] text-[#d4b896]">
                Dramatic luxury. Crafted for those who dress with intention.
              </p>
            </div>
            
            {/* Gold Divider */}
            <div className="hidden sm:block w-12 h-px bg-[#b8976a] mt-12"></div>
          </div>

          {/* Center-Left Column - Categories */}
          <div className="sm:px-6 lg:px-8">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b8976a] mb-8">
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-[14px] text-[#d4b896] transition hover:text-[#f5f2ed]"
                >
                  All
                </Link>
              </li>
              {categoryLinks.map((cat) => (
                <li key={cat}>
                  <Link
                    href={categoryFilterHref(cat)}
                    className="text-[14px] text-[#d4b896] transition hover:text-[#f5f2ed]"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Center-Right Column - Information */}
          <div className="sm:px-6 lg:px-8">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b8976a] mb-8">
              Information
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#d4b896] transition hover:text-[#f5f2ed]"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#d4b896] transition hover:text-[#f5f2ed]"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#d4b896] transition hover:text-[#f5f2ed]"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[#d4b896] transition hover:text-[#f5f2ed]"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column - Contact */}
          <div className="sm:col-span-1 lg:px-8">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b8976a] mb-8">
              Contact
            </h3>
            <p className="text-[14px] text-[#d4b896] mb-4">WhatsApp</p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-3 text-[13px] font-bold uppercase tracking-[0.1em] text-[#f5f2ed] transition hover:text-[#b8976a]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-[#0f0e0d] text-xs font-bold">
                W
              </span>
              {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>

        {/* Bottom Section - Copyright & Links */}
        <div className="mt-12 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <p className="text-[11px] text-[#7a7068] uppercase tracking-[0.1em]">
            © {new Date().getFullYear()} FashionNova. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[11px] uppercase tracking-[0.1em] text-[#7a7068] hover:text-[#b8976a] transition">
              Instagram
            </a>
            <a href="#" className="text-[11px] uppercase tracking-[0.1em] text-[#7a7068] hover:text-[#b8976a] transition">
              Facebook
            </a>
            <a href="#" className="text-[11px] uppercase tracking-[0.1em] text-[#7a7068] hover:text-[#b8976a] transition">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
