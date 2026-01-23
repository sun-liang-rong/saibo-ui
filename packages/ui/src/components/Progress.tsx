import React from 'react'
import { cn } from '../utils/cn'

/**
 * Cyberpunk styled Progress bar component
 */
export interface ProgressProps {
  /** Current value of the progress (0-100 by default) */
  value: number
  /** Maximum value (default 100) */
  max?: number
  /** Color theme of the progress bar */
  color?: 'primary' | 'secondary'
  /** Whether to show a striped pattern */
  striped?: boolean
  /** Additional CSS classes */
  className?: string
  /** Whether to show the percentage label */
  showLabel?: boolean
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  color = 'primary',
  striped = false,
  className,
  showLabel = false,
}) => {
  const percentage = Math.min((value / max) * 100, 100)

  const colorStyles = {
    primary: `bg-primary shadow-[0_0_8px_rgba(0,255,255,0.5)]`,
    secondary: `bg-secondary shadow-[0_0_8px_rgba(255,0,255,0.5)]`,
  }

  const stripedClass = striped
    ? 'relative overflow-hidden'
    : ''

  return (
    <div className={cn('w-full space-y-1', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-mono text-primary">{value}%</span>
        </div>
      )}
      <div className="w-full bg-background-dark h-2 border border-surface-border">
        <div
          className={cn(
            'h-full',
            colorStyles[color],
            stripedClass
          )}
          style={{ width: `${percentage}%` }}
        >
          {striped && (
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage:
                  'linear-gradient(45deg,rgba(0,0,0,.15) 25%,transparent 25%,transparent 50%,rgba(0,0,0,.15) 50%,rgba(0,0,0,.15) 75%,transparent 75%,transparent)',
                backgroundSize: '1rem 1rem',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export { Progress }
