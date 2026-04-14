'use client'

import type { Product } from '@prisma/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { use3DCard } from '@/hooks/use3DEffect'
import ProductImage from './ProductImage'

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] ?? null
  const hoverImage = product.images[1] ?? null
  const { ref, rotateX, rotateY, translateZ, onMouseMove, onMouseLeave, isHoverCapable } =
    use3DCard(8)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHoverCapable) return
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
    onMouseMove(e)
  }

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <motion.div
        ref={ref}
        className="group relative flex h-full flex-col overflow-hidden rounded-[4px] bg-[#111113] border border-[rgba(255,255,255,0.08)] shadow-[0_12px_25px_rgba(0,0,0,0.3)] transition duration-300 hover:shadow-[0_28px_60px_rgba(139,92,246,0.2)] hover:border-[#8B5CF6]"
        onMouseMove={handleMouseMove}
        onMouseLeave={onMouseLeave}
        style={
          isHoverCapable
            ? {
                rotateX,
                rotateY,
                translateZ,
                transformStyle: 'preserve-3d',
              }
            : {}
        }
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
        whileHover={!isHoverCapable ? { scale: 1.01 } : {}}
      >
        <div className="relative overflow-hidden" style={{ perspective: '1000px' }}>
          <motion.div style={{ transformStyle: 'preserve-3d' }}>
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
          </motion.div>

          {/* Purple shimmer line that follows mouse */}
          {isHoverCapable && (
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{
                background: `radial-gradient(
                  circle 60px at ${mousePos.x}px ${mousePos.y}px,
                  rgba(139, 92, 246, 0.3) 0%,
                  transparent 100%
                )`,
              }}
            />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 px-6 py-6 sm:px-7 sm:py-7">
          <p className="text-[11px] uppercase tracking-[0.08em] font-bold text-[rgba(250,250,250,0.6)]">
            {product.category}
          </p>
          <h2 className="font-[family-name:var(--font-outfit),sans-serif] text-[18px] font-bold leading-snug text-[#FAFAFA] transition group-hover:text-[#8B5CF6]">
            {product.name}
          </h2>
          <p className="mt-auto text-[14px] font-normal text-[rgba(250,250,250,0.6)]">
            EGP {product.price.toLocaleString()}
          </p>
          <span className="mt-3 inline-block text-[12px] underline underline-offset-4 text-[#8B5CF6] opacity-90">
            View piece
          </span>
        </div>
      </motion.div>
    </Link>
  )
}
