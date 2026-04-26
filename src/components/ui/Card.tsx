interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered'
}

export function Card({ className = '', variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-paper border border-border',
    elevated: 'bg-paper shadow-lg',
    bordered: 'bg-paper border-2 border-ink',
  }

  return (
    <div className={`rounded-sm p-6 ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}