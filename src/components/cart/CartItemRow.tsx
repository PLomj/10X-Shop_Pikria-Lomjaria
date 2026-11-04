import { Link } from 'react-router'
import { useCart } from '../../context/CartContext'
import type { CartItem } from '../../types/cart'
import { formatPrice, lineSubtotal } from '../../utils/currency'

const quantityButton = 'size-10 rounded-md border border-neutral-300 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50'

export default function CartItemRow({ item }: { item: CartItem }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart()
  const subtotal = lineSubtotal(item.price, item.quantity)

  return (
    <li className="flex flex-wrap items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4">
      {item.thumbnail ? (
        <img src={item.thumbnail} alt={item.title} className="size-16 object-contain" />
      ) : (
        <span className="w-16 text-sm text-neutral-600">No image</span>
      )}
      <div className="min-w-0 flex-1 basis-32">
        <Link to={`/products/${item.productId}`} className="font-semibold underline-offset-4 hover:underline focus-visible:outline-2">
          {item.title}
        </Link>
        <p className="text-sm text-neutral-600">{formatPrice(item.price)} each</p>
      </div>
      <div role="group" aria-label={`Quantity for ${item.title}`} className="flex items-center gap-3">
        <button type="button" className={quantityButton} disabled={item.quantity === 1} aria-label={`Decrease quantity of ${item.title}`} onClick={() => decreaseQuantity(item.productId)}>−</button>
        <span>{item.quantity}</span>
        <button type="button" className={quantityButton} aria-label={`Increase quantity of ${item.title}`} onClick={() => increaseQuantity(item.productId)}>+</button>
      </div>
      <p className="font-semibold">Subtotal {formatPrice(subtotal)}</p>
      <button
        type="button"
        aria-label={`Remove ${item.title} from cart`}
        onClick={() => removeFromCart(item.productId)}
        className="rounded-sm px-2 py-2 text-sm underline underline-offset-4 hover:text-neutral-600 focus-visible:outline-2"
      >
        Remove
      </button>
    </li>
  )
}
