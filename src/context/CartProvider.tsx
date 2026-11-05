import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'
import { isCartItem, loadCart, saveCart } from '../utils/cartStorage'
import { discountedPrice, priceInCents } from '../utils/currency'
import { CartContext } from './CartContext'

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState(loadCart)
  const latestItems = useRef(cartItems)

  // All cart actions commit here so sequential clicks see the latest quantity,
  // even when React batches their renders.
  function commit(items: CartItem[]) {
    latestItems.current = items
    setCartItems(items)
  }

  useEffect(() => {
    saveCart(cartItems)
  }, [cartItems])

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
    if (!isCartItem(item)) return false
    const items = latestItems.current
    const existing = items.find((entry) => entry.productId === item.productId)
    const nextQuantity = (existing?.quantity ?? 0) + quantity
    if (!Number.isSafeInteger(nextQuantity) || nextQuantity > product.stock) return false
    commit(existing
      ? items.map((entry) => entry.productId === item.productId
        ? { ...entry, stock: product.stock, quantity: nextQuantity }
        : entry)
      : [...items, item])
    return true
  }

  function changeQuantity(productId: number, change: number) {
    const items = latestItems.current
    const item = items.find((entry) => entry.productId === productId)
    if (!item) return
    const quantity = item.quantity + change
    if (!Number.isSafeInteger(quantity) || quantity < 1) return
    // Legacy over-stock rows may decrease, but cannot increase further.
    if (change > 0 && quantity > item.stock) return
    commit(items.map((entry) => entry.productId === productId ? { ...entry, quantity } : entry))
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      cartItemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
      cartTotal: cartItems.reduce((cents, item) => cents + priceInCents(discountedPrice(item.price, item.discountPercentage)) * item.quantity, 0) / 100,
      addToCart,
      removeFromCart: (productId) => commit(latestItems.current.filter((item) => item.productId !== productId)),
      increaseQuantity: (productId) => changeQuantity(productId, 1),
      decreaseQuantity: (productId) => changeQuantity(productId, -1),
      clearCart: () => commit([]),
    }}>
      {children}
    </CartContext.Provider>
  )
}
