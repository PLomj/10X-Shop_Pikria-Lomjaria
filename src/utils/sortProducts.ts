import type { Product, ProductSortOption } from '../types/product'

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
