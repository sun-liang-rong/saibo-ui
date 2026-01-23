import React, { useState } from 'react'
import { cn } from '../utils/cn'
import { MaterialSymbolsOutlined } from './MaterialIcons'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
  badge?: string
  required?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      error,
      helperText,
      fullWidth = false,
      disabled,
      icon,
      iconPosition = 'right',
      size = 'md',
      badge,
      required = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)

    const baseStyles =
      'bg-panel-dark/60 border-2 border-surface-border text-white transition-all font-mono placeholder:text-slate-600'

    const sizeStyles = {
      sm: 'px-3 py-2 text-xs',
      md: 'px-4 py-3 text-sm',
      lg: 'px-5 py-4 text-base',
    }

    const focusStyles = error
      ? 'focus:border-error-red focus:shadow-neon-error'
      : 'focus:border-accent-magenta focus:shadow-neon-magenta'

    const errorStyles = error ? 'border-error-red glitch-border' : ''

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : ''

    const iconPaddingLeft = icon && iconPosition === 'left' ? 'pl-10' : ''
    const iconPaddingRight = icon && iconPosition === 'right' ? 'pr-10' : ''
    const badgePaddingRight = badge ? 'pr-20' : ''

    const widthClass = fullWidth ? 'w-full' : ''

    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type

    return (
      <div className={cn('group flex flex-col space-y-1.5', widthClass)}>
        {label && (
          <label
            className={cn(
              'block text-xs font-mono uppercase tracking-wide',
              error ? 'text-error-red' : 'text-primary'
            )}
          >
            {label}
            {required && <span className="ml-1 text-error-red">*</span>}
            {badge && (
              <span className="ml-2 text-[10px] bg-secondary/10 text-secondary px-1">{badge}</span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && iconPosition === 'left' && (
            <MaterialSymbolsOutlined
              icon={icon as any}
              className="absolute left-3 text-slate-500 group-focus-within:text-accent-magenta transition-colors"
            />
          )}
          <input
            type={inputType}
            className={cn(
              baseStyles,
              sizeStyles[size],
              focusStyles,
              errorStyles,
              disabledStyles,
              iconPaddingLeft,
              iconPaddingRight,
              badgePaddingRight,
              widthClass,
              'rounded-none'
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-500 group-focus-within:text-accent-magenta transition-colors hover:text-accent-magenta"
            >
              <MaterialSymbolsOutlined
                icon={showPassword ? 'visibility' : 'visibility_off'}
                className="cursor-pointer"
              />
            </button>
          )}
          {icon && iconPosition === 'right' && type !== 'password' && (
            <MaterialSymbolsOutlined
              icon={icon as any}
              className="absolute right-3 text-slate-500 group-focus-within:text-accent-magenta transition-colors"
            />
          )}
          {badge && (
            <div className="absolute right-2 px-1.5 py-0.5 bg-surface-border text-[10px] text-slate-300 font-mono">
              {badge}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-error-red font-mono">{error}</p>}
        {helperText && !error && <p className="text-sm text-slate-400 font-mono">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
