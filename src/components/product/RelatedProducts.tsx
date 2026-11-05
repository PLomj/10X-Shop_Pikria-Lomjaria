import { useEffect, useState } from 'react'
import { getProductsByCategory } from '../../api/products'
import type { Product } from '../../types/product'
import ProductGrid from './ProductGrid'

type RelatedResult =
  | { key: string; products: Product[] }
  | { key: string; error: string }

export default function RelatedProducts({ product }: { product: Product }) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<RelatedResult | null>(null)
  const { id, category } = product
  const requestKey = JSON.stringify([id, category, attempt])
  const currentResult = result?.key === requestKey ? result : null

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function loadRelatedProducts() {
      try {
        const response = await getProductsByCategory(category, signal, { page: 1, limit: 5 })
        if (!signal.aborted) {
          setResult({
            key: requestKey,
            products: response.products.filter((item) => item.id !== id).slice(0, 4),
          })
        }
      } catch {
        if (!signal.aborted) {
          setResult({ key: requestKey, error: 'We couldn’t load related products. Please try again.' })
        }
      }
    }

    void loadRelatedProducts()
    return () => controller.abort()
  }, [id, category, requestKey])

  return (
    <section aria-labelledby="related-products-heading" className="min-w-0 space-y-4 border-t border-neutral-200 pt-6 md:col-span-2">
      <h2 id="related-products-heading" className="text-xl font-semibold">Related Products</h2>
      {!currentResult ? (
        <p role="status" className="text-neutral-600">Loading related products…</p>
      ) : 'error' in currentResult ? (
        <div className="space-y-3">
          <p role="alert">{currentResult.error}</p>
          <button
            type="button"
            onClick={() => setAttempt((previous) => previous + 1)}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Retry related products
          </button>
        </div>
      ) : currentResult.products.length === 0 ? (
        <p className="text-neutral-600">No related products are available.</p>
      ) : (
        <ProductGrid products={currentResult.products} />
      )}
    </section>
  )
}
