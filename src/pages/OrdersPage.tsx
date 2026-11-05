import { Link } from 'react-router'
import useOrderHistory from '../hooks/useOrderHistory'
import { formatPrice } from '../utils/currency'
import { getOrderStatus } from '../utils/orderStatus'

export default function OrdersPage() {
  const { history, now, retry } = useOrderHistory()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Orders</h1>
      <p className="text-sm text-neutral-600">Order history is shared within this browser profile. Login controls access to these pages, not secure per-user storage.</p>
      {history.status === 'error' ? (
        <p role="alert">We couldn’t load order history. {history.error.message}</p>
      ) : (
        <>
          {history.status === 'partial' && (
            <p role="alert">Some stored order records could not be recovered and were skipped. Available orders are shown below. Stored history has not been changed.</p>
          )}
          {history.orders.length === 0 ? (
            <p>{history.status === 'success' ? 'You have no orders yet.' : 'No valid orders could be loaded.'}</p>
          ) : (
            <ul className="space-y-4">
              {history.orders.map((order) => {
                const status = getOrderStatus(order, now)
                return (
                  <li key={order.reference} className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
                    <h2 className="break-words text-lg font-semibold">
                      <Link to={`/orders/${encodeURIComponent(order.reference)}`} className="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">{order.reference}</Link>
                    </h2>
                    <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div><dt className="font-medium">Order date</dt><dd><time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString()}</time></dd></div>
                      <div><dt className="font-medium">Items</dt><dd>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</dd></div>
                      <div><dt className="font-medium">Total</dt><dd>{formatPrice(order.summary.total)}</dd></div>
                      <div><dt className="font-medium">Status</dt><dd role="status">{status === 'processing' ? 'Processing' : status === 'shipped' ? 'Shipped' : 'Delivered'}</dd></div>
                    </dl>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
      {history.status !== 'success' && (
        <button type="button" onClick={retry} className="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2">Retry loading orders</button>
      )}
      <Link to="/" className="block w-fit rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">Browse products</Link>
    </div>
  )
}
