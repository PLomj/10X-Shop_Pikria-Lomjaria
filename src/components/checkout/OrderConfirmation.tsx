import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import type { OrderConfirmation as OrderSnapshot } from '../../types/checkout'
import { checkoutCountries } from '../../utils/checkoutValidation'
import { formatPrice } from '../../utils/currency'

export default function OrderConfirmation({ order }: { order: OrderSnapshot }) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  const { customer, shippingAddress, summary } = order
  const country = checkoutCountries.find((entry) => entry.value === shippingAddress.country)?.label
    ?? shippingAddress.country

  return (
    <div className="space-y-6 rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
      <h1 ref={headingRef} tabIndex={-1} className="rounded-sm text-2xl font-bold focus-visible:outline-2 focus-visible:outline-offset-4">Order confirmed</h1>
      <p role="status">Thank you! Your order has been placed.</p>
      <dl className="space-y-2 break-words">
        <div><dt className="font-semibold">Order reference</dt><dd>{order.reference}</dd></div>
        <div><dt className="font-semibold">Order date</dt><dd><time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString()}</time></dd></div>
      </dl>
      <div className="grid gap-6 sm:grid-cols-2">
        <section aria-labelledby="order-customer-heading" className="min-w-0 space-y-2 break-words">
          <h2 id="order-customer-heading" className="text-lg font-semibold">Customer</h2>
          <p>{customer.fullName}</p>
          <p>{customer.email}</p>
          <p>{customer.phone}</p>
        </section>
        <section aria-labelledby="order-shipping-heading" className="min-w-0 space-y-2 break-words">
          <h2 id="order-shipping-heading" className="text-lg font-semibold">Shipping address</h2>
          <p>{shippingAddress.address}</p>
          <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
          <p>{country}</p>
        </section>
      </div>
      <section aria-labelledby="order-items-heading" className="space-y-3">
        <h2 id="order-items-heading" className="text-lg font-semibold">Purchased items</h2>
        <ul className="divide-y divide-neutral-200">
          {order.items.map((item) => (
            <li key={item.productId} className="flex flex-wrap justify-between gap-3 py-3">
              <div className="min-w-0 break-words">
                <p className="font-medium">{item.title}</p>
                <p>Quantity: {item.quantity} · {formatPrice(item.unitPrice)} each</p>
              </div>
              <p className="font-semibold">Line total: {formatPrice(item.lineTotal)}</p>
            </li>
          ))}
        </ul>
      </section>
      <dl className="ml-auto grid max-w-sm grid-cols-2 gap-2 border-t border-neutral-200 pt-4">
        <dt>Subtotal</dt><dd className="text-right">{formatPrice(summary.subtotal)}</dd>
        <dt>{order.promoCode ? `Discount (${order.promoCode} −10%)` : 'Discount'}</dt>
        <dd className="text-right">−{formatPrice(summary.discount)}</dd>
        <dt>Shipping</dt><dd className="text-right">{formatPrice(summary.shipping)}</dd>
        <dt className="font-bold">Order total</dt><dd className="text-right font-bold">{formatPrice(summary.total)}</dd>
      </dl>
      <Link to="/" className="inline-block rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">Continue shopping</Link>
    </div>
  )
}
