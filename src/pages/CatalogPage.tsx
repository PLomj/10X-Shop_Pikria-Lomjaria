import { useEffect, useState } from 'react'
import { fetchProducts } from '../api/products'
import ProductCard from '../components/product/ProductCard'
import type { Product } from '../types/product'

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function loadProducts() {
      try {
        const response = await fetchProducts(signal)
        if (!signal.aborted) {
          setProducts(response.products)
        }
      } catch {
        if (!signal.aborted) {
          setError('We couldn’t load the products. Please try again.')
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadProducts()
    return () => controller.abort()
  }, [attempt])

  function retry() {
    setError(null)
    setIsLoading(true)
    setAttempt((previous) => previous + 1)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Product Catalog</h1>
      {isLoading && <p role="status" className="text-neutral-600">Loading products…</p>}
      {error && (
        <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
          <p role="alert">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Retry
          </button>
        </div>
      )}
      {!isLoading && !error && (
        products.length === 0 ? (
          <p role="status" className="text-neutral-600">No products are available right now.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}
