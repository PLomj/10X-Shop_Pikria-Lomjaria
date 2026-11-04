import { useEffect, useState } from 'react'
import { fetchProducts, searchProducts } from '../api/products'
import ProductCard from '../components/product/ProductCard'
import SearchInput from '../components/ui/SearchInput'
import type { Product } from '../types/product'

interface CatalogRequest {
  query: string
  immediate: boolean
}

type CatalogResult =
  | { request: CatalogRequest; products: Product[] }
  | { request: CatalogRequest; error: string }

export default function CatalogPage() {
  const [searchText, setSearchText] = useState('')
  const [request, setRequest] = useState<CatalogRequest>({ query: '', immediate: true })
  const [result, setResult] = useState<CatalogResult | null>(null)
  const { query } = request
  const currentResult = result?.request === request ? result : null
  const error = currentResult && 'error' in currentResult ? currentResult.error : null
  const products = currentResult && 'products' in currentResult ? currentResult.products : null

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const { query, immediate } = request

    async function loadProducts() {
      try {
        const response = await (query ? searchProducts(query, signal) : fetchProducts(signal))
        if (!signal.aborted) {
          setResult({ request, products: response.products })
        }
      } catch {
        if (!signal.aborted) {
          setResult({ request, error: 'We couldn’t load the products. Please try again.' })
        }
      }
    }

    const timer = immediate ? undefined : setTimeout(() => void loadProducts(), 400)
    if (immediate) void loadProducts()

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [request])

  function changeSearchText(value: string) {
    setSearchText(value)
    const nextQuery = value.trim()
    if (nextQuery !== query) {
      setRequest({ query: nextQuery, immediate: nextQuery === '' })
    }
  }

  function retry() {
    setRequest({ query, immediate: true })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Product Catalog</h1>
      <SearchInput value={searchText} onChange={changeSearchText} placeholder="Enter a product name" />
      {!currentResult && (
        <p role="status" className="text-neutral-600">{query ? 'Searching products…' : 'Loading products…'}</p>
      )}
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
      {products && (
        products.length === 0 ? (
          query ? (
            <div className="space-y-3">
              <p role="status" className="break-words text-neutral-600">
                No products found for “{query}”. Try another search.
              </p>
              <button
                type="button"
                onClick={() => changeSearchText('')}
                className="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                Clear search
              </button>
            </div>
          ) : (
            <p role="status" className="text-neutral-600">No products are available right now.</p>
          )
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
