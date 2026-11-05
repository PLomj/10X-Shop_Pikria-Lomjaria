import { useEffect, useReducer, useRef } from 'react'
import type { ReactNode } from 'react'
import type { CartAction, CartItem } from '../types/cart'
import type { Product } from '../types/product'
import { loadCart, saveCart } from '../utils/cartStorage'
import { calculateCartSummary } from '../utils/cartCalculations'
import { CartContext } from './CartContext'
import { cartReducer } from './cartReducer'

export default function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart)
  const latestState = useRef(state)
  const cartItems = state.items
  const cartSummary = calculateCartSummary(state)

  // Preview the same pure transition for immediate success feedback. Every action
  // goes through here so batched clicks see all previously accepted actions.
  function sendAction(action: CartAction): boolean {
    const next = cartReducer(latestState.current, action)
    if (next === latestState.current) return false
    latestState.current = next
    dispatch(action)
    return true
  }

  useEffect(() => {
    saveCart(state)
  }, [state])

  function addToCart(product: Product, quantity = 1) {
    const item: CartItem = {
      productId: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      price: product.price,
      discountPercentage: product.discountPercentage,
      stock: product.stock,
      quantity,
    }
    return sendAction({ type: 'ADD_ITEM', item })
  }

  function changeQuantity(productId: number, change: number) {
    const item = latestState.current.items.find((entry) => entry.productId === productId)
    if (!item) return
    sendAction({ type: 'SET_QTY', productId, quantity: item.quantity + change })
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      cartItemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
      cartTotal: cartSummary.total,
      cartSummary,
      addToCart,
      removeFromCart: (productId) => { sendAction({ type: 'REMOVE_ITEM', productId }) },
      increaseQuantity: (productId) => changeQuantity(productId, 1),
      decreaseQuantity: (productId) => changeQuantity(productId, -1),
      clearCart: () => { sendAction({ type: 'CLEAR' }) },
    }}>
      {children}
    </CartContext.Provider>
  )
}
