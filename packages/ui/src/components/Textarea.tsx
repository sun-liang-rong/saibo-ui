import React from 'react'
import { cn } from '../utils/cn'
import { MaterialSymbolsOutlined } from './MaterialIcons'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  icon?: string
  maxLength?: number
  showCharCount?: boolean
  required?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      disabled,
      icon,
      maxLength,
      showCharCount = false,
      required = false,
      value,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const charCount = String(value || '').length

    const baseStyles =
      'bg-background-dark border-2 border-surface-border text-white transition-all font-mono placeholder:text-slate-600'

    const focusStyles = error
      ? 'focus:border-error-red focus:shadow-neon-error'
      : 'focus:border-accent-magenta focus:shadow-neon-magenta'

    const errorStyles = error ? 'border-error-red glitch-border' : ''

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : ''

    const widthClass = fullWidth ? 'w-full' : ''
    const iconPadding = icon ? 'pl-10' : ''

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
          </label>
        )}
        <div className="relative">
          {icon && (
            <MaterialSymbolsOutlined
              icon={icon as any}
              className="absolute left-3 top-3 text-primary/40 group-focus-within:text-accent-magenta transition-colors"
            />
          )}
          <textarea
            value={value}
            maxLength={maxLength}
            rows={rows}
            className={cn(
              baseStyles,
              focusStyles,
              errorStyles,
              disabledStyles,
              iconPadding,
              widthClass,
              'rounded resize-none'
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {showCharCount && (
            <div className="absolute right-3 bottom-3 text-xs font-mono text-slate-500">
              {charCount}
              {maxLength && ` / ${maxLength}`}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-error-red font-mono">{error}</p>}
        {helperText && !error && <p className="text-sm text-slate-400 font-mono">{helperText}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
