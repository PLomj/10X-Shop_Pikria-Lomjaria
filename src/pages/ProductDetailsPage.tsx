import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { fetchProductById, ProductNotFoundError } from '../api/products'
import ProductGallery from '../components/product/ProductGallery'
import type { Product } from '../types/product'

const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

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
      <ProductGallery product={product} />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold sm:text-3xl">{product.title}</h1>
        <p className="text-xl font-semibold">{priceFormatter.format(product.price)}</p>
        <p className="text-neutral-700">{product.description}</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="font-semibold">Category</dt>
          <dd>{product.category}</dd>
          {product.brand && <><dt className="font-semibold">Brand</dt><dd>{product.brand}</dd></>}
          {product.rating !== undefined && (
            <><dt className="font-semibold">Rating</dt><dd>{product.rating} / 5</dd></>
          )}
          {product.discountPercentage !== undefined && (
            <><dt className="font-semibold">Discount</dt><dd>{product.discountPercentage}%</dd></>
          )}
          <dt className="font-semibold">Availability</dt>
          <dd>{product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}</dd>
        </dl>
      </div>
    </article>
  )
}

export default function ProductDetailsPage() {
  const { id } = useParams()
  const productId = id && /^\d+$/.test(id) ? Number(id) : NaN
  const isValidId = Number.isSafeInteger(productId) && productId > 0

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-block rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">
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
