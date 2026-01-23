import React, { useEffect } from 'react'
import { cn } from '../utils/cn'
import { MaterialSymbolsOutlined } from './MaterialIcons'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showScanlines?: boolean
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      children,
      footer,
      size = 'md',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showScanlines = true,
    },
    ref
  ) => {
    // Handle Escape key
    useEffect(() => {
      if (!open || !closeOnEscape) return

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [open, closeOnEscape, onClose])

    // Prevent body scroll when modal is open
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [open])

    if (!open) return null

    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full m-4',
    }

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && closeOnOverlayClick) {
        onClose()
      }
    }

    return (
      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-[2px] p-4"
        onClick={handleOverlayClick}
        ref={ref}
      >
        <div
          className={cn(
            'relative w-full max-w-lg overflow-hidden rounded-xl border border-primary bg-[#0f131a] shadow-[0_0_40px_rgba(0,255,255,0.15)]',
            sizeClasses[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scanline effect on modal */}
          {showScanlines && (
            <div className="pointer-events-none absolute inset-0 opacity-10 bg-scanline z-0"></div>
          )}

          {/* Decorative corner accents */}
          <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-primary"></div>
          <div className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-primary"></div>
          <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-primary"></div>
          <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-primary"></div>

          {/* Modal Header */}
          {title && (
            <div className="flex items-center justify-between border-b border-surface-border bg-surface-dark px-6 py-4 relative z-10">
              <h3 className="font-display text-xl font-bold uppercase tracking-widest text-white text-glow">
                <span className="text-primary mr-2">///</span> {title}
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <MaterialSymbolsOutlined icon="close" />
              </button>
            </div>
          )}

          {/* Modal Body */}
          <div className="p-8 relative z-10">{children}</div>

          {/* Modal Footer */}
          {footer && (
            <div className="flex justify-end gap-3 border-t border-surface-border px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'

export { Modal }
