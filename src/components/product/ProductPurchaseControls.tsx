import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import type { Product } from '../../types/product'

const quantityButton = 'size-10 rounded-md border border-neutral-300 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

export default function ProductPurchaseControls({ product }: { product: Product }) {
  const { cartItems, addToCart } = useCart()
  const alreadyInCart = cartItems.find((item) => item.productId === product.id)?.quantity ?? 0
  const remainingQuantity = Math.max(0, product.stock - alreadyInCart)
  const [quantity, setQuantity] = useState(1)
  const [feedback, setFeedback] = useState<string | null>(null)
  // Keep a positive selection while exhausted controls are disabled.
  const maximum = Math.max(1, remainingQuantity)
  if (quantity > maximum) setQuantity(maximum)
  const selectedQuantity = Math.min(quantity, maximum)
  const unavailable = remainingQuantity === 0

  function changeQuantity(change: number) {
    setQuantity((current) => {
      const next = current + change
      return !unavailable && Number.isSafeInteger(next) && next >= 1 && next <= remainingQuantity ? next : current
    })
    setFeedback(null)
  }

  function addSelected() {
    if (!Number.isSafeInteger(selectedQuantity) || selectedQuantity < 1 || selectedQuantity > remainingQuantity) {
      setFeedback('The requested quantity is not available.')
      return
    }
    setFeedback(addToCart(product, selectedQuantity)
      ? 'Added to cart.'
      : 'The requested quantity is no longer available. Please choose a smaller quantity.')
  }

  return (
    <div className="space-y-3">
      <div role="group" aria-label="Quantity to add" className="flex items-center gap-3">
        <button type="button" className={quantityButton} disabled={unavailable || selectedQuantity === 1} aria-label="Decrease quantity to add" onClick={() => changeQuantity(-1)}>−</button>
        <span aria-label="Selected quantity">{selectedQuantity}</span>
        <button type="button" className={quantityButton} disabled={unavailable || selectedQuantity >= remainingQuantity} aria-label="Increase quantity to add" onClick={() => changeQuantity(1)}>+</button>
      </div>
      <p className="text-sm text-neutral-600">
        {unavailable
          ? product.stock === 0 ? 'This product is out of stock.' : 'No additional stock is available. You already have the available quantity in your cart.'
          : `${remainingQuantity} available to add.`}
      </p>
      <button
        type="button"
        disabled={unavailable}
        onClick={addSelected}
        className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Add to Cart
      </button>
      <p role="status" className="text-sm text-neutral-700">{feedback}</p>
    </div>
  )
}
