'use client'

import type { Collection, Product } from '@prisma/client'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, useRef } from 'react'
import {
  SHOP_CATEGORY_CHIPS,
  categoryFilterHref,
} from '@/lib/shop-categories'
import { useHeroMouseTilt } from '@/hooks/use3DEffect'
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

const scrollReveal = {
  hidden: { opacity: 0, y: 30, rotateX: 15 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

type Props = {
  products: Product[]
  collections: Collection[]
  initialCategory: string
}
export default function HomeView({ products, collections, initialCategory }: Props) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const heroSectionRef = useRef<HTMLDivElement>(null)
  const { rotateX: heroRotateX, rotateY: heroRotateY, onMouseMove: heroOnMouseMove, onMouseLeave: heroOnMouseLeave, isHoverCapable } = useHeroMouseTilt(5)
  
  // Scroll tracking for parallax effects
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 300], [0, 150])
  const textY = useTransform(scrollY, [0, 300], [0, 90])

  useEffect(() => {
    setSelectedCategory(initialCategory)
  }, [initialCategory])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products
    const needle = selectedCategory.trim().toLowerCase()
    return products.filter((p) => p.category.trim().toLowerCase() === needle)
  }, [products, selectedCategory])

  function selectCategory(cat: string) {
    setSelectedCategory(cat)
    router.push(categoryFilterHref(cat), { scroll: false })
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <section 
        ref={heroSectionRef}
        className="relative isolate min-h-[calc(100dvh-5.5rem)] overflow-hidden bg-[#09090B] px-4 pt-24 sm:px-8 lg:px-0"
        onMouseMove={(e) => {
          if (isHoverCapable) {
            heroOnMouseMove(e as any)
          }
        }}
        onMouseLeave={heroOnMouseLeave}
        style={{ perspective: '1000px' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.08),transparent_35%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_85%,rgba(139,92,246,0.02)_100%)]" aria-hidden="true" />

        <motion.div 
          className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
          style={isHoverCapable ? { rotateX: heroRotateX, rotateY: heroRotateY, transformStyle: 'preserve-3d' } : {}}
        >
          <motion.div 
            className="max-w-2xl py-20 lg:py-24"
            style={{ y: textY }}
          >
            <motion.p
              custom={0}
              variants={heroLine}
              initial="hidden"
              animate="show"
              className="mb-8 text-[11px] font-bold uppercase tracking-[0.08em] text-[rgba(250,250,250,0.6)]"
            >
              Est. 2024 · Cairo
            </motion.p>
            <motion.h1
              custom={1}
              variants={heroLine}
              initial="hidden"
              animate="show"
              className="font-[family-name:var(--font-outfit),sans-serif] text-[3.75rem] font-black leading-[0.95] tracking-[-0.03em] text-[#FAFAFA] sm:text-[5rem] md:text-[6.5rem]"
            >
              Dressed
              <br />
              <span className="italic text-[#FAFAFA]/70">for the bold</span>
            </motion.h1>
            <motion.p
              custom={2}
              variants={heroLine}
              initial="hidden"
              animate="show"
              className="mt-10 max-w-xl text-base leading-[1.85] text-[rgba(250,250,250,0.6)] sm:text-lg"
            >
              Curated silhouettes, refined materials, and theatrical luxury designed for those who move
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
          </motion.div>

          <motion.div 
            className="relative hidden lg:block"
            style={{ y: useTransform(scrollY, [0, 300], [0, 120]) }}
          >
            <div className="relative overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#111113] px-6 py-6 shadow-[0_40px_80px_rgba(0,0,0,0.3)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.1),transparent_46%)]" />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-[#1A1A1A]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(139,92,246,0.15),transparent_40%)]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'400\'><path d=\'M0 0h400v400H0z\' fill=\'%23111113\'/><path d=\'M0 100c100-50 200 50 300 0s100-100 100-100V400H0z\' fill=\'%238B5CF6\' opacity=\'0.08\'/></svg>')] bg-cover opacity-40" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-transparent" />
                <div className="relative z-10 flex h-full items-center justify-center px-10">
                  <div className="w-full max-w-[320px] rounded-[4px] border border-[rgba(139,92,246,0.3)] bg-[rgba(9,9,11,0.85)] px-8 py-12 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[rgba(250,250,250,0.6)]">Editorial</p>
                    <p className="mt-6 text-3xl font-[family-name:var(--font-outfit),sans-serif] font-bold leading-tight text-[#FAFAFA]">
                      The season collection
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="absolute inset-x-0 bottom-10 flex justify-center">
          <div className="flex h-12 w-8 flex-col items-center justify-between rounded-full border border-[rgba(139,92,246,0.4)] p-1">
            <span className="block h-1 w-full rounded-full bg-[#8B5CF6] opacity-40" />
            <span className="block h-1.5 w-1.5 rounded-full bg-[#8B5CF6] animate-bounce" />
          </div>
        </div>
      </section>

      {collections.length > 0 ? (
        <section className="bg-[#09090B] px-4 py-16 sm:px-8 lg:px-0">
          <div className="mx-auto max-w-7xl">
            <motion.div 
              className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={scrollReveal}
            >
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[rgba(250,250,250,0.6)]">Collections</p>
                <h2 className="mt-4 font-[family-name:var(--font-outfit),sans-serif] text-3xl font-black leading-tight text-[#FAFAFA]">
                  Curated edits for every look
                </h2>
              </div>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection, idx) => (
                <motion.div
                  key={collection.id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={{
                    hidden: { opacity: 0, y: 30, rotateX: 12 },
                    show: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      transition: { 
                        duration: 0.6, 
                        delay: idx * 0.1,
                        ease: [0.22, 1, 0.36, 1] as const 
                      },
                    },
                  }}
                  style={{ perspective: '1000px' }}
                  className="group"
                  whileHover={{ y: -4 }}
                >
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#111113] block transition shadow-[0_12px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_28px_60px_rgba(139,92,246,0.2)] hover:border-[#8B5CF6]"
                  >
                    <div className="h-56 overflow-hidden bg-[#1A1A1A]">
                      {collection.image ? (
                        <motion.img
                          src={collection.image}
                          alt={collection.name}
                          className="h-full w-full object-cover transition duration-300"
                          whileHover={{ scale: 1.05 }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#1A1A1A] text-sm uppercase tracking-[0.08em] text-[rgba(250,250,250,0.4)]">
                          {collection.name}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[rgba(250,250,250,0.6)]">Collection</p>
                      <h3 className="mt-3 text-xl font-bold text-[#FAFAFA]">
                        {collection.name}
                      </h3>
                      {collection.description ? (
                        <p className="mt-3 text-sm leading-6 text-[rgba(250,250,250,0.6)]">
                          {collection.description}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="border-b border-[rgba(255,255,255,0.08)] bg-[#09090B] px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-3 overflow-x-auto pb-1 sm:justify-start sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            {SHOP_CATEGORY_CHIPS.map((cat) => {
              const active = selectedCategory === cat
              return (
                <motion.button
                  key={cat}
                  type="button"
                  onClick={() => selectCategory(cat)}
                  className={`category-chip ${active ? 'category-chip-active' : 'category-chip-inactive'}`}
                  whileTap={{ scale: 0.96, translateZ: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  animate={active ? { scale: 1 } : { scale: 1 }}
                >
                  {cat}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      <section id="products" className="mx-auto max-w-7xl scroll-mt-[4.5rem] px-4 py-24 sm:px-8 sm:py-32 bg-[#09090B]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={scrollReveal}
          className="mb-16 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8B5CF6]">
              The edit
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-outfit),sans-serif] text-3xl font-black leading-tight text-[#FAFAFA] sm:text-4xl md:text-5xl">
              New arrivals
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-[1.85] text-[rgba(250,250,250,0.6)]">
            Each piece selected for texture, drape, and presence.
          </p>
        </motion.div>

        {products.length === 0 ? (
          <div className="rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#111113] p-20 text-center text-[rgba(250,250,250,0.6)]">
            The collection will appear here soon.
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#111113] p-20 text-center text-[rgba(250,250,250,0.6)]">
            <p>No pieces in this category yet.</p>
            <button
              type="button"
              onClick={() => selectCategory('All')}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#8B5CF6]"
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
