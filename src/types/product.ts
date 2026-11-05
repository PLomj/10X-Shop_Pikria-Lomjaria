import type { ProductReview } from './review'

export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage?: number
  brand?: string
  rating?: number
  stock: number
  category: string
  thumbnail: string
  images?: string[]
  reviews?: ProductReview[]
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface ProductCategory {
  slug: string
  name: string
  url: string
}

export type ProductSortOption =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'title-asc'

export const productSortOptions: { value: ProductSortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
  { value: 'title-asc', label: 'Title: A to Z' },
]
