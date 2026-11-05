import { useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../context/AuthContext'
import type { Product } from '../../types/product'
import type { LocalReview } from '../../types/review'
import { loadProductReviews, saveProductReview } from '../../utils/reviewStorage'

export default function ProductReviews({ product }: { product: Product }) {
  const { user } = useAuth()
  const [localReviews, setLocalReviews] = useState(() => loadProductReviews(product.id))
  const [rating, setRating] = useState('')
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({})
  const [feedback, setFeedback] = useState('')
  const submitted = useRef(false)
  const summary = useMemo(() => {
    const reviews = [...localReviews, ...(product.reviews ?? [])]
    return {
      reviews,
      average: reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : null,
    }
  }, [localReviews, product.reviews])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitted.current) return
    const numericRating = Number(rating)
    const trimmedComment = comment.trim()
    const nextErrors: typeof errors = {}
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) nextErrors.rating = 'Please select a rating'
    if (trimmedComment.length < 10) nextErrors.comment = 'Comment must be at least 10 characters'
    setErrors(nextErrors)
    setFeedback('')
    if (Object.keys(nextErrors).length) return

    const review: LocalReview = {
      rating: numericRating,
      comment: trimmedComment,
      date: new Date().toISOString(),
      reviewerName: user?.username.trim() || 'Guest',
    }
    submitted.current = true
    try {
      setLocalReviews(saveProductReview(product.id, review))
      setRating('')
      setComment('')
      setFeedback('Review added ✓')
    } catch {
      submitted.current = false
      setFeedback('Your review could not be saved. Please try again.')
    }
  }

  const inputStyle = 'w-full rounded-md border border-neutral-400 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2'

  return (
    <section aria-labelledby="product-reviews-heading" className="space-y-6 border-t border-neutral-200 pt-6 md:col-span-2">
      <div className="space-y-2">
        <h2 id="product-reviews-heading" className="text-xl font-semibold">Reviews ({summary.reviews.length})</h2>
        <p className="text-neutral-700">
          {summary.average === null ? 'No reviews yet.' : `Review average: ${summary.average.toFixed(1)} / 5`}
        </p>
      </div>
      <ul className="space-y-4">
        {summary.reviews.map((review, index) => (
          <li key={`${review.date}-${review.reviewerName}-${index}`} className="space-y-2 break-words rounded-lg border border-neutral-200 bg-white p-4">
            <p className="font-semibold">{review.reviewerName}</p>
            <p aria-label={`Rating ${review.rating} out of 5`}>
              <span aria-hidden="true">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
            </p>
            <time dateTime={review.date} className="text-sm text-neutral-600">{new Date(review.date).toLocaleDateString()}</time>
            <p className="whitespace-pre-wrap">{review.comment}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-4 rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
        <h3 className="text-lg font-semibold">Write a Review</h3>
        <div className="space-y-2">
          <label htmlFor="review-rating" className="block font-medium">Rating</label>
          <select id="review-rating" required value={rating} onChange={(event) => {
            submitted.current = false
            setRating(event.currentTarget.value)
            setFeedback('')
          }} aria-invalid={Boolean(errors.rating)} aria-describedby={errors.rating ? 'review-rating-error' : undefined} className={inputStyle}>
            <option value="">Select a rating</option>
            {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} {value === 1 ? 'star' : 'stars'}</option>)}
          </select>
          {errors.rating && <p id="review-rating-error" role="alert" className="text-sm text-red-700">{errors.rating}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="review-comment" className="block font-medium">Comment</label>
          <textarea id="review-comment" required rows={4} value={comment} onChange={(event) => {
            submitted.current = false
            setComment(event.currentTarget.value)
            setFeedback('')
          }} aria-invalid={Boolean(errors.comment)} aria-describedby={errors.comment ? 'review-comment-error' : undefined} className={inputStyle} />
          {errors.comment && <p id="review-comment-error" role="alert" className="text-sm text-red-700">{errors.comment}</p>}
        </div>
        <button type="submit" className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2">Submit review</button>
        <p role="status" className="text-sm text-neutral-700">{feedback}</p>
      </form>
    </section>
  )
}
