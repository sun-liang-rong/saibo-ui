import React from 'react'
import { cn } from '../utils/cn'

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  name: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  error?: boolean
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      checked = false,
      onCheckedChange,
      label,
      disabled = false,
      error = false,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked)
      props.onChange?.(e)
    }

    const baseStyles = 'size-5 border-2 rotate-45 flex items-center justify-center transition-all'

    const uncheckedStyles = !checked ? 'border-surface-border' : ''

    const checkedStyles = checked ? 'border-primary neon-glow' : error && 'border-accent-magenta'

    const disabledStyles = disabled ? 'opacity-30 cursor-not-allowed' : ''

    const innerDot = checked && (
      <div className={cn('size-2.5 bg-white', error && 'bg-accent-magenta rounded-full')} />
    )

    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="radio"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          ref={ref}
          className="sr-only"
          {...props}
        />
        <div className={cn(baseStyles, uncheckedStyles, checkedStyles, disabledStyles, className)}>
          {innerDot}
        </div>
        {label && (
          <span
            className={cn('text-[10px] text-[#9bbbbb] font-mono italic', disabled && 'opacity-40')}
          >
            {checked && !error ? 'ON' : 'OFF'}
          </span>
        )}
      </label>
    )
  }
)

Radio.displayName = 'Radio'

export { Radio }
