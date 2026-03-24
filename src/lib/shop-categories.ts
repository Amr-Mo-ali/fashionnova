export const SHOP_CATEGORY_CHIPS = [
  'All',
  'Jackets',
  'Bags',
  'Dresses',
  'Suits',
  'Pants',
  'T-Shirts',
] as const

export type ShopCategoryChip = (typeof SHOP_CATEGORY_CHIPS)[number]

export function normalizeCategoryParam(param: string | undefined | null): string {
  if (!param || typeof param !== 'string') return 'All'
  const decoded = decodeURIComponent(param.trim())
  const found = SHOP_CATEGORY_CHIPS.find(
    (c) => c.toLowerCase() === decoded.toLowerCase()
  )
  return found ?? 'All'
}

export function categoryFilterHref(category: string): string {
  if (category === 'All') return '/'
  return `/?category=${encodeURIComponent(category)}`
}
