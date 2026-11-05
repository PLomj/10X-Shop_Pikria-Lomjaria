import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router'
import { fetchProductsPage, getProductCategories, getProductsByCategory, productPageSize, searchProducts } from '../api/products'
import ProductGrid from '../components/product/ProductGrid'
import SearchInput from '../components/ui/SearchInput'
import CategorySelector from '../components/ui/CategorySelector'
import SortSelector from '../components/ui/SortSelector'
import Pagination from '../components/ui/Pagination'
import type { ProductsResponse, ProductCategory, ProductSortOption } from '../types/product'
import { parseCatalogSearchParams, updateCatalogSearchParams } from '../utils/catalogSearchParams'

type CatalogResult =
  | { key: string; response: ProductsResponse }
  | { key: string; error: string }

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const { query, category, sort, page } = parseCatalogSearchParams(searchParams)
  const [draft, setDraft] = useState<{ text: string; locationKey: string } | null>(null)
  // History entries reuse their keys on Back/Forward. Discard an abandoned
  // draft permanently so returning to its entry cannot restart its timer.
  if (draft && draft.locationKey !== location.key) {
    setDraft(null)
  }
  const searchText = draft?.locationKey === location.key ? draft.text : query
  const searchPending = searchText.trim() !== query
  const [categories, setCategories] = useState<ProductCategory[] | null>(null)
  const [categoryError, setCategoryError] = useState(false)
  const [categoryAttempt, setCategoryAttempt] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<CatalogResult | null>(null)
  const requestKey = JSON.stringify([query, category, sort, page, attempt])
  const currentResult = !searchPending && result?.key === requestKey ? result : null
  const error = currentResult && 'error' in currentResult ? currentResult.error : null
  const response = currentResult && 'response' in currentResult ? currentResult.response : null
  const products = response?.products ?? null
  // The final response may report fewer items than the requested page size.
  const totalPages = response ? Math.ceil(response.total / productPageSize) : 0
  const currentPage = response ? Math.floor(response.skip / productPageSize) + 1 : page
  const invalidPage = response !== null && page > Math.max(1, totalPages)
  const categoryReady = !category || categories !== null
  const categoryValid = !category || categories?.some(({ slug }) => slug === category) === true

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function loadCategories() {
      try {
        const list = await getProductCategories(signal)
        if (!signal.aborted) {
          setCategories(list)
        }
      } catch {
        if (!signal.aborted) setCategoryError(true)
      }
    }

    void loadCategories()
    return () => controller.abort()
  }, [categoryAttempt])

  function retryCategories() {
    setCategoryError(false)
    setCategoryAttempt((attempt) => attempt + 1)
  }

  useEffect(() => {
    if (!categoryReady || categoryValid) return
    setSearchParams((previous) => updateCatalogSearchParams(previous, { category: '', page: 1 }), { replace: true })
  }, [categoryReady, categoryValid, setSearchParams])

  useEffect(() => {
    if (!draft || draft.locationKey !== location.key || !searchPending) return
    const timer = setTimeout(() => {
      setSearchParams((previous) => updateCatalogSearchParams(previous, {
        query: draft.text.trim(), category: '', page: 1,
      }), { replace: true })
    }, 400)
    return () => clearTimeout(timer)
  }, [draft, location.key, searchPending, setSearchParams])

  useEffect(() => {
    if (!categoryReady || !categoryValid || searchPending) return
    const controller = new AbortController()
    const { signal } = controller

    async function loadProducts() {
      try {
        const response = await (category
          ? getProductsByCategory(category, signal, { page, limit: productPageSize }, sort)
          : query ? searchProducts(query, signal, { page, limit: productPageSize }, sort) : fetchProductsPage(page, productPageSize, signal, sort))
        if (!signal.aborted) {
          setResult({ key: requestKey, response })
        }
      } catch {
        if (!signal.aborted) {
          setResult({ key: requestKey, error: 'We couldn’t load the products. Please try again.' })
        }
      }
    }

    void loadProducts()

    return () => {
      controller.abort()
    }
  }, [query, category, sort, page, requestKey, categoryReady, categoryValid, searchPending])

  function changeSearchText(value: string) {
    setDraft({ text: value, locationKey: location.key })
    if (!value.trim() && query) {
      setSearchParams((previous) => updateCatalogSearchParams(previous, { query: '', page: 1 }), { replace: true })
    }
  }

  function changeCategory(slug: string) {
    setDraft(null)
    setSearchParams((previous) => updateCatalogSearchParams(previous, { query: '', category: slug, page: 1 }))
  }

  function changeSort(sort: ProductSortOption) {
    setDraft(null)
    setSearchParams((previous) => updateCatalogSearchParams(previous, { sort, page: 1 }))
  }

  function changePage(page: number) {
    if (!Number.isSafeInteger(page) || page < 1 || page === currentPage) return
    setDraft(null)
    setSearchParams((previous) => updateCatalogSearchParams(previous, { page }))
  }

  function retry() {
    setAttempt((previous) => previous + 1)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Product Catalog</h1>
      <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SearchInput value={searchText} onChange={changeSearchText} placeholder="Enter a product name" />
        <div className="space-y-2">
          <CategorySelector
            categories={categories ?? []}
            value={category}
            onChange={changeCategory}
            disabled={categories === null}
          />
          {categoryError ? (
            <div className="space-y-2 text-sm">
              <p role="alert">We couldn’t load categories.</p>
              <button
                type="button"
                onClick={retryCategories}
                className="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                Retry categories
              </button>
            </div>
          ) : categories === null && (
            <p role="status" className="text-sm text-neutral-600">Loading categories…</p>
          )}
        </div>
        <SortSelector value={sort} onChange={changeSort} />
      </div>
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
      {invalidPage && (
        <div className="space-y-2">
          <p role="status">This page is no longer available.</p>
          <button type="button" onClick={() => changePage(1)} className="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">
            Return to page 1
          </button>
        </div>
      )}
      {products && !invalidPage && (
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
            <p role="status" className="text-neutral-600">
              {category ? 'No products are available in this category.' : 'No products are available right now.'}
            </p>
          )
        ) : (
          <ProductGrid products={products} />
        )
      )}
      {products && products.length > 0 && !invalidPage && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />
      )}
    </div>
  )
}
