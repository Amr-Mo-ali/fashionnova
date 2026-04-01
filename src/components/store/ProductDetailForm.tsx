'use client'

import type { Product } from '@prisma/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useCart } from './CartProvider'
import ProductImage from './ProductImage'

export default function ProductDetailForm({ product }: { product: Product }) {
  const router = useRouter()
  const { addLine, openCartDrawer } = useCart()
  const [added, setAdded] = useState(false)

  const sizes = product.sizes.length > 0 ? product.sizes : []
  const colors = product.colors.length > 0 ? product.colors : []
  const productImages = product.images.length > 0 ? product.images : []
  const [selectedImage, setSelectedImage] = useState(productImages[0] ?? null)
  const [size, setSize] = useState(sizes[0] ?? '')
  const [color, setColor] = useState(colors[0] ?? '')
  const [quantity, setQuantity] = useState(1)

  const canAdd = useMemo(() => {
    if (product.stock < 1) return false
    if (sizes.length > 0 && !size) return false
    if (colors.length > 0 && !color) return false
    return true
  }, [product.stock, sizes.length, colors.length, size, color])

  function handleAddToCart() {
    if (!canAdd || quantity < 1 || quantity > product.stock) return
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
    setTimeout(() => setAdded(false), 2000)
  }

  const chipActive =
    'border-[var(--gold)] bg-[var(--gold-light)]/25 text-[var(--gold)]'
  const chipIdle =
    'border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--ink)]'

  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:items-start">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.3em] text-[var(--muted)]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-[var(--ink)]">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-[var(--ink)]">{product.category}</li>
          </ol>
        </nav>

        <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--white)] shadow-[0_24px_60px_rgba(15,14,13,0.1)]">
          <ProductImage
            src={selectedImage}
            alt={product.name}
            className="aspect-[4/5] w-full"
          />
        </div>

        {productImages.length > 1 ? (
          <div className="mt-5 grid grid-cols-4 gap-3">
            {productImages.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setSelectedImage(src)}
                className={`overflow-hidden rounded-xl border p-1 transition ${
                  selectedImage === src
                    ? 'border-[var(--gold)]'
                    : 'border-[var(--border)] hover:border-[var(--gold)]'
                }`}
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
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
          {product.category}
        </p>
        <h1 className="mt-5 font-[family-name:var(--font-cormorant),serif] text-4xl leading-tight text-[var(--ink)] sm:text-5xl md:text-6xl">
          {product.name}
        </h1>
        <p className="mt-6 text-3xl font-semibold text-[var(--gold)]">
          EGP {product.price.toLocaleString()}
        </p>
        <p className="mt-8 text-base leading-[1.85] text-[var(--muted)]">
          {product.description}
        </p>
        <p className="mt-6 text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        <div className="mt-12 space-y-8">
          {sizes.length > 0 ? (
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
                Size
              </p>
              <div className="flex flex-wrap gap-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-h-[44px] rounded-none border px-5 py-3 text-sm font-medium transition ${
                      size === s ? chipActive : chipIdle
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {colors.length > 0 ? (
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
                Color
              </p>
              <div className="flex flex-wrap gap-3">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`min-h-[44px] rounded-none border px-5 py-3 text-sm font-medium transition ${
                      color === c ? chipActive : chipIdle
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
              Quantity
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-none border border-[var(--border)] text-[var(--ink)] transition hover:border-[var(--gold)]"
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
                className="w-20 border-b border-[var(--border)] bg-transparent py-2 text-center text-[var(--ink)] focus:border-[var(--gold)] focus:outline-none"
              />
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="flex h-11 w-11 items-center justify-center rounded-none border border-[var(--border)] text-[var(--ink)] transition hover:border-[var(--gold)]"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
            <button
              type="button"
              disabled={!canAdd}
              onClick={handleAddToCart}
              className="min-h-[52px] rounded-none border border-[var(--ink)] bg-[var(--ink)] px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--cream)] transition hover:bg-[var(--gold)] disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:bg-[var(--border)] disabled:text-[var(--muted)]"
            >
              {added ? 'Added to bag' : 'Add to bag'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/cart')}
              className="min-h-[52px] rounded-none border border-[var(--border)] px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:border-[var(--gold)]"
            >
              View bag
            </button>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--white)] p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">Shipping</p>
            <p className="mt-3 text-sm leading-[1.8] text-[var(--muted)]">
              Complimentary express delivery on all orders. Returns accepted within 14 days of receipt.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
