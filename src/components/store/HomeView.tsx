'use client'

import type { Product } from '@prisma/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard from './ProductCard'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
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

export default function HomeView({ products }: { products: Product[] }) {
  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[calc(100dvh-4.25rem)] flex-col items-center justify-center overflow-hidden border-b border-zinc-800/40 px-4 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,175,55,0.12),transparent)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(212,175,55,0.04),transparent_45%)]" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.p
            custom={0}
            variants={heroLine}
            initial="hidden"
            animate="show"
            className="mb-6 text-xs font-medium uppercase tracking-[0.35em] text-[#D4AF37]"
          >
            Est. 2024 · Cairo
          </motion.p>
          <motion.h1
            custom={1}
            variants={heroLine}
            initial="hidden"
            animate="show"
            className="font-[family-name:var(--font-playfair),serif] text-5xl font-medium leading-[1.05] tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            Refined
            <br />
            <span className="text-zinc-500">for the</span> bold
          </motion.h1>
          <motion.p
            custom={2}
            variants={heroLine}
            initial="hidden"
            animate="show"
            className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            Curated silhouettes, uncompromising craft. Discover pieces designed to move with you
            from dusk to dawn.
          </motion.p>
          <motion.div
            custom={3}
            variants={heroLine}
            initial="hidden"
            animate="show"
            className="mt-12"
          >
            <Link
              href="#products"
              className="inline-flex rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37] backdrop-blur-sm transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/20"
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
          <div className="flex h-10 w-6 justify-center rounded-full border border-zinc-700 pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="h-1.5 w-1 rounded-full bg-[#D4AF37]"
            />
          </div>
        </motion.div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mb-14 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
              The edit
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-playfair),serif] text-3xl font-medium text-white sm:text-4xl">
              New arrivals
            </h2>
          </div>
          <p className="max-w-sm text-sm text-zinc-500">
            Each piece selected for texture, drape, and presence.
          </p>
        </motion.div>

        {products.length === 0 ? (
          <p className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 py-20 text-center text-zinc-500">
            The collection will appear here soon.
          </p>
        ) : (
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {products.map((p) => (
              <motion.div key={p.id} variants={item} className="h-full">
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  )
}
