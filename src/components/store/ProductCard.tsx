'use client'

import type { Product } from '@prisma/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductImage from './ProductImage'

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] ?? null

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <motion.div
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 shadow-lg shadow-black/20"
        whileHover={{
          scale: 1.02,
          boxShadow:
            '0 0 0 1px rgba(212,175,55,0.55), 0 28px 56px -14px rgba(0,0,0,0.55), 0 0 48px rgba(212,175,55,0.1)',
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <div className="relative overflow-hidden">
          <ProductImage
            src={image}
            alt={product.name}
            className="aspect-[4/5] w-full transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        </div>
        <div className="flex flex-1 flex-col gap-2 px-6 py-6 sm:px-7 sm:py-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            {product.category}
          </p>
          <h2 className="font-[family-name:var(--font-playfair),serif] text-lg font-medium leading-snug text-white transition group-hover:text-[#D4AF37] sm:text-xl">
            {product.name}
          </h2>
          <p className="mt-auto pt-3 font-medium text-[#D4AF37]">
            EGP {product.price.toLocaleString()}
          </p>
        </div>
      </motion.div>
    </Link>
  )
}
