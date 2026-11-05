import type { Product } from './product'

export interface CartItem {
  productId: number
  title: string
  thumbnail: string
  price: number
  discountPercentage?: number
  stock: number
  quantity: number
}

export interface CartState {
  items: CartItem[]
  promoCode: string | null
}

export interface CartSummary {
  subtotal: number
  discount: number
  shipping: number
  total: number
}

export interface CartPriceChange {
  existingQuantity: number
  previousUnitPrice: number
  currentUnitPrice: number
}

export type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem; refreshProduct?: boolean }
  | { type: 'SET_QTY'; productId: number; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'CLEAR' }
  | { type: 'APPLY_PROMO'; code: string }
  | { type: 'REMOVE_PROMO' }

export interface CartContextValue {
  cartItems: CartItem[]
  cartItemCount: number
  cartTotal: number
  cartSummary: CartSummary
  promoCode: string | null
  applyPromo: (code: string) => boolean
  removePromo: () => void
  addToCart: (product: Product, quantity?: number) => boolean
  addAvailableToCart: (product: Product, requestedQuantity: number, onRepriced?: (change: CartPriceChange) => void) => number
  removeFromCart: (productId: number) => void
  increaseQuantity: (productId: number) => void
  decreaseQuantity: (productId: number) => void
  clearCart: () => void
}
