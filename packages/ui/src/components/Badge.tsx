import React from 'react'
import { cn } from '../utils/cn'
import { MaterialSymbolsOutlined } from './MaterialIcons'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  pulse?: boolean
  dot?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant = 'info',
      size = 'md',
      icon,
      pulse = false,
      dot = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center gap-1.5 font-bold uppercase tracking-wider transition-all'

    const variantStyles = {
      info: 'bg-primary text-black shadow-[0_0_10px_#0df2f2]',
      success: 'bg-success-neon text-black shadow-[0_0_10px_#39ff14]',
      warning: 'bg-warning-orange text-black',
      danger: 'bg-danger-magenta text-white shadow-[0_0_10px_#ff00ff]',
    }

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-[10px]',
      md: 'px-3 py-1 text-xs',
      lg: 'px-4 py-1.5 text-sm',
    }

    return (
      <div
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          pulse && 'animate-pulse',
          className
        )}
        ref={ref}
        {...props}
      >
        {dot && <span className={cn('size-2 rounded-full', pulse && 'animate-pulse')} />}
        {icon && <MaterialSymbolsOutlined icon={icon as any} className="text-sm" />}
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
