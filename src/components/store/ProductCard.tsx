'use client'

import type { Product } from '@prisma/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductImage from './ProductImage'

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] ?? null
  const hoverImage = product.images[1] ?? null

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <motion.div
        className="group flex h-full flex-col overflow-hidden rounded-[4px] bg-[var(--white)] shadow-[0_12px_25px_rgba(15,14,13,0.06)] transition duration-300 hover:shadow-[0_18px_50px_rgba(15,14,13,0.18)]"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <div className="relative overflow-hidden">
          <ProductImage
            src={image}
            alt={product.name}
            className="aspect-[3/4] w-full transition duration-[700ms] group-hover:scale-[1.03]"
          />
          {hoverImage ? (
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
              <ProductImage
                src={hoverImage}
                alt={`${product.name} alternate view`}
                className="aspect-[3/4] w-full"
              />
            </div>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-2 px-6 py-6 sm:px-7 sm:py-7">
          <p className="text-[11px] uppercase tracking-[0.15em] text-[#999]">
            {product.category}
          </p>
          <h2 className="font-[family-name:var(--font-cormorant),serif] text-[18px] leading-snug text-[var(--ink)] transition group-hover:text-[var(--gold)]">
            {product.name}
          </h2>
          <p className="mt-auto text-[14px] font-normal text-[#555]">
            EGP {product.price.toLocaleString()}
          </p>
          <span className="mt-3 inline-block text-[12px] underline underline-offset-4 text-[var(--nav)] opacity-90">
            View piece
          </span>
        </div>
      </motion.div>
    </Link>
  )
}
