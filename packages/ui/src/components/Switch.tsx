import React from 'react'
import { cn } from '../utils/cn'
import { MaterialSymbolsOutlined } from './MaterialIcons'

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onCheckedChange, label, disabled = false, size = 'md', ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onCheckedChange?.(!checked)
      props.onClick?.(e)
    }

    const sizeStyles = {
      sm: 'w-10 h-5',
      md: 'w-12 h-6',
      lg: 'w-16 h-8',
    }

    const knobSize = {
      sm: 'size-3',
      md: 'size-4',
      lg: 'size-5',
    }

    const knobPosition = {
      sm: checked ? 'right-1' : 'left-1',
      md: checked ? 'right-1' : 'left-1',
      lg: checked ? 'right-1' : 'left-1',
    }

    const baseStyles = cn('relative rounded-full transition-all duration-300', sizeStyles[size])

    const uncheckedStyles = !checked ? 'bg-surface-border' : ''

    const checkedStyles = checked
      ? 'bg-primary/20 border border-primary/30 neon-glow'
      : 'bg-surface-border'

    const disabledStyles = disabled ? 'opacity-30 cursor-not-allowed' : ''

    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        ref={ref}
        className="flex items-center gap-3 cursor-pointer"
        {...props}
      >
        <div
          className={cn(
            baseStyles,
            checked ? checkedStyles : uncheckedStyles,
            disabledStyles,
            checked && 'shadow-[0_0_15px_rgba(6,249,249,0.3)]'
          )}
        >
          <div
            className={cn(
              'absolute top-1 flex items-center justify-center transition-transform duration-300',
              knobSize[size],
              knobPosition[size]
            )}
          >
            <MaterialSymbolsOutlined
              icon={'toggle_on' as any}
              className={cn(
                'text-[10px] font-black',
                checked ? 'text-background-dark' : 'text-surface-dark'
              )}
            />
          </div>
        </div>
        {label && (
          <span className={cn('text-xs font-mono', disabled && 'opacity-40')}>
            {checked ? 'ON' : 'OFF'}
          </span>
        )}
      </button>
    )
  }
)

Switch.displayName = 'Switch'

export { Switch }
