interface ProductGridSkeletonProps {
  count: number
  message: string
}

export default function ProductGridSkeleton({ count, message }: ProductGridSkeletonProps) {
  return (
    <div role="status">
      <span className="sr-only">{message}</span>
      <ul aria-hidden="true" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className="flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <div className="aspect-square w-full bg-neutral-200" />
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="h-7 w-3/4 rounded bg-neutral-200" />
              <div className="space-y-2">
                <div className="h-4 rounded bg-neutral-200" />
                <div className="h-4 rounded bg-neutral-200" />
                <div className="h-4 w-2/3 rounded bg-neutral-200" />
              </div>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="h-6 w-20 rounded bg-neutral-200" />
                <div className="h-4 w-24 rounded bg-neutral-200" />
              </div>
              <div className="h-9 w-28 rounded-md bg-neutral-200" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
