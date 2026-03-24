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
        className="group flex h-full flex-col overflow-hidden rounded-none border border-[#e8e0d4] bg-[#ffffff] shadow-[0_10px_30px_rgba(15,14,13,0.08)]"
        whileHover={{
          scale: 1.02,
          boxShadow:
            '0 0 0 1px rgba(184,151,106,0.65), 0 24px 46px -18px rgba(15,14,13,0.22), 0 0 26px rgba(184,151,106,0.18)',
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <div className="relative overflow-hidden">
          <ProductImage
            src={image}
            alt={product.name}
            className="aspect-[4/5] w-full transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#0f0e0d]/35 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        </div>
        <div className="flex flex-1 flex-col gap-2 px-6 py-6 sm:px-7 sm:py-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7a7068]">
            {product.category}
          </p>
          <h2 className="font-[family-name:var(--font-playfair),serif] text-lg font-medium leading-snug text-[#0f0e0d] transition group-hover:text-[#b8976a] sm:text-xl">
            {product.name}
          </h2>
          <p className="mt-auto pt-3 font-medium text-[#b8976a]">
            EGP {product.price.toLocaleString()}
          </p>
        </div>
      </motion.div>
    </Link>
  )
}
