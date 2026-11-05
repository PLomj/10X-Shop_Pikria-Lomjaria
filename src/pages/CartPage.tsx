import { Link } from 'react-router'
import CartItemRow from '../components/cart/CartItemRow'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/currency'

export default function CartPage() {
  const { cartItems, cartTotal, cartSummary } = useCart()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-neutral-600">Your cart is empty. Browse the catalog to find something you like.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {cartItems.map((item) => <CartItemRow key={item.productId} item={item} />)}
          </ul>
          <dl className="ml-auto grid max-w-xs grid-cols-2 gap-2 rounded-lg border border-neutral-200 bg-white p-4">
            <dt>Subtotal</dt>
            <dd className="text-right">{formatPrice(cartSummary.subtotal)}</dd>
            {cartSummary.discount > 0 && (
              <>
                <dt>Promo discount</dt>
                <dd className="text-right">−{formatPrice(cartSummary.discount)}</dd>
              </>
            )}
            <dt>Shipping</dt>
            <dd className="text-right">{formatPrice(cartSummary.shipping)}</dd>
            <dt className="font-bold">Total</dt>
            <dd className="text-right font-bold">{formatPrice(cartTotal)}</dd>
          </dl>
          <Link
            to="/checkout"
            className="ml-auto block w-full max-w-xs rounded-md bg-neutral-900 px-4 py-2 text-center font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Proceed to Checkout
          </Link>
        </>
      )}
      <Link to="/" className="inline-block rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">
        Back to Catalog
      </Link>
    </div>
  )
}
