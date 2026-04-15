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
  collections: Collection[]
  initialCategory: string
}

export default function HomeView({ products, collections, initialCategory }: Props) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const heroSectionRef = useRef<HTMLDivElement>(null)
  const { rotateX: heroRotateX, rotateY: heroRotateY, onMouseMove: heroOnMouseMove, onMouseLeave: heroOnMouseLeave, isHoverCapable } = useHeroMouseTilt(12)
  
  const { scrollY } = useScroll()

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
    <div className="flex flex-col overflow-hidden bg-[#f5f2ed]">
      {/* DRAMATIC HERO SECTION - Split Layout */}
      <section 
        ref={heroSectionRef}
        className="relative isolate min-h-dvh overflow-hidden"
        onMouseMove={(e) => {
          if (isHoverCapable) {
            heroOnMouseMove(e as any)
          }
        }}
        onMouseLeave={heroOnMouseLeave}
        style={{ perspective: '1000px' }}
      >
        {/* Left Panel - Dark with FN Monogram */}
        <div className="absolute inset-0 lg:static lg:w-1/2 bg-[#1a1816] flex flex-col items-center justify-center p-8 sm:p-12 order-2 lg:order-1">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Large FN Monogram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="font-serif text-[120px] sm:text-[150px] lg:text-[200px] font-bold text-[#b8976a] leading-none">
                FN
              </div>
            </motion.div>
            
            {/* Vertical Text - EST. 2024 CAIRO */}
            <motion.div
              initial={{ opacity: 0, rotateZ: -90 }}
              animate={{ opacity: 1, rotateZ: -90 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-8 sm:bottom-12 left-8 text-nowrap origin-center"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d4b896]">
                EST. 2024 · CAIRO
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Panel - Cream with Content */}
        <div className="absolute inset-0 lg:static lg:w-1/2 bg-[#f5f2ed] flex flex-col items-start justify-center p-8 sm:p-12 lg:p-16 order-1 lg:order-2">
          <motion.div
            style={isHoverCapable ? { 
              rotateX: heroRotateX, 
              rotateY: heroRotateY, 
              transformStyle: 'preserve-3d' 
            } : {}}
            className="w-full max-w-xl"
          >
            {/* Label */}
            <motion.p
              custom={0}
              variants={heroLine}
              initial="hidden"
              animate="show"
              className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#7a7068] mb-8"
            >
              DRAMATIC LUXURY
            </motion.p>

            {/* Main Heading with Weight Contrast */}
            <motion.h1
              custom={1}
              variants={heroLine}
              initial="hidden"
              animate="show"
              className="font-serif leading-[0.95] tracking-[-0.03em]"
            >
              <span className="text-[60px] sm:text-[80px] lg:text-[120px] font-light text-[#0f0e0d] block">
                DRESSED
              </span>
              <span className="text-[60px] sm:text-[80px] lg:text-[120px] font-bold text-[#b8976a] block">
                BOLD
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              custom={2}
              variants={heroLine}
              initial="hidden"
              animate="show"
              className="mt-12 text-[16px] leading-[1.8] text-[#7a7068] max-w-md"
            >
              Curated silhouettes, refined materials, and theatrical luxury designed for those who move with confidence and intention.
            </motion.p>

            {/* CTA Button - Full Width */}
            <motion.div
              custom={3}
              variants={heroLine}
              initial="hidden"
              animate="show"
              className="mt-16 w-full"
            >
              <a
                href="#products"
                className="block w-full dramatic-button text-center py-4 sm:py-5 text-[13px] sm:text-[14px]"
              >
                EXPLORE COLLECTION
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Down Arrow Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden lg:block">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7a7068]">Scroll</p>
            <svg className="w-5 h-5 text-[#b8976a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="h-px bg-[#b8976a] opacity-30 w-full" />

      {/* COLLECTIONS SECTION */}
      {collections.length > 0 ? (
        <section className="bg-[#f5f2ed] px-4 py-20 sm:px-8 sm:py-32 lg:px-0">
          <div className="mx-auto max-w-7xl">
            {/* Section Number Overlay */}
            <div className="relative mb-16">
              <div className="section-number">01</div>
              
              <motion.div 
                className="relative z-10"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                variants={scrollReveal}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#7a7068]">Collections</p>
                <h2 className="mt-4 font-serif text-[48px] sm:text-[64px] lg:text-[80px] font-bold leading-tight text-[#0f0e0d]">
                  Curated Edits
                </h2>
              </motion.div>
            </div>

            {/* Masonry Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                        ease: [0.22, 1, 0.36, 1] as const 
                      },
                    },
                  }}
                  style={{ perspective: '1000px' }}
                  className={`group ${idx === 0 ? 'sm:col-span-2 lg:row-span-2' : ''}`}
                  whileHover={{ y: -8 }}
                >
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="overflow-hidden border border-[rgba(184,151,106,0.2)] bg-[#f5f2ed] block transition duration-300 hover:border-[#b8976a] shadow-[0 4px 12px rgba(0,0,0,0.06)] hover:shadow-[0 20px 40px rgba(15,14,13,0.15)]"
                  >
                    {/* Image Container */}
                    <div className={`overflow-hidden bg-[#e8e0d4] ${idx === 0 ? 'h-80 sm:h-96' : 'h-56'}`}>
                      {collection.image ? (
                        <motion.img
                          src={collection.image}
                          alt={collection.name}
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                          whileHover={{ scale: 1.08 }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.15em] text-[#7a7068]">
                          {collection.name}
                        </div>
                      )}
                    </div>

                    {/* Content Overlay at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(15,14,13,0.9)] via-[rgba(15,14,13,0.4)] to-transparent p-6 sm:p-8 text-[#f5f2ed] opacity-0 group-hover:opacity-100 transition duration-300">
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#d4b896]">Collection</p>
                      <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold">
                        {collection.name}
                      </h3>
                      {collection.description ? (
                        <p className="mt-3 text-sm leading-6 text-[rgba(245,242,237,0.8)]">
                          {collection.description}
                        </p>
                      ) : null}
                    </div>
                    
                    {/* Static Content */}
                    <div className="p-6 sm:p-8">
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#7a7068]">Collection</p>
                      <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#0f0e0d]">
                        {collection.name}
                      </h3>
                      {collection.description ? (
                        <p className="mt-3 text-sm leading-6 text-[#7a7068]">
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

      {/* SECTION DIVIDER */}
      <div className="h-px bg-[#b8976a] opacity-30 w-full" />

      {/* CATEGORY FILTER */}
      <div className="border-b border-[#b8976a] border-opacity-20 bg-[#f5f2ed] px-4 py-8 sm:px-8 sticky top-16 z-40">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-4 overflow-x-auto pb-2 sm:justify-start sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            {SHOP_CATEGORY_CHIPS.map((cat) => {
              const active = selectedCategory === cat
              return (
                <motion.button
                  key={cat}
                  type="button"
                  onClick={() => selectCategory(cat)}
                  className={`whitespace-nowrap font-serif text-[24px] sm:text-[28px] lg:text-[32px] font-${active ? 'bold' : 'light'} tracking-tight transition-all duration-300 pb-2 ${
                    active 
                      ? 'text-[#0f0e0d] border-b-2 border-[#b8976a]' 
                      : 'text-[#7a7068] border-b-2 border-transparent hover:text-[#0f0e0d]'
                  }`}
                  whileTap={{ scale: 0.96 }}
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

      {/* PRODUCTS SECTION */}
      <section id="products" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-24 sm:px-8 sm:py-32 lg:px-0 bg-[#f5f2ed] w-full">
        <div className="relative mb-16 lg:mb-24">
          {/* Section Number */}
          <div className="section-number">02</div>
          
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={scrollReveal}
            className="relative z-10"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#7a7068]">
              The edit
            </p>
            <h2 className="mt-4 font-serif text-[48px] sm:text-[64px] lg:text-[80px] font-bold leading-tight text-[#0f0e0d]">
              New Arrivals
            </h2>
            <p className="mt-8 max-w-md text-[16px] leading-[1.8] text-[#7a7068]">
              Each piece selected for texture, drape, and presence.
            </p>
          </motion.div>
        </div>

        {products.length === 0 ? (
          <div className="border border-[#b8976a] border-opacity-20 bg-[rgba(232,224,212,0.5)] p-20 text-center text-[#7a7068]">
            The collection will appear here soon.
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="border border-[#b8976a] border-opacity-20 bg-[rgba(232,224,212,0.5)] p-20 text-center text-[#7a7068]">
            <p>No pieces in this category yet.</p>
            <button
              type="button"
              onClick={() => selectCategory('All')}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-[#b8976a]"
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
