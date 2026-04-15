'use client'

import type { Product } from '@prisma/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { use3DCard } from '@/hooks/use3DEffect'
import ProductImage from './ProductImage'

let cardCounter = 0

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] ?? null
  const hoverImage = product.images[1] ?? null
  const { ref, rotateX, rotateY, translateZ, onMouseMove, onMouseLeave, isHoverCapable, mousePos, shadowStyle } =
    use3DCard(12, { deepShadow: true, enableShimmer: true })
  
  // Generate card number
  const [cardNumber] = useState(() => {
    cardCounter += 1
    return String(cardCounter).padStart(2, '0')
  })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHoverCapable) return
    onMouseMove(e)
  }

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <motion.div
        ref={ref}
        className="group relative flex h-full flex-col overflow-hidden border border-[rgba(184,151,106,0.3)] bg-[#f5f2ed] shadow-[0 4px 12px rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0 20px 40px rgba(15,14,13,0.15)] hover:border-[#b8976a]"
        onMouseMove={handleMouseMove}
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
        whileHover={!isHoverCapable ? { y: -4 } : { y: -4 }}
      >
        {/* Large Card Number - Top Right Corner */}
        <motion.div
          initial={{ opacity: 0.3 }}
          whileHover={{ opacity: 0.2 }}
          className="absolute top-4 right-4 z-5"
        >
          <div className="text-[72px] sm:text-[96px] lg:text-[120px] font-serif font-light text-[#e8e0d4] leading-none pointer-events-none -translate-y-8">
            {cardNumber}
          </div>
        </motion.div>

        {/* Image Container - Full Bleed */}
        <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden bg-[#e8e0d4] flex-shrink-0" style={{ perspective: '1000px' }}>
          <motion.div style={{ transformStyle: 'preserve-3d' }}>
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

          {/* Gold Shimmer Effect on Hover */}
          {isHoverCapable && (
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(
                  circle 80px at ${mousePos.x}px ${mousePos.y}px,
                  rgba(184, 151, 106, 0.2) 0%,
                  transparent 100%
                )`,
              }}
            />
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between px-6 py-6 sm:px-7 sm:py-7">
          {/* Product Category - Label */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#7a7068]">
              {product.category}
            </p>
          </div>

          {/* Product Name - Large Serif */}
          <h2 className="font-serif text-[24px] sm:text-[28px] lg:text-[32px] font-bold leading-tight text-[#0f0e0d] transition-all duration-300 group-hover:text-[#b8976a]">
            {product.name}
          </h2>

          {/* Price - Bottom Corner */}
          <div className="mt-auto flex items-baseline justify-between">
            <p className="text-[14px] font-normal text-[#7a7068]">
              EGP {product.price.toLocaleString()}
            </p>
            <motion.span
              className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b8976a] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            >
              Explore →
            </motion.span>
          </div>
        </div>

        {/* Hover Overlay - Slide Up from Bottom */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[rgba(15,14,13,0.95)] via-[rgba(15,14,13,0.6)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 sm:p-7 pointer-events-none"
          initial={{ y: 20 }}
          whileHover={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#d4b896]">
            {product.category}
          </p>
          <h3 className="mt-2 font-serif text-[20px] sm:text-[24px] font-bold leading-tight text-[#f5f2ed]">
            {product.name}
          </h3>
          <p className="mt-4 text-[13px] leading-[1.6] text-[rgba(245,242,237,0.85)]">
            EGP {product.price.toLocaleString()}
          </p>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#d4b896]">
            ↵ View details
          </p>
        </motion.div>
      </motion.div>
    </Link>
  )
}
