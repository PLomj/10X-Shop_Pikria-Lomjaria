import type { CartState, CartSummary } from '../types/cart'
import { discountedPrice, priceInCents } from './currency'

export function calculateCartSummary(state: CartState): CartSummary {
  if (state.items.length === 0) {
    return { subtotal: 0, discount: 0, shipping: 0, total: 0 }
  }

  // Round each discounted unit first, matching existing cart line totals.
  const subtotalCents = state.items.reduce((sum, item) =>
    sum + priceInCents(discountedPrice(item.price, item.discountPercentage)) * item.quantity, 0)
  const discountCents = state.promoCode === '10X10' ? Math.round(subtotalCents / 10) : 0
  const afterDiscountCents = subtotalCents - discountCents
  // Free shipping eligibility is based on merchandise after the promo discount.
  const shippingCents = afterDiscountCents >= 10000 ? 0 : 1000

  return {
    subtotal: subtotalCents / 100,
    discount: discountCents / 100,
    shipping: shippingCents / 100,
    total: (afterDiscountCents + shippingCents) / 100,
  }
}
