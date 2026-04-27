'use client'

import type { Product } from '@prisma/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useCart } from './CartProvider'
import ProductImage from './ProductImage'

function isArabicText(text: string) {
  return /[\u0600-\u06FF]/.test(text)
}

function normalizeSwatchColor(color: string) {
  return CSS.supports('color', color) ? color : '#7a7068'
}

export default function ProductDetailForm({ product }: { product: Product }) {
  const router = useRouter()
  const { addLine, openCartDrawer } = useCart()
  const [added, setAdded] = useState(false)
  const resetAddedTimeout = useRef<number | null>(null)

  const sizes = product.sizes.length > 0 ? product.sizes : []
  const colors = product.colors.length > 0 ? product.colors : []
  const productImages = product.images.length > 0 ? product.images : []
  const [selectedImage, setSelectedImage] = useState(productImages[0] ?? null)
  const [size, setSize] = useState(sizes[0] ?? '')
  const [color, setColor] = useState(colors[0] ?? '')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    return () => {
      if (resetAddedTimeout.current) {
        window.clearTimeout(resetAddedTimeout.current)
      }
    }
  }, [])

  const canAdd = useMemo(() => {
    if (product.stock < 1) return false
    if (sizes.length > 0 && !size) return false
    if (colors.length > 0 && !color) return false
    return quantity >= 1 && quantity <= product.stock
  }, [product.stock, sizes.length, colors.length, size, color, quantity])

  function handleAddToCart() {
    if (!canAdd) return

    addLine({
      productId: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: selectedImage,
      size: sizes.length > 0 ? size : 'One size',
      color: colors.length > 0 ? color : 'Default',
      quantity,
    })

    setAdded(true)
    openCartDrawer()

    if (resetAddedTimeout.current) {
      window.clearTimeout(resetAddedTimeout.current)
    }

    resetAddedTimeout.current = window.setTimeout(() => setAdded(false), 2000)
  }

  const isArabic = isArabicText(product.description)

  return (
    <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <nav aria-label="Breadcrumb" className="text-[11px] font-[900] uppercase tracking-[0.2em] text-[#7a7068]">
          <p>
            <Link href="/" className="transition hover:text-[#b8976a]">
              Home
            </Link>{' '}
            <span className="mx-2">·</span>
            <span className="text-[#b8976a]">{product.category}</span>
          </p>
        </nav>

        <div className="dramatic-card mt-6 overflow-hidden">
          <ProductImage
            src={selectedImage}
            alt={product.name}
            className="aspect-[4/5] w-full"
          />
        </div>

        {productImages.length > 1 ? (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {productImages.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setSelectedImage(src)}
                className={`overflow-hidden border p-1 transition ${
                  selectedImage === src
                    ? 'border-[#b8976a]'
                    : 'border-[rgba(184,151,106,0.2)] hover:border-[#b8976a]'
                }`}
                aria-label={`View ${product.name} thumbnail`}
              >
                <ProductImage
                  src={src}
                  alt={`${product.name} thumbnail`}
                  className="aspect-[4/5] w-full"
                />
              </button>
            ))}
          </div>
        ) : null}
      </motion.div>

      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <p className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#7a7068]">
          {product.category}
        </p>
        <h1 className="mt-4 font-serif text-[42px] leading-none text-[#0f0e0d] sm:text-[56px]">
          <span className="font-[300]">The </span>
          <span className="font-[900]">{product.name}</span>
        </h1>
        <p className="mt-6 text-[16px] font-[900] text-[#b8976a]">
          EGP {product.price.toLocaleString()}
        </p>
        <p className={`mt-8 text-[14px] leading-7 text-[#7a7068] sm:text-[16px] ${isArabic ? 'arabic text-right' : ''}`}>
          {product.description}
        </p>
        <p className="mt-6 text-[11px] font-[900] uppercase tracking-[0.2em] text-[#7a7068]">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        <div className="mt-12 space-y-6">
          {sizes.length > 0 ? (
            <div>
              <p className="mb-3 text-[10px] font-[900] uppercase tracking-[0.2em] text-[#7a7068]">
                Size
              </p>
              <div className="flex flex-wrap gap-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`category-chip min-w-[64px] ${size === s ? 'category-chip-active' : 'category-chip-inactive'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {colors.length > 0 ? (
            <div>
              <p className="mb-3 text-[10px] font-[900] uppercase tracking-[0.2em] text-[#7a7068]">
                Color
              </p>
              <div className="flex flex-wrap gap-3">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`flex min-h-12 min-w-12 items-center justify-center border px-3 text-[10px] font-[900] uppercase tracking-[0.2em] ${
                      color === c
                        ? 'border-[#0f0e0d] bg-[#0f0e0d] text-[#f5f2ed]'
                        : 'border-[rgba(184,151,106,0.24)] text-[#0f0e0d] hover:border-[#b8976a]'
                    }`}
                    aria-label={`Choose color ${c}`}
                  >
                    <span
                      className="mr-2 inline-flex h-3 w-3 border border-[rgba(15,14,13,0.2)]"
                      style={{ backgroundColor: normalizeSwatchColor(c) }}
                      aria-hidden
                    />
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <p className="mb-3 text-[10px] font-[900] uppercase tracking-[0.2em] text-[#7a7068]">
              Quantity
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-12 w-12 items-center justify-center border border-[rgba(184,151,106,0.24)] text-[#0f0e0d] transition hover:border-[#b8976a]"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (!Number.isFinite(v)) return
                  setQuantity(Math.min(product.stock, Math.max(1, Math.round(v))))
                }}
                className="dramatic-input w-24 text-center"
                aria-label="Product quantity"
              />
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="flex h-12 w-12 items-center justify-center border border-[rgba(184,151,106,0.24)] text-[#0f0e0d] transition hover:border-[#b8976a]"
              >
                +
              </button>
            </div>
          </div>

          {product.stock < 1 ? (
            <div className="pill-badge">Out of stock</div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              disabled={!canAdd}
              onClick={handleAddToCart}
              className="dramatic-button w-full bg-[#0f0e0d] text-[#f5f2ed] hover:bg-[#f5f2ed] hover:text-[#0f0e0d]"
            >
              {added ? 'Added to bag' : 'Add to bag'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/cart')}
              className="btn-secondary w-full"
            >
              View bag
            </button>
          </div>

          <div className="border-t border-[rgba(184,151,106,0.2)] pt-6">
            <div className="info-bar bg-[rgba(184,151,106,0.08)]">
              <span className="text-base" aria-hidden>i</span>
              <span>Complimentary express delivery on all orders.</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
