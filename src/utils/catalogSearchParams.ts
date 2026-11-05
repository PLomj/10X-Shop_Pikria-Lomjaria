import { productPageSize } from '../api/products'
import type { CatalogUrlState } from '../types/catalog'
import { productSortOptions } from '../types/product'

export function parseCatalogSearchParams(params: URLSearchParams): CatalogUrlState {
  const query = (params.get('q') ?? '').trim()
  const rawCategory = params.get('category') ?? ''
  // Search takes precedence when both modes are supplied.
  const category = !query && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rawCategory) ? rawCategory : ''
  const sort = productSortOptions.find((option) => option.value === params.get('sort'))?.value ?? 'default'
  const rawPage = params.get('page') ?? ''
  const page = /^[0-9]+$/.test(rawPage) ? Number(rawPage) : NaN
  const validPage = Number.isSafeInteger(page) && page > 0 &&
    Number.isSafeInteger((page - 1) * productPageSize)

  return { query, category, sort, page: validPage ? page : 1 }
}
