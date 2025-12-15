import React from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ className, type = 'button', size = 'md', ...props }: ButtonProps) {
  const sizeClass =
    size === 'sm' ? 'px-3 py-1 text-sm' : size === 'lg' ? 'px-7 py-3 text-lg' : 'px-5 py-2'

  return (
    <button
      type={type}
      className={cn(
        'bg-emerald-600 text-white hover:bg-emerald-700 transition',
        sizeClass,
        className
      )}
      {...props}
    />
  )
}