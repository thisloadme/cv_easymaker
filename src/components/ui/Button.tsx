'use client'

import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-ui font-medium transition-all duration-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-ink text-paper hover:bg-accent active:scale-[0.98]',
      secondary: 'border border-ink text-ink hover:bg-ink hover:text-paper active:scale-[0.98]',
      ghost: 'text-ink hover:bg-accent-muted active:scale-[0.98]',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }