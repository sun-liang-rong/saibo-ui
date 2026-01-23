import React from 'react'
import { cn } from '../utils/cn'
import { MaterialSymbolsOutlined } from './MaterialIcons'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'lg' | 'md' | 'sm'
  loading?: boolean
  fullWidth?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all'

    const variantStyles = {
      primary: {
        default: 'bg-primary text-background-dark',
        hover: 'bg-primary hover:scale-105 shadow-[0_0_25px_rgba(6,249,249,0.6)]',
        active: 'bg-primary/80 opacity-90 shadow-inner',
        disabled: 'bg-primary/20 text-white/20 cursor-not-allowed',
      },
      secondary: {
        default: 'bg-border-dark text-white',
        hover: 'bg-border-dark/80 hover:scale-105 border-primary/30 text-primary shadow-neon-glow',
        active: 'bg-primary/20 text-primary',
        disabled: 'bg-border-dark/30 text-white/20 cursor-not-allowed',
      },
      outline: {
        default: 'border border-border-dark text-white',
        hover: 'border-primary text-primary hover:scale-105 shadow-neon-glow',
        active: 'bg-primary border-primary text-background-dark',
        disabled: 'border-border-dark/30 text-white/20 cursor-not-allowed',
      },
      ghost: {
        default: 'bg-transparent text-white/60',
        hover: 'bg-primary/5 text-primary underline decoration-primary/50',
        active: 'bg-primary/20 text-primary italic',
        disabled: 'text-white/10 cursor-not-allowed',
      },
      default: {
        default: 'bg-primary text-background-dark',
        hover: 'bg-primary hover:scale-105 shadow-[0_0_25px_rgba(6,249,249,0.6)]',
        active: 'bg-primary/80 opacity-90 shadow-inner',
        disabled: 'bg-primary/20 text-white/20 cursor-not-allowed',
      }
    }

    const sizeStyles = {
      lg: 'h-[48px] px-8 text-sm font-black tracking-widest',
      md: 'h-[38px] px-6 text-xs font-bold tracking-wider',
      sm: 'h-[30px] px-4 text-[10px] font-bold uppercase',
    }

    const clippedClass =
      variant === 'primary' || variant === 'secondary' || variant === 'outline'
        ? 'clipped-corner-sm'
        : ''

    const widthClass = fullWidth ? 'w-full' : ''

    const iconSizeClass =
      size === 'lg' ? 'text-[22px]' : size === 'md' ? 'text-[20px]' : 'text-[16px]'

    return (
      <button
        className={cn(
          baseStyles,
          variantStyles[variant].default,
          !disabled && !loading && variantStyles[variant].hover,
          variantStyles[variant].active,
          disabled && variantStyles[variant].disabled,
          sizeStyles[size],
          clippedClass,
          widthClass,
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="-ml-1 mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && (
          <MaterialSymbolsOutlined icon={icon as any} className={cn('shrink-0', iconSizeClass)} />
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <MaterialSymbolsOutlined icon={icon as any} className={cn('shrink-0', iconSizeClass)} />
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
