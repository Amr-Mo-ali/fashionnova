import Link from 'next/link'
import {
  SHOP_CATEGORY_CHIPS,
  categoryFilterHref,
} from '@/lib/shop-categories'

const WHATSAPP_DISPLAY = '01024888895'
const WHATSAPP_LINK = 'https://wa.me/201024888895'

export default function StoreFooter() {
  const categoryLinks = SHOP_CATEGORY_CHIPS.filter((c) => c !== 'All')
  const infoItems = ['About Us', 'Terms & Conditions', 'Privacy Policy', 'FAQ']
  const socialItems = ['Instagram', 'Facebook', 'Twitter']

  return (
    <footer className="border-t border-[rgba(184,151,106,0.24)] bg-[#0f0e0d] text-[#f5f2ed]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="grid gap-12 border-b border-[rgba(184,151,106,0.24)] pb-12 md:grid-cols-3">
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-6 font-serif text-[64px] font-bold leading-none text-[#b8976a]">
                FN
              </div>
              <p className="max-w-xs text-[14px] leading-7 text-[#d4b896]">
                Dramatic luxury. Crafted for those who dress with intention.
              </p>
            </div>
            <div className="mt-12 hidden h-px w-12 bg-[#b8976a] md:block" />
          </div>

          <div className="md:border-l md:border-r md:border-[rgba(184,151,106,0.24)] md:px-8">
            <h3 className="mb-8 text-[11px] font-[900] uppercase tracking-[0.2em] text-[#b8976a]">
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="inline-flex min-h-[44px] items-center text-[14px] text-[#d4b896] transition hover:text-[#f5f2ed]">
                  All
                </Link>
              </li>
              {categoryLinks.map((cat) => (
                <li key={cat}>
                  <Link
                    href={categoryFilterHref(cat)}
                    className="inline-flex min-h-[44px] items-center text-[14px] text-[#d4b896] transition hover:text-[#f5f2ed]"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-8 text-[11px] font-[900] uppercase tracking-[0.2em] text-[#b8976a]">
              Contact
            </h3>
            <p className="mb-4 text-[14px] text-[#d4b896]">WhatsApp</p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-3 text-[13px] font-[900] uppercase tracking-[0.2em] text-[#f5f2ed] transition hover:text-[#b8976a]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center bg-[#25D366] text-xs font-[900] text-[#0f0e0d]">
                W
              </span>
              {WHATSAPP_DISPLAY}
            </a>

            <div className="mt-10">
              <h3 className="mb-6 text-[11px] font-[900] uppercase tracking-[0.2em] text-[#b8976a]">
                Information
              </h3>
              <ul className="space-y-3">
                {infoItems.map((item) => (
                  <li key={item} className="inline-flex min-h-[44px] items-center text-[14px] text-[#7a7068]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#7a7068]">
            © {new Date().getFullYear()} FashionNova. All rights reserved.
          </p>
          <div className="flex gap-8">
            {socialItems.map((item) => (
              <span key={item} className="text-[11px] uppercase tracking-[0.2em] text-[#7a7068]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
