'use client'

import {
  CART_STORAGE_KEY,
  type CartLine,
  cartSubtotal,
  parseCartJson,
} from '@/lib/cart'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  cartDrawerOpen: boolean
  openCartDrawer: () => void
  closeCartDrawer: () => void
  addLine: (line: Omit<CartLine, 'quantity'> & { quantity?: number }) => void
  setQuantity: (productId: string, size: string, color: string, quantity: number) => void
  removeLine: (productId: string, size: string, color: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function lineKey(productId: string, size: string, color: string) {
  return `${productId}::${size}::${color}`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)

  const openCartDrawer = useCallback(() => setCartDrawerOpen(true), [])
  const closeCartDrawer = useCallback(() => setCartDrawerOpen(false), [])

  useEffect(() => {
    const t = window.setTimeout(() => {
      setLines(parseCartJson(localStorage.getItem(CART_STORAGE_KEY)))
      setHydrated(true)
    }, 0)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines))
  }, [lines, hydrated])

  const addLine = useCallback(
    (line: Omit<CartLine, 'quantity'> & { quantity?: number }) => {
      const qty = line.quantity ?? 1
      setLines((prev) => {
        const i = prev.findIndex(
          (l) =>
            l.productId === line.productId &&
            l.size === line.size &&
            l.color === line.color
        )
        if (i >= 0) {
          const next = [...prev]
          next[i] = { ...next[i], quantity: next[i].quantity + qty }
          return next
        }
        return [...prev, { ...line, quantity: qty }]
      })
    },
    []
  )

  const setQuantity = useCallback(
    (productId: string, size: string, color: string, quantity: number) => {
      if (quantity < 1) {
        setLines((prev) =>
          prev.filter(
            (l) => lineKey(l.productId, l.size, l.color) !== lineKey(productId, size, color)
          )
        )
        return
      }
      setLines((prev) =>
        prev.map((l) =>
          lineKey(l.productId, l.size, l.color) === lineKey(productId, size, color)
            ? { ...l, quantity }
            : l
        )
      )
    },
    []
  )

  const removeLine = useCallback((productId: string, size: string, color: string) => {
    setLines((prev) =>
      prev.filter(
        (l) => lineKey(l.productId, l.size, l.color) !== lineKey(productId, size, color)
      )
    )
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: cartSubtotal(lines),
      cartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
      addLine,
      setQuantity,
      removeLine,
      clearCart,
    }),
    [
      lines,
      cartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
      addLine,
      setQuantity,
      removeLine,
      clearCart,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
