import type { ProductSortOption } from './product'

export interface CatalogUrlState {
  query: string
  category: string
  sort: ProductSortOption
  page: number
}
