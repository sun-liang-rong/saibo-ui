import React from 'react'
import { cn } from '../utils/cn'
import { MaterialSymbolsOutlined } from './MaterialIcons'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  message: string
  variant?: 'primary' | 'secondary'
  icon?: string
  actions?: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    { className, title, message, variant = 'secondary', icon = 'warning', actions, ...props },
    ref
  ) => {
    const variantStyles = {
      primary: {
        border: 'border-primary/50',
        shadow: 'shadow-[0_0_15px_rgba(0,255,255,0.1)]',
        text: 'text-primary',
        gradient:
          'bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,255,0.05)_50%,transparent_75%,transparent_100%)]',
      },
      secondary: {
        border: 'border-secondary/50',
        shadow: 'shadow-[0_0_15px_rgba(255,0,255,0.1)]',
        text: 'text-secondary',
        gradient:
          'bg-[linear-gradient(45deg,transparent_25%,rgba(255,0,255,0.05)_50%,transparent_75%,transparent_100%)]',
      },
    }

    const styles = variantStyles[variant]

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-lg border bg-surface-dark p-6',
          styles.border,
          styles.shadow,
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'absolute inset-0 bg-[length:250%_250%] hover:bg-[position:100%_100%] transition-[background-position] duration-1000',
            styles.gradient
          )}
        />
        <div className="relative z-10">
          <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-white">
            <MaterialSymbolsOutlined
              icon={icon as any}
              className={cn('animate-pulse', styles.text)}
            />
            {title}
          </h3>
          <p className="mb-4 text-sm text-slate-300">{message}</p>
          {actions && <div className="flex gap-3">{actions}</div>}
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export { Alert }
