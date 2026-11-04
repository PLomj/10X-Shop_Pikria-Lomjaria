import { createContext, useContext } from 'react'
import type { CartContextValue } from '../types/cart'

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart(): CartContextValue {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('useCart must be used inside CartProvider.')
  return cart
}
