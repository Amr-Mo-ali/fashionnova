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
    'border-[#b8976a] bg-[#d4b896]/20 text-[#b8976a]'
  const chipIdle =
    'border-[#e8e0d4] text-[#7a7068] hover:border-[#b8976a]/40 hover:text-[#0f0e0d]'

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
          className="aspect-[4/5] w-full max-h-[620px] rounded-none border border-[#e8e0d4] shadow-[0_18px_40px_rgba(15,14,13,0.16)] lg:max-h-none"
        />
      </motion.div>

      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b8976a]">
          {product.category}
        </p>
        <h1 className="mt-5 font-[family-name:var(--font-playfair),serif] text-4xl font-medium leading-[1.15] text-[#0f0e0d] sm:text-5xl md:text-6xl">
          {product.name}
        </h1>
        <p className="mt-8 text-2xl font-medium tracking-tight text-[#b8976a]">
          EGP {product.price.toLocaleString()}
        </p>
        <p className="mt-8 leading-[1.75] text-[#7a7068]">{product.description}</p>
        <p className="mt-5 text-sm text-[#7a7068]">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        <div className="mt-10 space-y-8">
          {sizes.length > 0 ? (
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#7a7068]">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <motion.button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    whileTap={{ scale: 0.94 }}
                    layout
                    className={`min-h-[44px] rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                      size === s ? chipActive : chipIdle
                    }`}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : null}

          {colors.length > 0 ? (
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#7a7068]">
                Color
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <motion.button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    whileTap={{ scale: 0.94 }}
                    layout
                    className={`min-h-[44px] rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                      color === c ? chipActive : chipIdle
                    }`}
                  >
                    {c}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <label htmlFor="qty" className="mb-3 block text-xs font-medium uppercase tracking-wider text-[#7a7068]">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="flex h-11 w-11 items-center justify-center rounded-none border border-[#e8e0d4] text-lg text-[#0f0e0d] transition hover:border-[#b8976a]/50"
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
                className="w-20 rounded-none border border-[#e8e0d4] bg-[#ffffff] py-2.5 text-center text-[#0f0e0d] focus:border-[#b8976a] focus:outline-none"
              />
              <button
                type="button"
                aria-label="Increase quantity"
                className="flex h-11 w-11 items-center justify-center rounded-none border border-[#e8e0d4] text-lg text-[#0f0e0d] transition hover:border-[#b8976a]/50"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap gap-4">
          <motion.button
            type="button"
            disabled={!canAdd}
            onClick={handleAddToCart}
            whileHover={canAdd ? { scale: 1.02 } : undefined}
            whileTap={canAdd ? { scale: 0.98 } : undefined}
            className="min-h-[52px] rounded-none border border-[#0f0e0d] bg-[#0f0e0d] px-10 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#f5f2ed] transition hover:bg-[#1a1816] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8976a] disabled:cursor-not-allowed disabled:border-[#e8e0d4] disabled:bg-[#e8e0d4] disabled:text-[#7a7068]"
          >
            {added ? 'Added — view bag' : 'Add to bag'}
          </motion.button>
          <button
            type="button"
            onClick={() => router.push('/cart')}
            className="min-h-[52px] rounded-none border border-[#0f0e0d]/40 px-9 py-3.5 text-sm font-semibold text-[#7a7068] transition hover:border-[#b8976a]/60 hover:text-[#b8976a]"
          >
            Full cart
          </button>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex text-sm text-[#7a7068] transition hover:text-[#b8976a]"
        >
          ← Back to collection
        </Link>
      </motion.div>
    </div>
  )
}
