import React from 'react'
import { cn } from '../utils/cn'
import { MaterialSymbolsOutlined } from './MaterialIcons'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string
  size?: 'sm' | 'md' | 'lg'
  shape?: 'rounded' | 'circle'
  variant?: 'default' | 'primary'
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, size = 'md', shape = 'rounded', variant = 'default', ...props }, ref) => {
    const baseStyles = 'flex items-center justify-center transition-all hover-glow'

    const sizeStyles = {
      sm: 'size-10',
      md: 'size-14',
      lg: 'size-20',
    }

    const shapeStyles = {
      rounded: 'rounded-lg',
      circle: 'rounded-full',
    }

    const variantStyles = {
      default: 'border border-slate-200 dark:border-[#283939] text-slate-600 dark:text-white',
      primary: 'border border-primary text-primary bg-primary/10',
    }

    const iconSize = {
      sm: '!text-xl',
      md: '!text-2xl',
      lg: '!text-4xl',
    }

    return (
      <button
        className={cn(
          baseStyles,
          sizeStyles[size],
          shapeStyles[shape],
          variantStyles[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        <MaterialSymbolsOutlined icon={icon as any} className={iconSize[size]} />
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'

export { IconButton }
