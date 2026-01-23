import React from 'react'
import { cn } from '../utils/cn'
import { MaterialSymbolsOutlined } from './MaterialIcons'

export type TagVariant = 'info' | 'success' | 'warning' | 'danger' | 'outline'

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TagVariant
  icon?: string
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant = 'info', icon, children, ...props }, ref) => {
    const baseStyles =
      'clip-tag px-6 py-1.5 flex items-center gap-2 font-bold text-xs uppercase tracking-widest'

    const variantStyles = {
      info: 'bg-primary text-background-dark',
      success: 'bg-success-neon text-background-dark shadow-[0_0_15px_rgba(57,255,20,0.3)]',
      warning: 'bg-warning-orange text-background-dark',
      danger: 'bg-danger-magenta text-white shadow-[0_0_15px_rgba(255,0,255,0.3)]',
      outline: 'border border-primary text-primary hover:bg-primary/10 transition-colors',
    }

    return (
      <div className={cn(baseStyles, variantStyles[variant], className)} ref={ref} {...props}>
        {icon && <MaterialSymbolsOutlined icon={icon as any} className="text-sm" />}
        <span>{children}</span>
      </div>
    )
  }
)

Tag.displayName = 'Tag'

export { Tag }
