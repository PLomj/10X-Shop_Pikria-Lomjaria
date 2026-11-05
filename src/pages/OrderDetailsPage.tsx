import { Link, useLocation, useParams } from 'react-router'
import useOrderHistory from '../hooks/useOrderHistory'
import { checkoutCountries } from '../utils/checkoutValidation'
import { formatPrice } from '../utils/currency'
import { getOrderStatus } from '../utils/orderStatus'
import NotFoundPage from './NotFoundPage'
import ReorderButton from '../components/orders/ReorderButton'

const steps = [
  { status: 'processing', label: 'Processing' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' },
] as const

export default function OrderDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const { history, now, retry } = useOrderHistory()
  const order = history.status === 'error' ? undefined : history.orders.find((entry) => entry.reference === id)
  const state: unknown = location.state
  const justPlaced = order !== undefined && typeof state === 'object' && state !== null &&
    'justPlaced' in state && state.justPlaced === order.reference
  const status = order ? getOrderStatus(order, now) : null
  const currentStep = steps.findIndex((step) => step.status === status)
  const country = order && (checkoutCountries.find((entry) => entry.value === order.shippingAddress.country)?.label
    ?? order.shippingAddress.country)

  return (
    <div className="space-y-6">
      <p className="text-sm text-neutral-600">Order history is shared within this browser profile. Login controls access to these pages, not secure per-user storage.</p>
      {history.status === 'error' && <><h1 className="text-2xl font-bold">Order unavailable</h1><p role="alert">We couldn’t load order history. {history.error.message}</p></>}
      {history.status === 'partial' && <p role="alert">Some stored order records could not be recovered and were skipped. Stored history has not been changed.</p>}
      {history.status !== 'error' && !order && (
        history.status === 'partial' ? (
          <section className="space-y-3">
            <h1 className="text-2xl font-bold">Order unavailable</h1>
            <p>The requested order could not be found in the recovered records. It may be among the records that could not be loaded.</p>
          </section>
        ) : <NotFoundPage />
      )}
      {order && (
        <>
          <h1 className="break-words text-2xl font-bold sm:text-3xl">Order {order.reference}</h1>
          {justPlaced && <p role="status" className="rounded-lg border border-neutral-300 bg-white p-4">Thank you! Your order has been placed.</p>}
          <p>Order date: <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString()}</time></p>
          <ReorderButton key={order.reference} order={order} />
          <section aria-labelledby="order-status-heading" className="space-y-3">
            <h2 id="order-status-heading" className="text-lg font-semibold">Order status</h2>
            <p role="status">{steps[currentStep]?.label}</p>
            <ol className="grid gap-3 sm:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.status} aria-current={index === currentStep ? 'step' : undefined} className="rounded-lg border border-neutral-200 bg-white p-4">
                  <p className="font-medium">{step.label}</p>
                  <p className="text-sm text-neutral-600">{index < currentStep ? 'Completed' : index === currentStep ? 'Current' : 'Upcoming'}</p>
                </li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="saved-shipping-heading" className="space-y-2 break-words rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
            <h2 id="saved-shipping-heading" className="text-lg font-semibold">Shipping address</h2>
            <p>{order.customer.fullName}</p><p>{order.customer.email}</p><p>{order.customer.phone}</p>
            <p>{order.shippingAddress.address}</p><p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p><p>{country}</p>
          </section>
          <section aria-labelledby="saved-items-heading" className="space-y-3">
            <h2 id="saved-items-heading" className="text-lg font-semibold">Purchased items</h2>
            <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white px-4">
              {order.items.map((item) => (
                <li key={item.productId} className="flex flex-wrap justify-between gap-3 py-4">
                  <div className="min-w-0 break-words"><p className="font-medium">{item.title}</p><p>Quantity: {item.quantity} · {formatPrice(item.unitPrice)} each</p></div>
                  <p className="font-semibold">Line total: {formatPrice(item.lineTotal)}</p>
                </li>
              ))}
            </ul>
          </section>
          <dl className="ml-auto grid max-w-sm grid-cols-2 gap-2 rounded-lg border border-neutral-200 bg-white p-4">
            <dt>Subtotal</dt><dd className="text-right">{formatPrice(order.summary.subtotal)}</dd>
            <dt>{order.promoCode ? `Discount (${order.promoCode} −10%)` : 'Discount'}</dt><dd className="text-right">−{formatPrice(order.summary.discount)}</dd>
            <dt>Shipping</dt><dd className="text-right">{formatPrice(order.summary.shipping)}</dd>
            <dt className="font-bold">Order total</dt><dd className="text-right font-bold">{formatPrice(order.summary.total)}</dd>
          </dl>
        </>
      )}
      {history.status !== 'success' && <button type="button" onClick={retry} className="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2">Retry loading orders</button>}
      <div className="flex flex-wrap gap-4">
        <Link to="/orders" className="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">Back to Orders</Link>
        <Link to="/" className="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">Browse products</Link>
      </div>
    </div>
  )
}
