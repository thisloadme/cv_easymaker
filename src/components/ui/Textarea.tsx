'use client'

import { forwardRef } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-ui font-medium text-ink">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-3 font-ui bg-paper border border-border rounded-sm
            placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
            transition-colors duration-200 ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-500 font-ui">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export { Textarea }