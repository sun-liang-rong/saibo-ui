import React from 'react'
import { cn } from '../utils/cn'

export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerStyle = 'minimal' | 'junction' | 'gradient' | 'labeled' | 'cross'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation
  dividerStyle?: DividerStyle
  label?: string
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', dividerStyle = 'minimal', label, ...props }, ref) => {
    if (dividerStyle === 'labeled' && orientation === 'horizontal') {
      return (
        <div
          className={cn('relative flex items-center justify-center', className)}
          ref={ref}
          {...props}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-[#395656]" />
          </div>
          <div className="relative px-3 bg-slate-50 dark:bg-[#0c1a1a] text-[10px] font-mono text-primary uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-xs">adjust</span>
            {label}
            <span className="material-symbols-outlined text-xs">adjust</span>
          </div>
        </div>
      )
    }

    if (dividerStyle === 'cross') {
      return (
        <div
          className={cn('relative w-full h-48 flex items-center justify-center', className)}
          ref={ref}
          {...props}
        >
          <div className="absolute w-full h-[1px] bg-[#273a3a]" />
          <div className="absolute h-full w-[1px] bg-[#273a3a]" />
          <div className="relative z-10 size-10 bg-[#101818] border border-primary flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.4)]">
            <span className="material-symbols-outlined text-primary text-xl">hub</span>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-primary" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-primary" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-4 bg-primary" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-4 bg-primary" />
        </div>
      )
    }

    if (orientation === 'vertical') {
      const styleMap = {
        minimal: 'w-[1px] bg-slate-300 dark:bg-[#273a3a]',
        junction: '',
        gradient: 'w-[2px] bg-gradient-to-b from-primary via-primary/20 to-primary',
        labeled: '',
        cross: '',
      }

      if (dividerStyle === 'junction') {
        return (
          <div className="h-64 flex flex-col items-center" ref={ref} {...props}>
            <div className="size-1.5 bg-primary rounded-full" />
            <div className="w-[1px] flex-1 bg-gradient-to-b from-primary via-primary/20 to-primary" />
            <div className="size-1.5 border border-primary rounded-full" />
          </div>
        )
      }

      return <div className={cn(styleMap[dividerStyle], className)} ref={ref} {...props} />
    }

    // Horizontal dividers
    const styleMap: Record<string, string | React.ReactNode> = {
      minimal: 'w-full h-[1px] bg-slate-300 dark:bg-[#273a3a]',
      junction: (
        <div className="flex items-center">
          <div className="size-2 bg-primary rotate-45" />
          <div className="flex-1 h-[1px] bg-primary/40" />
          <div className="size-2 border border-primary rotate-45" />
        </div>
      ),
      gradient:
        'w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60',
      labeled: '',
      cross: '',
    }

    if (dividerStyle === 'junction') {
      return (
        <div className={cn(className)} ref={ref} {...props}>
          {styleMap.junction}
        </div>
      )
    }

    return <div className={cn(styleMap[dividerStyle], className)} ref={ref} {...props} />
  }
)

Divider.displayName = 'Divider'

export { Divider }
