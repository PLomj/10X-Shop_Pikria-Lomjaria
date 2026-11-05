import { useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Product } from '../../types/product'
import ProductReviews from './ProductReviews'

type DetailsTab = 'description' | 'reviews'

export default function ProductDetailsTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<DetailsTab>('description')
  const id = useId()
  const descriptionTab = useRef<HTMLButtonElement>(null)
  const reviewsTab = useRef<HTMLButtonElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, tab: DetailsTab) {
    let nextTab: DetailsTab
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowLeft':
        nextTab = tab === 'description' ? 'reviews' : 'description'
        break
      case 'Home':
        nextTab = 'description'
        break
      case 'End':
        nextTab = 'reviews'
        break
      default:
        return
    }
    event.preventDefault()
    setActiveTab(nextTab)
    const target = nextTab === 'description' ? descriptionTab : reviewsTab
    target.current?.focus()
  }

  return (
    <ProductReviews
      product={product}
      renderContent={(count, reviews) => (
        <div className="min-w-0 space-y-4 md:col-span-2">
          <div role="tablist" aria-label="Product information" className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2">
            {(['description', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                ref={tab === 'description' ? descriptionTab : reviewsTab}
                type="button"
                role="tab"
                id={`${id}-${tab}-tab`}
                aria-controls={`${id}-${tab}-panel`}
                aria-selected={activeTab === tab}
                tabIndex={activeTab === tab ? 0 : -1}
                onClick={() => setActiveTab(tab)}
                onKeyDown={(event) => handleKeyDown(event, tab)}
                className="rounded-md px-4 py-2 font-medium hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 aria-selected:bg-neutral-900 aria-selected:text-white"
              >
                {tab === 'description' ? 'Description' : `Reviews (${count})`}
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id={`${id}-description-panel`}
            aria-labelledby={`${id}-description-tab`}
            hidden={activeTab !== 'description'}
            tabIndex={0}
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <p className="break-words text-neutral-700">{product.description}</p>
          </div>
          <div
            role="tabpanel"
            id={`${id}-reviews-panel`}
            aria-labelledby={`${id}-reviews-tab`}
            hidden={activeTab !== 'reviews'}
            tabIndex={0}
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {reviews}
          </div>
        </div>
      )}
    />
  )
}
