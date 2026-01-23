import React from 'react'
import { cn } from '../utils/cn'
import { MaterialSymbolsOutlined } from './MaterialIcons'

/**
 * Cyberpunk styled Toast notification component
 */
export interface ToastProps {
  id?: string
  title?: string
  message: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  variant = 'info',
  onClose,
  autoClose = false,
  duration = 3000,
}) => {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  const variantStyles = {
    success: {
      border: 'border-primary',
      shadow: 'shadow-[0_0_15px_rgba(0,255,255,0.2)]',
      accent: 'bg-primary',
      titleColor: 'text-primary',
    },
    error: {
      border: 'border-secondary',
      shadow: 'shadow-[0_0_15px_rgba(255,0,255,0.2)]',
      accent: 'bg-secondary',
      titleColor: 'text-secondary',
    },
    warning: {
      border: 'border-orange-500',
      shadow: 'shadow-[0_0_15px_rgba(255,140,0,0.2)]',
      accent: 'bg-orange-500',
      titleColor: 'text-orange-400',
    },
    info: {
      border: 'border-primary',
      shadow: 'shadow-[0_0_15px_rgba(0,255,255,0.2)]',
      accent: 'bg-primary',
      titleColor: 'text-primary',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div
      className={cn(
        'animate-float pointer-events-auto flex w-80 translate-x-0 flex-col overflow-hidden rounded border bg-background-dark/90 p-3 backdrop-blur-md',
        styles.border,
        styles.shadow
      )}
    >
      <div className="absolute left-0 top-0 h-full w-1"></div>
      <div className="mb-1 flex items-start justify-between">
        {title && (
          <span className={cn('font-mono text-xs font-bold', styles.titleColor)}>
            &gt; {title}
          </span>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <MaterialSymbolsOutlined icon="close" className="text-[10px]" />
          </button>
        )}
      </div>
      <p className="text-sm font-medium text-white">{message}</p>
    </div>
  )
}


