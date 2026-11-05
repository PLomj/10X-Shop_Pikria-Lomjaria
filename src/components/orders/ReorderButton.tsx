import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { fetchProductById, ProductNotFoundError } from '../../api/products'
import { useCart } from '../../context/CartContext'
import type { Order } from '../../types/order'
import type { ReorderItemResult, ReorderResult } from '../../types/reorder'

export default function ReorderButton({ order }: { order: Order }) {
  const { addAvailableToCart } = useCart()
  const navigate = useNavigate()
  const activeRequest = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState<ReorderResult | null>(null)

  useEffect(() => () => { activeRequest.current?.abort() }, [])

  async function reorder() {
    if (activeRequest.current) return
    const controller = new AbortController()
    activeRequest.current = controller
    setLoading(true)
    setFailure(null)
    try {
      const fetched = await Promise.allSettled(order.items.map((item) =>
        fetchProductById(item.productId, controller.signal)))
      if (controller.signal.aborted) return

      // No awaits during commits: each provider call uses its latest Cart state.
      const items: ReorderItemResult[] = order.items.map((item, index) => {
        const result: ReorderItemResult = {
          productId: item.productId, title: item.title, requestedQuantity: item.quantity,
          addedQuantity: 0, skippedQuantity: item.quantity,
        }
        const response = fetched[index]
        if (response.status === 'rejected') {
          result.reason = response.reason instanceof ProductNotFoundError
            ? 'Product no longer available.' : 'Could not load current product information.'
          return result
        }
        result.title = response.value.title
        result.addedQuantity = addAvailableToCart(response.value, item.quantity, (change) => {
          result.repricing = change
        })
        result.skippedQuantity = item.quantity - result.addedQuantity
        if (result.skippedQuantity > 0) {
          result.reason = response.value.stock === 0 ? 'Out of stock.'
            : result.addedQuantity > 0 ? 'Only part of the requested quantity was available.'
              : 'No units could be added within current stock limits, or current product data was invalid.'
        }
        return result
      })
      const hasAdded = items.some((item) => item.addedQuantity > 0)
      const result: ReorderResult = {
        outcome: !hasAdded ? 'failure' : items.some((item) => item.skippedQuantity > 0) ? 'partial' : 'success',
        items,
      }
      if (hasAdded) navigate('/cart', { state: { reorderResult: result } })
      else setFailure(result)
    } finally {
      if (!controller.signal.aborted) {
        activeRequest.current = null
        setLoading(false)
      }
    }
  }

  return (
    <div className="space-y-3">
      <button type="button" disabled={loading} onClick={() => { void reorder() }} className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? 'Reordering…' : 'Reorder'}
      </button>
      {loading && <p role="status">Loading current product availability…</p>}
      {failure && (
        <div role="alert" className="space-y-2 rounded-lg border border-neutral-300 p-4">
          <p className="font-semibold">No items were added to your cart.</p>
          <ul className="list-inside list-disc space-y-2">
            {failure.items.map((item) => <li key={item.productId}>{item.title}: requested {item.requestedQuantity}, added {item.addedQuantity}, skipped {item.skippedQuantity}. {item.reason}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
