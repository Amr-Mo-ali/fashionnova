'use client'

import type { Product } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  SHOP_CATEGORY_CHIPS,
  categoryFilterHref,
} from '@/lib/shop-categories'
import ProductCard from './ProductCard'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const heroLine = {
  hidden: { opacity: 0, y: 36 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

type Props = {
  products: Product[]
  initialCategory: string
}
export default function HomeView({ products, initialCategory }: Props) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  useEffect(() => {
    setSelectedCategory(initialCategory)
  }, [initialCategory])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products
    const needle = selectedCategory.toLowerCase()
    return products.filter((p) => p.category.trim().toLowerCase() === needle)
  }, [products, selectedCategory])

  function selectCategory(cat: string) {
    setSelectedCategory(cat)
    router.push(categoryFilterHref(cat), { scroll: false })
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <section className="relative isolate min-h-[calc(100dvh-5.5rem)] overflow-hidden bg-[var(--cream)] px-4 pt-24 sm:px-8 lg:px-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,151,106,0.14),transparent_35%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_85%,rgba(15,14,13,0.03)_100%)]" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl py-20 lg:py-24">
            <motion.p
              custom={0}
              variants={heroLine}
              initial="hidden"
              animate="show"
              className="mb-8 text-[11px] uppercase tracking-[0.15em] text-[#999]"
            >
              Est. 2024 · Cairo
            </motion.p>
            <motion.h1
              custom={1}
              variants={heroLine}
              initial="hidden"
              animate="show"
              className="font-[family-name:var(--font-cormorant),serif] text-[3.75rem] leading-[0.95] tracking-[-0.03em] text-[var(--ink)] sm:text-[5rem] md:text-[6.5rem]"
            >
              Dressed
              <br />
              <span className="italic text-[var(--ink)]/85">for the bold</span>
            </motion.h1>
            <motion.p
              custom={2}
              variants={heroLine}
              initial="hidden"
              animate="show"
              className="mt-10 max-w-xl text-base leading-[1.85] text-[var(--muted)] sm:text-lg"
            >
              Curated silhouettes, refined materials, and quiet luxury designed for those who move
              with confidence.
            </motion.p>
            <motion.div
              custom={3}
              variants={heroLine}
              initial="hidden"
              animate="show"
              className="mt-14"
            >
              <a
                href="#products"
                className="btn-primary text-sm"
              >
                Shop collection
              </a>
            </motion.div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative overflow-hidden rounded-[4px] border border-[var(--border)] bg-[var(--panel)] px-6 py-6 shadow-[0_40px_80px_rgba(15,14,13,0.12)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,184,150,0.18),transparent_46%)]" />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-[var(--ink)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(245,242,237,0.24),transparent_40%)]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'400\'><path d=\'M0 0h400v400H0z\' fill=\'%23e8e0d4\'/><path d=\'M0 100c100-50 200 50 300 0s100-100 100-100V400H0z\' fill=\'%23f5f2ed\' opacity=\'0.55\'/></svg>')] bg-cover opacity-40" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[rgba(15,14,13,0.72)] to-transparent" />
                <div className="relative z-10 flex h-full items-center justify-center px-10">
                  <div className="w-full max-w-[320px] rounded-[4px] border border-[var(--gold)]/20 bg-[rgba(245,242,237,0.85)] px-8 py-12 text-center">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#999]">Editorial</p>
                    <p className="mt-6 text-3xl font-[family-name:var(--font-cormorant),serif] leading-tight text-[var(--ink)]">
                      The season collection
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-10 flex justify-center">
          <div className="flex h-12 w-8 flex-col items-center justify-between rounded-full border border-[var(--gold)]/40 p-1">
            <span className="block h-1 w-full rounded-full bg-[var(--gold)] opacity-40" />
            <span className="block h-1.5 w-1.5 rounded-full bg-[var(--gold)] animate-bounce" />
          </div>
        </div>
      </section>

      <div className="border-b border-[var(--border)] bg-[var(--cream)] px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-3 overflow-x-auto pb-1 sm:justify-start sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            {SHOP_CATEGORY_CHIPS.map((cat) => {
              const active = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => selectCategory(cat)}
                  className={`category-chip ${active ? 'category-chip-active' : 'category-chip-inactive'}`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <section id="products" className="mx-auto max-w-7xl scroll-mt-[4.5rem] px-4 py-24 sm:px-8 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              The edit
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-cormorant),serif] text-3xl leading-tight text-[var(--ink)] sm:text-4xl md:text-5xl">
              New arrivals
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-[1.85] text-[var(--muted)]">
            Each piece selected for texture, drape, and presence.
          </p>
        </motion.div>

        {products.length === 0 ? (
          <div className="rounded-[4px] border border-[var(--border)] bg-[var(--white)] p-20 text-center text-[var(--muted)]">
            The collection will appear here soon.
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-[4px] border border-[var(--border)] bg-[var(--white)] p-20 text-center text-[var(--muted)]">
            <p>No pieces in this category yet.</p>
            <button
              type="button"
              onClick={() => selectCategory('All')}
              className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-[var(--gold)]"
            >
              View all
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              <motion.div
                className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredProducts.map((p) => (
                  <motion.div key={p.id} variants={item} layout className="h-full">
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </div>
  )
}
