import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizeClass = size === 'sm' ? 'px-3 py-1 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-sm'

    return (
      <button
        ref={ref}
        className={cn(
          `inline-flex items-center justify-center rounded-xl font-medium transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 active:scale-[0.96] hover:shadow-lg ${sizeClass}`,
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
