import type { Product, ProductCategory, ProductsResponse } from '../types/product'

const productsUrl = 'https://dummyjson.com/products'

export class ProductNotFoundError extends Error {
  constructor(id: number) {
    super(`Product ${id} was not found.`)
    this.name = 'ProductNotFoundError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isProductCategory(value: unknown): value is ProductCategory {
  return (
    isRecord(value) &&
    typeof value.slug === 'string' &&
    typeof value.name === 'string' &&
    typeof value.url === 'string'
  )
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
    (value.discountPercentage === undefined || typeof value.discountPercentage === 'number') &&
    (value.brand === undefined || typeof value.brand === 'string') &&
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

async function fetchProductList(url: string, signal?: AbortSignal): Promise<ProductsResponse> {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`Product request failed (HTTP ${response.status}).`)
  }

  const data: unknown = await response.json()
  if (!isProductsResponse(data)) {
    throw new Error('The product API returned an unexpected response.')
  }

  return data
}

export function fetchProducts(signal?: AbortSignal): Promise<ProductsResponse> {
  return fetchProductList(productsUrl, signal)
}

export function searchProducts(query: string, signal?: AbortSignal): Promise<ProductsResponse> {
  const params = new URLSearchParams({ q: query })
  return fetchProductList(`${productsUrl}/search?${params}`, signal)
}

export async function getProductCategories(signal?: AbortSignal): Promise<ProductCategory[]> {
  const response = await fetch(`${productsUrl}/categories`, { signal })

  if (!response.ok) {
    throw new Error(`Category request failed (HTTP ${response.status}).`)
  }

  const data: unknown = await response.json()
  if (!Array.isArray(data) || !data.every(isProductCategory)) {
    throw new Error('The category API returned an unexpected response.')
  }

  return data
}

export async function fetchProductById(id: number, signal?: AbortSignal): Promise<Product> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('A product ID must be a positive safe integer.')
  }

  const response = await fetch(`${productsUrl}/${id}`, { signal })
  if (response.status === 404) {
    throw new ProductNotFoundError(id)
  }
  if (!response.ok) {
    throw new Error(`Product request failed (HTTP ${response.status}).`)
  }

  const data: unknown = await response.json()
  if (!isProduct(data) || data.id !== id) {
    throw new Error('The product API returned an unexpected response.')
  }

  return data
}
