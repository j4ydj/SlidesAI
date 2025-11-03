'use client'

import { Slot } from '@radix-ui/react-slot'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import clsx from 'clsx'

const baseStyles =
  'inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60'

const variantStyles: Record<string, string> = {
  primary:
    'bg-[color:var(--accent)] text-[color:var(--accent-foreground)] hover:bg-indigo-400 focus-visible:outline-[color:var(--accent)] shadow-lg shadow-indigo-500/20',
  secondary:
    'bg-white/10 text-[color:var(--foreground)] hover:bg-white/20 focus-visible:outline-white',
  ghost:
    'bg-transparent text-[color:var(--foreground)] hover:bg-white/10 focus-visible:outline-white/60',
}

const sizeStyles: Record<string, string> = {
  sm: 'h-9 px-3',
  md: 'h-11 px-5',
  lg: 'h-12 px-6 text-base',
}

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
