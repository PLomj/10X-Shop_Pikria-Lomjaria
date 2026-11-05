export interface ProductReview {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail?: string
}

export type LocalReview = Pick<ProductReview, 'rating' | 'comment' | 'date' | 'reviewerName'>
export type StoredReviews = Record<string, LocalReview[]>

export function isProductReview(value: unknown): value is ProductReview {
  if (typeof value !== 'object' || value === null) return false
  return (
    'rating' in value && typeof value.rating === 'number' &&
    Number.isInteger(value.rating) && value.rating >= 1 && value.rating <= 5 &&
    'comment' in value && typeof value.comment === 'string' &&
    'date' in value && typeof value.date === 'string' && Number.isFinite(Date.parse(value.date)) &&
    'reviewerName' in value && typeof value.reviewerName === 'string' &&
    (!('reviewerEmail' in value) || value.reviewerEmail === undefined || typeof value.reviewerEmail === 'string')
  )
}
