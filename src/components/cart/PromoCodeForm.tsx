import { useId, useState, type FormEvent } from 'react'

interface PromoCodeFormProps {
  promoCode: string | null
  onApply: (code: string) => boolean
  onRemove: () => void
}

export default function PromoCodeForm({ promoCode, onApply, onRemove }: PromoCodeFormProps) {
  const inputId = useId()
  const [code, setCode] = useState('')
  const [hasError, setHasError] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setHasError(!onApply(code))
  }

  function handleRemove() {
    onRemove()
    setCode('')
    setHasError(false)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="ml-auto w-full max-w-xs space-y-3">
      <label htmlFor={inputId} className="block font-medium">Promo Code</label>
      <div className="flex flex-wrap gap-2">
        <input
          id={inputId}
          type="text"
          value={code}
          onChange={(event) => {
            setCode(event.currentTarget.value)
            setHasError(false)
          }}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          className="min-w-0 flex-1 rounded-md border border-neutral-400 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 aria-invalid:border-red-700"
        />
        <button type="submit" className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2">
          Apply
        </button>
      </div>
      {hasError && <p id={`${inputId}-error`} role="alert" className="text-sm text-red-700">Invalid promo code</p>}
      <p role="status" className="text-sm text-neutral-700">
        {promoCode ? `Promo code ${promoCode} applied.` : 'No promo code applied.'}
      </p>
      {promoCode && (
        <button type="button" onClick={handleRemove} className="rounded-sm underline underline-offset-4 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2">
          Remove promo code
        </button>
      )}
    </form>
  )
}
