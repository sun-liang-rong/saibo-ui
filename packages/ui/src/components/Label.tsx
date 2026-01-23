import React from 'react'
import { cn } from '../utils/cn'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: 'standard' | 'required' | 'meta'
  error?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant = 'standard', error = false, children, ...props }, ref) => {
    const baseStyles = 'block text-xs font-bold uppercase tracking-wide transition-colors'

    const variantStyles = {
      standard: error ? 'text-error-red' : 'text-[#9bbbbb]',
      required: 'text-white',
      meta: 'text-primary/70 text-[10px] tracking-[2px]',
    }

    return (
      <label className={cn(baseStyles, variantStyles[variant], className)} ref={ref} {...props}>
        {children}
        {variant === 'required' && <span className="ml-1 text-error-red">*</span>}
      </label>
    )
  }
)

Label.displayName = 'Label'

export { Label }
