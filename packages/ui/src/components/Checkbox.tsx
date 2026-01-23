import React from 'react'
import { cn } from '../utils/cn'
import { MaterialSymbolsOutlined } from './MaterialIcons'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  error?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
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

    const baseStyles = 'size-6 border-2 flex items-center justify-center transition-all'

    const uncheckedStyles = !checked ? 'border-surface-border' : ''

    const checkedStyles = checked
      ? 'border-primary neon-glow'
      : error && 'border-accent-magenta/30 bg-accent-magenta/10'

    const disabledStyles = disabled ? 'opacity-40 cursor-not-allowed' : ''

    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          ref={ref}
          className="sr-only"
          {...props}
        />
        <div className={cn(baseStyles, uncheckedStyles, checkedStyles, disabledStyles, className)}>
          {checked && !error && (
            <MaterialSymbolsOutlined icon="close" className="text-primary text-lg font-bold" />
          )}
          {checked && error && <div className="absolute inset-0 bg-accent-magenta/10" />}
        </div>
        {label && (
          <span
            className={cn('text-[10px] text-[#9bbbbb] font-mono italic', disabled && 'opacity-40')}
          >
            {checked ? 'ON' : 'OFF'}
          </span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
