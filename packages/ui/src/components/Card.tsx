import React from 'react'
import { cn } from '../utils/cn'

export type CardVariant = 'default' | 'action' | 'graphic'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  glow?: boolean
  hologram?: boolean
  image?: string
  title?: string
  description?: string
  footer?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      glow = false,
      hologram = false,
      image,
      title,
      description,
      footer,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'group relative flex flex-col rounded-lg bg-white dark:bg-[#152a2a] transition-all overflow-hidden'

    const variantStyles = {
      default: 'border border-slate-200 dark:border-[#273a3a] hover:border-primary/50',
      action: 'border-2 border-primary shadow-neon-glow',
      graphic: 'border border-slate-200 dark:border-[#273a3a] hover:border-primary',
    }

    const glowClass = glow ? 'neon-glow' : ''

    const hologramOverlay = hologram && (
      <div className="absolute inset-0 holographic-overlay opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    )

    return (
      <div
        className={cn(baseStyles, variantStyles[variant], glowClass, className)}
        ref={ref}
        {...props}
      >
        {image && variant === 'graphic' && (
          <div className="h-32 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
            <div
              className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#152a2a] to-transparent" />
          </div>
        )}
        <div className={cn('p-6', variant === 'graphic' && 'flex-1')}>
          {title && (
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                {variant === 'default' && 'Type-A // Info'}
                {variant === 'action' && 'Type-B // Action'}
                {variant === 'graphic' && 'Type-C // Visual'}
              </span>
              {variant === 'action' && (
                <span className="material-symbols-outlined text-primary text-sm animate-spin">
                  refresh
                </span>
              )}
            </div>
          )}
          {title && (
            <h3
              className={cn(
                'text-xl font-bold mb-2 group-hover:text-primary transition-colors',
                variant === 'action' && 'mb-6'
              )}
            >
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-slate-500 dark:text-[#9abcbc] mb-6 leading-relaxed">
              {description}
            </p>
          )}
          {children}
        </div>
        {footer && (
          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-[#273a3a]">
            {footer}
          </div>
        )}
        {hologramOverlay}
      </div>
    )
  }
)

Card.displayName = 'Card'

export { Card }
