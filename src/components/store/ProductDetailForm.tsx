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

  const [size, setSize] = useState(sizes[0] ?? '')
  const [color, setColor] = useState(colors[0] ?? '')
  const [quantity, setQuantity] = useState(1)

  const image = product.images[0] ?? null

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
      image,
      size: sizes.length > 0 ? size : 'One size',
      color: colors.length > 0 ? color : 'Default',
      quantity,
    })
    setAdded(true)
    openCartDrawer()
    setTimeout(() => setAdded(false), 2000)
  }

  const chipActive =
    'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
  const chipIdle =
    'border-zinc-700 text-zinc-300 hover:border-[#D4AF37]/40 hover:text-white'

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <ProductImage
          src={image}
          alt={product.name}
          className="aspect-[4/5] w-full max-h-[620px] rounded-2xl border border-zinc-800/60 shadow-2xl shadow-black/40 lg:max-h-none"
        />
      </motion.div>

      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
          {product.category}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-playfair),serif] text-4xl font-medium leading-tight text-white sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-6 text-2xl font-medium text-[#D4AF37]">
          EGP {product.price.toLocaleString()}
        </p>
        <p className="mt-6 leading-relaxed text-zinc-400">{product.description}</p>
        <p className="mt-4 text-sm text-zinc-500">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        <div className="mt-10 space-y-8">
          {sizes.length > 0 ? (
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
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
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Color
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
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
            <label htmlFor="qty" className="mb-3 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 text-lg text-white transition hover:border-[#D4AF37]/50"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <input
                id="qty"
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (!Number.isFinite(v)) return
                  setQuantity(Math.min(product.stock, Math.max(1, Math.round(v))))
                }}
                className="w-20 rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 text-center text-white focus:border-[#D4AF37] focus:outline-none"
              />
              <button
                type="button"
                aria-label="Increase quantity"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 text-lg text-white transition hover:border-[#D4AF37]/50"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <motion.button
            type="button"
            disabled={!canAdd}
            onClick={handleAddToCart}
            whileHover={canAdd ? { scale: 1.02 } : undefined}
            whileTap={canAdd ? { scale: 0.98 } : undefined}
            className="rounded-full bg-[#D4AF37] px-10 py-4 text-sm font-semibold uppercase tracking-wider text-zinc-950 transition hover:bg-[#e5c04a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {added ? 'Added — view bag' : 'Add to bag'}
          </motion.button>
          <button
            type="button"
            onClick={() => router.push('/cart')}
            className="rounded-full border border-zinc-600 px-8 py-4 text-sm font-semibold text-zinc-300 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
          >
            Full cart
          </button>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex text-sm text-zinc-500 transition hover:text-[#D4AF37]"
        >
          ← Back to collection
        </Link>
      </motion.div>
    </div>
  )
}
