import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../utils/cn'

export interface SelectOption {
  value: string
  label: string
  icon?: string
  disabled?: boolean
}

export interface SelectProps {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      size = 'md',
      options,
      value,
      onValueChange,
      placeholder = 'Select target module...',
      required = false,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedOption = options.find(opt => opt.value === value)

    const sizeStyles = {
      sm: 'h-8 text-xs',
      md: 'h-12 text-sm',
      lg: 'h-14 text-base',
    }

    const errorStyles = error ? 'border-orange-500 bg-orange-500/10 text-orange-200' : ''

    const baseStyles = cn(
      'relative w-full border border-surface-dark/50 text-white font-mono transition-all',
      sizeStyles[size],
      errorStyles
    )

    const focusStyles = error
      ? 'focus:border-orange-500'
      : 'focus:border-primary bg-primary/10 text-white shadow-neon-glow'

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : ''

    return (
      <div className={cn('relative', fullWidth && 'w-full', className)} ref={ref}>
        {label && (
          <label
            className={cn(
              'block text-[10px] text-primary/40 font-mono uppercase tracking-widest',
              error && 'text-orange-500'
            )}
          >
            {label}
            {required && <span className="ml-1 text-error-red">*</span>}
          </label>
        )}

        <div className={cn('relative', isOpen && 'z-50')} ref={selectRef}>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              'w-full flex items-center justify-between px-4 rounded',
              baseStyles,
              focusStyles,
              disabledStyles,
              isOpen && 'ring-2 ring-primary/20 ring-offset-2 ring-offset-background-dark'
            )}
          >
            <span
              className={cn(
                !selectedOption && 'text-white/70 font-bold',
                selectedOption && 'font-bold uppercase tracking-wider'
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="text-primary">{isOpen ? '▲' : '▼'}</span>
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-1 w-full overflow-hidden border border-primary/20 bg-[#0f2323]/70 backdrop-blur-md rounded-lg shadow-2xl">
              <div className="py-2">
                {options.map((option, index) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      onValueChange?.(option.value)
                      setIsOpen(false)
                    }}
                    className={cn(
                      'px-4 py-3 flex items-center justify-between cursor-pointer group transition-all',
                      value === option.value ? 'bg-primary cursor-pointer' : 'hover:bg-primary/10',
                      option.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono uppercase">
                        {String(index + 1).padStart(3, '0')}
                      </span>
                      <span
                        className={cn(
                          'text-sm font-medium uppercase tracking-wider',
                          value === option.value
                            ? 'text-background-dark font-black'
                            : 'text-white/80'
                        )}
                      >
                        {option.label}
                      </span>
                    </div>
                    {value === option.value && (
                      <>
                        <span className="text-[10px] font-bold text-background-dark bg-background-dark/10 px-1 rounded">
                          SELECTED
                        </span>
                        <span className="text-accent-magenta">✓</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-orange-500 font-mono mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-slate-400 font-mono mt-1">{helperText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }
