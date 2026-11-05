import type { CartItem, CartSummary } from '../types/cart'
import type { CheckoutFormValues, OrderConfirmation } from '../types/checkout'
import { discountedPrice, lineSubtotal } from './currency'

let referenceCounter = 0

function createReference(): string {
  try {
    if (typeof globalThis.crypto?.randomUUID === 'function') {
      return `SHOP-${globalThis.crypto.randomUUID()}`
    }
  } catch {
    // Older browsers may expose crypto but not allow UUID generation.
  }
  referenceCounter += 1
  return `SHOP-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${referenceCounter}`.toUpperCase()
}

export function createOrderSnapshot(
  values: CheckoutFormValues,
  items: CartItem[],
  promoCode: string | null,
  summary: CartSummary,
): OrderConfirmation {
  return {
    reference: createReference(),
    createdAt: new Date().toISOString(),
    customer: {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    },
    shippingAddress: {
      address: values.address.trim(),
      city: values.city.trim(),
      postalCode: values.postalCode.trim(),
      country: values.country,
    },
    items: items.map((item) => ({
      productId: item.productId,
      title: item.title,
      price: item.price,
      discountPercentage: item.discountPercentage,
      quantity: item.quantity,
      unitPrice: discountedPrice(item.price, item.discountPercentage),
      lineTotal: lineSubtotal(item.price, item.quantity, item.discountPercentage),
    })),
    promoCode,
    summary: { ...summary },
  }
}
