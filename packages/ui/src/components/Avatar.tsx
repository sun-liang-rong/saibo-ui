import React from 'react'
import { cn } from '../utils/cn'
import { MaterialSymbolsOutlined } from './MaterialIcons'

export type AvatarStatus = 'online' | 'offline' | 'away' | 'hologram' | 'corrupted'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  size?: 'sm' | 'md' | 'lg'
  shape?: 'circle' | 'square'
  status?: AvatarStatus
  fallback?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, size = 'md', shape = 'circle', status, fallback, ...props }, ref) => {
    const sizeStyles = {
      sm: 'size-10 border-2',
      md: 'size-24 border-4',
      lg: 'size-32 border-4',
    }

    const shapeStyles = {
      circle: 'rounded-full',
      square: 'rounded-lg overflow-hidden',
    }

    const statusStyles = {
      online: 'bg-primary',
      offline: 'bg-slate-600',
      away: 'bg-yellow-500',
      hologram: 'bg-primary/70',
      corrupted: 'bg-red-500/50',
    }

    const statusIndicator = status && (
      <div
        className={cn(
          'absolute -bottom-1 -right-1 size-6 rounded-full border-4 border-background-dark',
          statusStyles[status]
        )}
      >
        {status === 'corrupted' && (
          <MaterialSymbolsOutlined
            icon="warning"
            className="absolute inset-0 flex items-center justify-center text-red-500 text-lg"
          />
        )}
      </div>
    )

    return (
      <div className="relative inline-block" ref={ref} {...props}>
        {status === 'hologram' ? (
          <div
            className={cn(
              'relative border-2 border-primary/50 overflow-hidden',
              sizeStyles[size],
              shapeStyles[shape]
            )}
          >
            {src && (
              <div
                className="w-full h-full bg-cover bg-center opacity-70"
                style={{ backgroundImage: `url(${src})` }}
              />
            )}
            <div className="absolute inset-0 holographic-overlay pointer-events-none" />
            <div className="scanline absolute inset-0 animate-bounce w-full h-2 bg-primary/30" />
          </div>
        ) : status === 'corrupted' ? (
          <div
            className={cn(
              'relative border-2 border-red-500/50 overflow-hidden glitch-effect',
              sizeStyles[size],
              shapeStyles[shape]
            )}
          >
            {src && (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
              />
            )}
            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
              <MaterialSymbolsOutlined icon="warning" className="text-red-500 text-3xl" />
            </div>
          </div>
        ) : (
          <div
            className={cn(
              sizeStyles[size],
              shapeStyles[shape],
              'border overflow-hidden bg-background-dark',
              status === 'offline' && 'grayscale'
            )}
          >
            {src ? (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-border text-slate-400">
                {fallback || '?'}
              </div>
            )}
          </div>
        )}
        {statusIndicator}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export { Avatar }
