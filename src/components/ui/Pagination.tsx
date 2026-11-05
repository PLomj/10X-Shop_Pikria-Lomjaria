interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const buttonStyle = 'min-h-10 min-w-10 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-current:bg-neutral-900 aria-current:text-white'

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)

  return (
    <nav aria-label="Product pages" className="space-y-3">
      <p role="status" className="text-sm text-neutral-600">Page {currentPage} of {totalPages}</p>
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          <button type="button" className={buttonStyle} disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>Previous</button>
        </li>
        {pages.map((page, index) => (
          <li key={page} className="flex items-center gap-2">
            {index > 0 && page - pages[index - 1] > 1 && <span aria-hidden="true">…</span>}
            <button
              type="button"
              className={buttonStyle}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button type="button" className={buttonStyle} disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>Next</button>
        </li>
      </ul>
    </nav>
  )
}
