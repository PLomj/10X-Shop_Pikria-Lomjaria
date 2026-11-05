import { useEffect, useReducer, useRef } from 'react'
import type { ReactNode } from 'react'
import type { CartAction, CartItem, CartPriceChange } from '../types/cart'
import type { Product } from '../types/product'
import { loadCart, saveCart } from '../utils/cartStorage'
import { calculateCartSummary } from '../utils/cartCalculations'
import { CartContext } from './CartContext'
import { cartReducer } from './cartReducer'
import { discountedPrice } from '../utils/currency'

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

  function addAvailableToCart(
    product: Product,
    requestedQuantity: number,
    onRepriced?: (change: CartPriceChange) => void,
  ): number {
    if (!Number.isSafeInteger(requestedQuantity) || requestedQuantity < 1 ||
      !Number.isSafeInteger(product.stock) || product.stock < 0) return 0
    const existing = latestState.current.items.find((item) => item.productId === product.id)
    const accepted = Math.min(requestedQuantity, Math.max(0, product.stock - (existing?.quantity ?? 0)))
    if (accepted === 0) return 0
    const item: CartItem = {
      productId: product.id, title: product.title, thumbnail: product.thumbnail,
      price: product.price, discountPercentage: product.discountPercentage,
      stock: product.stock, quantity: accepted,
    }
    if (!sendAction({ type: 'ADD_ITEM', item, refreshProduct: true })) return 0
    // Report the exact row used by the atomic transition, not a stale component value.
    if (existing && (existing.price !== product.price || existing.discountPercentage !== product.discountPercentage)) {
      onRepriced?.({
        existingQuantity: existing.quantity,
        previousUnitPrice: discountedPrice(existing.price, existing.discountPercentage),
        currentUnitPrice: discountedPrice(product.price, product.discountPercentage),
      })
    }
    return accepted
  }

  function applyPromo(code: string): boolean {
    const normalizedCode = code.trim().toUpperCase()
    if (normalizedCode !== '10X10') return false
    // Reapplying a valid active code is successful, even without a state change.
    sendAction({ type: 'APPLY_PROMO', code: normalizedCode })
    return true
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      cartItemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
      cartTotal: cartSummary.total,
      cartSummary,
      promoCode: state.promoCode,
      applyPromo,
      removePromo: () => { sendAction({ type: 'REMOVE_PROMO' }) },
      addToCart,
      addAvailableToCart,
      removeFromCart: (productId) => { sendAction({ type: 'REMOVE_ITEM', productId }) },
      increaseQuantity: (productId) => changeQuantity(productId, 1),
      decreaseQuantity: (productId) => changeQuantity(productId, -1),
      clearCart: () => { sendAction({ type: 'CLEAR' }) },
    }}>
      {children}
    </CartContext.Provider>
  )
}
