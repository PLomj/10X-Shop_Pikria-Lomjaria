export default function ProductDetailsSkeleton() {
  return (
    <div role="status" aria-label="Loading product" className="grid items-start gap-6 md:grid-cols-2 md:gap-10">
      <span className="sr-only">Loading product…</span>
      <div aria-hidden="true" className="min-w-0 space-y-3">
        <div className="aspect-square rounded-lg bg-neutral-200" />
        <div className="flex gap-2">
          <div className="size-16 rounded-md bg-neutral-200" />
          <div className="size-16 rounded-md bg-neutral-200" />
          <div className="size-16 rounded-md bg-neutral-200" />
        </div>
      </div>
      <div aria-hidden="true" className="min-w-0 space-y-4">
        <div className="h-9 w-3/4 rounded bg-neutral-200" />
        <div className="h-7 w-1/3 rounded bg-neutral-200" />
        <div className="space-y-2">
          <div className="h-5 rounded bg-neutral-200" />
          <div className="h-5 rounded bg-neutral-200" />
          <div className="h-5 w-2/3 rounded bg-neutral-200" />
        </div>
        <div className="h-28 rounded bg-neutral-200" />
        <div className="h-10 w-40 rounded bg-neutral-200" />
      </div>
    </div>
  )
}
