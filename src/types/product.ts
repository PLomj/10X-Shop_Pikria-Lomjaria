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
  images: string[]
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
