'use client'

import type { Product } from '@prisma/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useMemo } from 'react'
import { use3DCard } from '@/hooks/use3DEffect'
import ProductImage from './ProductImage'

function cardMark(id: string) {
  const total = Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return String((total % 99) + 1).padStart(2, '0')
}

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] ?? null
  const hoverImage = product.images[1] ?? null
  const {
    ref,
    rotateX,
    rotateY,
    translateZ,
    onMouseMove,
    onMouseLeave,
    isHoverCapable,
    mousePos,
    shadowStyle,
  } = use3DCard(12, { deepShadow: true, enableShimmer: true })

  const badge = useMemo(() => cardMark(product.id), [product.id])

  return (
    <Link href={`/products/${product.id}`} className="block h-full focus-visible:outline-none">
      <motion.article
        ref={ref}
        className="dramatic-card group relative flex h-full flex-col overflow-hidden"
        onMouseMove={(e) => {
          if (!isHoverCapable) return
          onMouseMove(e)
        }}
        onMouseLeave={onMouseLeave}
        style={
          isHoverCapable
            ? {
                rotateX,
                rotateY,
                translateZ,
                transformStyle: 'preserve-3d',
                boxShadow: shadowStyle,
              }
            : {}
        }
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
        whileHover={{ y: -4 }}
      >
        <div className="pointer-events-none absolute right-4 top-4 z-10 text-[72px] font-serif font-[300] leading-none text-[rgba(184,151,106,0.18)] sm:text-[92px]">
          {badge}
        </div>

        <div className="relative aspect-[4/5] overflow-hidden bg-[#e8e0d4]" style={{ perspective: '1000px' }}>
          <motion.div style={{ transformStyle: 'preserve-3d' }} className="h-full">
            <ProductImage
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {hoverImage ? (
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                <ProductImage
                  src={hoverImage}
                  alt={`${product.name} alternate view`}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </motion.div>

          {isHoverCapable ? (
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle 80px at ${mousePos.x}px ${mousePos.y}px, rgba(184, 151, 106, 0.18) 0%, transparent 100%)`,
              }}
            />
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-4 px-6 py-6">
          <p className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#7a7068]">
            {product.category}
          </p>
          <h2 className="font-serif text-[20px] font-[900] leading-tight text-[#0f0e0d] transition-colors duration-150 group-hover:text-[#b8976a]">
            {product.name}
          </h2>
          <div className="mt-auto flex items-end justify-between gap-4">
            <p className="text-[16px] font-[900] text-[#b8976a]">
              EGP {product.price.toLocaleString()}
            </p>
            <span className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#7a7068] transition-colors duration-150 group-hover:text-[#0f0e0d]">
              View
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}
