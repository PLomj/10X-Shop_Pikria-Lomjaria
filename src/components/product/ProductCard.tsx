import { useState } from 'react'
import { Link } from 'react-router'
import { useCart } from '../../context/CartContext'
import type { Product } from '../../types/product'
import { formatPrice } from '../../utils/currency'

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [feedback, setFeedback] = useState<'added' | 'error' | null>(null)

  return (
    <div className="space-y-2">
      <button
        type="button"
        aria-label={`Add ${product.title} to cart`}
        onClick={() => setFeedback(addToCart(product) ? 'added' : 'error')}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        Add to Cart
      </button>
      <p role="status" className="text-sm text-neutral-700">
        {feedback === 'added' && 'Added to cart.'}
        {feedback === 'error' && 'This product could not be added.'}
      </p>
    </div>
  )
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <img
        src={product.thumbnail}
        alt={product.title}
        loading="lazy"
        className="aspect-square w-full bg-neutral-100 object-contain p-4"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-lg font-semibold">
          <Link
            to={`/products/${product.id}`}
            className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {product.title}
          </Link>
        </h2>
        <p className="line-clamp-3 text-sm text-neutral-600">{product.description}</p>
        <div className="mt-auto flex flex-wrap items-baseline justify-between gap-2 pt-2">
          <p className="font-semibold">{formatPrice(product.price)}</p>
          {product.rating !== undefined && (
            <p className="text-sm text-neutral-600">Rating {product.rating} / 5</p>
          )}
        </div>
        <AddToCartButton product={product} />
      </div>
    </article>
  )
}
