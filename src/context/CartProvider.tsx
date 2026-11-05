import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'
import { isCartItem, loadCart, saveCart } from '../utils/cartStorage'
import { discountedPrice, priceInCents } from '../utils/currency'
import { CartContext } from './CartContext'

function nextQuantity(quantity: number, change: number) {
  const next = quantity + change
  return Number.isSafeInteger(next) && next > 0 ? next : quantity
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState(loadCart)

  useEffect(() => {
    saveCart(cartItems)
  }, [cartItems])

  function addToCart(product: Product) {
    const item: CartItem = {
      productId: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      price: product.price,
      discountPercentage: product.discountPercentage,
      stock: product.stock,
      quantity: 1,
    }
    if (!isCartItem(item)) return false

    setCartItems((items) =>
      items.some((existing) => existing.productId === item.productId)
        ? items.map((existing) => existing.productId === item.productId
          ? { ...existing, quantity: nextQuantity(existing.quantity, 1) }
          : existing)
        : [...items, item],
    )
    return true
  }

  function changeQuantity(productId: number, change: number) {
    setCartItems((items) => items.map((item) => item.productId === productId
      ? { ...item, quantity: nextQuantity(item.quantity, change) }
      : item))
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      cartItemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
      cartTotal: cartItems.reduce((cents, item) => cents + priceInCents(discountedPrice(item.price, item.discountPercentage)) * item.quantity, 0) / 100,
      addToCart,
      removeFromCart: (productId) => setCartItems((items) => items.filter((item) => item.productId !== productId)),
      increaseQuantity: (productId) => changeQuantity(productId, 1),
      decreaseQuantity: (productId) => changeQuantity(productId, -1),
      clearCart: () => setCartItems([]),
    }}>
      {children}
    </CartContext.Provider>
  )
}
