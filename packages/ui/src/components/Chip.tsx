import React from 'react'
import { cn } from '../utils/cn'
import { MaterialSymbolsOutlined } from './MaterialIcons'

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'deletable'
  icon?: string
  onDelete?: () => void
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant = 'default', icon, onDelete, children, ...props }, ref) => {
    const baseStyles =
      'group flex items-center gap-2 pl-3 pr-1 py-1 border text-primary text-xs font-bold uppercase cursor-pointer transition-all duration-200'

    const variantStyles = {
      default: 'bg-primary/10 border-primary/40 rounded-full',
      deletable:
        'bg-primary/10 border-primary/30 clip-chip hover:bg-danger-magenta hover:text-white hover:border-danger-magenta',
    }

    return (
      <div className={cn(baseStyles, variantStyles[variant], className)} ref={ref} {...props}>
        {icon && <MaterialSymbolsOutlined icon={icon as any} className="text-[16px]" />}
        <span>{children}</span>
        {variant === 'deletable' && (
          <button
            type="button"
            onClick={onDelete}
            className="bg-primary/20 group-hover:bg-white/20 rounded p-0.5 transition-colors"
          >
            <MaterialSymbolsOutlined icon="close" className="text-[14px]" />
          </button>
        )}
      </div>
    )
  }
)

Chip.displayName = 'Chip'

export { Chip }
