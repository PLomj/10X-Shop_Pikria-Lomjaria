import type { CartItem, CartState } from '../types/cart'
import { priceInCents } from './currency'

const storageKey = 'shop_cart'

export function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false
  return (
    'productId' in value && typeof value.productId === 'number' &&
    Number.isSafeInteger(value.productId) && value.productId > 0 &&
    'title' in value && typeof value.title === 'string' &&
    'thumbnail' in value && typeof value.thumbnail === 'string' &&
    'price' in value && typeof value.price === 'number' &&
    value.price >= 0 && Number.isSafeInteger(priceInCents(value.price)) &&
    'stock' in value && typeof value.stock === 'number' &&
    Number.isSafeInteger(value.stock) && value.stock >= 0 &&
    'quantity' in value && typeof value.quantity === 'number' &&
    Number.isSafeInteger(value.quantity) && value.quantity > 0 &&
    (!('discountPercentage' in value) || value.discountPercentage === undefined ||
      (typeof value.discountPercentage === 'number' && Number.isFinite(value.discountPercentage)))
  )
}

export function loadCart(): CartState {
  const empty: CartState = { items: [], promoCode: null }
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved === null) return empty
    const data: unknown = JSON.parse(saved)
    const rows: unknown = Array.isArray(data) ? data
      : typeof data === 'object' && data !== null && 'items' in data ? data.items : null
    if (!Array.isArray(rows)) return empty

    const storedPromo: unknown = !Array.isArray(data) && typeof data === 'object' &&
      data !== null && 'promoCode' in data ? data.promoCode : null
    const promoCode = typeof storedPromo === 'string' &&
      storedPromo.trim().toUpperCase() === '10X10' ? '10X10' : null

    const items = new Map<number, CartItem>()
    for (const row of rows) {
      if (isCartItem(row) && !items.has(row.productId)) items.set(row.productId, row)
    }
    return {
      items: [...items.values()]
        .filter((item) => item.stock > 0)
        .map((item) => ({ ...item, quantity: Math.min(item.quantity, item.stock) })),
      promoCode,
    }
  } catch {
    return empty
  }
}

export function saveCart(state: CartState) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state))
  } catch {
    // The live cart still works when storage is unavailable.
  }
}
