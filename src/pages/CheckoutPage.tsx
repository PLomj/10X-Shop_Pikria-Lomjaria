import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useCart } from '../context/CartContext'
import type { CheckoutFormErrors, CheckoutFormValues, OrderConfirmation } from '../types/checkout'
import { formatPrice, lineSubtotal } from '../utils/currency'

const fields = [
  { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'address', label: 'Address', type: 'text', autoComplete: 'street-address' },
  { name: 'city', label: 'City', type: 'text', autoComplete: 'address-level2' },
] as const

const linkStyle = 'inline-block rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4'

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const [values, setValues] = useState<CheckoutFormValues>({ fullName: '', email: '', address: '', city: '' })
  const [errors, setErrors] = useState<CheckoutFormErrors>({})
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null)
  const submitted = useRef(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitted.current || cartItems.length === 0) return

    const nextErrors: CheckoutFormErrors = {}
    const fullName = values.fullName.trim()
    const email = values.email.trim()
    if (!fullName) nextErrors.fullName = 'Enter your full name.'
    if (!email) nextErrors.email = 'Enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email address.'
    if (!values.address.trim()) nextErrors.address = 'Enter your address.'
    if (!values.city.trim()) nextErrors.city = 'Enter your city.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const order: OrderConfirmation = {
      reference: `SHOP-${Date.now().toString(36).toUpperCase()}`,
      customerName: fullName,
      total: cartTotal,
    }
    submitted.current = true
    setConfirmation(order)
    clearCart()
  }

  if (confirmation) {
    return (
      <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
        <div role="status" className="space-y-2">
          <h1 className="text-2xl font-bold">Order confirmed</h1>
          <p>Thank you, {confirmation.customerName}. Your simulated order has been placed.</p>
          <p>Order reference: {confirmation.reference}</p>
          <p className="font-semibold">Order total: {formatPrice(confirmation.total)}</p>
        </div>
        <Link to="/" className={linkStyle}>Back to Catalog</Link>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
        <p>Your cart is empty. Add an item before placing an order.</p>
        <Link to="/cart" className={linkStyle}>Back to Cart</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <section className="min-w-0 space-y-4 rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <ul className="divide-y divide-neutral-200">
            {cartItems.map((item) => (
              <li key={item.productId} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-3">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
                </div>
                <p>Subtotal: {formatPrice(lineSubtotal(item.price, item.quantity, item.discountPercentage))}</p>
              </li>
            ))}
          </ul>
          <p className="border-t border-neutral-200 pt-3 font-bold">Order total: {formatPrice(cartTotal)}</p>
        </section>
        <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Shipping and contact details</h2>
          {fields.map(({ name, label, type, autoComplete }) => {
            const inputId = `checkout-${name}`
            const error = errors[name]
            return (
              <div key={name} className="space-y-2">
                <label htmlFor={inputId} className="block font-medium">{label}</label>
                <input
                  id={inputId}
                  name={name}
                  type={type}
                  autoComplete={autoComplete}
                  required
                  value={values[name]}
                  onChange={(event) => setValues({ ...values, [name]: event.target.value })}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${inputId}-error` : undefined}
                  className="w-full rounded-md border border-neutral-400 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 aria-invalid:border-red-700"
                />
                {error && <p id={`${inputId}-error`} role="alert" className="text-sm text-red-700">{error}</p>}
              </div>
            )
          })}
          <button type="submit" className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2">
            Place Order
          </button>
        </form>
      </div>
    </div>
  )
}
