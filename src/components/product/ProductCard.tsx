import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useCart } from '../../context/CartContext'
import type { Product } from '../../types/product'
import { discountedPrice, formatPrice } from '../../utils/currency'

export function ProductPrice({ product }: { product: Product }) {
  const price = discountedPrice(product.price, product.discountPercentage)
  const hasDiscount = product.discountPercentage !== undefined &&
    product.discountPercentage > 0 && product.discountPercentage <= 100

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="font-semibold">{formatPrice(price)}</span>
      {hasDiscount && (
        <>
          <span className="text-sm text-neutral-600">
            <span className="sr-only">Original price </span><del>{formatPrice(product.price)}</del>
          </span>
          <span className="text-sm text-neutral-700">{product.discountPercentage}% off</span>
        </>
      )}
    </div>
  )
}

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, cartItems } = useCart()
  const quantityInCart = cartItems.find((item) => item.productId === product.id)?.quantity ?? 0
  const unavailable = product.stock <= quantityInCart
  const [feedback, setFeedback] = useState<'added' | 'error' | null>(null)

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={unavailable}
        aria-label={`Add ${product.title} to cart`}
        onClick={() => setFeedback(addToCart(product) ? 'added' : 'error')}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Add to Cart
      </button>
      <p role="status" className="text-sm text-neutral-700">
        {feedback === 'added' && 'Added to cart.'}
        {feedback === 'error' && 'This product could not be added.'}
      </p>
      {unavailable && <p className="text-sm text-neutral-600">{product.stock === 0 ? 'Out of stock' : 'No additional stock available.'}</p>}
    </div>
  )
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const location = useLocation()
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {product.thumbnail ? <img
        src={product.thumbnail}
        alt={product.title}
        loading="lazy"
        className="aspect-square w-full bg-neutral-100 object-contain p-4"
      /> : <p className="p-4 text-sm text-neutral-600">No product image available.</p>}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-lg font-semibold">
          <Link
            to={`/products/${product.id}`}
            state={location.pathname === '/' ? { fromCatalog: true } : undefined}
            className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {product.title}
          </Link>
        </h2>
        <p className="line-clamp-3 text-sm text-neutral-600">{product.description}</p>
        <div className="mt-auto flex flex-wrap items-baseline justify-between gap-2 pt-2">
          <ProductPrice product={product} />
          {product.rating !== undefined && (
            <p className="text-sm text-neutral-600">Rating {product.rating} / 5</p>
          )}
        </div>
        <AddToCartButton product={product} />
      </div>
    </article>
  )
}
