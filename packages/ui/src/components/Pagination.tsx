import React from 'react'
import { cn } from '../utils/cn'

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, currentPage, totalPages, onPageChange, ...props }, ref) => {
    // Generate page numbers (simplified for now, can be expanded to support ellipsis)
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1 justify-center', className)}
        {...props}
      >
        {pages.map((page, index) => {
          const isActive = page === currentPage
          return (
            <React.Fragment key={page}>
              {index > 0 && (
                <div className="w-4 h-px bg-surface-border" />
              )}
              <button
                onClick={() => onPageChange(page)}
                className={cn(
                  'w-8 h-8 flex items-center justify-center text-xs font-bold transition-all',
                  isActive
                    ? 'border border-primary text-primary bg-primary/10'
                    : 'border border-surface-border text-slate-400 hover:border-slate-400'
                )}
              >
                {page}
              </button>
            </React.Fragment>
          )
        })}
      </div>
    )
  }
)

Pagination.displayName = 'Pagination'

export { Pagination }
