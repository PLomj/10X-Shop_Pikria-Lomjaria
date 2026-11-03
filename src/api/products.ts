import type { Product, ProductsResponse } from '../types/product'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    Number.isSafeInteger(value.id) &&
    value.id > 0 &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.price === 'number' &&
    Number.isFinite(value.price) &&
    typeof value.discountPercentage === 'number' &&
    (value.rating === undefined || typeof value.rating === 'number') &&
    typeof value.stock === 'number' &&
    typeof value.category === 'string' &&
    typeof value.thumbnail === 'string' &&
    Array.isArray(value.images) &&
    value.images.every((image: unknown) => typeof image === 'string')
  )
}

function isProductsResponse(value: unknown): value is ProductsResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.products) &&
    value.products.every(isProduct) &&
    typeof value.total === 'number' &&
    typeof value.skip === 'number' &&
    typeof value.limit === 'number'
  )
}

export async function fetchProducts(signal?: AbortSignal): Promise<ProductsResponse> {
  const response = await fetch('https://dummyjson.com/products', { signal })

  if (!response.ok) {
    throw new Error(`Product request failed (HTTP ${response.status}).`)
  }

  const data: unknown = await response.json()
  if (!isProductsResponse(data)) {
    throw new Error('The product API returned an unexpected response.')
  }

  return data
}
