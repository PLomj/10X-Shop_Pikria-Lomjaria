import type { Product, ProductSortOption } from '../types/product'

// Fallback for an endpoint proven unable to sort. This only orders loaded items,
// so callers must disclose that it does not provide globally sorted pagination.
// Current Catalog endpoints support server sorting and do not use this fallback.
export function sortProducts(products: readonly Product[], option: ProductSortOption): readonly Product[] {
  switch (option) {
    case 'default':
      return products
    case 'price-asc':
      return [...products].sort((a, b) => a.price - b.price)
    case 'price-desc':
      return [...products].sort((a, b) => b.price - a.price)
    case 'rating-desc':
      return [...products].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1))
    case 'title-asc':
      return [...products].sort((a, b) => a.title.localeCompare(b.title))
  }
}
