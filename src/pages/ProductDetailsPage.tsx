import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { fetchProductById, ProductNotFoundError } from '../api/products'
import ProductGallery from '../components/product/ProductGallery'
import { ProductPrice } from '../components/product/ProductCard'
import ProductPurchaseControls from '../components/product/ProductPurchaseControls'
import type { Product } from '../types/product'

function ProductDetails({ id }: { id: number }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [failure, setFailure] = useState<'not-found' | 'request' | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function loadProduct() {
      try {
        const result = await fetchProductById(id, signal)
        if (!signal.aborted) setProduct(result)
      } catch (error) {
        if (!signal.aborted) {
          setFailure(error instanceof ProductNotFoundError ? 'not-found' : 'request')
        }
      } finally {
        if (!signal.aborted) setIsLoading(false)
      }
    }

    void loadProduct()
    return () => controller.abort()
  }, [id, attempt])

  function retry() {
    setFailure(null)
    setIsLoading(true)
    setAttempt((previous) => previous + 1)
  }

  if (isLoading) return <p role="status">Loading product…</p>

  if (failure === 'not-found') {
    return <h1 className="text-2xl font-bold">Product not found</h1>
  }

  if (!product) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Product unavailable</h1>
        <p role="alert">We couldn’t load this product. Please try again.</p>
        <button
          type="button"
          onClick={retry}
          className="rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <article className="grid items-start gap-6 md:grid-cols-2 md:gap-10">
      <ProductGallery key={product.id} product={product} />
      <div className="min-w-0 space-y-4 break-words">
        <h1 className="text-2xl font-bold sm:text-3xl">{product.title}</h1>
        <div className="text-xl"><ProductPrice product={product} /></div>
        <p className="text-neutral-700">{product.description}</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="font-semibold">Category</dt>
          <dd>
            <Link
              to={`/?${new URLSearchParams({ category: product.category, page: '1' })}`}
              className="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {product.category}
            </Link>
          </dd>
          {product.brand && <><dt className="font-semibold">Brand</dt><dd>{product.brand}</dd></>}
          {product.rating !== undefined && (
            <><dt className="font-semibold">Rating</dt><dd>{product.rating} / 5</dd></>
          )}
          <dt className="font-semibold">Availability</dt>
          <dd className={product.stock === 0 ? 'font-medium text-red-700' : product.stock <= 5 ? 'font-medium text-amber-800' : ''}>
            {product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left!` : 'In stock'}
          </dd>
        </dl>
        <ProductPurchaseControls key={product.id} product={product} />
      </div>
    </article>
  )
}

export default function ProductDetailsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const navigationState: unknown = location.state
  const fromCatalog = typeof navigationState === 'object' && navigationState !== null &&
    'fromCatalog' in navigationState && navigationState.fromCatalog === true
  const { id } = useParams()
  const productId = id && /^\d+$/.test(id) ? Number(id) : NaN
  const isValidId = Number.isSafeInteger(productId) && productId > 0

  return (
    <div className="space-y-6">
      <Link to="/" onClick={(event) => {
        // A new tab has no earlier entry in this router, even if link state exists.
        if (fromCatalog && typeof window !== 'undefined' && window.history.state?.idx > 0) {
          event.preventDefault()
          navigate(-1)
        }
      }} className="inline-block rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">
        Back to Catalog
      </Link>
      {isValidId ? <ProductDetails key={productId} id={productId} /> : (
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Invalid product ID</h1>
          <p className="text-neutral-600">Choose a product from the catalog to view its details.</p>
        </div>
      )}
    </div>
  )
}
