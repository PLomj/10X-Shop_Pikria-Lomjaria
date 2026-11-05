import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useCart } from '../context/CartContext'
import type { CheckoutFormValues, OrderConfirmation } from '../types/checkout'
import { checkoutCountries, validateCheckout } from '../utils/checkoutValidation'
import { formatPrice, lineSubtotal } from '../utils/currency'

const fields = [
  { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
  { name: 'address', label: 'Address', type: 'text', autoComplete: 'street-address' },
  { name: 'city', label: 'City', type: 'text', autoComplete: 'address-level2' },
  { name: 'postalCode', label: 'Postal code', type: 'text', autoComplete: 'postal-code' },
  { name: 'country', label: 'Country', type: 'select', autoComplete: 'country' },
] as const

const linkStyle = 'inline-block rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4'

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartSummary, promoCode, clearCart } = useCart()
  const [values, setValues] = useState<CheckoutFormValues>({
    fullName: '', email: '', phone: '', address: '', city: '', postalCode: '', country: 'GE',
  })
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormValues, boolean>>>({})
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null)
  const submitted = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const errors = validateCheckout(values)

  function changeField(name: keyof CheckoutFormValues, value: string) {
    setValues((previous) => ({ ...previous, [name]: value }))
  }

  function touchField(name: keyof CheckoutFormValues) {
    setTouched((previous) => ({ ...previous, [name]: true }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitted.current || cartItems.length === 0) return

    setHasAttemptedSubmit(true)
    const nextErrors = validateCheckout(values)
    const fullName = values.fullName.trim()
    const firstInvalid = fields.find(({ name }) => nextErrors[name])
    if (firstInvalid) {
      const control = formRef.current?.elements.namedItem(firstInvalid.name)
      if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement) control.focus()
      return
    }

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
          <dl className="grid grid-cols-2 gap-2 border-t border-neutral-200 pt-3">
            <dt>Subtotal</dt>
            <dd className="text-right">{formatPrice(cartSummary.subtotal)}</dd>
            {promoCode && (
              <>
                <dt>Discount ({promoCode} −10%)</dt>
                <dd className="text-right">−{formatPrice(cartSummary.discount)}</dd>
              </>
            )}
            <dt>Shipping</dt>
            <dd className="text-right">{formatPrice(cartSummary.shipping)}</dd>
            <dt className="font-bold">Order total</dt>
            <dd className="text-right font-bold">{formatPrice(cartTotal)}</dd>
          </dl>
        </section>
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Shipping and contact details</h2>
          {fields.map(({ name, label, type, autoComplete }) => {
            const inputId = `checkout-${name}`
            const error = touched[name] || hasAttemptedSubmit ? errors[name] : undefined
            const inputStyle = 'w-full rounded-md border border-neutral-400 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 aria-invalid:border-red-700'
            return (
              <div key={name} className="space-y-2">
                <label htmlFor={inputId} className="block font-medium">{label}</label>
                {type === 'select' ? (
                  <select
                    id={inputId}
                    name={name}
                    autoComplete={autoComplete}
                    required
                    value={values[name]}
                    onChange={(event) => changeField(name, event.currentTarget.value)}
                    onBlur={() => touchField(name)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    className={inputStyle}
                  >
                    {checkoutCountries.map((country) => (
                      <option key={country.value} value={country.value}>{country.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                  id={inputId}
                  name={name}
                  type={type}
                  inputMode={name === 'postalCode' ? 'numeric' : undefined}
                  autoComplete={autoComplete}
                  required
                  value={values[name]}
                  onChange={(event) => changeField(name, event.currentTarget.value)}
                  onBlur={() => touchField(name)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${inputId}-error` : undefined}
                  className={inputStyle}
                />
                )}
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
