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
import { useHeroMouseTilt } from '@/hooks/use3DEffect'
import type { StoreCollection } from '@/lib/store-api'
import ProductCard from './ProductCard'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const heroLine = {
  hidden: { opacity: 0, y: 60, rotateX: 15 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: 0.2 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const scrollReveal = {
  hidden: { opacity: 0, y: 60, rotateX: 15 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
}

type Props = {
  products: Product[]
  collections: StoreCollection[]
  initialCategory: string
}

export default function HomeView({ products, collections, initialCategory }: Props) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const {
    ref: heroTiltRef,
    rotateX: heroRotateX,
    rotateY: heroRotateY,
    onMouseMove: heroOnMouseMove,
    onMouseLeave: heroOnMouseLeave,
    isHoverCapable,
  } = useHeroMouseTilt(10)

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
    <div className="flex flex-col overflow-x-hidden">
      <section
        ref={heroTiltRef}
        className="relative isolate min-h-dvh overflow-hidden border-b border-[rgba(184,151,106,0.24)]"
        onMouseMove={(e) => {
          if (isHoverCapable) {
            heroOnMouseMove(e)
          }
        }}
        onMouseLeave={heroOnMouseLeave}
        style={{ perspective: '1000px' }}
      >
        <div className="grid min-h-dvh lg:grid-cols-2">
          <div className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-[#1a1816] px-8 py-16 sm:px-12 lg:min-h-dvh">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,151,106,0.14),transparent_55%)]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.84 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-center"
            >
              <div className="font-serif text-[120px] font-bold leading-none text-[#b8976a] sm:text-[150px] lg:text-[220px]">
                FN
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, rotateZ: -90 }}
              animate={{ opacity: 1, rotateZ: -90 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-16 left-0 origin-center text-[11px] font-[900] uppercase tracking-[0.2em] text-[#d4b896]"
            >
              EST. 2024 · CAIRO
            </motion.p>
          </div>

          <div className="relative flex items-center bg-[#f5f2ed] px-4 py-16 sm:px-8 lg:px-16">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(184,151,106,0.08),transparent_45%)]" />
            <motion.div
              style={isHoverCapable ? {
                rotateX: heroRotateX,
                rotateY: heroRotateY,
                transformStyle: 'preserve-3d',
              } : {}}
              className="relative z-10 w-full max-w-2xl"
            >
              <motion.p
                custom={0}
                variants={heroLine}
                initial="hidden"
                animate="show"
                className="text-label mb-8 text-[#b8976a]"
              >
                Dramatic luxury
              </motion.p>

              <motion.h1
                custom={1}
                variants={heroLine}
                initial="hidden"
                animate="show"
                className="font-serif leading-[0.92] tracking-[-0.04em] text-[#0f0e0d]"
              >
                <span className="block text-[54px] font-[300] sm:text-[84px] lg:text-[118px]">
                  Dressed
                </span>
                <span className="block text-[54px] font-[900] text-[#b8976a] sm:text-[84px] lg:text-[118px]">
                  Bold
                </span>
              </motion.h1>

              <motion.p
                custom={2}
                variants={heroLine}
                initial="hidden"
                animate="show"
                className="mt-8 max-w-lg text-[14px] leading-7 text-[#7a7068] sm:text-[16px]"
              >
                Curated silhouettes, refined materials, and theatrical luxury designed
                for those who move with confidence and intention.
              </motion.p>

              <motion.div
                custom={3}
                variants={heroLine}
                initial="hidden"
                animate="show"
                className="mt-12"
              >
                <a href="#products" className="dramatic-button inline-flex min-w-[220px] bg-[#0f0e0d] text-[#f5f2ed] hover:bg-[#f5f2ed] hover:text-[#0f0e0d]">
                  Explore collection
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-[11px] font-[900] uppercase tracking-[0.2em] text-[#7a7068]">Scroll</p>
            <div className="h-14 w-px bg-[linear-gradient(180deg,#b8976a,transparent)]" />
          </motion.div>
        </div>
      </section>

      {collections.length > 0 ? (
        <section className="px-4 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="relative mb-16">
              <div className="section-number">01</div>
              <motion.div
                className="relative z-10"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                variants={scrollReveal}
              >
                <p className="text-label text-[#b8976a]">Collections</p>
                <h2 className="mt-4 font-serif text-[40px] font-[300] leading-none text-[#0f0e0d] sm:text-[56px] lg:text-[80px]">
                  Curated <span className="font-[900]">Edits</span>
                </h2>
              </motion.div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection, idx) => (
                <motion.div
                  key={collection.id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={{
                    hidden: { opacity: 0, y: 60, rotateX: 12 },
                    show: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      transition: {
                        duration: 0.7,
                        delay: idx * 0.12,
                        ease: [0.22, 1, 0.36, 1] as const,
                      },
                    },
                  }}
                  style={{ perspective: '1000px' }}
                  className={`${idx === 0 ? 'sm:col-span-2' : ''}`}
                  whileHover={{ y: -8 }}
                >
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="dramatic-card group relative block h-full overflow-hidden"
                  >
                    <div className={`overflow-hidden bg-[#e8e0d4] ${idx === 0 ? 'h-80 sm:h-96' : 'h-64'}`}>
                      {collection.mediaUrl ? (
                        collection.mediaType === 'video' ? (
                          <video
                            src={collection.mediaUrl}
                            className="h-full w-full object-cover"
                            muted
                            autoPlay
                            loop
                            playsInline
                          />
                        ) : (
                          <motion.img
                            src={collection.mediaUrl}
                            alt={collection.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            whileHover={{ scale: 1.08 }}
                          />
                        )
                      ) : collection.coverImage ? (
                        <motion.img
                          src={collection.coverImage}
                          alt={collection.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                          whileHover={{ scale: 1.08 }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center text-[14px] uppercase tracking-[0.2em] text-[#7a7068]">
                          {collection.title}
                        </div>
                      )}
                    </div>

                    <div className="p-6 sm:p-8">
                      <p className="text-label text-[#7a7068]">Collection</p>
                      <h3 className="mt-3 font-serif text-[28px] font-[900] leading-none text-[#0f0e0d]">
                        {collection.title}
                      </h3>
                      {collection.description ? (
                        <p className="mt-4 text-[14px] leading-7 text-[#7a7068]">
                          {collection.description}
                        </p>
                      ) : null}
                      <p className="mt-4 text-[11px] font-[900] uppercase tracking-[0.2em] text-[#b8976a]">
                        {collection.productCount} {collection.productCount === 1 ? 'product' : 'products'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="sticky top-14 z-40 border-y border-[rgba(184,151,106,0.2)] bg-[rgba(245,242,237,0.92)] px-4 py-4 backdrop-blur md:top-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-3 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden">
            {SHOP_CATEGORY_CHIPS.map((cat) => {
              const active = selectedCategory === cat
              return (
                <motion.button
                  key={cat}
                  type="button"
                  onClick={() => selectCategory(cat)}
                  className={`category-chip ${active ? 'category-chip-active' : 'category-chip-inactive'}`}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {cat}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      <section id="products" className="mx-auto w-full max-w-7xl scroll-mt-32 px-4 py-16 sm:px-8 md:py-24">
        <div className="relative mb-16 lg:mb-24">
          <div className="section-number">02</div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={scrollReveal}
            className="relative z-10"
          >
            <p className="text-label text-[#b8976a]">The edit</p>
            <h2 className="mt-4 font-serif text-[40px] font-[300] leading-none text-[#0f0e0d] sm:text-[56px] lg:text-[80px]">
              New <span className="font-[900]">Arrivals</span>
            </h2>
            <p className="mt-8 max-w-md text-[14px] leading-7 text-[#7a7068] sm:text-[16px]">
              Each piece selected for texture, drape, and presence.
            </p>
          </motion.div>
        </div>

        {products.length === 0 ? (
          <div className="dramatic-card p-12 text-center text-[14px] text-[#7a7068] md:p-16">
            The collection will appear here soon.
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="dramatic-card p-12 text-center md:p-16">
            <p className="text-[14px] text-[#7a7068]">No pieces in this category yet.</p>
            <button type="button" onClick={() => selectCategory('All')} className="btn-secondary mt-6">
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
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
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
