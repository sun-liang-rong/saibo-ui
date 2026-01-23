import React from 'react'
import { cn } from '../utils/cn'
import { MaterialSymbolsOutlined } from './MaterialIcons'

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  icon?: string
  progress?: number
  color?: 'primary' | 'secondary'
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      label,
      value,
      trend,
      trendDirection = 'up',
      icon,
      progress,
      color = 'primary',
      ...props
    },
    ref
  ) => {
    const colorStyles = {
      primary: {
        text: 'text-primary',
        bg: 'bg-primary',
        border: 'hover:border-primary/50',
        glow: 'group-hover:text-primary',
        blur: 'bg-primary/5 group-hover:bg-primary/10',
        shadow: 'shadow-[0_0_10px_#00ffff]',
      },
      secondary: {
        text: 'text-secondary',
        bg: 'bg-secondary',
        border: 'hover:border-secondary/50',
        glow: 'group-hover:text-secondary',
        blur: 'bg-secondary/5 group-hover:bg-secondary/10',
        shadow: 'shadow-[0_0_10px_#ff00ff]',
      },
    }

    const styles = colorStyles[color]

    return (
      <div
        ref={ref}
        className={cn(
          'group relative flex flex-col justify-between overflow-hidden rounded-lg border border-surface-border bg-surface-dark p-5 transition-colors',
          styles.border,
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'absolute -right-6 -top-6 h-20 w-20 rounded-full blur-xl transition-all',
            styles.blur
          )}
        />
        <div className="mb-4 flex items-center justify-between">
          <span
            className={cn(
              'text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors',
              styles.glow
            )}
          >
            {label}
          </span>
          {icon && (
            <MaterialSymbolsOutlined
              icon={icon as any}
              className={cn('text-opacity-50', styles.text)}
            />
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          {trend && (
            <span className={cn('text-sm font-medium', styles.text)}>{trend}</span>
          )}
        </div>
        {progress !== undefined && (
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={cn('h-full', styles.bg, styles.shadow)}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {/* Placeholder for chart bars if progress is not used but we want bars */}
        {!progress && (
          <div className="mt-3 flex gap-0.5 h-1">
             <div className={cn("flex-1 rounded-sm opacity-20", styles.bg)}></div>
             <div className={cn("flex-1 rounded-sm opacity-40", styles.bg)}></div>
             <div className={cn("flex-1 rounded-sm opacity-60", styles.bg)}></div>
             <div className={cn("flex-1 rounded-sm", styles.bg, styles.shadow)}></div>
             <div className="flex-1 rounded-sm bg-slate-800"></div>
          </div>
        )}
      </div>
    )
  }
)

StatCard.displayName = 'StatCard'

export { StatCard }
