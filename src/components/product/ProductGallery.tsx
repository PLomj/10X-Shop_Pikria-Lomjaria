import { useState } from 'react'
import type { Product } from '../../types/product'

export default function ProductGallery({ product }: { product: Product }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const images = [...new Set(product.images.filter(Boolean))]
  const mainImage = images[selectedIndex] ?? product.thumbnail

  return (
    <div className="space-y-3">
      {mainImage ? (
        <img
          src={mainImage}
          alt={images.length > 1 ? `${product.title}, image ${selectedIndex + 1}` : product.title}
          className="aspect-square w-full rounded-lg border border-neutral-200 bg-white object-contain p-4"
        />
      ) : (
        <p className="rounded-lg bg-white p-4 text-neutral-600">No product image available.</p>
      )}
      {images.length > 1 && (
        <ul className="flex flex-wrap gap-2" aria-label="Product images">
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                aria-label={`Show image ${index + 1} of ${product.title}`}
                aria-pressed={index === selectedIndex}
                onClick={() => setSelectedIndex(index)}
                className="rounded-md border border-neutral-300 bg-white p-1 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 aria-pressed:border-neutral-900 aria-pressed:ring-1 aria-pressed:ring-neutral-900"
              >
                <img src={image} alt="" className="size-14 object-contain" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
