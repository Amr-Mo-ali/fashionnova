/** 10% of the highest unit price in the cart/order (per line item price, not subtotal). */
export function computeDepositFromUnitPrices(unitPrices: number[]): number {
  if (unitPrices.length === 0) return 0
  const max = Math.max(...unitPrices)
  return Math.round(max * 0.1 * 100) / 100
}
