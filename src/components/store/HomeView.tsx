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
    <div className="flex flex-col">
      <section className="relative flex min-h-[calc(100dvh-4.25rem)] flex-col items-center justify-center overflow-hidden border-b border-[#3D252F]/40 px-4 pb-16 pt-8 sm:px-8 sm:pb-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(200,114,138,0.18),transparent_55%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_55%,rgba(200,114,138,0.08),transparent_42%)]" />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(200,114,138,0.06)_0%,transparent_38%,transparent_62%,rgba(200,114,138,0.04)_100%)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-4xl px-2 text-center">
          <motion.p
            custom={0}
            variants={heroLine}
            initial="hidden"
            animate="show"
            className="mb-8 text-xs font-medium uppercase tracking-[0.38em] text-[#C8728A]"
          >
            Est. 2024 · Cairo
          </motion.p>
          <motion.h1
            custom={1}
            variants={heroLine}
            initial="hidden"
            animate="show"
            className="font-[family-name:var(--font-playfair),serif] text-5xl font-medium leading-[1.08] tracking-tight text-[#FAF6F1] sm:text-7xl md:text-8xl"
          >
            Refined
            <br />
            <span className="text-[#8C6070]">for the</span> bold
          </motion.h1>
          <motion.p
            custom={2}
            variants={heroLine}
            initial="hidden"
            animate="show"
            className="mx-auto mt-10 max-w-lg text-base leading-[1.75] text-[#8C6070] sm:text-lg"
          >
            Curated silhouettes, uncompromising craft. Discover pieces designed to move with you
            from dusk to dawn.
          </motion.p>
          <motion.div
            custom={3}
            variants={heroLine}
            initial="hidden"
            animate="show"
            className="mt-14"
          >
            <Link
              href="#products"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#C8728A]/70 bg-transparent px-12 py-3.5 text-sm font-semibold uppercase tracking-[0.22em] text-[#C8728A] transition hover:border-[#C8728A] hover:bg-[#C8728A]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8728A]"
            >
              Shop collection
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden
        >
          <div className="flex h-10 w-6 justify-center rounded-full border border-[#3D252F] pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="h-1.5 w-1 rounded-full bg-[#C8728A]"
            />
          </div>
        </motion.div>
      </section>

      <div className="border-b border-[#3D252F]/50 bg-[#FAF6F1]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-8">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8C6070]">
            Shop by category
          </p>
          <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            {SHOP_CATEGORY_CHIPS.map((cat) => {
              const active = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => selectCategory(cat)}
                  className={`min-h-[44px] shrink-0 snap-start rounded-full border px-5 py-2.5 text-sm font-medium tracking-wide transition sm:min-h-0 ${
                    active
                      ? 'border-[#C8728A] text-[#C8728A] shadow-[0_0_20px_rgba(200,114,138,0.18)]'
                      : 'border-[#3D252F]/50 text-[#8C6070] hover:border-[#C8728A]/50 hover:text-[#1A0E13]'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <section
        id="products"
        className="mx-auto max-w-7xl scroll-mt-[4.5rem] px-4 py-24 sm:px-8 sm:py-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-[#C8728A]">
              The edit
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-playfair),serif] text-3xl font-medium leading-tight text-[#FAF6F1] sm:text-4xl md:text-5xl">
              New arrivals
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#8C6070]">
            Each piece selected for texture, drape, and presence.
          </p>
        </motion.div>

        {products.length === 0 ? (
          <p className="rounded-2xl border border-[#3D252F]/80 bg-[#23151c]/40 py-24 text-center text-[#8C6070]">
            The collection will appear here soon.
          </p>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-[#3D252F]/80 bg-[#23151c]/40 py-20 text-center"
          >
            <p className="text-[#8C6070]">No pieces in this category yet.</p>
            <button
              type="button"
              onClick={() => selectCategory('All')}
              className="mt-6 text-sm font-medium text-[#C8728A] underline-offset-4 hover:underline"
            >
              View all
            </button>
          </motion.div>
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
