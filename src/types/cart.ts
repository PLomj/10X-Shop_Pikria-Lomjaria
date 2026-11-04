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

export type CartState = CartItem[]

export interface CartContextValue {
  cartItems: CartState
  cartItemCount: number
  cartTotal: number
  addToCart: (product: Product) => boolean
  removeFromCart: (productId: number) => void
  increaseQuantity: (productId: number) => void
  decreaseQuantity: (productId: number) => void
  clearCart: () => void
}
